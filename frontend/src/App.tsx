import React, { useState, useEffect, useRef, useCallback } from 'react';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: (response: { credential: string }) => void }) => void;
          renderButton: (element: HTMLElement | null, config: object) => void;
        };
      };
    };
  }
}
import { 
  Shield, FlaskConical, Scroll, Sword, Lock, Sparkles, Copy, RefreshCw,
  Skull, Trash2, Key, LogOut, User, ArrowRight, Eye, Activity, Users,
  Beaker, ShieldAlert, Zap, Globe, Loader2, Wand2, Star, Ghost, Crown, Radar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "726201702658-a01oskaisbkkpnpltij5f573johk2836.apps.googleusercontent.com";

const AVATARS = [
  { id: 'knight', icon: Shield, label: 'The Knight', color: '#00f2ff' },
  { id: 'mage', icon: Wand2, label: 'The Mage', color: '#bd00ff' },
  { id: 'ranger', icon: Star, label: 'The Ranger', color: '#00ff41' },
  { id: 'ghost', icon: Ghost, label: 'The Rogue', color: '#ff003c' },
  { id: 'alchemist', icon: FlaskConical, label: 'The Alchemist', color: '#ffb800' }
];

const getPasswordStrength = (password: string) => {
  if (!password) return { score: 0, label: "Empty Vessel", color: "#666" };
  let score = 0;
  if (password.length > 8) score++;
  if (password.length > 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  
  const levels = [
    { label: "Weak Potion", color: "#ff003c" }, // Red
    { label: "Fair Brew", color: "#ffb800" },   // Orange/Yellow
    { label: "Stable Mix", color: "#00ff41" },  // Green
    { label: "Strong Essence", color: "#bd00ff" }, // Purple
    { label: "Legendary Potency", color: "#00f2ff" } // Cyan
  ];
  
  const finalScore = Math.min(score, 4);
  return { score: finalScore, ...levels[finalScore] };
};

const PotencyMeter = ({ password }: { password: string }) => {
  const { score, label, color } = getPasswordStrength(password);
  return (
    <div className="mt-4 space-y-2">
      <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest">
        <span style={{ color }}>{label}</span>
        <span className="text-gray-500">{score * 25}% Potency</span>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden flex gap-0.5">
        {[0, 1, 2, 3].map((step) => (
          <div 
            key={step} 
            className="flex-1 transition-all duration-500" 
            style={{ backgroundColor: step <= score - 1 ? color : '#ffffff05' }}
          />
        ))}
      </div>
    </div>
  );
};

function App() {
  const [token, setToken] = useState(localStorage.getItem('vq_token') || '');
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const [googleLoaded, setGoogleLoaded] = useState(false);
  
  const [user, setUser] = useState(null);
  const [isInitiated, setIsInitiated] = useState(true); // Default true until check
  
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Profile Setup State
  const [setupName, setSetupName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  // App State
  const [brewedPassword, setBrewedPassword] = useState('');
  const [length, setLength] = useState(16);
  const [complexity, setComplexity] = useState(2);
  const [isBrewing, setIsBrewing] = useState(false);
  const [activeTab, setActiveTab] = useState('lab');
  const [vaultItems, setVaultItems] = useState([]);
  const [serviceName, setServiceName] = useState('');
  const [manualServiceName, setManualServiceName] = useState('');
  const [manualPassword, setManualPassword] = useState('');
  const [saving, setSaving] = useState(false);

  const [adminStats, setAdminStats] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [loadingStats, setLoadingStats] = useState(false);
  const [breachStatus, setBreachStatus] = useState({});
  const [scanResult, setScanResult] = useState<{ total: number; compromised: number; safe: number } | null>(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem('vq_token', token);
      fetchMe();
    } else {
      localStorage.removeItem('vq_token');
      setUser(null);
    }
  }, [token]);

  useEffect(() => {
    if (token && activeTab === 'vault') fetchVault();
    if (token && activeTab === 'admin') {
      fetchAdminStats();
      fetchAllUsers();
    }
  }, [activeTab, token]);

  const fetchMe = async () => {
    try {
      const res = await axios.get(`${API_BASE}/user/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
      // If no display_name or avatar, they need initiation
      setIsInitiated(!!(res.data.display_name && res.data.avatar_url));
      if (res.data.display_name) setSetupName(res.data.display_name);
    } catch { setToken(''); }
  };

  const handleProfileSetup = async () => {
    if (!setupName || !selectedAvatar) return;
    try {
      await axios.post(`${API_BASE}/profile/update`, {
        display_name: setupName,
        avatar_url: selectedAvatar
      }, { headers: { Authorization: `Bearer ${token}` } });
      fetchMe();
    } catch { alert("Failed to forge identity."); }
  };

  const handleGoogleResponse = useCallback(async (response: { credential: string }) => {
    try {
      const res = await axios.post(`${API_BASE}/auth/google`, { credential: response.credential });
      setToken(res.data.access_token);
    } catch { setAuthError("Google Sign-In failed. Please try again."); }
  }, []);

  useEffect(() => {
    if (token) return;

    const initGoogle = () => {
      if (!googleButtonRef.current || !window.google) return;
      window.google.accounts.id.initialize({ client_id: GOOGLE_CLIENT_ID, callback: handleGoogleResponse });
      window.google.accounts.id.renderButton(googleButtonRef.current, { theme: "filled_blue", size: "large", width: "100%" });
      setGoogleLoaded(true);
    };

    if (window.google) {
      initGoogle();
    } else {
      const script = document.querySelector<HTMLScriptElement>('script[src*="accounts.google.com"]');
      if (script) {
        script.addEventListener('load', initGoogle, { once: true });
        return () => script.removeEventListener('load', initGoogle);
      }
    }
  }, [token, handleGoogleResponse]);

  const fetchVault = async () => {
    try {
      const res = await axios.get(`${API_BASE}/vault/list`, { headers: { Authorization: `Bearer ${token}` } });
      setVaultItems(res.data);
      const stored: Record<number, { loading: boolean; count: number }> = {};
      for (const item of res.data) {
        if (item.last_checked) {
          stored[item.id] = { loading: false, count: item.breach_count };
        }
      }
      setBreachStatus(stored);
    } catch { setToken(''); }
  };

  const fetchAdminStats = async () => {
    setLoadingStats(true);
    try {
      const res = await axios.get(`${API_BASE}/admin/stats`, { headers: { Authorization: `Bearer ${token}` } });
      setAdminStats(res.data);
    } finally { setLoadingStats(false); }
  };

  const fetchAllUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/admin/users`, { headers: { Authorization: `Bearer ${token}` } });
      setAllUsers(res.data);
    } catch {}
  };

  const banishUser = async (userId: number, userName: string) => {
    if (!window.confirm(`Banish ${userName}?`)) return;
    try {
      await axios.delete(`${API_BASE}/admin/user/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchAllUsers(); fetchAdminStats();
    } catch {
      alert("Failed to banish user.");
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', passwordInput);
      const res = await axios.post(`${API_BASE}/${isLogin ? 'token' : 'signup'}`, isLogin ? formData : {username, password: passwordInput});
      setToken(res.data.access_token);
    } catch (err) { setAuthError("Gate closed."); }
  };

  const logout = () => { setToken(''); setVaultItems([]); setBreachStatus({}); setActiveTab('lab'); };

  const generatePassword = async () => {
    setIsBrewing(true);
    try {
      const res = await axios.post(`${API_BASE}/generate`, { length, complexity });
      setTimeout(() => { setBrewedPassword(res.data.password); setIsBrewing(false); }, 800);
    } catch {
      setIsBrewing(false);
      alert("Failed to brew password. Check your connection.");
    }
  };

  const scoutBreach = async (id) => {
    setBreachStatus(prev => ({ ...prev, [id]: { loading: true } }));
    try {
      const res = await axios.get(`${API_BASE}/vault/check-breach/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setBreachStatus(prev => ({ ...prev, [id]: { loading: false, count: res.data.breach_count } }));
    } catch {
      setBreachStatus(prev => ({ ...prev, [id]: { loading: false, error: true } }));
    }
  };

  const addToVault = async () => {
    if (!serviceName || !brewedPassword) return;
    setSaving(true);
    try {
      await axios.post(`${API_BASE}/vault/add`, {
        service_name: serviceName, password: brewedPassword,
        armor_class: complexity === 3 ? "Legendary" : complexity === 2 ? "Master" : "Common"
      }, { headers: { Authorization: `Bearer ${token}` } });
      setServiceName(''); setBrewedPassword(''); alert("Vaulted!");
      fetchVault();
    } catch {
      alert("Failed to save to vault. Your password was not stored.");
    } finally {
      setSaving(false);
    }
  };

  const handleManualVault = async (e) => {
    e.preventDefault();
    if (!manualServiceName || !manualPassword) return;
    setSaving(true);
    try {
      await axios.post(`${API_BASE}/vault/add`, {
        service_name: manualServiceName, 
        password: manualPassword,
        armor_class: "Common"
      }, { headers: { Authorization: `Bearer ${token}` } });
      setManualServiceName(''); setManualPassword('');
      fetchVault();
    } catch { alert("Failed to forge secret."); }
    setSaving(false);
  };

  const deleteVaultEntry = async (id, name) => {
    if (!window.confirm(`Banish ${name} from your vault forever?`)) return;
    try {
      await axios.delete(`${API_BASE}/vault/delete/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchVault();
    } catch { alert("The secret resisted banishment."); }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] text-white flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-neon-cyan/10 blur-[150px] rounded-full" />
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md glass-card p-10 z-10 text-center">
          <div className="p-4 inline-block rounded-2xl bg-neon-cyan/10 text-neon-cyan mb-6"><Shield size={48} /></div>
          <h1 className="text-3xl font-black uppercase mb-2">Vault-Quest</h1>
          <p className="text-gray-500 text-[10px] font-black tracking-widest uppercase mb-10">Forge Your Security</p>
          <div className="space-y-6">
            <div ref={googleButtonRef} className="w-full min-h-[50px]" />
            <div className="flex items-center gap-4 text-[10px] font-black text-gray-700"><div className="flex-1 h-px bg-white/5" />OR<div className="flex-1 h-px bg-white/5" /></div>
            <form onSubmit={handleAuth} className="space-y-4 text-left">
              <input type="text" placeholder="Username" required className="w-full bg-white/5 border border-white/10 p-4 rounded-xl font-bold" value={username} onChange={e => setUsername(e.target.value)} />
              <input type="password" placeholder="Password" required className="w-full bg-white/5 border border-white/10 p-4 rounded-xl font-bold" value={passwordInput} onChange={e => setPasswordInput(e.target.value)} />
              {authError && <p className="text-danger-red text-[10px] font-bold text-center uppercase">{authError}</p>}
              <button type="submit" className="w-full py-4 rounded-xl bg-neon-cyan text-black font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(0,242,255,0.3)]">{isLogin ? "Login" : "Sign Up"}</button>
            </form>
            <button onClick={() => setIsLogin(!isLogin)} className="text-gray-600 hover:text-neon-cyan text-[10px] font-black uppercase">{isLogin ? "Join the Kingdom" : "Already have a quest?"}</button>
          </div>
        </motion.div>
      </div>
    );
  }

  // --- Initiation Screen ---
  if (!isInitiated) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] text-white flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl glass-card p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12"><Crown size={120} /></div>
          <h2 className="text-4xl font-black uppercase mb-2 tracking-tighter">Awaken, Hero</h2>
          <p className="text-gray-500 uppercase tracking-widest text-xs mb-12">The Kingdom of Vault-Quest awaits its next legend.</p>
          
          <div className="space-y-12">
            <div className="space-y-4">
              <label className="text-xs font-black uppercase text-gray-500 tracking-[0.3em]">Choose Your Legend Name</label>
              <input type="text" value={setupName} onChange={e => setSetupName(e.target.value)} placeholder="Display Name..." className="w-full bg-white/5 border-2 border-white/10 p-6 rounded-2xl text-2xl font-black text-center focus:border-neon-cyan outline-none transition-all" />
            </div>

            <div className="space-y-6">
              <label className="text-xs font-black uppercase text-gray-500 tracking-[0.3em]">Choose Your Avatar</label>
              <div className="grid grid-cols-5 gap-4">
                {AVATARS.map(av => (
                  <button key={av.id} onClick={() => setSelectedAvatar(av.id)} className={`p-6 rounded-2xl border-2 transition-all group flex flex-col items-center gap-3 ${selectedAvatar === av.id ? 'border-neon-cyan bg-neon-cyan/10' : 'border-white/5 bg-white/5 hover:border-white/20'}`}>
                    <av.icon size={32} color={selectedAvatar === av.id ? av.color : '#666'} />
                    <span className="text-[8px] font-black uppercase opacity-0 group-hover:opacity-100 transition-opacity">{av.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleProfileSetup} disabled={!setupName || !selectedAvatar} className="w-full py-6 rounded-2xl bg-neon-cyan text-black font-black text-xl uppercase tracking-widest disabled:opacity-20 hover:scale-[1.02] transition-all shadow-[0_0_30px_rgba(0,242,255,0.2)]">Begin Your Legend</button>
          </div>
        </motion.div>
      </div>
    );
  }

  // --- Main Dashboard ---
  const UserAvatar = user && AVATARS.find(a => a.id === user.avatar_url)?.icon || User;
  const userColor = user && AVATARS.find(a => a.id === user.avatar_url)?.color || '#00f2ff';

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-[#e2e2e6] font-sans">
      <nav className="fixed left-6 top-6 bottom-6 w-72 glass-card p-8 flex flex-col gap-12 z-50">
        <div className="flex items-center gap-4 text-2xl font-bold text-neon-cyan"><Shield size={36} /><span className="tracking-tight uppercase">Vault-Quest</span></div>
        <ul className="flex flex-col gap-2">
          <li className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all ${activeTab === 'lab' ? 'bg-white/5 text-white' : 'text-gray-500 hover:text-white'}`} onClick={() => setActiveTab('lab')}><FlaskConical size={22} /> Lab</li>
          <li className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all ${activeTab === 'vault' ? 'bg-white/5 text-white' : 'text-gray-500 hover:text-white'}`} onClick={() => setActiveTab('vault')}><Scroll size={22} /> Vault</li>
          {user?.role === 'admin' && <li className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all ${activeTab === 'admin' ? 'bg-neon-cyan/10 text-neon-cyan' : 'text-neon-cyan/40 hover:text-neon-cyan'}`} onClick={() => setActiveTab('admin')}><Eye size={22} /> Admin Mirror</li>}
        </ul>
        <div className="mt-auto space-y-4">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-4">
            <div className="p-3 rounded-lg" style={{ backgroundColor: `${userColor}20` }}><UserAvatar size={20} color={userColor} /></div>
            <div>
              <p className="text-xs font-black uppercase text-white leading-none mb-1">{user?.display_name || user?.username}</p>
              <p className="text-[8px] font-black uppercase text-gray-500 tracking-widest">{user?.role === 'admin' ? 'Grand Overseer' : 'Adventurer'}</p>
            </div>
          </div>
          <button onClick={logout} className="w-full flex items-center justify-center gap-2 p-4 text-gray-500 hover:text-danger-red transition-all font-black uppercase text-[10px]">Log Out</button>
        </div>
      </nav>

      <main className="pl-[22rem] pr-12 pt-12 min-h-screen">
        <header className="mb-12">
          <h1 className="text-4xl font-black uppercase tracking-tight">{activeTab === 'lab' ? 'The Alchemist Lab' : activeTab === 'vault' ? 'The Secret Vault' : 'Overseer Mirror'}</h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{activeTab === 'lab' ? 'Brewing unbreakable potion passwords' : 'Your collection of ancient secrets'}</p>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'lab' && (
            <motion.div key="lab" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-12 gap-8">
              <div className="col-span-8 glass-card p-10 relative overflow-hidden">
                <h2 className="text-2xl font-black uppercase mb-8 flex items-center gap-3 text-neon-cyan"><Sparkles /> Potion Mixer</h2>
                <div className="space-y-12">
                  <div className="space-y-4">
                    <div className="flex justify-between text-[10px] font-black uppercase text-gray-500"><span>Potion Length</span><span className="text-neon-cyan">{length} Units</span></div>
                    <input type="range" min="8" max="64" value={length} onChange={e => setLength(parseInt(e.target.value))} className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-neon-cyan" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map(lvl => (
                      <button key={lvl} onClick={() => setComplexity(lvl)} className={`p-4 rounded-xl border-2 font-black uppercase text-[10px] ${complexity === lvl ? 'border-neon-cyan bg-neon-cyan/10 text-neon-cyan' : 'border-white/5 text-gray-500'}`}>{lvl === 1 ? 'Squire' : lvl === 2 ? 'Master' : 'God-Like'}</button>
                    ))}
                  </div>
                  <button onClick={generatePassword} disabled={isBrewing} className="w-full py-5 rounded-xl bg-neon-cyan text-black font-black uppercase flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(0,242,255,0.3)]">{isBrewing ? <RefreshCw className="animate-spin" /> : <FlaskConical />}Brew Potion</button>
                </div>
                {brewedPassword && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 p-6 bg-white/5 rounded-2xl border border-neon-cyan/20">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex-1 mr-4">
                        <span className="font-mono text-2xl font-bold text-white break-all">{brewedPassword}</span>
                        <PotencyMeter password={brewedPassword} />
                      </div>
                      <button onClick={() => navigator.clipboard.writeText(brewedPassword)} className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all self-start"><Copy size={24} /></button>
                    </div>
                    <div className="flex gap-4"><input type="text" placeholder="Service..." value={serviceName} onChange={e => setServiceName(e.target.value)} className="flex-1 bg-[#0a0a0c] border border-white/10 p-4 rounded-xl font-bold" /><button onClick={addToVault} className="px-8 bg-neon-cyan text-black font-black uppercase text-[10px] rounded-xl">Vault</button></div>
                  </motion.div>
                )}
              </div>
              <div className="col-span-4 glass-card p-8 border-safety-amber/10"><h3 className="text-xl font-black mb-6 uppercase text-safety-amber flex items-center gap-2"><Activity size={20} /> Stats</h3><div className="space-y-4 text-[10px] font-black uppercase"><div className="flex justify-between"><span>Level</span><span className="text-white">42</span></div><div className="flex justify-between"><span>Class</span><span className="text-safety-amber">Legendary</span></div></div></div>
            </motion.div>
          )}

          {activeTab === 'vault' && (
            <motion.div key="vault" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              {/* Forge Entry Form */}
              <div className="glass-card p-8 border-neon-cyan/10">
                <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-3 text-neon-cyan"><Sparkles size={20} /> Forge New Secret</h3>
                <form onSubmit={handleManualVault} className="space-y-6">
                  <div className="flex gap-4">
                    <input 
                      type="text" 
                      placeholder="Application (e.g. Netflix)" 
                      value={manualServiceName} 
                      onChange={e => setManualServiceName(e.target.value)}
                      className="flex-1 bg-white/5 border border-white/10 p-4 rounded-xl font-bold focus:border-neon-cyan outline-none transition-all"
                    />
                    <div className="flex-1">
                      <input 
                        type="password" 
                        placeholder="Secret Password" 
                        value={manualPassword} 
                        onChange={e => setManualPassword(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 p-4 rounded-xl font-bold focus:border-neon-cyan outline-none transition-all"
                      />
                      <PotencyMeter password={manualPassword} />
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    disabled={saving || !manualServiceName || !manualPassword}
                    className="w-full py-4 bg-neon-cyan text-black font-black uppercase text-[10px] rounded-xl hover:scale-[1.01] transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(0,242,255,0.2)]"
                  >
                    {saving ? "Forging..." : "Store in Vault"}
                  </button>
                </form>
              </div>

              {/* Vault Grid */}
              <div className="grid grid-cols-3 gap-6">
                {vaultItems.map((item, i) => (
                  <div key={item.id || i} className="glass-card p-6 border-white/5 hover:border-neon-cyan/20 transition-all group relative">
                    <div className="flex justify-between mb-4">
                      <div className="p-3 bg-neon-cyan/10 text-neon-cyan rounded-lg">
                        <Key size={20} />
                      </div>
                      <div className="flex gap-2">
                        <span className="text-[8px] font-black uppercase px-2 py-1 border border-white/10 rounded h-fit">
                          {item.armor_class}
                        </span>
                        <button 
                          onClick={() => scoutBreach(item.id)}
                          className={`p-2 rounded-lg transition-all ${breachStatus[item.id]?.count > 0 ? 'text-danger-red bg-danger-red/10' : 'text-gray-500 hover:text-neon-cyan hover:bg-neon-cyan/10'}`}
                          title="Scout for Breaches"
                        >
                          {breachStatus[item.id]?.loading ? <RefreshCw size={14} className="animate-spin" /> : <Radar size={14} />}
                        </button>
                        <button 
                          onClick={() => deleteVaultEntry(item.id, item.service_name)}
                          className="p-2 text-gray-500 hover:text-danger-red hover:bg-danger-red/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <h4 className="font-black uppercase mb-1">{item.service_name}</h4>
                    
                    {/* Breach Status Warning */}
                    <div className="mb-4 min-h-[20px]">
                      {breachStatus[item.id]?.count > 0 && (
                        <div className="flex items-center gap-2 text-danger-red animate-pulse">
                          <ShieldAlert size={12} />
                          <span className="text-[8px] font-black uppercase">Exposed {breachStatus[item.id].count.toLocaleString()} times!</span>
                        </div>
                      )}
                      {breachStatus[item.id]?.count === 0 && (
                        <div className="flex items-center gap-2 text-neon-cyan">
                          <Shield size={12} />
                          <span className="text-[8px] font-black uppercase">Unseen in Breaches</span>
                        </div>
                      )}
                      {breachStatus[item.id]?.error && (
                        <span className="text-[8px] font-black uppercase text-gray-500">Scout failed...</span>
                      )}
                    </div>

                    {item.last_checked && !breachStatus[item.id] && (
                      <p className="text-[8px] font-black uppercase text-gray-600 mb-3">
                        Last scouted {new Date(item.last_checked).toLocaleDateString()}
                      </p>
                    )}

                    <button onClick={() => navigator.clipboard.writeText(item.password)} className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest border border-white/5 flex items-center justify-center gap-2">
                      <Zap size={14} /> Copy Secret
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'admin' && (
            <motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
              <div className="grid grid-cols-3 gap-8">
                {[{l: 'Heroes', v: adminStats?.total_users, i: Users}, {l: 'Potions', v: adminStats?.total_potions, i: Beaker}, {l: 'Status', v: adminStats?.kingdom_status, i: Shield}].map((s, i) => (
                  <div key={i} className="glass-card p-8 text-center"><div className="p-4 inline-block bg-white/5 rounded-full mb-4"><s.i size={32} /></div><p className="text-[10px] font-black uppercase text-gray-500 mb-2">{s.l}</p><h3 className="text-3xl font-black">{s.v || '...'}</h3></div>
                ))}
              </div>
              <div className="glass-card p-8 border-danger-red/10">
                <h3 className="text-xl font-black uppercase mb-4 flex items-center gap-3 text-danger-red"><Radar size={20} /> Breach Control</h3>
                <p className="text-[10px] font-black uppercase text-gray-500 mb-6">Auto-scan runs every 24h. Trigger a manual scan of all vault entries now.</p>
                <button
                  disabled={scanning}
                  onClick={async () => {
                    setScanning(true);
                    try {
                      const res = await axios.post(`${API_BASE}/admin/breach-scan`, {}, { headers: { Authorization: `Bearer ${token}` } });
                      setScanResult(res.data);
                    } catch { alert("Scan failed. Check backend connection."); }
                    finally { setScanning(false); }
                  }}
                  className="px-6 py-3 bg-danger-red/10 text-danger-red border border-danger-red/20 rounded-xl font-black uppercase text-[10px] hover:bg-danger-red hover:text-white transition-all flex items-center gap-2 disabled:opacity-40"
                >
                  {scanning ? <RefreshCw size={14} className="animate-spin" /> : <Radar size={14} />}
                  {scanning ? 'Scouting the Underdark...' : 'Run Breach Scan Now'}
                </button>
              </div>
              <div className="glass-card p-10"><h3 className="text-xl font-black uppercase mb-8 flex items-center gap-3 text-neon-cyan"><Users /> Hall of Heroes</h3><table className="w-full text-left"><thead className="text-[10px] font-black uppercase text-gray-500 border-b border-white/5"><tr><th className="pb-6">Hero</th><th className="pb-6">Role</th><th className="pb-6 text-right">Action</th></tr></thead><tbody className="font-bold text-sm">{allUsers.map(u => (<tr key={u.id} className="border-b border-white/[0.02] hover:bg-white/[0.01] transition-all"><td className="py-6 flex items-center gap-3"><div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center"><User size={16} /></div>{u.display_name || u.username}</td><td><span className={`px-3 py-1 rounded-full text-[8px] uppercase font-black ${u.role === 'admin' ? 'bg-neon-cyan/20 text-neon-cyan' : 'bg-white/5 text-gray-500'}`}>{u.role}</span></td><td className="text-right">{u.username !== user?.username && <button onClick={() => banishUser(u.id, u.username)} className="p-3 bg-danger-red/10 text-danger-red rounded-lg hover:bg-danger-red hover:text-white"><Skull size={18} /></button>}</td></tr>))}</tbody></table></div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {scanResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-6"
            onClick={() => setScanResult(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 30 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="glass-card p-12 max-w-md w-full text-center relative overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className={`absolute inset-0 opacity-5 ${scanResult.compromised > 0 ? 'bg-danger-red' : 'bg-neon-cyan'}`} />

              <div className={`p-5 inline-flex rounded-2xl mb-6 ${scanResult.compromised > 0 ? 'bg-danger-red/10 text-danger-red' : 'bg-neon-cyan/10 text-neon-cyan'}`}>
                {scanResult.compromised > 0 ? <Skull size={48} /> : <Shield size={48} />}
              </div>

              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-2">Underdark Scout Report</p>
              <h2 className={`text-3xl font-black uppercase tracking-tight mb-2 ${scanResult.compromised > 0 ? 'text-danger-red' : 'text-neon-cyan'}`}>
                {scanResult.compromised > 0 ? 'Demons Detected' : 'Kingdom Secure'}
              </h2>
              <p className="text-gray-500 text-xs mb-10">
                {scanResult.compromised > 0
                  ? `${scanResult.compromised} of your secrets have been spotted in the dark web.`
                  : 'No traces of your secrets were found in the darkness.'}
              </p>

              <div className="grid grid-cols-3 gap-4 mb-10">
                {[
                  { label: 'Scouted', value: scanResult.total, color: 'text-white' },
                  { label: 'Compromised', value: scanResult.compromised, color: 'text-danger-red' },
                  { label: 'Safe', value: scanResult.safe, color: 'text-neon-cyan' },
                ].map(s => (
                  <div key={s.label} className="p-4 bg-white/5 rounded-xl">
                    <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                    <p className="text-[8px] font-black uppercase text-gray-600 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setScanResult(null)}
                className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all ${scanResult.compromised > 0 ? 'bg-danger-red/10 text-danger-red hover:bg-danger-red hover:text-white border border-danger-red/20' : 'bg-neon-cyan text-black hover:opacity-90'}`}
              >
                {scanResult.compromised > 0 ? 'Understood — Check My Vault' : 'Return to the Kingdom'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
