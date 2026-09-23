import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const P = { fontFamily: "'Russo One', sans-serif" };

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('id');

  return (
    <div className="max-w-[800px] mx-auto px-4 py-24 flex flex-col items-center text-center">
      <div className="bg-[#43B047] border-3 border-black p-4 shadow-[4px_4px_0px_rgba(0,0,0,0.5)] mb-6">
        <CheckCircle className="w-16 h-16 text-white" />
      </div>
      <h1 className="text-xl font-bold text-[#43B047] mb-4" style={P}>Order Placed!</h1>
      <p className="text-[15px] text-[#4a4a6a] mb-8" style={P}>Thank you for your purchase. Your order has been saved.</p>

      {orderId && (
        <div className="bg-[#1A1A2E] p-6 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,0.5)] mb-8 w-full max-w-md">
          <p className="text-[17px] text-[#5C94FC] uppercase tracking-wider font-bold mb-1" style={P}>Order Number</p>
          <p className="text-2xl font-bold text-white" style={P}>#{orderId}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-4 justify-center">
        <Link to="/shop/account/orders" className="retro-btn bg-[#049CD8] hover:bg-[#0380b0] text-white font-bold py-3 px-8 text-[15px]" style={P}>
          View My Orders
        </Link>
        <Link to="/shop/catalog" className="retro-btn bg-[#FBD000] hover:bg-[#ffe033] text-black font-bold py-3 px-8 text-[15px]" style={P}>
          Continue Shopping
        </Link>
        <Link to="/" className="retro-btn bg-[#1A1A2E] hover:bg-[#2a2a4e] text-[#5C94FC] font-bold py-3 px-8 text-[15px] border-2 border-black" style={P}>
          Return Home
        </Link>
      </div>
    </div>
  );
}
