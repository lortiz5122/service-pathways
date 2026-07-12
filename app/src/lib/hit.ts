import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Record that a page was viewed. Nothing else.
 *
 * The site promises it does not track readers, and this must not quietly break
 * that promise. It sends ONE thing — the path — and it sends no cookie, no id and
 * no identifier of any kind. The server counts it and never learns who it was.
 *
 * It is fire-and-forget: if it fails, it fails silently. A reader must never see a
 * page break because a counter was unreachable.
 */
export function usePageview() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Never count the owner reading their own inbox.
    if (pathname.startsWith('/admin')) return;

    fetch('/api/hit', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ path: pathname }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);
}
