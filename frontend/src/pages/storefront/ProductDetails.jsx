import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { useCart } from '../../components/storefront/CartContext';
import toast from 'react-hot-toast';
import { ShoppingCart, Truck, ShieldCheck, ArrowLeft } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

const P = { fontFamily: "'Press Start 2P', monospace" };

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/storefront/products/${id}`);
        setProduct(res.data);
      } catch (error) {
        console.warn('Error fetching product details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
        <div className="h-8 w-32 bg-[#5C94FC]/20 border-2 border-black mb-8"></div>
        <div className="flex flex-col md:flex-row gap-12">
          <div className="w-full md:w-1/2 h-96 bg-[#5C94FC]/20 border-2 border-black"></div>
          <div className="w-full md:w-1/2 space-y-4 pt-4">
            <div className="h-10 bg-[#5C94FC]/20 border-2 border-black w-3/4"></div>
            <div className="h-6 bg-[#5C94FC]/20 border-2 border-black w-1/4"></div>
            <div className="h-24 bg-[#5C94FC]/20 border-2 border-black w-full mt-8"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-24 text-center">
        <h2 className="text-xl font-bold text-[#E52521] mb-4" style={P}>Product not found</h2>
        <p className="text-[9px] text-[#4a4a6a] mb-8" style={P}>We couldn&apos;t find the product you&apos;re looking for.</p>
        <button onClick={() => navigate('/shop/catalog')} className="retro-btn text-[9px] px-6 py-2 bg-[#049CD8] text-white" style={P}>
          <ArrowLeft className="inline w-4 h-4 mr-1"/> Back to Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Navigation */}
      <div className="mb-6">
        <button onClick={() => navigate(-1)} className="retro-btn text-[8px] px-4 py-2 bg-[#1A1A2E] text-[#5C94FC]" style={P}>
          <ArrowLeft className="inline w-4 h-4 mr-1" /> Back to results
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-12">
        {/* Image */}
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <div className="w-full border-3 border-black shadow-[4px_4px_0px_rgba(0,0,0,0.5)] aspect-square flex items-center justify-center mb-4 overflow-hidden relative bg-[#1A1A2E]">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <ShoppingCart className="w-16 h-16 text-[#4a4a6a]" />
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="w-full md:w-1/2">
          <h1 className="text-xl font-bold text-[#1A1A2E] tracking-tight mb-2" style={P}>{product.name}</h1>

          <div className="flex items-center gap-2 mb-4">
            <span className="pixel-badge" style={{ background: '#049CD820', color: '#049CD8', borderColor: '#049CD8' }}>
              {product.category}
            </span>
          </div>

          <div className="border-t-2 border-black mb-6" />

          <div className="mb-6">
            <span className="text-3xl font-extrabold text-[#E52521]" style={P}>{formatCurrency(product.price)}</span>
          </div>

          <div className="mb-8">
            <h3 className="text-[9px] font-bold text-[#1A1A2E] mb-2 uppercase" style={P}>About this item</h3>
            <p className="text-[9px] whitespace-pre-line text-[#4a4a6a] leading-relaxed" style={P}>{product.description}</p>
          </div>

          <div className="retro-card-light p-6">
            <div className="mb-4">
              <span className="pixel-badge" style={{ background: product.stock > 0 ? '#43B047' : '#E52521', color: '#fff' }}>
                {product.stock > 0 ? 'IN STOCK' : 'OUT OF STOCK'}
              </span>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <label className="text-[9px] font-bold text-[#1A1A2E]" style={P}>Qty:</label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="border-2 border-black bg-[#FFF8E7] px-2 py-1 text-[9px] outline-none shadow-[2px_2px_0px_rgba(0,0,0,0.3)]"
                style={P}
                disabled={product.stock === 0}
              >
                {[...Array(Math.min(10, product.stock || 0))].map((_, i) => (
                  <option key={i+1} value={i+1}>{i+1}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => { addToCart(product, quantity); toast.success(`Added ${quantity} to cart!`); }}
              disabled={product.stock === 0}
              className="retro-btn w-full bg-[#FBD000] hover:bg-[#ffe033] text-black font-bold py-3 px-4 text-[10px] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={P}
            >
              <ShoppingCart className="w-5 h-5"/> Add to Cart
            </button>
            <button
              onClick={() => { addToCart(product, quantity); navigate('/shop/checkout'); }}
              disabled={product.stock === 0}
              className="retro-btn w-full mt-3 bg-[#E52521] hover:bg-[#ff3333] text-white font-bold py-3 px-4 text-[10px] disabled:opacity-50 disabled:cursor-not-allowed"
              style={P}
            >
              Buy Now
            </button>

            <div className="mt-6 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-[#049CD8]" />
                <span className="text-[8px] text-[#1A1A2E]" style={P}>Ships from <b>ShopStream</b></span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-[#43B047]" />
                <span className="text-[8px] text-[#1A1A2E]" style={P}>Eligible for Return</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
