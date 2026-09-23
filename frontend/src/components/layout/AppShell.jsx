import { ChevronLeft, ChevronRight, LayoutDashboard, LogOut, Menu, Package2, ReceiptText, Users } from 'lucide-react';
import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { cn } from '../../lib/utils';
import { getStoredUser, logout } from '../../services/api';
import { Button } from '../ui/button';

const P = { fontFamily: "'Russo One', sans-serif" };

const navItems = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard, color: '#E52521' },
  { label: 'Products', to: '/admin/products', icon: Package2, color: '#049CD8' },
  { label: 'Orders', to: '/admin/orders', icon: ReceiptText, color: '#FBD000' },
  { label: 'Customers', to: '/admin/customers', icon: Users, color: '#43B047' },
];

function AppShell() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const user = getStoredUser();

  const handleLogout = () => {
    logout();
    toast.success('Signed out successfully');
    navigate('/');
  };

  return (
    <div className="admin-shell grid-pattern min-h-screen">
      <div className="flex min-h-screen">
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-30 flex w-72 flex-col border-r-3 border-black px-4 py-6 transition-transform duration-300 lg:static lg:translate-x-0',
            collapsed && 'lg:w-24',
            mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          )}
          style={{ background: 'linear-gradient(180deg, #0F0F23, #1A1A2E)', boxShadow: '4px 0 0 rgba(0,0,0,0.5)' }}
        >
          <div className="mb-8 flex items-center justify-between">
            <div className={cn('transition-all', collapsed && 'lg:hidden')}>
              <p className="text-[17px] uppercase tracking-[0.35em] text-[#5C94FC]" style={P}>Admin Suite</p>
              <h1 className="mt-2 text-lg font-bold text-white" style={P}>Shop Pulse</h1>
            </div>
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(false)}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden lg:inline-flex" onClick={() => setCollapsed((value) => !value)}>
              {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </Button>
          </div>

          <nav className="space-y-1">
            {navItems.map(({ label, to, icon: Icon, color }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/admin'}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 border-2 px-4 py-3 text-[15px] font-bold transition-all',
                    isActive ? 'border-black shadow-[3px_3px_0px_rgba(0,0,0,0.5)]' : 'border-transparent hover:border-[#5C94FC]/30',
                    collapsed && 'lg:justify-center lg:px-0',
                  )
                }
                style={({ isActive }) => ({
                  background: isActive ? `${color}25` : 'transparent',
                  color: isActive ? color : '#5C94FC',
                  fontFamily: "'Russo One', sans-serif",
                })}
                onClick={() => setMobileOpen(false)}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className={cn(collapsed && 'lg:hidden')}>{label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto border-2 border-black p-4 shadow-[3px_3px_0px_rgba(0,0,0,0.4)]" style={{ background: '#0F0F23' }}>
            <p className="text-[16px] uppercase tracking-[0.3em] text-[#4a4a6a]" style={P}>Signed In</p>
            <p className="mt-3 text-[15px] font-bold text-white" style={P}>{user?.username ?? 'Admin'}</p>
            <p className="text-[17px] text-[#5C94FC] mt-1" style={P}>{user?.role ?? 'ADMIN'}</p>
            <Button className="mt-4 w-full" variant="danger" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span className={cn(collapsed && 'lg:hidden')}>Logout</span>
            </Button>
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b-3 border-black px-4 py-4 md:px-8" style={{ background: 'rgba(15,15,35,0.9)', backdropFilter: 'blur(4px)' }}>
            <div className="mx-auto flex max-w-7xl items-center justify-between">
              <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)}>
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <p className="text-[17px] uppercase tracking-[0.3em] text-[#4a4a6a]" style={P}>Shopping Admin System</p>
                <p className="mt-1 text-[15px] text-[#5C94FC]" style={P}>Operations, revenue tracking, and catalog management.</p>
              </div>
              <div className="flex items-center gap-3">
                <NavLink to="/shop" className="text-[17px] text-[#5C94FC] hover:text-[#FBD000] transition-colors border-2 border-black px-3 py-1.5 shadow-[2px_2px_0px_rgba(0,0,0,0.3)]" style={{ background: '#1A1A2E', ...P }}>
                  ← View Store
                </NavLink>
                <Button variant="danger" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-1" /> Logout
                </Button>
              </div>
            </div>
          </header>

          <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-6 md:px-8">
            <Outlet />
          </main>
        </div>
      </div>
      {mobileOpen ? <div className="fixed inset-0 z-20 bg-[#0F0F23]/80 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)} /> : null}
    </div>
  );
}

export default AppShell;
