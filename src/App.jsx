import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import Distributor from './pages/Distributor.jsx';
import Brand from './pages/Brand.jsx';
import Retailer from './pages/Retailer.jsx';
import Inventory from './pages/Inventory.jsx';
import { BrandMark, Icon, LiveDot } from './components/ui.jsx';

const tabs = [
  { to: '/retailer', label: 'Retailer', icon: 'store' },
  { to: '/distributor', label: 'Distributor', icon: 'truck' },
  { to: '/inventory', label: 'Inventory', icon: 'box' },
  { to: '/brand', label: 'Brand', icon: 'chart' },
];

export default function App() {
  return (
    <div className="min-h-[100dvh] bg-paper text-ink">
      <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-3.5 sm:px-8">
          <div className="flex items-center gap-4">
            <BrandMark />
            <span className="hidden h-4 w-px bg-line-strong sm:block" />
            <span className="hidden text-[13px] text-muted sm:block">
              Supply chain, on WhatsApp
            </span>
          </div>

          <nav className="flex items-center gap-1">
            {tabs.map((t) => (
              <NavLink
                key={t.to}
                to={t.to}
                className={({ isActive }) =>
                  `group relative flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${
                    isActive ? 'text-ink' : 'text-muted hover:text-ink-soft'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon name={t.icon} className="h-[18px] w-[18px]" />
                    <span className="hidden sm:inline">{t.label}</span>
                    <span
                      className={`absolute inset-x-2 -bottom-[15px] h-0.5 rounded-full transition-all duration-300 ${
                        isActive ? 'bg-brand opacity-100' : 'bg-ink opacity-0 group-hover:opacity-20'
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            <LiveDot label="live" />
            <span className="h-4 w-px bg-line-strong" />
            <span className="whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
              FYP&nbsp;2026–27
            </span>
          </div>
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/distributor" replace />} />
          <Route path="/retailer" element={<Retailer />} />
          <Route path="/distributor" element={<Distributor />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/brand" element={<Brand />} />
        </Routes>
      </main>
    </div>
  );
}
