import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Package } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

const P = { fontFamily: "'Press Start 2P', monospace" };

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/customer/orders');
        setOrders(res.data);
      } catch (error) {
        console.warn('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const statusStyle = (status) => {
    switch (status) {
      case 'DELIVERED': return { bg: '#43B047', color: '#fff' };
      case 'SHIPPED': return { bg: '#049CD8', color: '#fff' };
      case 'CANCELLED': return { bg: '#E52521', color: '#fff' };
      case 'PAID': return { bg: '#7B2FBE', color: '#fff' };
      default: return { bg: '#FBD000', color: '#000' };
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-lg font-bold mb-6 text-[#E52521]" style={P}>Your Orders</h1>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-[#5C94FC]/20 animate-pulse border-2 border-black" />
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="p-16 flex flex-col items-center justify-center text-center">
        <div className="bg-[#1A1A2E] p-4 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,0.5)] mb-4">
          <Package className="w-12 h-12 text-[#5C94FC]" />
        </div>
        <h2 className="text-lg font-bold text-[#E52521] mb-2" style={P}>No orders yet</h2>
        <p className="text-[9px] text-[#4a4a6a] mb-6" style={P}>Browse our catalog and place your first order.</p>
        <Link to="/shop/catalog" className="retro-btn bg-[#FBD000] hover:bg-[#ffe033] text-black font-bold py-2 px-6 text-[9px]" style={P}>Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8">
      <h1 className="text-lg font-bold text-[#E52521] mb-6" style={P}>Your Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => {
          const ss = statusStyle(order.status);
          return (
          <div key={order.orderId} className="border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,0.5)] overflow-hidden bg-[#FFF8E7]">
            <div className="bg-[#1A1A2E] border-b-2 border-black px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex gap-8">
                <div>
                  <p className="text-[7px] text-[#5C94FC] uppercase tracking-wider font-bold mb-1" style={P}>Order Placed</p>
                  <p className="text-[9px] font-bold text-[#FBD000]" style={P}>{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-[7px] text-[#5C94FC] uppercase tracking-wider font-bold mb-1" style={P}>Total</p>
                  <p className="text-[9px] font-bold text-[#FBD000]" style={P}>{formatCurrency(order.totalAmount)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[7px] text-[#5C94FC] uppercase tracking-wider font-bold mb-1" style={P}>Order #</p>
                <p className="text-[9px] font-bold text-[#FBD000]" style={P}>{order.orderId}</p>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <span className="pixel-badge" style={{ background: ss.bg, color: ss.color }}>
                  {order.status}
                </span>
              </div>

              <div className="space-y-4">
                {order.items && order.items.length > 0 ? order.items.map((item) => (
                  <div key={item.orderItemId} className="flex gap-4 items-center">
                    <Link to={`/shop/product/${item.productId}`} className="w-20 h-20 bg-[#1A1A2E] border-2 border-black flex items-center justify-center flex-shrink-0">
                      <Package className="w-6 h-6 text-[#5C94FC]" />
                    </Link>
                    <div className="flex-1">
                      <Link to={`/shop/product/${item.productId}`} className="text-[9px] font-bold text-[#049CD8] hover:text-[#E52521]" style={P}>
                        Product #{item.productId}
                      </Link>
                      <p className="text-[8px] text-[#4a4a6a] mt-1" style={P}>Qty: {item.quantity}</p>
                      <p className="text-[9px] font-bold text-[#E52521] mt-1" style={P}>{formatCurrency(item.price)} each</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-[9px] text-[#4a4a6a]" style={P}>No items found.</p>
                )}
              </div>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
}
