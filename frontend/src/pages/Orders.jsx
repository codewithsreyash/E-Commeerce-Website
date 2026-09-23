import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { ChevronDown, ChevronUp, Trash2, RefreshCw, MapPin, User, Phone, Package, DollarSign, ShoppingBag, Clock, CheckCircle, XCircle, Truck, FileText } from 'lucide-react';
import { formatCurrency, formatDate, getErrorMessage } from '../lib/utils';
import { getOrdersWithDetails, getOrderRevenue, updateOrder, deleteOrder } from '../services/api';
import InvoiceModal from '../components/InvoiceModal';

const P = { fontFamily: "'Russo One', sans-serif" };

const STATUS_CONFIG = {
  PENDING:   { color: '#FBD000', bg: '#FBD00020', border: '#FBD000', icon: Clock,       dot: '#FBD000' },
  PAID:      { color: '#049CD8', bg: '#049CD820', border: '#049CD8', icon: DollarSign,  dot: '#049CD8' },
  SHIPPED:   { color: '#7B2FBE', bg: '#7B2FBE20', border: '#7B2FBE', icon: Truck,       dot: '#7B2FBE' },
  DELIVERED: { color: '#43B047', bg: '#43B04720', border: '#43B047', icon: CheckCircle, dot: '#43B047' },
  CANCELLED: { color: '#E52521', bg: '#E5252120', border: '#E52521', icon: XCircle,     dot: '#E52521' },
};

