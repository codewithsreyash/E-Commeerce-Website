import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { ShoppingCart, Sparkles, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

const P = { fontFamily: "'Press Start 2P', monospace" };

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home & Kitchen'];

const CATEGORY_COLORS = {
  'Electronics':    { color: '#049CD8', emoji: '💻' },
  'Clothing':       { color: '#FF6B9D', emoji: '👕' },
  'Books':          { color: '#FBD000', emoji: '📚' },
  'Home & Kitchen': { color: '#43B047', emoji: '🏠' },
  'Toys':           { color: '#7B2FBE', emoji: '🧸' },
};

const ProductCard = ({ product }) => {
  const cfg = CATEGORY_COLORS[product.category] || { color: '#5C94FC' };
  return (
    <Link
      to={`/shop/product/${product.productId}`}
      className="retro-card-light overflow-hidden group"
    >
      <div className="h-44 bg-[#1A1A2E] flex justify-center items-center overflow-hidden">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <ShoppingCart className="w-10 h-10 text-[#4a4a6a]" />
        )}
      </div>
      <div className="p-4">
        <p className="text-[7px] font-bold uppercase mb-1" style={{ color: cfg.color, ...P }}>{product.category}</p>
        <h3 className="font-bold text-[#1A1A2E] text-[9px] mb-2 line-clamp-2" style={P}>{product.name}</h3>
        <p className="text-lg font-extrabold" style={{ color: '#E52521', ...P }}>{formatCurrency(product.price)}</p>
      </div>
    </Link>
  );
};

export default function StorefrontHome() {
  const [productsByCategory, setProductsByCategory] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const results = await Promise.all(
          CATEGORIES.map((cat) =>
            api.get(`/storefront/products/category/${encodeURIComponent(cat)}?size=6`)
              .then((r) => ({ cat, products: r.data.content || [] }))
              .catch(() => ({ cat, products: [] }))
          )
        );
        const map = {};
        results.forEach(({ cat, products }) => { map[cat] = products; });
        setProductsByCategory(map);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const categories = Object.keys(productsByCategory);
  const byCategory = categories.map(cat => ({
    category: cat,
    items: productsByCategory[cat].slice(0, 4),
  }));

  return (
    <div className="min-h-screen">

      {/* Hero Banner */}
      <section className="relative overflow-hidden border-b-3 border-black" style={{ background: 'linear-gradient(135deg, #E52521, #049CD8)' }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 30px, rgba(251,208,0,0.15) 30px, rgba(251,208,0,0.15) 31px), repeating-linear-gradient(90deg, transparent, transparent 30px, rgba(251,208,0,0.15) 30px, rgba(251,208,0,0.15) 31px)' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 border-2 border-black bg-[#FBD000] px-4 py-1.5 text-[8px] mb-6 shadow-[2px_2px_0px_rgba(0,0,0,0.3)]" style={{ ...P, color: '#E52521' }}>
            <Sparkles className="w-4 h-4" />
            <span>NEW ARRIVALS EVERY WEEK!</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 text-white" style={P}>
            Level Up Your <span className="text-[#FBD000]">Shopping</span>
          </h1>
          <p className="text-[10px] text-white/80 max-w-2xl mb-8 leading-relaxed" style={P}>
            Discover amazing products across Electronics, Fashion, Books, Home & more. Fast checkout, real-time tracking, and the best deals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/shop/catalog" className="retro-btn inline-flex items-center gap-2 bg-[#FBD000] hover:bg-[#ffe033] text-black font-bold px-8 py-3.5 text-[10px]" style={P}>
              Shop Now <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/shop/catalog" className="retro-btn inline-flex items-center gap-2 bg-[#049CD8] hover:bg-[#06b0f0] text-white font-bold px-8 py-3.5 text-[10px]" style={P}>
              Browse Catalog
            </Link>
          </div>
        </div>
      </section>

      {/* Category Quick Links */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-6 relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {categories.map(cat => {
            const cfg = CATEGORY_COLORS[cat] || { color: '#5C94FC', emoji: '🛍️' };
            return (
              <Link key={cat} to={`/shop/catalog?category=${encodeURIComponent(cat)}`}
                className="retro-card-light flex flex-col items-center gap-2 p-4 group">
                <span className="text-3xl group-hover:scale-110 transition-transform">{cfg.emoji}</span>
                <span className="text-[8px] font-bold" style={{ color: cfg.color, ...P }}>{cat}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Products by Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        {byCategory.map(({ category, items }) => {
          const cfg = CATEGORY_COLORS[category] || { color: '#5C94FC', emoji: '🛍️' };
          return (
            <div key={category}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{cfg.emoji}</span>
                  <h2 className="text-lg font-bold" style={{ color: cfg.color, ...P }}>{category}</h2>
                </div>
                <Link to={`/shop/catalog?category=${encodeURIComponent(category)}`} className="retro-btn text-[8px] font-bold px-4 py-2" style={{ background: cfg.color, color: '#fff', ...P }}>
                  View All <ArrowRight className="w-4 h-4 inline" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {items.map(p => (
                  <ProductCard key={p.productId} product={p} />
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
