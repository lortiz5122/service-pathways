import { useCallback, useEffect, useState } from 'react';
import type { Tier } from '../data/eligibility';

/**
 * A local, private profile.
 *
 * Stored in localStorage on the reader's own device. Nothing is sent anywhere,
 * there is no account, and this site is not a lead generator — a 16-year-old
 * researching whether to enlist should not have that fact leave their browser.
 */

const KEY = 'service-pathways.profile.v1';

export type Profile = {
  afqt: number | null;
  tier: Tier;
  /** ISO date the score was recorded. */
  savedAt: string | null;
  /** Whether the reader says they've actually sat a practice test. */
  practiceTaken: boolean;
};

const EMPTY: Profile = {
  afqt: null,
  tier: 'diploma',
  savedAt: null,
  practiceTaken: false,
};

function read(): Profile {
  if (typeof localStorage === 'undefined') return EMPTY;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const p = JSON.parse(raw) as Partial<Profile>;
    const afqt =
      typeof p.afqt === 'number' && p.afqt >= 1 && p.afqt <= 99 ? p.afqt : null;
    return {
      afqt,
      tier: p.tier === 'ged' ? 'ged' : 'diploma',
      savedAt: typeof p.savedAt === 'string' ? p.savedAt : null,
      practiceTaken: Boolean(p.practiceTaken),
    };
  } catch {
    return EMPTY;
  }
}

function write(p: Profile) {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* storage disabled — the app still works, it just won't remember. */
  }
}

/** Cross-tab / cross-component sync without a store. */
const listeners = new Set<(p: Profile) => void>();

export function useProfile() {
  const [profile, setProfile] = useState<Profile>(EMPTY);

  // Read after mount, so server-render and first paint agree.
  useEffect(() => {
    setProfile(read());
    const fn = (p: Profile) => setProfile(p);
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  }, []);

  const save = useCallback((patch: Partial<Profile>) => {
    const next: Profile = { ...read(), ...patch };
    if (patch.afqt !== undefined) next.savedAt = new Date().toISOString();
    write(next);
    listeners.forEach((fn) => fn(next));
  }, []);

  const clear = useCallback(() => {
    write(EMPTY);
    listeners.forEach((fn) => fn(EMPTY));
  }, []);

  return { profile, save, clear };
}

/** Free, no-signup ASVAB practice. Verified reachable 2026-07-12. */
export const PRACTICE_TEST = {
  name: 'Mometrix ASVAB practice test',
  url: 'https://academy-pq.app.mometrix.com/practicequestion/products/ASVAB',
  note: 'Free practice questions, no purchase required.',
};

export const OFFICIAL_PRACTICE = {
  name: 'officialasvab.com',
  url: 'https://www.officialasvab.com',
  note: 'The official ASVAB program site — test information and official practice materials.',
};
