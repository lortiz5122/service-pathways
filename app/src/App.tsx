import { NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './pages/Home';
import Cluster from './pages/Cluster';
import Specialty from './pages/Specialty';
import Branches from './pages/Branches';
import Prep from './pages/Prep';
import Lifecycle from './pages/Lifecycle';
import About from './pages/About';
import { AppMark } from './branding/Emblem';
import { SiteDisclaimer } from './components/Disclaimer';
import { RESEARCH_DATE } from './lib/data';

const NAV = [
  { to: '/', label: 'Interests', end: true },
  { to: '/branches', label: 'Branches', end: false },
  { to: '/prep', label: 'Qualifying', end: false },
  { to: '/lifecycle', label: 'Retirement & After', end: false },
  { to: '/about', label: 'Sources', end: false },
];

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />

      <header className="topbar">
        <NavLink to="/" className="brandmark">
          <AppMark size={26} />
          <div>
            <strong>Service Pathways</strong>
            <span>Independent · Non-recruiting</span>
          </div>
        </NavLink>

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
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/interest/:id" element={<Cluster />} />
          <Route path="/specialty/:id" element={<Specialty />} />
          <Route path="/branches" element={<Branches />} />
          <Route path="/prep" element={<Prep />} />
          <Route path="/lifecycle" element={<Lifecycle />} />
          <Route path="/about" element={<About />} />
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
        </div>
      </footer>
    </>
  );
}
