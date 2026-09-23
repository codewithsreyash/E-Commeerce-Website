import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import { ShoppingCart, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

const P = { fontFamily: "'Russo One', sans-serif" };

const CATEGORY_COLORS = {
  'Electronics': '#049CD8', 'Home & Kitchen': '#43B047',
  'Fashion': '#FF6B9D', 'Clothing': '#FF6B9D', 'Books': '#FBD000', 'Toys': '#7B2FBE',
};
const getCatColor = (c) => CATEGORY_COLORS[c] || '#5C94FC';

export default function ProductCatalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);

  const currentPage = parseInt(searchParams.get('page') || '0', 10);
  const currentCategory = searchParams.get('category') || '';
  const currentKeyword = searchParams.get('keyword') || '';

  const categories = ['Electronics', 'Home & Kitchen', 'Clothing', 'Books', 'Toys'];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = { page: currentPage, size: 12 };
        let endpoint = '/storefront/products';
        if (currentKeyword) { endpoint = '/storefront/products/search'; params.keyword = currentKeyword; }
        else if (currentCategory) { endpoint = `/storefront/products/category/${encodeURIComponent(currentCategory)}`; }
        const res = await api.get(endpoint, { params });
        setProducts(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
      } catch (error) { console.warn('Error fetching catalog', error); }
      finally { setLoading(false); }
    };
    fetchProducts();
  }, [currentPage, currentCategory, currentKeyword]);

  const handleFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set(key, value); else newParams.delete(key);
    newParams.set('page', '0');
    setSearchParams(newParams);
  };
  const clearFilters = () => setSearchParams(new URLSearchParams());
  const hasFilters = currentCategory || currentKeyword;

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">

      {/* Sidebar */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="retro-card-light p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-[16px] text-[#E52521]" style={P}>Filters</h3>
            {hasFilters && (
              <button onClick={clearFilters} className="text-[17px] text-[#049CD8] hover:text-[#FBD000] flex items-center" style={P}>
                <X size={12} className="mr-0.5"/> Clear
              </button>
            )}
          </div>
          <div className="mb-6">
            <h4 className="font-bold text-[17px] text-[#1A1A2E] mb-3 uppercase border-b-2 border-black/10 pb-2" style={P}>Category</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => handleFilter('category', '')}
                  className={`text-left w-full text-[17px] px-3 py-2 border-2 transition-all flex items-center gap-2 ${!currentCategory ? 'font-bold bg-[#E52521] text-white border-[#E52521] shadow-[2px_2px_0px_rgba(0,0,0,0.3)]' : 'bg-[#FFF8E7] text-[#1A1A2E] border-black hover:bg-[#FBD000] hover:text-black'}`} style={P}>
                  <span className={`w-2 h-2 border border-black ${!currentCategory ? 'bg-white' : 'bg-transparent'}`}></span>
                  All Categories
                </button>
              </li>
              {categories.map((cat) => (
                <li key={cat}>
                  <button onClick={() => handleFilter('category', cat)}
                    className={`text-left w-full text-[17px] px-3 py-2 border-2 transition-all flex items-center gap-2 ${currentCategory === cat ? 'font-bold shadow-[2px_2px_0px_rgba(0,0,0,0.3)]' : 'bg-[#FFF8E7] hover:bg-[#FBD000]'}`}
                    style={{ color: currentCategory === cat ? '#FFF' : '#1A1A2E', backgroundColor: currentCategory === cat ? getCatColor(cat) : undefined, borderColor: currentCategory === cat ? getCatColor(cat) : '#000', ...P }}>
                    <span className={`w-2 h-2 border border-black ${currentCategory === cat ? 'bg-white' : 'bg-transparent'}`}></span>
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[17px] text-[#1A1A2E] mb-2 uppercase" style={P}>Price Range</h4>
            <ul className="space-y-1 text-[17px] text-[#1A1A2E]" style={P}>
              <li><button className="hover:text-[#E52521]">Under $25</button></li>
              <li><button className="hover:text-[#E52521]">$25 to $50</button></li>
              <li><button className="hover:text-[#E52521]">$50 to $100</button></li>
              <li><button className="hover:text-[#E52521]">$100+</button></li>
            </ul>
          </div>
        </div>
      </aside>

      {/* Main Grid */}
      <div className="flex-1">
        {currentKeyword && (
          <h2 className="text-[16px] font-bold mb-4 retro-card-light p-4" style={P}>
            Search: <span className="text-[#049CD8]">&quot;{currentKeyword}&quot;</span>
          </h2>
        )}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (<div key={i} className="h-80 bg-[#5C94FC]/20 animate-pulse border-2 border-black" />))}
          </div>
        ) : products.length === 0 ? (
          <div className="retro-card-light p-12 text-center">
            <ShoppingCart className="w-12 h-12 text-[#4a4a6a] mx-auto mb-4" />
            <h3 className="text-[16px] font-bold text-[#E52521]" style={P}>No products found</h3>
            <p className="text-[17px] text-[#4a4a6a] mt-2" style={P}>Try adjusting your filters.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map(product => (
                <Link to={`/shop/product/${product.productId}`} key={product.productId} className="retro-card-light overflow-hidden group">
                  <div className="h-48 bg-[#1A1A2E] flex justify-center items-center overflow-hidden relative">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <ShoppingCart className="w-10 h-10 text-[#4a4a6a]" />
                    )}
                  </div>
                  <div className="p-4">
                    <span className="pixel-badge mb-1" style={{ background: `${getCatColor(product.category)}20`, color: getCatColor(product.category), borderColor: getCatColor(product.category) }}>
                      {product.category}
                    </span>
                    <h3 className="font-bold text-[#1A1A2E] text-[15px] line-clamp-2 mt-2 mb-2" style={P}>{product.name}</h3>
                    <span className="text-lg font-bold text-[#E52521]" style={P}>{formatCurrency(product.price)}</span>
                  </div>
                </Link>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-12 mb-8">
                <button disabled={currentPage <= 0} onClick={() => handleFilter('page', (currentPage - 1).toString())}
                  className="retro-btn p-2 bg-[#049CD8] text-white disabled:opacity-50 disabled:cursor-not-allowed">
                  <ChevronLeft className="w-5 h-5"/>
                </button>
                <span className="text-[15px] text-[#1A1A2E] font-bold" style={P}>
                  Page {currentPage + 1} of {totalPages}
                </span>
                <button disabled={currentPage >= totalPages - 1} onClick={() => handleFilter('page', (currentPage + 1).toString())}
                  className="retro-btn p-2 bg-[#049CD8] text-white disabled:opacity-50 disabled:cursor-not-allowed">
                  <ChevronRight className="w-5 h-5"/>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
