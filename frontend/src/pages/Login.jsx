import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getErrorMessage, getFieldError } from '../lib/utils';
import { login } from '../services/api';
import api from '../services/api';

const P = { fontFamily: "'Russo One', sans-serif" };

function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState(searchParams.get('tab') === 'register' ? 'register' : 'login');
  const [form, setForm] = useState({ username: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      const data = await login({ username: form.username, password: form.password });
      toast.success('Signed in successfully');
      if (data.role === 'ADMIN' || data.role === 'MANAGER') {
        navigate('/admin');
      } else {
        navigate('/shop');
      }
    } catch (err) {
      setError(getFieldError(err) || getErrorMessage(err, 'Invalid username or password'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setIsSubmitting(true);
    setError('');
    try {
      await api.post('/auth/register', { username: form.username, password: form.password, role: 'CUSTOMER' });
      toast.success('Account created! Please sign in.');
      setTab('login');
      setForm((f) => ({ ...f, password: '', confirmPassword: '' }));
    } catch (err) {
      setError(getFieldError(err) || getErrorMessage(err, 'Registration failed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputCls = "w-full border-2 border-black bg-[#1A1A2E] p-3 text-[16px] text-white outline-none focus:border-[#049CD8] focus:shadow-[0_0_8px_rgba(4,156,216,0.4),2px_2px_0px_rgba(0,0,0,0.5)] shadow-[2px_2px_0px_rgba(0,0,0,0.5)] placeholder:text-[#4a4a6a]";

  return (
    <div className="dark-page flex flex-col items-center justify-center px-4 py-10">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3 mb-8">
        <div className="bg-[#E52521] border-2 border-black p-1.5 shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">
          <ShoppingCart size={22} className="text-white" />
        </div>
        <span className="text-xl font-bold text-white tracking-tight" style={P}>
          Shop<span className="text-[#FBD000]">Stream</span>
        </span>
      </Link>

      <div className="w-full max-w-md border-3 border-black shadow-[6px_6px_0px_rgba(0,0,0,0.5)] p-8" style={{ background: 'linear-gradient(180deg, #1A1A2E, #16213E)' }}>
        {/* Tabs */}
        <div className="flex mb-8 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,0.3)]">
          {[['login', 'Sign In'], ['register', 'Create Account']].map(([key, label]) => (
            <button
              key={key}
              onClick={() => { setTab(key); setError(''); }}
              className={`flex-1 py-2.5 text-[15px] font-bold transition-all ${P} ${
                tab === key
                  ? 'bg-[#E52521] text-white'
                  : 'bg-[#0F0F23] text-[#4a4a6a] hover:text-[#5C94FC]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[15px] font-bold text-[#5C94FC] mb-1.5 uppercase" style={P}>Username / Email</label>
              <input
                required type="text" value={form.username}
                onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                placeholder="admin@store.com"
                className={inputCls}
                style={P}
              />
            </div>
            <div>
              <label className="block text-[15px] font-bold text-[#5C94FC] mb-1.5 uppercase" style={P}>Password</label>
              <input
                required type="password" value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                placeholder="••••••••"
                className={inputCls}
                style={P}
              />
            </div>
            {error && <p className="text-[17px] text-[#FF6B9D] bg-[#E52521]/20 border-2 border-[#E52521] p-3" style={P}>{error}</p>}
            <button
              type="submit" disabled={isSubmitting}
              className="retro-btn w-full bg-[#FBD000] hover:bg-[#ffe033] text-black font-bold py-3 text-[16px] mt-2"
              style={P}
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
            <div className="bg-[#0F0F23] border-2 border-black p-4 mt-2 space-y-2 text-[17px] text-[#5C94FC]" style={P}>
              <p className="font-bold text-white mb-2 text-[15px]">Demo Credentials</p>
              <p className="text-[#E52521]">Admin: <span className="text-white">admin@store.com</span> / <span className="text-white">password</span></p>
              <p className="text-[#43B047]">Customer: <span className="text-white">customer@store.com</span> / <span className="text-white">password</span></p>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-[15px] font-bold text-[#5C94FC] mb-1.5 uppercase" style={P}>Email / Username</label>
              <input
                required type="text" value={form.username}
                onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                placeholder="your@email.com"
                className={inputCls}
                style={P}
              />
            </div>
            <div>
              <label className="block text-[15px] font-bold text-[#5C94FC] mb-1.5 uppercase" style={P}>Password</label>
              <input
                required type="password" value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                placeholder="At least 8 characters"
                className={inputCls}
                style={P}
              />
            </div>
            <div>
              <label className="block text-[15px] font-bold text-[#5C94FC] mb-1.5 uppercase" style={P}>Confirm Password</label>
              <input
                required type="password" value={form.confirmPassword}
                onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                placeholder="Re-enter password"
                className={inputCls}
                style={P}
              />
            </div>
            {error && <p className="text-[17px] text-[#FF6B9D] bg-[#E52521]/20 border-2 border-[#E52521] p-3" style={P}>{error}</p>}
            <button
              type="submit" disabled={isSubmitting}
              className="retro-btn w-full bg-[#43B047] hover:bg-[#52c456] text-white font-bold py-3 text-[16px] mt-2"
              style={P}
            >
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        )}
      </div>

      <p className="text-[16px] text-[#4a4a6a] mt-6 text-center" style={P}>
        By continuing, you agree to ShopStream&apos;s Conditions of Use.
      </p>
    </div>
  );
}

export default Login;
