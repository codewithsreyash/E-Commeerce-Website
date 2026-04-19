import { Pencil, Plus, Search, Trash2, X, ImageIcon, Tag, Layers } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Select } from '../components/ui/select';
import { Skeleton } from '../components/ui/skeleton';
import { formatCurrency, getErrorMessage } from '../lib/utils';
import { createProduct, deleteProduct, getProducts, updateProduct } from '../services/api';

const P = { fontFamily: "'Press Start 2P', monospace" };

const defaultForm = { sellerId: 1, name: '', description: '', price: '', stock: '', category: '', imageUrl: '' };

const CATEGORY_COLORS = {
  'Electronics':    { color: '#049CD8' },
  'Clothing':       { color: '#FF6B9D' },
  'Books':          { color: '#FBD000' },
  'Home & Kitchen': { color: '#43B047' },
  'Toys':           { color: '#7B2FBE' },
};
const getCatColor = (cat) => CATEGORY_COLORS[cat]?.color || '#5C94FC';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', category: '' });
  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const categories = useMemo(() => Array.from(new Set(products.map(p => p.category).filter(Boolean))), [products]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await getProducts({ page: 0, size: 100, sort: 'createdAt,desc', category: filters.category || undefined });
        setProducts(res.data.content);
      } catch (err) {
        toast.error(getErrorMessage(err, 'Failed to load products'));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [filters.category, reloadKey]);

  const visible = products.filter(p => p.name.toLowerCase().includes(filters.search.toLowerCase()));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, price: Number(form.price), stock: Number(form.stock), sellerId: Number(form.sellerId) };
      if (editingId) { await updateProduct(editingId, payload); toast.success('Product updated'); }
      else { await createProduct(payload); toast.success('Product created'); }
      setForm(defaultForm); setEditingId(null); setShowForm(false);
      setReloadKey(k => k + 1);
    } catch (err) { toast.error(getErrorMessage(err, 'Failed to save product')); }
  };

  const handleEdit = (p) => {
    setEditingId(p.productId);
    setForm({ sellerId: p.sellerId, name: p.name, description: p.description ?? '', price: p.price, stock: p.stock, category: p.category ?? '', imageUrl: p.imageUrl ?? '' });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try { await deleteProduct(id); toast.success('Product deleted'); setReloadKey(k => k + 1); }
    catch (err) { toast.error(getErrorMessage(err, 'Failed to delete product')); }
  };

  const f = (key) => (e) => setForm(c => ({ ...c, [key]: e.target.value }));

  const totalStock = products.reduce((s, p) => s + (p.stock || 0), 0);
  const outOfStock = products.filter(p => p.stock === 0).length;
  const lowStock = products.filter(p => p.stock > 0 && p.stock < 10).length;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-[8px] font-bold uppercase tracking-widest text-[#5C94FC] mb-1" style={P}>Catalog</p>
          <h1 className="text-xl font-bold text-[#FBD000]" style={P}>Products</h1>
          <p className="text-[9px] text-[#5C94FC] mt-1" style={P}>Add, edit, delete products and manage stock levels.</p>
        </div>
        {!showForm && (
          <button
            onClick={() => { setShowForm(true); setEditingId(null); setForm(defaultForm); }}
            className="retro-btn flex items-center gap-2 px-5 py-2.5 bg-[#049CD8] hover:bg-[#06b0f0] text-white font-bold text-[9px]"
            style={P}
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        )}
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Products', value: products.length, color: '#049CD8' },
          { label: 'Total Stock', value: totalStock, color: '#43B047' },
          { label: 'Low Stock', value: lowStock, color: '#FBD000' },
          { label: 'Out of Stock', value: outOfStock, color: '#E52521' },
        ].map(({ label, value, color }) => (
          <div key={label} className="border-3 border-black shadow-[3px_3px_0px_rgba(0,0,0,0.5)] p-4" style={{ background: `${color}20` }}>
            <p className="text-[7px] font-bold uppercase tracking-wider mb-1" style={{ color, ...P }}>{label}</p>
            <p className="text-2xl font-bold" style={{ color, ...P }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="border-3 border-black shadow-[4px_4px_0px_rgba(0,0,0,0.5)] p-6" style={{ background: 'linear-gradient(180deg, #049CD815, #1A1A2E)' }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_rgba(0,0,0,0.3)]" style={{ background: '#049CD830' }}>
                <Plus className="w-5 h-5" style={{ color: '#049CD8' }} />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm" style={P}>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
                <p className="text-[#5C94FC] text-[9px]" style={P}>Fill in the product details below</p>
              </div>
            </div>
            <button onClick={() => { setShowForm(false); setEditingId(null); setForm(defaultForm); }} className="w-8 h-8 border-2 border-black bg-[#E52521] text-white hover:bg-[#ff3333] flex items-center justify-center transition-all shadow-[2px_2px_0px_rgba(0,0,0,0.3)]">
              <X className="w-4 h-4" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-[8px] text-[#5C94FC] mb-1.5 font-bold uppercase tracking-wider" style={P}>Product Name *</label>
              <Input required placeholder="e.g. Aurora X1 Laptop" value={form.name} onChange={f('name')} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[8px] text-[#5C94FC] mb-1.5 font-bold uppercase tracking-wider" style={P}>Description</label>
              <Input placeholder="Short product description" value={form.description} onChange={f('description')} />
            </div>
            <div>
              <label className="block text-[8px] text-[#5C94FC] mb-1.5 font-bold uppercase tracking-wider" style={P}>Price ($) *</label>
              <Input required type="number" min="0.01" step="0.01" placeholder="0.00" value={form.price} onChange={f('price')} />
            </div>
            <div>
              <label className="block text-[8px] text-[#5C94FC] mb-1.5 font-bold uppercase tracking-wider" style={P}>Stock *</label>
              <Input required type="number" min="0" placeholder="0" value={form.stock} onChange={f('stock')} />
            </div>
            <div>
              <label className="block text-[8px] text-[#5C94FC] mb-1.5 font-bold uppercase tracking-wider" style={P}>Category *</label>
              <select
                required
                value={form.category}
                onChange={f('category')}
                className="w-full h-9 px-3 border-2 border-black bg-[#1A1A2E] text-[9px] text-[#FBD000] outline-none focus:border-[#FBD000] shadow-[2px_2px_0px_rgba(0,0,0,0.3)] cursor-pointer"
                style={{ ...P, backgroundColor: '#1A1A2E' }}
              >
                <option value="" style={{ backgroundColor: '#1A1A2E', color: '#FBD000' }}>Select a category...</option>
                <option value="Electronics" style={{ backgroundColor: '#1A1A2E', color: '#049CD8' }}>Electronics</option>
                <option value="Clothing" style={{ backgroundColor: '#1A1A2E', color: '#FF6B9D' }}>Clothing</option>
                <option value="Books" style={{ backgroundColor: '#1A1A2E', color: '#FBD000' }}>Books</option>
                <option value="Home & Kitchen" style={{ backgroundColor: '#1A1A2E', color: '#43B047' }}>Home & Kitchen</option>
                <option value="Toys" style={{ backgroundColor: '#1A1A2E', color: '#7B2FBE' }}>Toys</option>
              </select>
            </div>
            <div>
              <label className="block text-[8px] text-[#5C94FC] mb-1.5 font-bold uppercase tracking-wider" style={P}>Seller ID</label>
              <Input type="number" min="1" value={form.sellerId} onChange={f('sellerId')} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[8px] text-[#5C94FC] mb-1.5 font-bold uppercase tracking-wider" style={P}>Image URL</label>
              <Input placeholder="https://..." value={form.imageUrl} onChange={f('imageUrl')} />
              {form.imageUrl && (
                <img src={form.imageUrl} alt="preview" className="mt-2 h-20 w-20 object-cover border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,0.3)]" onError={e => e.target.style.display = 'none'} />
              )}
            </div>
            <div className="md:col-span-2 flex gap-3 pt-2">
              <Button type="submit" variant="blue">{editingId ? 'Update Product' : 'Create Product'}</Button>
              <Button type="button" variant="secondary" onClick={() => { setShowForm(false); setEditingId(null); setForm(defaultForm); }}>Cancel</Button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5C94FC]" />
          <Input className="pl-10" placeholder="Search products..." value={filters.search} onChange={e => setFilters(c => ({ ...c, search: e.target.value }))} />
        </div>
        <Select value={filters.category} onChange={e => setFilters(c => ({ ...c, category: e.target.value }))}>
          <option value="">All categories</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </Select>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-72 w-full" />)}
        </div>
      ) : visible.length === 0 ? (
        <div className="border-3 border-black bg-[#1A1A2E] p-16 text-center shadow-[4px_4px_0px_rgba(0,0,0,0.5)]">
          <Layers className="w-12 h-12 text-[#4a4a6a] mx-auto mb-4" />
          <p className="text-[#5C94FC] font-bold text-[10px]" style={P}>No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {visible.map(p => {
            const catColor = getCatColor(p.category);
            const stockStatus = p.stock === 0
              ? { label: 'OUT OF STOCK', bg: '#E52521', color: '#fff' }
              : p.stock < 10
              ? { label: `${p.stock} LEFT`, bg: '#FBD000', color: '#000' }
              : { label: `${p.stock} IN STOCK`, bg: '#43B047', color: '#fff' };

            return (
              <div key={p.productId} className="retro-card overflow-hidden group">
                {/* Image */}
                <div className="h-44 bg-[#0F0F23] flex items-center justify-center overflow-hidden relative">
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <ImageIcon className="w-12 h-12 text-[#4a4a6a]" />
                  )}
                  <div className="absolute top-2 right-2 pixel-badge" style={{ background: stockStatus.bg, color: stockStatus.color }}>
                    {stockStatus.label}
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="mb-2">
                    <span className="pixel-badge" style={{ background: `${catColor}30`, color: catColor, borderColor: catColor }}>
                      {p.category}
                    </span>
                  </div>
                  <h3 className="text-white font-bold text-[9px] mb-1 leading-relaxed" style={{ ...P, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.name}</h3>
                  {p.description && <p className="text-[#4a4a6a] text-[8px] mb-3 overflow-hidden text-ellipsis whitespace-nowrap" style={P}>{p.description}</p>}
                  <p className="text-[#FBD000] font-bold text-lg mb-4" style={P}>{formatCurrency(p.price)}</p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(p)}
                      className="retro-btn flex-1 flex items-center justify-center gap-1.5 text-[8px] font-bold py-2 bg-[#049CD8] hover:bg-[#06b0f0] text-white"
                      style={P}
                    >
                      <Pencil className="w-3 h-3" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.productId)}
                      className="retro-btn flex-1 flex items-center justify-center gap-1.5 text-[8px] font-bold py-2 bg-[#E52521] hover:bg-[#ff3333] text-white"
                      style={P}
                    >
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