const STATUSES = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
  return (
    <span className="pixel-badge" style={{ background: cfg.bg, color: cfg.color, borderColor: cfg.border }}>
      <span style={{ width:6, height:6, background: cfg.dot, display:'inline-block', border:'1px solid #000' }} />
      {status}
    </span>
  );
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [revenue, setRevenue] = useState(0);
  const [filterStatus, setFilterStatus] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [invoiceOrder, setInvoiceOrder] = useState(null);

  const reload = useCallback(() => setReloadKey(k => k + 1), []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [ordRes, revRes] = await Promise.all([
          getOrdersWithDetails({ page: 0, size: 100, sort: 'createdAt,desc', status: filterStatus || undefined }),
          getOrderRevenue({}),
        ]);
        setOrders(ordRes.data);
        setRevenue(revRes.data.revenue);
      } catch (err) {
        toast.error(getErrorMessage(err, 'Failed to load orders'));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [filterStatus, reloadKey]);

  const handleStatusChange = async (order, newStatus) => {
    try {
      await updateOrder(order.orderId, { customerId: order.customerId, totalAmount: order.totalAmount, status: newStatus });
      toast.success(`Order #${order.orderId} → ${newStatus}`);
      reload();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to update status'));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Delete Order #${id}?`)) return;
    try { await deleteOrder(id); toast.success(`Order #${id} deleted`); reload(); }
    catch (err) { toast.error(getErrorMessage(err, 'Failed to delete order')); }
  };

  const counts = STATUSES.reduce((acc, s) => ({ ...acc, [s]: orders.filter(o => o.status === s).length }), {});

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="text-[17px] font-bold uppercase tracking-widest text-[#5C94FC] mb-1" style={P}>Fulfillment</p>
          <h1 className="text-xl font-bold text-white" style={P}>Orders</h1>
          <p className="text-[15px] text-[#5C94FC] mt-1" style={P}>Manage orders, update statuses, and view customer details.</p>
        </div>
        <button onClick={reload} className="retro-btn flex items-center gap-2 px-4 py-2 bg-[#1A1A2E] text-[#5C94FC] text-[17px]" style={P}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        <div className="border-3 border-black shadow-[3px_3px_0px_rgba(0,0,0,0.5)] p-4" style={{ background: '#E52521' }}>
          <p className="text-[16px] font-bold uppercase tracking-wider mb-1" style={{ color: '#FFF', ...P }}>Revenue</p>
          <p className="text-lg font-bold" style={{ color: '#FFF', ...P }}>{formatCurrency(revenue)}</p>
        </div>
        {STATUSES.map(s => {
          const cfg = STATUS_CONFIG[s];
          const Icon = cfg.icon;
          const active = filterStatus === s;
          return (
            <button key={s} onClick={() => setFilterStatus(active ? '' : s)}
              className="border-3 border-black shadow-[3px_3px_0px_rgba(0,0,0,0.5)] p-4 text-left cursor-pointer transition-all"
              style={{ background: active ? cfg.bg : '#1A1A2E', borderColor: active ? cfg.border : '#000' }}>
              <Icon size={14} style={{ color: active ? cfg.color : '#4a4a6a', marginBottom: 8 }} />
              <p className="text-lg font-bold" style={{ color: active ? cfg.color : '#FBD000', ...P }}>{counts[s] ?? 0}</p>
              <p className="text-[16px] font-bold uppercase mt-1" style={{ color: active ? cfg.color : '#4a4a6a', ...P }}>{s}</p>
            </button>
          );
        })}
      </div>

      {/* Orders List */}
      <div className="space-y-2">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="border-2 border-black bg-[#1A1A2E] p-5 h-20 shadow-[2px_2px_0px_rgba(0,0,0,0.3)]" />
          ))
        ) : orders.length === 0 ? (
          <div className="border-3 border-black bg-[#1A1A2E] p-16 text-center shadow-[4px_4px_0px_rgba(0,0,0,0.5)]">
            <ShoppingBag size={40} className="text-[#4a4a6a] mx-auto mb-4" />
            <p className="text-[#5C94FC] font-bold text-[16px]" style={P}>No orders found</p>
          </div>
        ) : orders.map(order => {
          const isOpen = expandedId === order.orderId;
          const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
          return (
            <div key={order.orderId} className="border-3 border-black shadow-[3px_3px_0px_rgba(0,0,0,0.5)] transition-all" style={{ background: isOpen ? '#16213E' : '#1A1A2E', borderColor: isOpen ? cfg.border : '#000' }}>

              {/* Row */}
              <div className="flex items-center gap-3 p-4">
                <button onClick={() => setExpandedId(isOpen ? null : order.orderId)}
                  className="w-8 h-8 border-2 border-black bg-[#0F0F23] flex items-center justify-center flex-shrink-0 shadow-[2px_2px_0px_rgba(0,0,0,0.3)] text-[#5C94FC]">
                  {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                <div style={{ width:8, height:8, background: cfg.dot, border:'1px solid #000', flexShrink:0 }} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[16px] font-bold text-white" style={P}>Order #{order.orderId}</span>
                    <StatusBadge status={order.status} />
                  </div>
                  <div className="flex items-center gap-4 mt-1 flex-wrap">
                    <span className="flex items-center gap-1 text-[17px] text-[#5C94FC]" style={P}>
                      <User size={11} /> {order.customerName || 'Unknown'}
                    </span>
                    {order.deliveryAddress && (
                      <span className="flex items-center gap-1 text-[17px] text-[#4a4a6a]" style={P}>
                        <MapPin size={11} /> {order.deliveryAddress}
                      </span>
                    )}
                    <span className="text-[16px] text-[#4a4a6a]" style={P}>{formatDate(order.createdAt)}</span>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <p className="text-[16px] font-bold text-white" style={P}>{formatCurrency(order.totalAmount)}</p>
                  <p className="text-[16px] text-[#4a4a6a]" style={P}>{order.items?.length ?? 0} items</p>
                </div>

                <select value={order.status} onChange={e => handleStatusChange(order, e.target.value)}
                  className="border-2 border-black px-2 py-1 text-[17px] font-bold cursor-pointer outline-none flex-shrink-0 shadow-[2px_2px_0px_rgba(0,0,0,0.3)]"
                  style={{ background: cfg.bg, color: cfg.color, borderColor: cfg.border, ...P }}>
                  {STATUSES.map(s => <option key={s} value={s} style={{ background:'#0F0F23', color: '#FBD000' }}>{s}</option>)}
                </select>

                {order.status === 'DELIVERED' && (
                  <button onClick={() => setInvoiceOrder(order)}
                    className="retro-btn w-8 h-8 flex items-center justify-center bg-[#43B047] text-white flex-shrink-0 text-[17px]">
                    <FileText size={13} />
                  </button>
                )}
                <button onClick={() => handleDelete(order.orderId)}
                  className="retro-btn w-8 h-8 flex items-center justify-center bg-[#E52521] text-white flex-shrink-0 text-[17px]">
                  <Trash2 size={13} />
                </button>
              </div>

              {/* Expanded */}
              {isOpen && (
                <div className="border-t-2 border-black p-5 space-y-4">

                  {/* Customer info */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { icon: User,   color:'#7B2FBE', label:'Customer',  val: order.customerName || '—', sub: order.customerEmail },
                      { icon: Phone,  color:'#049CD8', label:'Phone',     val: order.customerPhone || '—' },
                      { icon: MapPin, color:'#FBD000', label:'Address',   val: order.deliveryAddress || '—' },
                    ].map(({ icon: Icon, color, label, val, sub }) => (
                      <div key={label} className="border-2 border-black p-4 shadow-[2px_2px_0px_rgba(0,0,0,0.3)]" style={{ background: `${color}10` }}>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-7 h-7 border border-black flex items-center justify-center" style={{ background: `${color}30` }}>
                            <Icon size={13} style={{ color }} />
                          </div>
                          <span className="text-[16px] font-bold uppercase" style={{ color: '#5C94FC', ...P }}>{label}</span>
                        </div>
                        <p className="text-[15px] font-bold text-white" style={P}>{val}</p>
                        {sub && <p className="text-[17px] text-[#5C94FC] mt-1" style={P}>{sub}</p>}
                      </div>
                    ))}
                  </div>

                  {/* Items */}
                  {order.items && order.items.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Package size={13} className="text-[#5C94FC]" />
                        <span className="text-[17px] font-bold uppercase text-[#5C94FC]" style={P}>Order Items · {order.items.length}</span>
                      </div>
                      <div className="space-y-2">
                        {order.items.map(item => (
                          <div key={item.orderItemId} className="flex items-center gap-3 border-2 border-black p-3 shadow-[2px_2px_0px_rgba(0,0,0,0.3)]" style={{ background: '#0F0F23' }}>
                            {item.productImageUrl ? (
                              <img src={item.productImageUrl} alt={item.productName} className="w-11 h-11 object-cover border border-black flex-shrink-0" />
                            ) : (
                              <div className="w-11 h-11 border border-black bg-[#1A1A2E] flex items-center justify-center flex-shrink-0">
                                <Package size={18} className="text-[#4a4a6a]" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-[15px] font-bold text-white overflow-hidden text-ellipsis whitespace-nowrap" style={P}>
                                {item.productName || `Product #${item.productId}`}
                              </p>
                              <p className="text-[16px] text-[#4a4a6a] mt-1" style={P}>{item.productCategory || 'Uncategorized'}</p>
                            </div>
                            <div className="flex gap-4 flex-shrink-0 text-right">
                              <div>
                                <p className="text-[16px] text-[#4a4a6a]" style={P}>Qty</p>
                                <p className="text-[15px] font-bold text-[#5C94FC]" style={P}>{item.quantity}</p>
                              </div>
                              <div>
                                <p className="text-[16px] text-[#4a4a6a]" style={P}>Price</p>
                                <p className="text-[15px] font-bold text-[#5C94FC]" style={P}>{formatCurrency(item.price)}</p>
                              </div>
                              <div>
                                <p className="text-[16px] text-[#4a4a6a]" style={P}>Sub</p>
                                <p className="text-[15px] font-bold" style={{ color: '#43B047', ...P }}>{formatCurrency(item.price * item.quantity)}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-end mt-3">
                        <div className="border-2 border-black p-3 shadow-[2px_2px_0px_rgba(0,0,0,0.3)] text-right" style={{ background: '#0F0F23' }}>
                          <p className="text-[16px] uppercase text-[#4a4a6a]" style={P}>Order Total</p>
                          <p className="text-lg font-bold text-white mt-1" style={P}>{formatCurrency(order.totalAmount)}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {invoiceOrder && <InvoiceModal order={invoiceOrder} onClose={() => setInvoiceOrder(null)} />}
    </div>
  );
}
