import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../components/storefront/CartContext';
import { ShieldCheck, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { formatCurrency } from '../../lib/utils';

const P = { fontFamily: "'Russo One', sans-serif" };

export default function Checkout() {
  const { cart, cartSubtotal, cartItemCount, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  if (cartItemCount === 0) {
    return (
      <div className="max-w-[800px] mx-auto py-24 text-center">
        <h2 className="text-xl font-bold mb-4 text-[#E52521]" style={P}>Your cart is empty</h2>
        <Link to="/shop" className="retro-btn text-[15px] px-6 py-2 bg-[#049CD8] text-white" style={P}>Return to homepage</Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const items = cart.map((item) => ({
        productId: item.product.productId,
        quantity: item.quantity,
        price: item.product.price,
      }));
      const res = await api.post('/storefront/checkout', { items, phone, address });
      const orderId = res.data.orderId;
      clearCart();
      navigate(`/shop/order-success?id=${orderId}`);
      toast.success('Order placed successfully!');
    } catch {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const estimatedTax = cartSubtotal * 0.08;
  const total = cartSubtotal + estimatedTax;

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
      {/* Checkout Forms */}
      <div className="flex-1 space-y-6">
        <div className="flex items-center gap-2 mb-6 text-lg font-bold text-[#E52521]" style={P}>
          <Lock size={24} className="text-[#049CD8]" />
          Secure Checkout
        </div>

        <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-8">
          {/* Shipping Address */}
          <div className="retro-card-light p-6">
            <h2 className="text-sm font-bold mb-4 flex items-center gap-2 text-[#1A1A2E]" style={P}>
              <span className="bg-[#E52521] text-white w-6 h-6 flex items-center justify-center text-[15px] border border-black">1</span>
              Shipping Address
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-8">
              <div className="col-span-2">
                <label className="block text-[17px] font-bold text-[#1A1A2E] mb-1 uppercase" style={P}>Full Name</label>
                <input required type="text" className="w-full border-2 border-black bg-[#FFF8E7] p-2 outline-none focus:border-[#FBD000] focus:shadow-[0_0_8px_rgba(251,208,0,0.4)] shadow-[2px_2px_0px_rgba(0,0,0,0.3)]" placeholder="John Doe" />
              </div>
              <div className="col-span-2">
                <label className="block text-[17px] font-bold text-[#1A1A2E] mb-1 uppercase" style={P}>Phone Number</label>
                <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border-2 border-black bg-[#FFF8E7] p-2 outline-none focus:border-[#FBD000] focus:shadow-[0_0_8px_rgba(251,208,0,0.4)] shadow-[2px_2px_0px_rgba(0,0,0,0.3)]" placeholder="+1 (555) 123-4567" />
              </div>
              <div className="col-span-2">
                <label className="block text-[17px] font-bold text-[#1A1A2E] mb-1 uppercase" style={P}>Full Address</label>
                <textarea required value={address} onChange={(e) => setAddress(e.target.value)} rows={3} className="w-full border-2 border-black bg-[#FFF8E7] p-2 outline-none focus:border-[#FBD000] focus:shadow-[0_0_8px_rgba(251,208,0,0.4)] shadow-[2px_2px_0px_rgba(0,0,0,0.3)] resize-none" placeholder="123 Example St, Apt 4B, Metropolis, CA 90210" />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="retro-card-light p-6">
            <h2 className="text-sm font-bold mb-4 flex items-center gap-2 text-[#1A1A2E]" style={P}>
              <span className="bg-[#049CD8] text-white w-6 h-6 flex items-center justify-center text-[15px] border border-black">2</span>
              Payment Method
            </h2>
            <div className="ml-8 space-y-4">
              <div className="flex items-center p-4 border-2 border-[#049CD8] bg-[#049CD8]/10">
                <input type="radio" name="payment" id="cc" defaultChecked className="mr-3 accent-[#049CD8]" />
                <label htmlFor="cc" className="font-bold cursor-pointer text-[#1A1A2E] text-[15px]" style={P}>Credit or debit card</label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="col-span-2">
                  <label className="block text-[17px] font-bold text-[#1A1A2E] mb-1 uppercase" style={P}>Card number</label>
                  <input required type="text" className="w-full border-2 border-black bg-[#FFF8E7] p-2 outline-none focus:border-[#FBD000] focus:shadow-[0_0_8px_rgba(251,208,0,0.4)] shadow-[2px_2px_0px_rgba(0,0,0,0.3)]" placeholder="0000 0000 0000 0000" />
                </div>
                <div>
                  <label className="block text-[17px] font-bold text-[#1A1A2E] mb-1 uppercase" style={P}>Expiration date</label>
                  <input required type="text" className="w-full border-2 border-black bg-[#FFF8E7] p-2 outline-none focus:border-[#FBD000] focus:shadow-[0_0_8px_rgba(251,208,0,0.4)] shadow-[2px_2px_0px_rgba(0,0,0,0.3)]" placeholder="MM/YY" />
                </div>
                <div>
                  <label className="block text-[17px] font-bold text-[#1A1A2E] mb-1 uppercase" style={P}>Security code</label>
                  <input required type="text" className="w-full border-2 border-black bg-[#FFF8E7] p-2 outline-none focus:border-[#FBD000] focus:shadow-[0_0_8px_rgba(251,208,0,0.4)] shadow-[2px_2px_0px_rgba(0,0,0,0.3)]" placeholder="CVC" />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Order Summary */}
      <div className="w-full lg:w-96 flex-shrink-0">
        <div className="retro-card-light p-6 sticky top-6">
          <button
            type="submit"
            form="checkout-form"
            disabled={loading}
            className="retro-btn w-full bg-[#FBD000] hover:bg-[#ffe033] text-black font-bold py-3 px-4 text-[16px] mb-4 flex items-center justify-center disabled:opacity-75 disabled:cursor-wait"
            style={P}
          >
            {loading ? 'Processing...' : 'Place your order'}
          </button>

          <p className="text-[16px] text-[#4a4a6a] text-center mb-6 border-b-2 border-black/20 pb-6" style={P}>
            By placing your order, you agree to ShopStream&apos;s conditions of use.
          </p>

          <h3 className="font-bold text-sm mb-4 text-[#1A1A2E]" style={P}>Order Summary</h3>

          <div className="space-y-2 text-[17px] text-[#1A1A2E] mb-4 border-b-2 border-black/20 pb-4" style={P}>
            <div className="flex justify-between">
              <span>Items ({cartItemCount}):</span>
              <span>{formatCurrency(cartSubtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between">
              <span>Before tax:</span>
              <span>{formatCurrency(cartSubtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (8%):</span>
              <span>{formatCurrency(estimatedTax)}</span>
            </div>
          </div>

          <div className="flex justify-between text-lg font-bold text-[#E52521] mb-6" style={P}>
            <span>Total:</span>
            <span>{formatCurrency(total)}</span>
          </div>

          <div className="space-y-3 border-t-2 border-black/20 pt-4">
            {cart.map((item) => (
              <div key={item.product.productId} className="flex gap-3">
                <div className="w-12 h-12 bg-[#1A1A2E] border border-black flex-shrink-0 overflow-hidden">
                  {item.product.imageUrl ? (
                    <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                  ) : null}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[17px] text-[#1A1A2E] line-clamp-1" style={P}>{item.product.name}</p>
                  <p className="text-[16px] text-[#4a4a6a]" style={P}>Qty: {item.quantity} × {formatCurrency(item.product.price)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 bg-[#1A1A2E] p-3 border-2 border-black flex gap-2">
            <ShieldCheck className="w-5 h-5 flex-shrink-0 text-[#43B047]" />
            <p className="text-[16px] text-[#5C94FC]" style={P}>Your order is saved to the database via JDBC.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
