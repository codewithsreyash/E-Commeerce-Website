import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Package, User, LogOut, ShoppingBag } from 'lucide-react';
import { logout, getStoredUser } from '../../services/api';
import toast from 'react-hot-toast';

const P = { fontFamily: "'Russo One', sans-serif" };

export default function AccountLayout() {
  const navigate = useNavigate();
  const user = getStoredUser();

  const handleSignOut = () => {
    logout();
    toast.success('Signed out successfully');
    navigate('/');
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="retro-card-light overflow-hidden sticky top-6">
          {/* User info */}
          <div className="p-4 bg-[#1A1A2E] border-b-2 border-black">
            <div className="w-10 h-10 border-2 border-black bg-[#E52521] flex items-center justify-center text-white font-bold text-sm mb-2 shadow-[2px_2px_0px_rgba(0,0,0,0.3)]" style={P}>
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <p className="font-bold text-[15px] text-[#FBD000] truncate" style={P}>{user?.username || 'User'}</p>
            <p className="text-[16px] text-[#5C94FC]" style={P}>{user?.role || 'CUSTOMER'}</p>
          </div>

          {/* Nav links */}
          <ul className="p-2 space-y-1">
            <li>
              <NavLink
                to="/shop/account/orders"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 border-2 border-transparent transition-colors text-[17px] ${isActive ? 'bg-[#049CD8] text-white border-black shadow-[2px_2px_0px_rgba(0,0,0,0.3)]' : 'text-[#1A1A2E] hover:bg-[#FBD000]/20 hover:border-black'}`
                }
                style={P}
              >
                <Package className="w-4 h-4" /> Orders
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/shop/account/settings"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 border-2 border-transparent transition-colors text-[17px] ${isActive ? 'bg-[#049CD8] text-white border-black shadow-[2px_2px_0px_rgba(0,0,0,0.3)]' : 'text-[#1A1A2E] hover:bg-[#FBD000]/20 hover:border-black'}`
                }
                style={P}
              >
                <User className="w-4 h-4" /> Settings
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/shop/catalog"
                className="flex items-center gap-3 px-3 py-2.5 border-2 border-transparent transition-colors text-[17px] text-[#1A1A2E] hover:bg-[#FBD000]/20 hover:border-black"
                style={P}
              >
                <ShoppingBag className="w-4 h-4" /> Shop
              </NavLink>
            </li>
          </ul>

          {/* Logout */}
          <div className="p-2 border-t-2 border-black/20">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-2.5 border-2 border-transparent text-[17px] font-bold text-[#E52521] hover:bg-[#E52521]/10 hover:border-[#E52521] transition-colors"
              style={P}
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 retro-card-light overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
