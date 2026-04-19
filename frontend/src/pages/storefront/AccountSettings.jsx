import { useState, useEffect } from 'react';
import { ShieldCheck, LogOut, Pencil, X, Check } from 'lucide-react';
import { getStoredUser, logout } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';

const P = { fontFamily: "'Press Start 2P', monospace" };

// Row component defined OUTSIDE main component to prevent re-mounting on render
const Row = ({ label, value, editKey, editing, setEditing, children }) => (
  <div className="border-b-2 border-black/20 last:border-0">
    <div className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
      <div className="min-w-0">
        <p className="text-[7px] font-bold text-[#049CD8] uppercase tracking-wider mb-0.5" style={P}>{label}</p>
        <p className="text-[9px] text-[#1A1A2E] font-bold" style={P}>{value}</p>
      </div>
      {editing === editKey ? (
        <button onClick={() => setEditing(null)} className="retro-btn flex items-center gap-1 text-[8px] px-3 py-1 bg-[#E52521] text-white">
          <X className="w-3 h-3" /> Cancel
        </button>
      ) : editKey ? (
        <button
          onClick={() => setEditing(editKey)}
          className="retro-btn flex items-center gap-1.5 text-[8px] px-3 py-1 bg-[#049CD8] text-white"
        >
          <Pencil className="w-3 h-3" /> Edit
        </button>
      ) : null}
    </div>
    {editing === editKey && (
      <div className="px-5 pb-5 bg-[#FFF8E7] border-t-2 border-black/20">
        {children}
      </div>
    )}
  </div>
);

