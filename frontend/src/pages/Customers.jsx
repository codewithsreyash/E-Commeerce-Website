import { ChevronDown, ChevronUp, Plus, Pencil, Trash2, X, Search, Mail, Phone, MapPin, User, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Skeleton } from '../components/ui/skeleton';
import { formatDate, getErrorMessage } from '../lib/utils';
import { getCustomers } from '../services/api';
import api from '../services/api';

const P = { fontFamily: "'Press Start 2P', monospace" };

const defaultForm = { firstName: '', lastName: '', email: '', password: 'Customer@123', phone: '', address: '' };

const AVATAR_COLORS = ['#E52521', '#049CD8', '#43B047', '#FBD000', '#FF6B9D', '#7B2FBE'];

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await getCustomers({ page: 0, size: 100, sort: 'createdAt,desc', search });
        setCustomers(res.data.content);
      } catch (err) {
        toast.error(getErrorMessage(err, 'Failed to load customers'));
      } finally {
        setLoading(false);
      }
    };
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [search, reloadKey]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) { await api.put(`/admin/customers/${editingId}`, form); toast.success('Customer updated'); }
      else { await api.post('/admin/customers', form); toast.success('Customer created'); }
      setForm(defaultForm); setEditingId(null); setShowForm(false);
      setReloadKey(k => k + 1);
    } catch (err) { toast.error(getErrorMessage(err, 'Failed to save customer')); }
  };

  const handleEdit = (c) => {
    setEditingId(c.customerId);
    setForm({ firstName: c.firstName, lastName: c.lastName, email: c.email, password: 'Customer@123', phone: c.phone ?? '', address: c.address ?? '' });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete customer ${name}?`)) return;
    try { await api.delete(`/admin/customers/${id}`); toast.success('Customer deleted'); setReloadKey(k => k + 1); }
    catch (err) { toast.error(getErrorMessage(err, 'Failed to delete customer')); }
  };

  const f = (key) => (e) => setForm(c => ({ ...c, [key]: e.target.value }));

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-[8px] font-bold uppercase tracking-widest text-[#5C94FC] mb-1" style={P}>Customers</p>
          <h1 className="text-xl font-bold text-[#FBD000]" style={P}>Customer Management</h1>
          <p className="text-[9px] text-[#5C94FC] mt-1" style={P}>View, add, edit and delete customers.</p>
        </div>
        {!showForm && (
          <button
            onClick={() => { setShowForm(true); setEditingId(null); setForm(defaultForm); }}
            className="retro-btn flex items-center gap-2 px-5 py-2.5 bg-[#7B2FBE] hover:bg-[#9340e0] text-white font-bold text-[9px]"
            style={P}
          >
            <Plus className="w-4 h-4" /> Add Customer
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: 'Total Customers', value: customers.length, color: '#7B2FBE' },
          { label: 'With Phone', value: customers.filter(c => c.phone).length, color: '#049CD8' },
          { label: 'With Address', value: customers.filter(c => c.address).length, color: '#43B047' },
        ].map(({ label, value, color }) => (
          <div key={label} className="border-3 border-black shadow-[3px_3px_0px_rgba(0,0,0,0.5)] p-4" style={{ background: `${color}20` }}>
            <p className="text-[7px] font-bold uppercase tracking-wider mb-1" style={{ color, ...P }}>{label}</p>
            <p className="text-2xl font-bold" style={{ color, ...P }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="border-3 border-black shadow-[4px_4px_0px_rgba(0,0,0,0.5)] p-6" style={{ background: 'linear-gradient(180deg, #7B2FBE15, #1A1A2E)' }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_rgba(0,0,0,0.3)]" style={{ background: '#7B2FBE30' }}>
                <User className="w-5 h-5" style={{ color: '#7B2FBE' }} />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm" style={P}>{editingId ? 'Edit Customer' : 'Add New Customer'}</h3>
                <p className="text-[#5C94FC] text-[9px]" style={P}>Fill in the customer details</p>
              </div>
            </div>
            <button onClick={() => { setShowForm(false); setEditingId(null); setForm(defaultForm); }} className="w-8 h-8 border-2 border-black bg-[#E52521] text-white hover:bg-[#ff3333] flex items-center justify-center transition-all shadow-[2px_2px_0px_rgba(0,0,0,0.3)]">
              <X className="w-4 h-4" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[8px] text-[#5C94FC] mb-1.5 font-bold uppercase tracking-wider" style={P}>First Name *</label>
              <Input required placeholder="John" value={form.firstName} onChange={f('firstName')} />
            </div>
            <div>
              <label className="block text-[8px] text-[#5C94FC] mb-1.5 font-bold uppercase tracking-wider" style={P}>Last Name *</label>
              <Input required placeholder="Doe" value={form.lastName} onChange={f('lastName')} />
            </div>
            <div>
              <label className="block text-[8px] text-[#5C94FC] mb-1.5 font-bold uppercase tracking-wider" style={P}>Email *</label>
              <Input required type="email" placeholder="john@example.com" value={form.email} onChange={f('email')} />
            </div>
            <div>
              <label className="block text-[8px] text-[#5C94FC] mb-1.5 font-bold uppercase tracking-wider" style={P}>Password {editingId ? '(keep)' : '*'}</label>
              <Input required={!editingId} type="password" placeholder="Min 8 chars" value={form.password} onChange={f('password')} />
            </div>
            <div>
              <label className="block text-[8px] text-[#5C94FC] mb-1.5 font-bold uppercase tracking-wider" style={P}>Phone</label>
              <Input placeholder="+1 555 0100" value={form.phone} onChange={f('phone')} />
            </div>
            <div>
              <label className="block text-[8px] text-[#5C94FC] mb-1.5 font-bold uppercase tracking-wider" style={P}>Address</label>
              <Input placeholder="123 Main St" value={form.address} onChange={f('address')} />
            </div>
            <div className="md:col-span-2 flex gap-3 pt-2">
              <Button type="submit" variant="blue">{editingId ? 'Update Customer' : 'Create Customer'}</Button>
              <Button type="button" variant="secondary" onClick={() => { setShowForm(false); setEditingId(null); setForm(defaultForm); }}>Cancel</Button>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5C94FC]" />
        <Input className="pl-10" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Customer List */}
      <div className="space-y-2">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="border-2 border-black bg-[#1A1A2E] p-5 shadow-[2px_2px_0px_rgba(0,0,0,0.3)]">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 border-2 border-black bg-[#0F0F23]" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-[#5C94FC]/20 w-1/4" />
                  <div className="h-3 bg-[#5C94FC]/10 w-1/3" />
                </div>
              </div>
            </div>
          ))
        ) : customers.length === 0 ? (
          <div className="border-3 border-black bg-[#1A1A2E] p-16 text-center shadow-[4px_4px_0px_rgba(0,0,0,0.5)]">
            <Users className="w-12 h-12 text-[#4a4a6a] mx-auto mb-4" />
            <p className="text-[#5C94FC] font-bold text-[10px]" style={P}>No customers found</p>
          </div>
        ) : customers.map((c, idx) => {
          const isOpen = expandedId === c.customerId;
          const initials = `${c.firstName?.[0] ?? ''}${c.lastName?.[0] ?? ''}`.toUpperCase();
          const avatarColor = AVATAR_COLORS[idx % AVATAR_COLORS.length];

          return (
            <div key={c.customerId} className="border-3 border-black shadow-[3px_3px_0px_rgba(0,0,0,0.5)] transition-all" style={{ background: isOpen ? '#16213E' : '#1A1A2E', borderColor: isOpen ? avatarColor : '#000' }}>
              <div className="flex items-center gap-4 px-5 py-4">
                {/* Avatar */}
                <div className="w-11 h-11 border-2 border-black flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-[2px_2px_0px_rgba(0,0,0,0.3)]" style={{ background: avatarColor }}>
                  {initials}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#FBD000] text-[10px]" style={P}>{c.firstName} {c.lastName}</p>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="flex items-center gap-1 text-[8px] text-[#5C94FC]" style={P}>
                      <Mail className="w-3 h-3" />{c.email}
                    </span>
                    {c.phone && (
                      <span className="flex items-center gap-1 text-[8px] text-[#4a4a6a]" style={P}>
                        <Phone className="w-3 h-3" />{c.phone}
                      </span>
                    )}
                    <span className="text-[7px] text-[#4a4a6a]" style={P}>Joined {formatDate(c.createdAt)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => setExpandedId(isOpen ? null : c.customerId)} className="retro-btn w-8 h-8 flex items-center justify-center bg-[#0F0F23] text-[#5C94FC]">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  <button onClick={() => handleEdit(c)} className="retro-btn w-8 h-8 flex items-center justify-center bg-[#049CD8] text-white">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(c.customerId, `${c.firstName} ${c.lastName}`)} className="retro-btn w-8 h-8 flex items-center justify-center bg-[#E52521] text-white">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Expanded */}
              {isOpen && (
                <div className="border-t-2 border-black px-5 py-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { icon: Mail, color: '#049CD8', label: 'Email', val: c.email },
                    { icon: Phone, color: '#43B047', label: 'Phone', val: c.phone || '—' },
                    { icon: MapPin, color: '#FBD000', label: 'Address', val: c.address || '—' },
                  ].map(({ icon: Icon, color, label, val }) => (
                    <div key={label} className="border-2 border-black p-4 shadow-[2px_2px_0px_rgba(0,0,0,0.3)]" style={{ background: `${color}10` }}>
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="w-3.5 h-3.5" style={{ color }} />
                        <p className="text-[7px] font-bold uppercase text-[#5C94FC]" style={P}>{label}</p>
                      </div>
                      <p className="text-[9px] font-bold text-[#FBD000]" style={P}>{val}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
