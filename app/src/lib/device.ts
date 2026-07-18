import { useSyncExternalStore } from 'react';

/**
 * Are we on a phone? Two signals, in order of trust:
 *
 *   1. The server's verdict, stamped on `<html data-device>` from the User-Agent
 *      in the Worker. It is set before any JS runs, so the first React render is
 *      already correct — no desktop-nav flash on a phone.
 *   2. The viewport width, as a safety net for anything the server did not tag
 *      (an unrecognised UA, or a narrow desktop window resized down).
 */
const PHONE_QUERY = '(max-width: 720px)';

function serverSaysMobile(): boolean {
  return (
    typeof document !== 'undefined' &&
    document.documentElement.dataset.device === 'mobile'
  );
}

function subscribe(onChange: () => void): () => void {
  const mql = window.matchMedia(PHONE_QUERY);
  mql.addEventListener('change', onChange);
  return () => mql.removeEventListener('change', onChange);
}

function getSnapshot(): boolean {
  return serverSaysMobile() || window.matchMedia(PHONE_QUERY).matches;
}

// No DOM (SSR / prerender): assume desktop; the client corrects on mount.
const getServerSnapshot = () => false;

export function useIsMobile(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
