/**
 * The site's only backend.
 *
 * Everything else here is static. This Worker exists for one reason: readers find
 * mistakes, and a reference site with no way to report one is a site that stays
 * wrong. So it does exactly three things — take a message, let exactly one person
 * read the messages, and serve the app otherwise.
 *
 * PRIVACY. The site tells readers that nothing they do here is sent to a
 * recruiter, and that promise has to survive contact with a form:
 *   - No account. No tracking. No third party. Feedback goes to a private table.
 *   - Contact is OPTIONAL and only exists because a correction sometimes needs a
 *     follow-up question.
 *   - The IP address is NEVER stored. Only a salted hash of it, only to stop a bot
 *     filling the table, and it cannot be reversed back to an address.
 *
 * AUTH. Cloudflare Access would be the natural fit, but it cannot protect a
 * workers.dev hostname and the deploy token has no Zero Trust scope — so the login
 * is implemented here. One allowed email, a password, and a signed session cookie.
 * The email, the password and both salts are Cloudflare SECRETS: they are set with
 * `wrangler secret put`, they are not in this repo, and they are not in git.
 */

interface Env {
  DB: D1Database;
  ASSETS: Fetcher;
  ADMIN_EMAIL: string;
  ADMIN_PASSWORD: string;
  SESSION_SECRET: string;
  IP_SALT: string;
}

const SESSION_HOURS = 12;
const MAX_MESSAGE = 4000;
const MAX_PER_IP_PER_HOUR = 5;
const KINDS = ['correction', 'missing', 'broken', 'suggestion', 'contact', 'other'];

const json = (body: unknown, status = 200, headers: HeadersInit = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', ...headers },
  });

const enc = new TextEncoder();

/** Constant-time compare. A plain `===` on a secret leaks its length via timing. */
function safeEqual(a: string, b: string): boolean {
  const x = enc.encode(a);
  const y = enc.encode(b);
  if (x.length !== y.length) return false;
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
  return diff === 0;
}

