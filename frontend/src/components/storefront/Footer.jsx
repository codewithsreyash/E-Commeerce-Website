import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowUp } from 'lucide-react';

const P = { fontFamily: "'Press Start 2P', monospace" };

export default function Footer() {
  const columns = [
    {
      title: 'Get to Know Us',
      links: ['About ShopStream', 'Careers', 'Press Releases'],
    },
    {
      title: 'Make Money',
      links: ['Sell products', 'Affiliate', 'Advertise'],
    },
    {
      title: 'Payment & Ship',
      links: ['Payment Methods', 'Shipping Rates', 'Returns'],
    },
    {
      title: 'Let Us Help',
      links: ['Your Account', 'Your Orders', 'Help'],
    },
  ];

  return (
    <footer style={{ background: '#1A1A2E' }}>
      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="w-full py-3 border-b-3 border-black text-[9px] text-[#FBD000] transition-colors flex items-center justify-center gap-2 hover:bg-[#C41E1A]"
        style={{ background: '#E52521', ...P }}
      >
        <ArrowUp size={16} /> BACK TO TOP
      </button>

      {/* Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        {columns.map(col => (
          <div key={col.title}>
            <h4 className="text-[#FBD000] font-bold text-[9px] mb-4" style={P}>{col.title}</h4>
            <ul className="space-y-3">
              {col.links.map(label => (
                <li key={label}>
                  <Link to="#" className="text-[8px] text-[#5C94FC] hover:text-[#FBD000] transition-colors" style={P}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom */}
      <div className="border-t-2 border-black py-6" style={{ background: '#0F0F23' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link to="/shop" className="flex items-center gap-2">
            <div className="bg-[#FBD000] border-2 border-black p-1.5 shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">
              <ShoppingCart size={18} className="text-[#E52521]" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight" style={P}>
              Shop<span className="text-[#FBD000]">Stream</span>
            </span>
          </Link>
          <p className="text-[7px] text-[#4a4a6a]" style={P}>© 2025 ShopStream. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