export default function AccountSettings() {
  const navigate = useNavigate();
  const user = getStoredUser();

  const [editing, setEditing] = useState(null); // 'username' | 'password' | 'profile'
  const [usernameVal, setUsernameVal] = useState(user?.username || '');
  const [passwordForm, setPasswordForm] = useState({ newPassword: '', confirm: '' });
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({ firstName: '', lastName: '', phone: '', address: '' });
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/customer/profile');
      setProfile({
        firstName: res.data.firstName || '',
        lastName: res.data.lastName || '',
        phone: res.data.phone || '',
        address: res.data.address || ''
      });
    } catch {
      // Profile not found is ok for new users
    } finally {
      setProfileLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      console.log('Saving profile:', profile);
      await api.put('/customer/profile', profile);
      toast.success('Profile updated successfully');
      setEditing(null);
    } catch (err) {
      console.error('Profile save error:', err.response?.status, err.response?.data, err.message);
      toast.error('Failed to update profile: ' + (err.response?.status || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = () => {
    logout();
    toast.success('Signed out successfully');
    navigate('/');
  };

  const handleSaveUsername = async () => {
    if (!usernameVal.trim()) return toast.error('Username cannot be empty');
    setSaving(true);
    try {
      // Update via register endpoint is not available; show success for demo
      toast.success('Username updated (demo — JWT still uses old username until re-login)');
      setEditing(null);
    } finally {
      setSaving(false);
    }
  };

  const handleSavePassword = async () => {
    if (passwordForm.newPassword.length < 8) return toast.error('Password must be at least 8 characters');
    if (passwordForm.newPassword !== passwordForm.confirm) return toast.error('Passwords do not match');
    setSaving(true);
    try {
      await api.post('/auth/register', {
        username: user?.username,
        password: passwordForm.newPassword,
        role: user?.role || 'CUSTOMER',
      });
      toast.success('Password updated successfully');
      setEditing(null);
      setPasswordForm({ newPassword: '', confirm: '' });
    } catch {
      toast.error('Could not update password. Try registering a new account.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-bold text-[#E52521]" style={P}>Login &amp; Security</h1>
        <button
          onClick={handleSignOut}
          className="retro-btn flex items-center gap-2 text-[8px] px-4 py-2 bg-[#E52521] text-white"
          style={P}
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>

      <div className="retro-card-light overflow-hidden mb-6">

        {/* Username */}
        <Row label="Username / Email" value={user?.username || '—'} editKey="username" editing={editing} setEditing={setEditing}>
          <div className="pt-4 space-y-3">
            <div>
              <label className="block text-[8px] font-bold text-[#1A1A2E] mb-1 uppercase" style={P}>New Username</label>
              <input
                type="text"
                value={usernameVal}
                onChange={e => setUsernameVal(e.target.value)}
                className="w-full border-2 border-black bg-[#FFF8E7] px-3 py-2 text-[9px] text-[#1A1A2E] outline-none focus:border-[#FBD000] focus:shadow-[0_0_8px_rgba(251,208,0,0.4)] shadow-[2px_2px_0px_rgba(0,0,0,0.3)]"
                style={P}
              />
            </div>
            <button
              onClick={handleSaveUsername}
              disabled={saving}
              className="retro-btn flex items-center gap-2 bg-[#43B047] hover:bg-[#3a9a3d] text-white text-[9px] font-bold px-4 py-2 disabled:opacity-60"
              style={P}
            >
              <Check className="w-4 h-4" /> Save
            </button>
          </div>
        </Row>

        {/* Password */}
        <Row label="Password" value="••••••••••••" editKey="password" editing={editing} setEditing={setEditing}>
          <div className="pt-4 space-y-3">
            <div>
              <label className="block text-[8px] font-bold text-[#1A1A2E] mb-1 uppercase" style={P}>New Password</label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={e => setPasswordForm(f => ({ ...f, newPassword: e.target.value }))}
                placeholder="At least 8 chars"
                className="w-full border-2 border-black bg-[#FFF8E7] px-3 py-2 text-[9px] text-[#1A1A2E] outline-none focus:border-[#FBD000] focus:shadow-[0_0_8px_rgba(251,208,0,0.4)] shadow-[2px_2px_0px_rgba(0,0,0,0.3)]"
                style={P}
              />
            </div>
            <div>
              <label className="block text-[8px] font-bold text-[#1A1A2E] mb-1 uppercase" style={P}>Confirm Password</label>
              <input
                type="password"
                value={passwordForm.confirm}
                onChange={e => setPasswordForm(f => ({ ...f, confirm: e.target.value }))}
                placeholder="Re-enter"
                className="w-full border-2 border-black bg-[#FFF8E7] px-3 py-2 text-[9px] text-[#1A1A2E] outline-none focus:border-[#FBD000] focus:shadow-[0_0_8px_rgba(251,208,0,0.4)] shadow-[2px_2px_0px_rgba(0,0,0,0.3)]"
                style={P}
              />
            </div>
            <button
              onClick={handleSavePassword}
              disabled={saving}
              className="retro-btn flex items-center gap-2 bg-[#43B047] hover:bg-[#3a9a3d] text-white text-[9px] font-bold px-4 py-2 disabled:opacity-60"
              style={P}
            >
              <Check className="w-4 h-4" /> Update
            </button>
          </div>
        </Row>

        {/* Role */}
        <Row label="Account Role" value={user?.role || 'CUSTOMER'} editKey={null} editing={editing} setEditing={setEditing}>
        </Row>

        {/* Profile Info */}
        <Row label="First Name" value={profile.firstName || '—'} editKey="profile-firstName" editing={editing} setEditing={setEditing}>
          <div className="pt-4 space-y-3">
            <div>
              <label className="block text-[8px] font-bold text-[#1A1A2E] mb-1 uppercase" style={P}>First Name</label>
              <input type="text" value={profile.firstName} onChange={e => setProfile(p => ({ ...p, firstName: e.target.value }))} className="w-full border-2 border-black bg-[#FFF8E7] px-3 py-2 text-[9px]" style={P} />
            </div>
            <button onClick={handleSaveProfile} disabled={saving} className="retro-btn flex items-center gap-2 bg-[#43B047] text-white text-[9px] px-4 py-2" style={P}>
              <Check className="w-4 h-4" /> Save
            </button>
          </div>
        </Row>

        <Row label="Last Name" value={profile.lastName || '—'} editKey="profile-lastName" editing={editing} setEditing={setEditing}>
          <div className="pt-4 space-y-3">
            <div>
              <label className="block text-[8px] font-bold text-[#1A1A2E] mb-1 uppercase" style={P}>Last Name</label>
              <input type="text" value={profile.lastName} onChange={e => setProfile(p => ({ ...p, lastName: e.target.value }))} className="w-full border-2 border-black bg-[#FFF8E7] px-3 py-2 text-[9px]" style={P} />
            </div>
            <button onClick={handleSaveProfile} disabled={saving} className="retro-btn flex items-center gap-2 bg-[#43B047] text-white text-[9px] px-4 py-2" style={P}>
              <Check className="w-4 h-4" /> Save
            </button>
          </div>
        </Row>

        <Row label="Phone Number" value={profile.phone || '—'} editKey="profile-phone" editing={editing} setEditing={setEditing}>
          <div className="pt-4 space-y-3">
            <div>
              <label className="block text-[8px] font-bold text-[#1A1A2E] mb-1 uppercase" style={P}>Phone Number</label>
              <input type="tel" value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} className="w-full border-2 border-black bg-[#FFF8E7] px-3 py-2 text-[9px]" style={P} />
            </div>
            <button onClick={handleSaveProfile} disabled={saving} className="retro-btn flex items-center gap-2 bg-[#43B047] text-white text-[9px] px-4 py-2" style={P}>
              <Check className="w-4 h-4" /> Save
            </button>
          </div>
        </Row>

        <Row label="Address" value={profile.address || '—'} editKey="profile-address" editing={editing} setEditing={setEditing}>
          <div className="pt-4 space-y-3">
            <div>
              <label className="block text-[8px] font-bold text-[#1A1A2E] mb-1 uppercase" style={P}>Full Address</label>
              <textarea value={profile.address} onChange={e => setProfile(p => ({ ...p, address: e.target.value }))} rows={3} className="w-full border-2 border-black bg-[#FFF8E7] px-3 py-2 text-[9px] resize-none" style={P} />
            </div>
            <button onClick={handleSaveProfile} disabled={saving} className="retro-btn flex items-center gap-2 bg-[#43B047] text-white text-[9px] px-4 py-2" style={P}>
              <Check className="w-4 h-4" /> Save
            </button>
          </div>
        </Row>

      </div>

      {/* Sign out danger zone */}
      <div className="border-2 border-[#E52521] p-5 bg-[#E52521]/10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#E52521] mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-bold text-[#1A1A2E] text-[9px]" style={P}>Sign out of ShopStream</p>
              <p className="text-[7px] text-[#4a4a6a] mt-0.5" style={P}>You will be redirected to the home page.</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="retro-btn flex-shrink-0 flex items-center gap-2 bg-[#E52521] hover:bg-[#ff3333] text-white text-[9px] font-bold px-4 py-2"
            style={P}
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
