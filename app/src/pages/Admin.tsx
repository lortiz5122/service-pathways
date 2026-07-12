import { useEffect, useState } from 'react';

/**
 * The private inbox. One account, and only one.
 *
 * There is no sign-up, no password reset and no second user, because there is no
 * second person this is for. The gate is enforced in the Worker — this page is only
 * the door. Rendering it proves nothing and grants nothing: every read of the
 * feedback table is re-checked server-side against a signed session cookie, so
 * getting to this screen without the password shows you an empty login box and
 * nothing else.
 */

type Item = {
  id: number;
  created_at: string;
  kind: string;
  page: string | null;
  message: string;
  contact: string | null;
  handled: number;
};

const KIND_LABEL: Record<string, string> = {
  correction: 'Correction',
  missing: 'Missing',
  broken: 'Broken',
  suggestion: 'Suggestion',
  contact: 'Contact',
  other: 'Other',
};

export default function Admin() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [filter, setFilter] = useState<'all' | 'open'>('open');

  useEffect(() => {
    fetch('/api/admin/session')
      .then((r) => r.json())
      .then((d: { authed: boolean }) => setAuthed(d.authed))
      .catch(() => setAuthed(false));
  }, []);

  useEffect(() => {
    if (!authed) return;
    fetch('/api/admin/feedback')
      .then((r) => r.json())
      .then((d: { items?: Item[] }) => setItems(d.items ?? []))
      .catch(() => setItems([]));
  }, [authed]);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const r = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const d = (await r.json()) as { ok?: boolean; error?: string };
      if (!r.ok || !d.ok) throw new Error(d.error ?? 'Sign-in failed.');
      setAuthed(true);
      setPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-in failed.');
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    setAuthed(false);
    setItems([]);
  }

  async function mark(id: number, handled: boolean) {
    setItems((xs) => xs.map((x) => (x.id === id ? { ...x, handled: handled ? 1 : 0 } : x)));
    await fetch('/api/admin/feedback', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id, handled }),
    });
  }

  if (authed === null)
    return (
      <div className="wrap">
        <p className="srcline">Checking…</p>
      </div>
    );

  if (!authed)
    return (
      <div className="wrap">
        <div className="card adminlogin">
          <h2>Sign in</h2>
          <p>This page is private. It holds reader feedback and nothing else.</p>
          <form onSubmit={login}>
            <div className="field">
              <label htmlFor="ae">Email</label>
              <input
                id="ae"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="ap">Password</label>
              <input
                id="ap"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
            {error ? <p className="fb-error">{error}</p> : null}
            <button className="btn" disabled={busy}>
              {busy ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    );

  const shown = filter === 'open' ? items.filter((i) => !i.handled) : items;
  const open = items.filter((i) => !i.handled).length;

  return (
    <div className="wrap">
      <div className="section-head">
        <h2>Feedback</h2>
        <p>
          {items.length} total · <b>{open} not yet handled</b>
        </p>
      </div>

      <div className="admin-bar">
        <div className="seg">
          <button
            className={filter === 'open' ? 'on' : ''}
            onClick={() => setFilter('open')}
          >
            Open ({open})
          </button>
          <button
            className={filter === 'all' ? 'on' : ''}
            onClick={() => setFilter('all')}
          >
            All ({items.length})
          </button>
        </div>
        <button className="btn ghost" onClick={logout}>
          Sign out
        </button>
      </div>

      {shown.length === 0 ? (
        <div className="card">
          <p>{items.length ? 'Nothing open. All caught up.' : 'No feedback yet.'}</p>
        </div>
      ) : null}

      {shown.map((i) => (
        <article key={i.id} className={`card fbitem${i.handled ? ' done' : ''}`}>
          <header className="fbitem-head">
            <span className="chip brand">{KIND_LABEL[i.kind] ?? i.kind}</span>
            <span className="fbitem-when">
              {new Date(i.created_at).toLocaleString()}
            </span>
            {i.page ? <code className="fbitem-page">{i.page}</code> : null}
          </header>

          <p className="fbitem-msg">{i.message}</p>

          <footer className="fbitem-foot">
            {i.contact ? (
              <a href={`mailto:${i.contact}`} className="fbitem-contact">
                Reply to {i.contact}
              </a>
            ) : (
              <span className="fbitem-contact none">No email — anonymous</span>
            )}
            <button
              className="btn ghost small"
              onClick={() => mark(i.id, !i.handled)}
            >
              {i.handled ? 'Reopen' : 'Mark handled'}
            </button>
          </footer>
        </article>
      ))}
    </div>
  );
}
