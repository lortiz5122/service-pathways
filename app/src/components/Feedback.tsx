import { useState } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Feedback, and a way to reach the person who built this.
 *
 * Two jobs in one box. Readers find mistakes — a reference site with no way to
 * report one stays wrong — and some people just want to get in touch.
 *
 * The site tells readers that nothing they do here is sent to a recruiter, and a
 * form is exactly where a promise like that gets quietly broken. So it is stated
 * again, right above the send button, and it is true: no account, no third party,
 * the message goes to one private inbox, and an email address is optional and only
 * there so a question can be answered.
 */

const KINDS = [
  { id: 'correction', label: 'Something here is wrong', hint: 'A number, a score, a requirement. Tell me what and where.' },
  { id: 'missing', label: 'Something is missing', hint: 'A job, a branch, a benefit, a path that should be here.' },
  { id: 'broken', label: 'Something is broken', hint: 'A page, a link, or something that just looks wrong.' },
  { id: 'suggestion', label: 'A suggestion', hint: 'Something that would make this more useful.' },
  { id: 'contact', label: 'I just want to get in touch', hint: 'Anything else at all.' },
];

export function Feedback() {
  const { pathname } = useLocation();
  const [kind, setKind] = useState('correction');
  const [message, setMessage] = useState('');
  const [contact, setContact] = useState('');
  const [website, setWebsite] = useState(''); // honeypot; a person never sees this
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');

  const active = KINDS.find((k) => k.id === kind);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (message.trim().length < 4) {
      setError('Tell me a little more than that.');
      setState('error');
      return;
    }

    setState('sending');
    setError('');
    try {
      const r = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ kind, message, contact, website, page: pathname }),
      });
      const d = (await r.json()) as { ok?: boolean; error?: string };
      if (!r.ok || !d.ok) throw new Error(d.error ?? 'That did not send.');
      setState('sent');
      setMessage('');
      setContact('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'That did not send.');
      setState('error');
    }
  }

  if (state === 'sent')
    return (
      <section className="card feedback sent">
        <h3>Thank you — it arrived.</h3>
        <p>
          It goes to one person, and it gets read. If you left an email address and
          asked something that needs an answer, you will get one.
        </p>
        <p>
          If you found a mistake: thank you, genuinely. Corrections are the single
          most useful thing anyone sends. This site is only as good as the people who
          push back on it.
        </p>
        <button type="button" className="btn ghost" onClick={() => setState('idle')}>
          Send something else
        </button>
      </section>
    );

  return (
    <section className="card feedback" id="contact">
      <h3>Found a mistake? Want to get in touch?</h3>
      <p className="fb-lede">
        This site was built by one person and it{' '}
        <b>will contain errors</b> — policy changes constantly and no website
        outruns it. If something here is wrong, please say so. If you just want to
        reach me, this is the way.
      </p>

      <form onSubmit={submit}>
        <fieldset className="fb-kinds">
          <legend>What is this about?</legend>
          {KINDS.map((k) => (
            <label key={k.id} className={`fb-kind${kind === k.id ? ' on' : ''}`}>
              <input
                type="radio"
                name="kind"
                value={k.id}
                checked={kind === k.id}
                onChange={() => setKind(k.id)}
              />
              <span>{k.label}</span>
            </label>
          ))}
        </fieldset>

        <div className="field">
          <label htmlFor="fb-msg">{active?.hint ?? 'Your message'}</label>
          <textarea
            id="fb-msg"
            rows={6}
            maxLength={4000}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              kind === 'correction'
                ? 'e.g. The line score you list for 68W is wrong — it should be ST 101, not ST 91. Source: …'
                : 'Type whatever you want to say.'
            }
            required
          />
          <span className="fb-count">{message.length} / 4000</span>
        </div>

        <div className="field">
          <label htmlFor="fb-contact">
            Your email — <b>optional</b>, and only if you want a reply
          </label>
          <input
            id="fb-contact"
            type="email"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
          <span className="fb-hint">
            Leave it blank and your message is completely anonymous. It is never used
            for anything except answering you.
          </span>
        </div>

        {/* Honeypot. Hidden from people, irresistible to bots. */}
        <div className="fb-hp" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input
            id="website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>

        {state === 'error' ? <p className="fb-error">{error}</p> : null}

        <div className="fb-actions">
          <button type="submit" className="btn" disabled={state === 'sending'}>
            {state === 'sending' ? 'Sending…' : 'Send'}
          </button>
          <p className="fb-privacy">
            No account, no sign-up, no third party. This goes to one private inbox
            belonging to the person who built the site — <b>not to a recruiter</b>,
            and not to any branch of the military.
          </p>
        </div>
      </form>
    </section>
  );
}
