import { useRef } from 'react';
import { X, Printer, Package } from 'lucide-react';
import { formatCurrency, formatDate } from '../lib/utils';

const P = { fontFamily: "'Russo One', sans-serif" };
const P2 = { fontFamily: "'Inter', sans-serif" };

export default function InvoiceModal({ order, onClose }) {
  const printRef = useRef(null);

  if (!order) return null;

  const handlePrint = () => {
    const content = printRef.current;
    const win = window.open('', '_blank');
    win.document.write(`
      <html>
      <head>
        <title>Invoice #${order.orderId}</title>
        <link href="https://fonts.googleapis.com/css2?family=Russo+One&family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Inter', sans-serif; padding: 40px; color: #1A1A2E; }
          .invoice { max-width: 800px; margin: 0 auto; border: 3px solid #000; }
          .header { background: #E52521; color: #fff; padding: 24px 32px; display: flex; justify-content: space-between; align-items: center; }
          .header h1 { font-family: 'Russo One', sans-serif; font-size: 28px; }
          .header .invoice-no { font-family: 'Russo One', sans-serif; font-size: 14px; color: #fff; }
          .body { padding: 32px; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px; }
          .info-box { border: 2px solid #000; padding: 16px; }
          .info-box h3 { font-family: 'Russo One', sans-serif; font-size: 11px; color: #E52521; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 1px; }
          .info-box p { font-size: 13px; line-height: 1.6; font-weight: 600; }
          .info-box .label { color: #666; font-size: 11px; text-transform: uppercase; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
          thead th { background: #1A1A2E; color: #fff; font-family: 'Russo One', sans-serif; font-size: 11px; text-transform: uppercase; padding: 12px 16px; text-align: left; border: 2px solid #000; }
          thead th:last-child, thead th:nth-child(3), thead th:nth-child(4) { text-align: right; }
          tbody td { padding: 12px 16px; border: 1px solid #ccc; font-size: 13px; font-weight: 600; }
          tbody td:last-child, tbody td:nth-child(3), tbody td:nth-child(4) { text-align: right; }
          tbody tr:nth-child(even) { background: #FFF8E7; }
          .totals { display: flex; justify-content: flex-end; }
          .totals-box { border: 3px solid #000; min-width: 250px; }
          .totals-row { display: flex; justify-content: space-between; padding: 10px 16px; font-weight: 600; font-size: 13px; }
          .totals-row.total { background: #1A1A2E; color: #fff; font-family: 'Russo One', sans-serif; font-size: 16px; padding: 14px 16px; }
          .badge { display: inline-block; background: #43B047; color: #fff; font-family: 'Russo One', sans-serif; font-size: 10px; padding: 4px 12px; border: 2px solid #000; }
          .footer { border-top: 2px solid #000; padding: 16px 32px; text-align: center; font-size: 11px; color: #666; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>${content.innerHTML}</body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  const subtotal = order.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) || order.totalAmount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto border-3 border-black shadow-[8px_8px_0px_rgba(0,0,0,0.5)]" style={{ background: '#fff' }}>

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b-2 border-black" style={{ background: '#E52521' }}>
          <h2 className="text-white font-bold" style={P}>Invoice</h2>
          <div className="flex items-center gap-2">
            <button onClick={handlePrint} className="retro-btn flex items-center gap-1 bg-[#049CD8] text-white text-[12px] px-3 py-1" style={P}>
              <Printer size={14} /> Print
            </button>
            <button onClick={onClose} className="retro-btn flex items-center justify-center bg-[#1A1A2E] text-white w-8 h-8">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Invoice Content */}
        <div ref={printRef} className="invoice">
          {/* Header */}
          <div className="px-8 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" style={{ background: '#E52521' }}>
            <div>
              <h1 className="text-2xl font-bold text-white" style={P}>ShopStream</h1>
              <p className="text-[12px] text-white mt-1" style={P2}>Invoice / Bill</p>
            </div>
            <div className="text-right">
              <p className="text-[14px] font-bold text-white" style={P}>Invoice #{order.orderId}</p>
              <p className="text-[12px] text-white mt-1" style={P2}>{formatDate(order.createdAt)}</p>
              <span className="inline-block mt-2 px-3 py-1 text-[10px] font-bold text-white border-2 border-black" style={{ background: '#43B047', ...P }}>
                DELIVERED
              </span>
            </div>
          </div>

          {/* Info Grid */}
          <div className="px-8 py-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border-2 border-black p-4" style={{ background: '#FFF8E7' }}>
              <h3 className="text-[11px] font-bold text-[#E52521] uppercase tracking-wider mb-2" style={P}>Bill To</h3>
              <p className="text-[14px] font-bold text-[#1A1A2E]" style={P2}>{order.customerName || 'Customer'}</p>
              {order.customerEmail && <p className="text-[12px] text-[#444] mt-1" style={P2}>Email: {order.customerEmail}</p>}
              {order.customerPhone && <p className="text-[12px] text-[#444] mt-1" style={P2}>Phone: {order.customerPhone}</p>}
              {order.deliveryAddress && <p className="text-[12px] text-[#444] mt-1" style={P2}>Address: {order.deliveryAddress}</p>}
            </div>
            <div className="border-2 border-black p-4" style={{ background: '#FFF8E7' }}>
              <h3 className="text-[11px] font-bold text-[#E52521] uppercase tracking-wider mb-2" style={P}>Order Info</h3>
              <p className="text-[12px] text-[#666]" style={P2}>Order ID: <strong>#{order.orderId}</strong></p>
              <p className="text-[12px] text-[#666] mt-1" style={P2}>Date: <strong>{formatDate(order.createdAt)}</strong></p>
              <p className="text-[12px] text-[#666] mt-1" style={P2}>Status: <strong style={{ color: '#43B047' }}>Delivered</strong></p>
              <p className="text-[12px] text-[#666] mt-1" style={P2}>Items: <strong>{order.items?.length || 0}</strong></p>
            </div>
          </div>

          {/* Items Table */}
          <div className="px-8 pb-6">
            <table className="w-full border-2 border-black border-collapse">
              <thead>
                <tr>
                  <th className="text-left px-4 py-3 text-[11px] text-white uppercase border-2 border-black" style={{ background: '#1A1A2E', ...P }}>#</th>
                  <th className="text-left px-4 py-3 text-[11px] text-white uppercase border-2 border-black" style={{ background: '#1A1A2E', ...P }}>Product</th>
                  <th className="text-right px-4 py-3 text-[11px] text-white uppercase border-2 border-black" style={{ background: '#1A1A2E', ...P }}>Qty</th>
                  <th className="text-right px-4 py-3 text-[11px] text-white uppercase border-2 border-black" style={{ background: '#1A1A2E', ...P }}>Unit Price</th>
                  <th className="text-right px-4 py-3 text-[11px] text-white uppercase border-2 border-black" style={{ background: '#1A1A2E', ...P }}>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items?.map((item, i) => (
                  <tr key={item.orderItemId || i} style={{ background: i % 2 === 0 ? '#fff' : '#FFF8E7' }}>
                    <td className="px-4 py-3 border border-black/20 text-[12px] font-bold" style={P2}>{i + 1}</td>
                    <td className="px-4 py-3 border border-black/20" style={P2}>
                      <div className="flex items-center gap-3">
                        {item.productImageUrl ? (
                          <img src={item.productImageUrl} alt={item.productName} className="w-10 h-10 object-cover border border-black flex-shrink-0" />
                        ) : (
                          <div className="w-10 h-10 border border-black bg-[#1A1A2E] flex items-center justify-center flex-shrink-0">
                            <Package className="w-4 h-4 text-[#5C94FC]" />
                          </div>
                        )}
                        <div>
                          <p className="text-[12px] font-bold text-[#1A1A2E]">{item.productName || `Product #${item.productId}`}</p>
                          {item.productCategory && <p className="text-[10px] text-[#888] mt-0.5">{item.productCategory}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 border border-black/20 text-[12px] font-bold text-right" style={P2}>{item.quantity}</td>
                    <td className="px-4 py-3 border border-black/20 text-[12px] font-bold text-right" style={P2}>{formatCurrency(item.price)}</td>
                    <td className="px-4 py-3 border border-black/20 text-[12px] font-bold text-right" style={P2}>{formatCurrency(item.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="px-8 pb-8 flex justify-end">
            <div className="border-3 border-black min-w-[250px]">
              <div className="flex justify-between px-4 py-2 border-b border-black/20">
                <span className="text-[12px] text-[#666]" style={P2}>Subtotal</span>
                <span className="text-[12px] font-bold" style={P2}>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between px-4 py-2 border-b border-black/20">
                <span className="text-[12px] text-[#666]" style={P2}>Shipping</span>
                <span className="text-[12px] font-bold text-[#43B047]" style={P2}>FREE</span>
              </div>
              <div className="flex justify-between px-4 py-3" style={{ background: '#1A1A2E' }}>
                <span className="text-[14px] text-white font-bold" style={P}>Total</span>
                <span className="text-[14px] text-white font-bold" style={P}>{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t-2 border-black px-8 py-4 text-center" style={{ background: '#FFF8E7' }}>
            <p className="text-[11px] font-bold text-[#E52521]" style={P}>Thank you for shopping with ShopStream!</p>
            <p className="text-[10px] text-[#666] mt-1" style={P2}>This is a computer-generated invoice. No signature required.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
