import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  FlaskConical, 
  Scroll, 
  Sword, 
  Lock, 
  Sparkles, 
  Copy, 
  RefreshCw,
  Skull,
  Plus,
  Trash2,
  Key
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const API_BASE = "http://localhost:8000";

function App() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [complexity, setComplexity] = useState(2);
  const [isBrewing, setIsBrewing] = useState(false);
  const [showVault, setShowVault] = useState(false);
  const [vaultItems, setVaultItems] = useState([]);
  const [serviceName, setServiceName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (showVault) fetchVault();
  }, [showVault]);

  const fetchVault = async () => {
    try {
      const res = await axios.get(`${API_BASE}/vault/list`);
      setVaultItems(res.data);
    } catch (err) {
      console.error("Failed to fetch vault", err);
    }
  };

  const generatePassword = async () => {
    setIsBrewing(true);
    try {
      const res = await axios.post(`${API_BASE}/generate`, { length, complexity });
      // Small delay for RPG effect
      await new Promise(r => setTimeout(r, 800));
      setPassword(res.data.password);
    } catch (err) {
      console.error("Failed to brew potion", err);
    } finally {
      setIsBrewing(false);
    }
  };

  const addToVault = async () => {
    if (!serviceName || !password) return;
    setSaving(true);
    try {
      await axios.post(`${API_BASE}/vault/add`, {
        service_name: serviceName,
        password: password,
        armor_class: complexity === 3 ? "Legendary" : complexity === 2 ? "Master" : "Common"
      });
      setServiceName('');
      setPassword('');
      alert("✨ Potion successfully vaulted!");
    } catch (err) {
      console.error("Failed to vault potion", err);
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-[#e2e2e6] font-sans">
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-cyan/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-safety-amber/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Sidebar */}
      <nav className="fixed left-6 top-6 bottom-6 w-72 glass-card p-8 flex flex-col gap-12 z-50">
        <div className="flex items-center gap-4 text-2xl font-bold text-neon-cyan">
          <Shield size={36} className="drop-shadow-[0_0_8px_rgba(0,242,255,0.5)]" />
          <span className="tracking-tight">Vault-Quest</span>
        </div>

        <ul className="flex flex-col gap-2">
          <li 
            className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all ${!showVault ? 'bg-white/5 text-white' : 'text-gray-500 hover:text-white'}`}
            onClick={() => setShowVault(false)}
          >
            <FlaskConical size={22} />
            <span className="font-semibold text-lg">Alchemist's Lab</span>
          </li>
          <li 
            className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all ${showVault ? 'bg-white/5 text-white' : 'text-gray-500 hover:text-white'}`}
            onClick={() => setShowVault(true)}
          >
            <Scroll size={22} />
            <span className="font-semibold text-lg">Secret Vault</span>
          </li>
          <li className="flex items-center gap-4 p-4 text-gray-700 cursor-not-allowed">
            <Sword size={22} />
            <span className="font-semibold text-lg">The Arena</span>
          </li>
          <li className="flex items-center gap-4 p-4 text-gray-700 cursor-not-allowed">
            <Skull size={22} />
            <span className="font-semibold text-lg">The Underdark</span>
          </li>
        </ul>

        <div className="mt-auto p-4 rounded-xl bg-neon-cyan/5 border border-neon-cyan/20">
          <div className="flex items-center gap-3 text-sm font-bold text-neon-cyan uppercase tracking-wider mb-2">
            <Lock size={14} /> Sentinel Active
          </div>
          <p className="text-xs text-gray-400">AES-256 encryption active. Your kingdom is secure.</p>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pl-[22rem] pr-12 pt-12 pb-12 min-h-screen">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-extrabold mb-2 tracking-tight">
              {!showVault ? "Alchemist's Lab" : "The Secret Vault"}
            </h1>
            <p className="text-gray-500">
              {!showVault 
                ? "Mix ingredients to brew an unbreakable password potion."
                : "Your collection of protected artifacts and ancient scrolls."}
            </p>
          </div>
          <div className="flex items-center gap-4 px-6 py-3 rounded-full bg-white/5 border border-white/10">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-bold uppercase tracking-widest text-gray-400">Guardian Online</span>
          </div>
        </header>

        {!showVault ? (
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-8 space-y-8">
              <section className="glass-card p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-neon-cyan/5 blur-3xl pointer-events-none" />
                
                <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                  <Sparkles className="text-neon-cyan" size={24} /> Potion Mixer
                </h2>

                <div className="space-y-12">
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm font-bold uppercase tracking-wider text-gray-400">
                      <span>Mercury (Potion Length)</span>
                      <span className="text-neon-cyan">{length} Units</span>
                    </div>
                    <input 
                      type="range" min="8" max="64" value={length} 
                      onChange={(e) => setLength(parseInt(e.target.value))}
                      className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-neon-cyan"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="text-sm font-bold uppercase tracking-wider text-gray-400">Sulfur Complexity</div>
                    <div className="grid grid-cols-3 gap-4">
                      {[1, 2, 3].map((lvl) => (
                        <button
                          key={lvl}
                          onClick={() => setComplexity(lvl)}
                          className={`p-4 rounded-xl border-2 transition-all font-bold ${
                            complexity === lvl 
                              ? 'border-neon-cyan bg-neon-cyan/10 text-neon-cyan shadow-[0_0_15px_rgba(0,242,255,0.2)]' 
                              : 'border-white/10 bg-white/5 text-gray-500 hover:border-white/20'
                          }`}
                        >
                          {lvl === 1 ? 'Squire' : lvl === 2 ? 'Master' : 'God-Like'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={generatePassword}
                    disabled={isBrewing}
                    className="w-full py-5 rounded-xl bg-neon-cyan text-black font-black text-xl tracking-tighter hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(0,242,255,0.3)]"
                  >
                    {isBrewing ? <RefreshCw className="animate-spin" /> : <FlaskConical />}
                    {isBrewing ? 'BREWING...' : 'BREW PASSWORD POTION'}
                  </button>
                </div>
              </section>

              <AnimatePresence mode="wait">
                {password && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="glass-card p-8 border-neon-cyan/30"
                  >
                    <div className="flex flex-col gap-6">
                      <div className="flex items-center justify-between gap-6">
                        <div className="flex-1 font-mono text-3xl font-bold tracking-tight text-white break-all bg-white/5 p-6 rounded-xl border border-white/10">
                          {password}
                        </div>
                        <button 
                          onClick={() => copyToClipboard(password)}
                          className="p-6 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all border border-white/10"
                          title="Copy Potion"
                        >
                          <Copy size={28} />
                        </button>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex-1 relative">
                          <input 
                            type="text"
                            placeholder="Name of the Kingdom/Service (e.g. Google)..."
                            value={serviceName}
                            onChange={(e) => setServiceName(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 outline-none focus:border-neon-cyan/50 transition-all font-semibold"
                          />
                        </div>
                        <button 
                          onClick={addToVault}
                          disabled={!serviceName || saving}
                          className="px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-neon-cyan font-bold border border-neon-cyan/30 flex items-center gap-2 disabled:opacity-30 transition-all"
                        >
                          {saving ? <RefreshCw className="animate-spin" size={20} /> : <Scroll size={20} />}
                          VAULT POTION
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="col-span-4">
              <section className="glass-card p-8 sticky top-12">
                <h3 className="text-xl font-bold mb-6">Alchemist Stats</h3>
                <div className="space-y-6 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-semibold uppercase tracking-widest">Master Level</span>
                    <span className="text-white font-bold">Lvl 42</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-semibold uppercase tracking-widest">Armor Class</span>
                    <span className="text-safety-amber font-bold flex items-center gap-2">
                      <Shield size={16} /> Legendary
                    </span>
                  </div>
                  <div className="pt-6 border-t border-white/10">
                    <div className="bg-neon-cyan/5 p-4 rounded-xl border border-neon-cyan/10">
                      <p className="text-xs text-neon-cyan/80 leading-relaxed italic">
                        "Secure your most precious artifacts. A potion vaulted is a kingdom protected."
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {vaultItems.length > 0 ? (
              vaultItems.map((item, idx) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={idx} 
                  className="glass-card p-6 border-white/5 hover:border-neon-cyan/20 transition-all group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-lg bg-neon-cyan/10 text-neon-cyan">
                      <Key size={20} />
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border ${
                      item.armor_class === 'Legendary' ? 'text-safety-amber border-safety-amber/30 bg-safety-amber/5' : 'text-gray-500 border-white/10 bg-white/5'
                    }`}>
                      {item.armor_class}
                    </span>
                  </div>
                  <h4 className="font-bold text-lg mb-1">{item.service_name}</h4>
                  <p className="text-gray-500 font-mono text-sm mb-6 flex items-center gap-2">
                    ••••••••••••
                  </p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => copyToClipboard(item.password)}
                      className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 py-2 rounded-lg text-xs font-bold transition-all"
                    >
                      <Copy size={14} /> COPY
                    </button>
                    <button className="px-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-all">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-3 flex flex-col items-center justify-center h-[40vh] text-center opacity-30">
                <Scroll size={64} className="mb-4" />
                <p className="font-bold text-xl uppercase tracking-widest">No Scrolls Found</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
