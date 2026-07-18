import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, useLocation } from 'react-router-dom';

type NavItem = { to: string; label: string; end: boolean };

/**
 * The phone navigation: a hamburger button in the topbar that opens a full-height
 * drawer of large tap targets. It closes on link tap (route change), on the
 * overlay, on the ✕, and on Escape; body scroll is locked while it is open. When
 * closed the drawer stays mounted (so it can slide both ways) but is `inert`, so
 * its links are out of the tab order and the accessibility tree.
 *
 * The overlay and drawer are portalled to <body>: the topbar uses backdrop-filter,
 * which would otherwise become the containing block for their `position: fixed`
 * and clip them to the ~50px bar.
 */
export default function MobileNav({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  // A tapped link changes the route — close the drawer.
  useEffect(() => setOpen(false), [pathname]);

  // Lock the page behind the drawer and wire Escape while it is open.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="navtoggle"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="mobile-drawer"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="navtoggle-bars" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </button>

      {typeof document !== 'undefined' &&
        createPortal(
          <>
            <div
              className={open ? 'drawer-overlay is-open' : 'drawer-overlay'}
              onClick={() => setOpen(false)}
            />

            <nav
              id="mobile-drawer"
              className={open ? 'drawer is-open' : 'drawer'}
              aria-label="Site navigation"
              inert={!open}
            >
              <div className="drawer-head">
                <span className="drawer-title">Menu</span>
                <button
                  type="button"
                  className="drawer-close"
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                >
                  ✕
                </button>
              </div>

              {items.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  end={n.end}
                  className={({ isActive }) =>
                    isActive ? 'drawerlink is-active' : 'drawerlink'
                  }
                >
                  {n.label}
                </NavLink>
              ))}
            </nav>
          </>,
          document.body,
        )}
    </>
  );
}