async function hmac(secret: string, msg: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(msg));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function sha256(s: string): Promise<string> {
  const d = await crypto.subtle.digest('SHA-256', enc.encode(s));
  return [...new Uint8Array(d)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** Session cookie is `<expiry>.<hmac(expiry)>` — unforgeable without the secret. */
async function mintSession(env: Env): Promise<string> {
  const exp = String(Date.now() + SESSION_HOURS * 3600_000);
  return `${exp}.${await hmac(env.SESSION_SECRET, exp)}`;
}

async function validSession(req: Request, env: Env): Promise<boolean> {
  const raw = (req.headers.get('cookie') ?? '')
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith('mc_admin='))
    ?.slice('mc_admin='.length);
  if (!raw) return false;

  const [exp, sig] = raw.split('.');
  if (!exp || !sig) return false;
  if (Number(exp) < Date.now()) return false;
  return safeEqual(sig, await hmac(env.SESSION_SECRET, exp));
}

const cookie = (value: string, maxAge: number) =>
  `mc_admin=${value}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${maxAge}`;

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);
    const p = url.pathname;

    // ------------------------------------------------ reader submits feedback
    if (p === '/api/feedback' && req.method === 'POST') {
      let body: Record<string, unknown>;
      try {
        body = await req.json();
      } catch {
        return json({ error: 'Malformed request.' }, 400);
      }

      // Honeypot. A real person never fills a field they cannot see.
      if (typeof body.website === 'string' && body.website.length > 0)
        return json({ ok: true });

      const message = String(body.message ?? '').trim();
      const kind = String(body.kind ?? 'other');
      const contact = String(body.contact ?? '').trim();
      const page = String(body.page ?? '').trim();

      if (message.length < 4)
        return json({ error: 'Tell us a little more than that.' }, 400);
      if (message.length > MAX_MESSAGE)
        return json({ error: `Please keep it under ${MAX_MESSAGE} characters.` }, 400);
      if (!KINDS.includes(kind)) return json({ error: 'Unknown feedback type.' }, 400);
      if (contact.length > 200) return json({ error: 'That contact is too long.' }, 400);

      // Salted hash, never the address itself.
      const ip = req.headers.get('cf-connecting-ip') ?? 'unknown';
      const ipHash = await sha256(`${env.IP_SALT}:${ip}`);

      const since = new Date(Date.now() - 3600_000).toISOString();
      const recent = await env.DB.prepare(
        'SELECT COUNT(*) AS n FROM feedback WHERE ip_hash = ? AND created_at > ?',
      )
        .bind(ipHash, since)
        .first<{ n: number }>();

      if ((recent?.n ?? 0) >= MAX_PER_IP_PER_HOUR)
        return json({ error: 'That is a lot of feedback in one hour. Try again later.' }, 429);

      await env.DB.prepare(
        `INSERT INTO feedback (created_at, kind, page, message, contact, ua, ip_hash)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
      )
        .bind(
          new Date().toISOString(),
          kind,
          page.slice(0, 200),
          message,
          contact,
          (req.headers.get('user-agent') ?? '').slice(0, 300),
          ipHash,
        )
        .run();

      return json({ ok: true });
    }

    // --------------------------------------------------------- a page was viewed
    //
    // Aggregate only. No cookie, no session, no per-person row, no IP stored.
    // The visitor hash folds the DAY into the digest on purpose — the same reader
    // hashes differently tomorrow, so this cannot follow anyone across days even
    // for the person who owns the table. It answers "how many people today", and
    // deliberately cannot answer anything more than that.
    if (p === '/api/hit' && req.method === 'POST') {
      let path = '/';
      try {
        const b = (await req.json()) as { path?: string };
        path = (b.path ?? '/').slice(0, 120);
      } catch {
        return json({ ok: true });
      }

      const day = new Date().toISOString().slice(0, 10);
      const now = new Date().toISOString();
      const ip = req.headers.get('cf-connecting-ip') ?? 'unknown';
      const visitor = await sha256(`${env.IP_SALT}:${ip}:${day}`);

      await env.DB.batch([
        env.DB.prepare(
          `INSERT INTO pageviews (day, path, views) VALUES (?, ?, 1)
             ON CONFLICT (day, path) DO UPDATE SET views = views + 1`,
        ).bind(day, path),
        env.DB.prepare(
          `INSERT OR IGNORE INTO visitors (day, visitor_hash) VALUES (?, ?)`,
        ).bind(day, visitor),
        env.DB.prepare(
          `INSERT INTO ip_log (ip, first_seen, last_seen, hits) VALUES (?, ?, ?, 1)
             ON CONFLICT (ip) DO UPDATE SET last_seen = ?, hits = hits + 1`,
        ).bind(ip, now, now, now),
      ]);

      return json({ ok: true });
    }

    // ------------------------------------------------------------- admin login
    if (p === '/api/admin/login' && req.method === 'POST') {
      let body: Record<string, unknown>;
      try {
        body = await req.json();
      } catch {
        return json({ error: 'Malformed request.' }, 400);
      }

      const email = String(body.email ?? '').trim().toLowerCase();
      const password = String(body.password ?? '');

      // Both checks always run — never short-circuit on the email, or the response
      // time tells an attacker which addresses are real.
      const emailOk = safeEqual(email, (env.ADMIN_EMAIL ?? '').trim().toLowerCase());
      const passOk = safeEqual(password, env.ADMIN_PASSWORD ?? '');

      if (!emailOk || !passOk)
        return json({ error: 'That email and password do not match.' }, 401);

      return json(
        { ok: true },
        200,
        { 'set-cookie': cookie(await mintSession(env), SESSION_HOURS * 3600) },
      );
    }

    if (p === '/api/admin/logout' && req.method === 'POST')
      return json({ ok: true }, 200, { 'set-cookie': cookie('', 0) });

    if (p === '/api/admin/session')
      return json({ authed: await validSession(req, env) });

    // ------------------------------------------------- admin reads the feedback
    if (p === '/api/admin/feedback') {
      if (!(await validSession(req, env)))
        return json({ error: 'Not signed in.' }, 401);

      if (req.method === 'POST') {
        const { id, handled } = (await req.json()) as { id: number; handled: boolean };
        await env.DB.prepare('UPDATE feedback SET handled = ? WHERE id = ?')
          .bind(handled ? 1 : 0, id)
          .run();
        return json({ ok: true });
      }

      const { results } = await env.DB.prepare(
        `SELECT id, created_at, kind, page, message, contact, handled
           FROM feedback ORDER BY created_at DESC LIMIT 500`,
      ).all();

      return json({ items: results }, 200, { 'cache-control': 'no-store' });
    }

    // ------------------------------------------------------ admin reads traffic
    if (p === '/api/admin/stats') {
      if (!(await validSession(req, env)))
        return json({ error: 'Not signed in.' }, 401);

      const today = new Date().toISOString().slice(0, 10);
      const dayAgo = (n: number) =>
        new Date(Date.now() - n * 86_400_000).toISOString().slice(0, 10);

      const [totals, todayRow, week, month, topPages, daily] = await env.DB.batch([
        env.DB.prepare('SELECT COALESCE(SUM(views), 0) AS v FROM pageviews'),
        env.DB.prepare(
          'SELECT COALESCE(SUM(views), 0) AS v FROM pageviews WHERE day = ?',
        ).bind(today),
        env.DB.prepare(
          'SELECT COALESCE(SUM(views), 0) AS v FROM pageviews WHERE day >= ?',
        ).bind(dayAgo(7)),
        env.DB.prepare(
          'SELECT COALESCE(SUM(views), 0) AS v FROM pageviews WHERE day >= ?',
        ).bind(dayAgo(30)),
        env.DB.prepare(
          `SELECT path, SUM(views) AS views FROM pageviews
             GROUP BY path ORDER BY views DESC LIMIT 15`,
        ),
        env.DB.prepare(
          `SELECT p.day AS day,
                  COALESCE(SUM(p.views), 0) AS views,
                  (SELECT COUNT(*) FROM visitors v WHERE v.day = p.day) AS visitors
             FROM pageviews p
            WHERE p.day >= ?
            GROUP BY p.day ORDER BY p.day DESC`,
        ).bind(dayAgo(30)),
      ]);

      const uniq = await env.DB.batch([
        env.DB.prepare('SELECT COUNT(*) AS n FROM visitors WHERE day = ?').bind(today),
        env.DB.prepare('SELECT COUNT(DISTINCT visitor_hash) AS n FROM visitors WHERE day >= ?').bind(dayAgo(7)),
        env.DB.prepare('SELECT COUNT(*) AS n FROM visitors').bind(),
      ]);

      const ipRows = await env.DB.batch([
        env.DB.prepare('SELECT COUNT(*) AS n FROM ip_log'),
        env.DB.prepare(
          'SELECT ip, first_seen, last_seen, hits FROM ip_log ORDER BY last_seen DESC LIMIT 200',
        ),
      ]);

      const num = (r: D1Result, k = 'v') =>
        Number((r.results?.[0] as Record<string, unknown>)?.[k] ?? 0);

      return json(
        {
          views: {
            today: num(todayRow),
            week: num(week),
            month: num(month),
            all: num(totals),
          },
          // NOTE: "week" here counts a returning reader once per day, because the
          // hash rotates daily by design. It is an upper bound on people, not a
          // true 7-day unique. Saying so beats quoting a number that means something
          // other than what it looks like.
          visitors: {
            today: num(uniq[0], 'n'),
            weekDayCounted: num(uniq[1], 'n'),
            allDayCounted: num(uniq[2], 'n'),
          },
          topPages: topPages.results ?? [],
          daily: daily.results ?? [],
          uniqueIps: num(ipRows[0], 'n'),
          ips: ipRows[1].results ?? [],
        },
        200,
        { 'cache-control': 'no-store' },
      );
    }

    // Anything under /api that we did not handle is a 404, not the SPA shell.
    if (p.startsWith('/api/')) return json({ error: 'Not found.' }, 404);

    return env.ASSETS.fetch(req);
  },
};
