import type { ReactNode } from 'react';
import { isUnverified } from '../lib/types';

export function Chip({
  children,
  tone = 'neutral',
}: {
  children: ReactNode;
  tone?: 'neutral' | 'ok' | 'warn' | 'alert' | 'brand';
}) {
  return <span className={`chip ${tone === 'neutral' ? '' : tone}`}>{children}</span>;
}

/**
 * Renders a value, or a visible UNVERIFIED marker when the research could not
 * confirm it. Never silently blanks — an unknown must LOOK unknown.
 */
export function Value({ v }: { v: unknown }) {
  if (v === null || v === undefined || v === '') {
    return <span className="unknown">Not published</span>;
  }
  if (isUnverified(v)) {
    return <span className="unverified">UNVERIFIED — {String(v)}</span>;
  }
  return <>{String(v)}</>;
}

export function SourceNote({
  source,
  date,
}: {
  source?: string;
  date?: string;
}) {
  if (!source) return null;
  return (
    <p className="srcline">
      Source: {source}
      {date ? ` · retrieved ${date}` : ''}
    </p>
  );
}

export function Note({
  tone = 'neutral',
  children,
}: {
  tone?: 'neutral' | 'warn' | 'alert';
  children: ReactNode;
}) {
  return <div className={`note ${tone === 'neutral' ? '' : tone}`}>{children}</div>;
}

export function SectionHead({
  title,
  lede,
}: {
  title: string;
  lede?: string;
}) {
  return (
    <div className="section-head">
      <h2>{title}</h2>
      {lede ? <p>{lede}</p> : null}
    </div>
  );
}

/** Shown where a research command has not produced data. Honest, not hidden. */
export function DataPending({ what, why }: { what: string; why: string }) {
  return (
    <div className="note warn">
      <div>
        <b>{what} — no data.</b>
        <br />
        {why}
      </div>
    </div>
  );
}

export function TickList({ items }: { items: string[] }) {
  return (
    <ul className="ticklist">
      {items.map((t, i) => (
        <li key={i}>{t}</li>
      ))}
    </ul>
  );
}
