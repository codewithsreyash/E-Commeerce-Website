import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { TrendingUp, ShoppingCart, Users, Package, DollarSign } from 'lucide-react';
import { Skeleton } from '../components/ui/skeleton';
import { formatCurrency, getErrorMessage } from '../lib/utils';
import { getDashboardStats } from '../services/api';

const P = { fontFamily: "'Russo One', sans-serif" };

const KPI_CONFIG = [
  { key: 'totalRevenue',   label: 'Total Revenue',   icon: DollarSign,   color: '#E52521',  bg: '#FFE5E5' },
  { key: 'totalOrders',    label: 'Total Orders',    icon: ShoppingCart, color: '#049CD8',  bg: '#E5F5FF' },
  { key: 'totalCustomers', label: 'Total Customers', icon: Users,        color: '#43B047',  bg: '#E5FFE5' },
  { key: 'totalProducts',  label: 'Total Products',  icon: Package,      color: '#FBD000',  bg: '#FFFBE5' },
];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await getDashboardStats();
        setStats(res.data);
        setError('');
      } catch (err) {
        setError(getErrorMessage(err, 'Unable to load dashboard statistics'));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const orderStatusData = stats
    ? Object.entries(stats.orderStatusCounts).map(([status, total]) => ({ status, total }))
    : [];

  const kpiValues = stats ? {
    totalRevenue:   { value: formatCurrency(stats.totalRevenue),    delta: stats.totalRevenueMetric.changePercentage },
    totalOrders:    { value: stats.totalOrders.total,               delta: stats.totalOrders.changePercentage },
    totalCustomers: { value: stats.totalCustomers.total,            delta: stats.totalCustomers.changePercentage },
    totalProducts:  { value: stats.totalProducts.total,             delta: stats.totalProducts.changePercentage },
  } : {};

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <p className="text-[17px] font-bold uppercase tracking-widest text-[#5C94FC] mb-1" style={P}>Analytics</p>
        <h1 className="text-xl font-bold text-white" style={P}>Operations Dashboard</h1>
        <p className="text-[15px] text-[#5C94FC] mt-1" style={P}>Live revenue, order trends, and top-performing products.</p>
      </div>

      {error && (
        <div className="border-2 border-[#E52521] bg-[#E52521]/20 px-4 py-3 text-[15px] text-[#FF6B9D]" style={P}>{error}</div>
      )}

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {KPI_CONFIG.map(cfg => {
          const Icon = cfg.icon;
          const kpi = kpiValues[cfg.key];
          return (
            <div key={cfg.key} className="border-3 border-black shadow-[4px_4px_0px_rgba(0,0,0,0.5)] p-5 transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_rgba(0,0,0,0.5)]" style={{ background: cfg.bg }}>
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-28" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_rgba(0,0,0,0.3)]" style={{ background: `${cfg.color}30` }}>
                      <Icon className="w-5 h-5" style={{ color: cfg.color }} />
                    </div>
                    {kpi && (
                      <span className="text-[17px] font-bold px-2 py-1 border-2 border-black shadow-[1px_1px_0px_rgba(0,0,0,0.3)]" style={{ background: kpi.delta >= 0 ? '#43B047' : '#E52521', color: '#fff' }}>
                        {kpi.delta >= 0 ? '↑' : '↓'} {Math.abs(kpi.delta)}%
                      </span>
                    )}
                  </div>
                  <p className="text-[16px] font-bold uppercase tracking-wider mb-1" style={{ color: cfg.color, ...P }}>{cfg.label}</p>
                  <p className="text-2xl font-bold" style={{ color: cfg.color, ...P }}>{kpi?.value ?? '—'}</p>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">

        {/* Revenue Line Chart */}
        <div className="border-3 border-black shadow-[4px_4px_0px_rgba(0,0,0,0.5)] p-6" style={{ background: '#1A1A2E' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_rgba(0,0,0,0.3)]" style={{ background: '#E52521' }}>
              <TrendingUp className="w-5 h-5" style={{ color: '#fff' }} />
            </div>
            <div>
              <p className="text-[16px] uppercase tracking-wider text-[#5C94FC]" style={P}>Revenue Trend</p>
              <h3 className="text-white font-bold text-sm" style={P}>Monthly Revenue</h3>
            </div>
          </div>
          {loading ? <Skeleton className="h-[280px] w-full" /> : (
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.monthlyRevenue}>
                  <CartesianGrid stroke="rgba(91,148,252,0.1)" vertical={false} />
                  <XAxis dataKey="month" stroke="#5C94FC" tickLine={false} axisLine={false} tick={{ fill: '#5C94FC', fontSize: 9, fontFamily: "'Russo One'" }} />
                  <YAxis stroke="#5C94FC" tickLine={false} axisLine={false} tick={{ fill: '#5C94FC', fontSize: 9, fontFamily: "'Russo One'" }} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={{ background: '#0F0F23', border: '3px solid #000', borderRadius: '0px', color: '#FBD000', fontFamily: "'Russo One'", fontSize: '9px' }} formatter={v => [formatCurrency(v), 'Revenue']} />
                  <Line type="monotone" dataKey="revenue" stroke="#E52521" strokeWidth={3} dot={{ r: 5, fill: '#E52521', strokeWidth: 2, stroke: '#000' }} activeDot={{ r: 7, fill: '#FBD000' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Order Status Bar Chart */}
        <div className="border-3 border-black shadow-[4px_4px_0px_rgba(0,0,0,0.5)] p-6" style={{ background: '#1A1A2E' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_rgba(0,0,0,0.3)]" style={{ background: '#FBD000' }}>
              <ShoppingCart className="w-5 h-5" style={{ color: '#000' }} />
            </div>
            <div>
              <p className="text-[16px] uppercase tracking-wider text-[#5C94FC]" style={P}>Order Distribution</p>
              <h3 className="text-white font-bold text-sm" style={P}>Status Mix</h3>
            </div>
          </div>
          {loading ? <Skeleton className="h-[280px] w-full" /> : (
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={orderStatusData} barSize={32}>
                  <CartesianGrid stroke="rgba(91,148,252,0.1)" vertical={false} />
                  <XAxis dataKey="status" stroke="#5C94FC" tickLine={false} axisLine={false} tick={{ fill: '#5C94FC', fontSize: 8, fontFamily: "'Russo One'" }} />
                  <YAxis stroke="#5C94FC" tickLine={false} axisLine={false} tick={{ fill: '#5C94FC', fontSize: 9, fontFamily: "'Russo One'" }} />
                  <Tooltip contentStyle={{ background: '#0F0F23', border: '3px solid #000', borderRadius: '0px', color: '#FBD000', fontFamily: "'Russo One'", fontSize: '9px' }} />
                  <Bar dataKey="total" radius={[0, 0, 0, 0]} fill="url(#barGrad)" stroke="#000" strokeWidth={1} />
                  <defs>
                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FBD000" />
                      <stop offset="100%" stopColor="#F5A623" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Top Products Table */}
      <div className="border-3 border-black shadow-[4px_4px_0px_rgba(0,0,0,0.5)] p-6" style={{ background: '#1A1A2E' }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_rgba(0,0,0,0.3)]" style={{ background: '#7B2FBE' }}>
            <Package className="w-5 h-5" style={{ color: '#fff' }} />
          </div>
          <div>
            <p className="text-[16px] uppercase tracking-wider text-[#5C94FC]" style={P}>Best Sellers</p>
            <h3 className="text-white font-bold text-sm" style={P}>Top 5 Products</h3>
          </div>
        </div>
        {loading ? (
          <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
        ) : (
          <div className="overflow-hidden border-2 border-black">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: '#0F0F23' }}>
                  <th className="px-4 py-3 text-left text-[17px] font-bold text-white uppercase tracking-wider" style={P}>#</th>
                  <th className="px-4 py-3 text-left text-[17px] font-bold text-white uppercase tracking-wider" style={P}>Product</th>
                  <th className="px-4 py-3 text-right text-[17px] font-bold text-white uppercase tracking-wider" style={P}>Units Sold</th>
                  <th className="px-4 py-3 text-right text-[17px] font-bold text-white uppercase tracking-wider" style={P}>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {stats.topProducts.map((p, i) => (
                  <tr key={p.productId} className="border-t-2 border-black hover:bg-[#5C94FC]/5 transition-colors">
                    <td className="px-4 py-4">
                      <span className="w-6 h-6 border-2 border-black flex items-center justify-center text-[17px] font-bold" style={{ background: i === 0 ? '#FBD000' : i === 1 ? '#C0C0C0' : i === 2 ? '#CD7F32' : '#1A1A2E', color: i < 3 ? '#000' : '#5C94FC' }}>
                        {i + 1}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-bold text-[#5C94FC] text-[15px]" style={P}>{p.productName}</td>
                    <td className="px-4 py-4 text-right">
                      <span className="border-2 border-black px-2 py-1 text-[17px] font-bold" style={{ background: '#7B2FBE', color: '#FFF' }}>{p.totalUnitsSold}</span>
                    </td>
                    <td className="px-4 py-4 text-right font-bold text-[16px]" style={{ color: '#E52521', ...P }}>{formatCurrency(p.totalRevenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
