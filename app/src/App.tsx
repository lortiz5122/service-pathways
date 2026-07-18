import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './pages/Home';
import Cluster from './pages/Cluster';
import Specialty from './pages/Specialty';
import Branches from './pages/Branches';
import Prep from './pages/Prep';
import Lifecycle from './pages/Lifecycle';
import About from './pages/About';
import Explore from './pages/Explore';
import Pay from './pages/Pay';
import Jobs from './pages/Jobs';
import Methodology from './pages/Methodology';
import Admin from './pages/Admin';
import { usePageview } from './lib/hit';
import { AppMark } from './branding/Emblem';
import { SiteDisclaimer } from './components/Disclaimer';
import { RESEARCH_DATE } from './lib/data';
import { useIsMobile } from './lib/device';
import MobileNav from './components/MobileNav';

const NAV = [
  { to: '/', label: 'Interests', end: true },
  { to: '/explore', label: 'Find what fits', end: false },
  { to: '/jobs', label: 'Every job', end: false },
  { to: '/branches', label: 'Branches', end: false },
  { to: '/prep', label: 'Qualifying', end: false },
  { to: '/pay', label: 'Pay', end: false },
  { to: '/lifecycle', label: 'Retirement & After', end: false },
  { to: '/about', label: 'About', end: false },
];

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  usePageview();
  return null;
}

export default function App() {
  const isMobile = useIsMobile();

  return (
    <>
      <ScrollToTop />

      <header className="topbar">
        <NavLink to="/" className="brandmark">
          <AppMark size={26} />
          <div>
            <strong>Military Careers</strong>
            <span>Independent · Non-recruiting</span>
          </div>
        </NavLink>

        {isMobile ? (
          <MobileNav items={NAV} />
        ) : (
          <nav className="navscroll">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                className={({ isActive }) =>
                  isActive ? 'navbtn is-active' : 'navbtn'
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
        )}
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/interest/:id" element={<Cluster />} />
          <Route path="/specialty/:id" element={<Specialty />} />
          <Route path="/branches" element={<Branches />} />
          <Route path="/prep" element={<Prep />} />
          <Route path="/pay" element={<Pay />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/lifecycle" element={<Lifecycle />} />
          <Route path="/about" element={<About />} />
          <Route path="/methodology" element={<Methodology />} />
          {/* Unlisted on purpose: private, and there is no nav link to it. */}
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <SiteDisclaimer />
          <p>
            Figures retrieved {RESEARCH_DATE}. Policy across all six branches is in
            active flux through 2025–2026. Reconfirm any number here against the
            current official publication before it drives a decision.
          </p>
          <p className="footlinks">
            <Link to="/methodology">Methodology, sources &amp; legal notice</Link>
          </p>
          <p className="buildstamp">
            build {__BUILD_ID__} · if this page looks stale, hard-reload
            (Cmd/Ctrl + Shift + R)
          </p>
        </div>
      </footer>
    </>
  );
}
