import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, User, ChevronDown, ChevronUp, Menu, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useCart } from './CartContext';
import { getStoredUser, logout } from '../../services/api';
import toast from 'react-hot-toast';

const P = { fontFamily: "'Russo One', sans-serif" };

export default function Navbar() {
  const [search, setSearch] = useState('');
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { cart } = useCart();
  const user = getStoredUser();
  const dropdownRef = useRef(null);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setAccountOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/shop/catalog?keyword=${encodeURIComponent(search.trim())}`);
  };

  const handleLogout = () => {
    logout();
    toast.success('Signed out');
    navigate('/');
  };

  return (
    <nav className="border-b-3 border-black sticky top-0 z-50" style={{ background: '#E52521' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/shop" className="flex items-center gap-2 shrink-0">
          <div className="bg-[#FBD000] border-2 border-black p-1.5 shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">
            <ShoppingCart size={20} className="text-[#E52521]" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight hidden sm:inline" style={P}>
            Shop<span className="text-[#FBD000]">Stream</span>
          </span>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4a4a6a]" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full h-9 pl-9 pr-3 border-2 border-black bg-[#FFF8E7] text-[15px] text-[#1A1A2E] placeholder:text-[#4a4a6a] outline-none focus:border-[#FBD000] focus:shadow-[0_0_8px_rgba(251,208,0,0.4)] shadow-[2px_2px_0px_rgba(0,0,0,0.3)]"
              style={P}
            />
          </div>
        </form>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-4 text-[15px]" style={P}>
          <NavLink to="/shop" end className={({ isActive }) => isActive ? 'text-[#FBD000] font-bold' : 'text-white hover:text-[#FBD000] transition-colors'}>Home</NavLink>
          <NavLink to="/shop/catalog" className={({ isActive }) => isActive ? 'text-[#FBD000] font-bold' : 'text-white hover:text-[#FBD000] transition-colors'}>Catalog</NavLink>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {/* Cart */}
          <Link to="/shop/cart" className="relative p-2 text-white hover:text-[#FBD000] transition-colors">
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FBD000] text-[#E52521] text-[17px] font-bold border border-black flex items-center justify-center shadow-[1px_1px_0px_rgba(0,0,0,0.3)]" style={P}>{cartCount}</span>
            )}
          </Link>

          {/* Account */}
          {user ? (
            <div ref={dropdownRef} className="relative">
              <button onClick={() => setAccountOpen(!accountOpen)} className="flex items-center gap-1.5 text-[15px] text-white hover:text-[#FBD000] transition-colors" style={P}>
                <User size={18} />
                <span className="hidden sm:inline">{user.username}</span>
                {accountOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {accountOpen && (
                <div className="absolute right-0 mt-2 w-48 border-3 border-black shadow-[4px_4px_0px_rgba(0,0,0,0.5)] py-2 z-50" style={{ background: '#1A1A2E' }}>
                  <NavLink to="/shop/account/orders" onClick={() => setAccountOpen(false)} className="block px-4 py-2 text-[17px] text-[#5C94FC] hover:text-[#FBD000] hover:bg-[#0F0F23]" style={P}>My Orders</NavLink>
                  <NavLink to="/shop/account/settings" onClick={() => setAccountOpen(false)} className="block px-4 py-2 text-[17px] text-[#5C94FC] hover:text-[#FBD000] hover:bg-[#0F0F23]" style={P}>Account Settings</NavLink>
                  <div className="my-1 border-t-2 border-black" />
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-[17px] text-[#E52521] hover:bg-[#0F0F23]" style={P}>Sign Out</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="text-[15px] text-white hover:text-[#FBD000] transition-colors flex items-center gap-1.5" style={P}>
              <User size={18} /> Sign In
            </Link>
          )}

          {/* Mobile menu toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-white hover:text-[#FBD000]">
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t-2 border-black px-4 pb-4 pt-2 space-y-2" style={{ background: '#C41E1A' }}>
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4a4a6a]" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="w-full h-9 pl-9 pr-3 border-2 border-black bg-[#FFF8E7] text-[15px] text-[#1A1A2E] placeholder:text-[#4a4a6a] outline-none shadow-[2px_2px_0px_rgba(0,0,0,0.3)]" style={P} />
            </div>
          </form>
          <NavLink to="/shop" end onClick={() => setMobileOpen(false)} className="block py-2 text-[15px] text-white hover:text-[#FBD000]" style={P}>Home</NavLink>
          <NavLink to="/shop/catalog" onClick={() => setMobileOpen(false)} className="block py-2 text-[15px] text-white hover:text-[#FBD000]" style={P}>Catalog</NavLink>
          {user && (
            <>
              <NavLink to="/shop/account/orders" onClick={() => setMobileOpen(false)} className="block py-2 text-[15px] text-white hover:text-[#FBD000]" style={P}>My Orders</NavLink>
              <NavLink to="/shop/account/settings" onClick={() => setMobileOpen(false)} className="block py-2 text-[15px] text-white hover:text-[#FBD000]" style={P}>Account Settings</NavLink>
              <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="block w-full text-left py-2 text-[15px] text-[#FBD000]" style={P}>Sign Out</button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
