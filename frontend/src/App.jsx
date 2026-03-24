import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link2, Copy, BarChart2, QrCode, Lock, Clock, Settings2, Trash2, Power, Zap } from 'lucide-react';
import Aurora from './components/reactbits/Aurora';
import FadeContent from './components/reactbits/FadeContent';
import Bounce from './components/reactbits/Bounce';
import ClickSpark from './components/reactbits/ClickSpark';
import QRCodeModal from './components/QRCodeModal';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export default function App() {
  const [url, setUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [password, setPassword] = useState('');
  const [expiresIn, setExpiresIn] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [links, setLinks] = useState([]);
  const [isCopied, setIsCopied] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/links`);
      setLinks(res.data);
    } catch (err) {
      console.error('Failed to fetch links');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const payload = { originalUrl: url };
      if (customAlias) payload.customAlias = customAlias;
      if (password) payload.password = password;
      if (expiresIn) payload.expiresIn = Number(expiresIn);

      const res = await axios.post(`${API_URL}/api/shorten`, payload);
      setResult({
        shortUrl: `${API_URL}/${res.data.shortCode}`,
        shortCode: res.data.shortCode
      });
      setUrl('');
      setCustomAlias('');
      setPassword('');
      setExpiresIn('');
      setAdvancedOpen(false);
      fetchLinks();
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this link? This action cannot be undone.')) return;
    try {
      await axios.delete(`${API_URL}/api/links/${id}`);
      fetchLinks();
    } catch (err) {
      alert('Failed to delete the link.');
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      await axios.put(`${API_URL}/api/links/${id}`, { is_active: !currentStatus });
      fetchLinks();
    } catch (err) {
      alert('Failed to update link status.');
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result.shortUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <ClickSpark sparkColor="#10b981" sparkSize={8} sparkRadius={20} sparkCount={10}>
      <div className="min-h-screen text-zinc-100 relative flex flex-col items-center py-16 px-6 bg-zinc-950 font-sans selection:bg-emerald-500/30">
        
        {/* ReactBits Aurora Background */}
        <div className="fixed inset-0 z-0 opacity-40">
          <Aurora colorStops={["#064e3b", "#059669", "#10b981"]} speed={0.8} />
        </div>

        {/* Content */}
        <div className="w-full max-w-4xl z-10 flex flex-col gap-8">
          
          <FadeContent blur={true} duration={800} easing="ease-out" initialOpacity={0}>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center p-3 bg-emerald-500/10 rounded-2xl mb-4 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.15)] backdrop-blur-md">
                <Zap className="text-emerald-400" size={32} />
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight drop-shadow-sm">
                Shorten with <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-400">Precision</span>
              </h1>
              <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto font-medium">
                Create elegant short links, protect them with passwords, and track global engagement with our ultra-premium analytics engine.
              </p>
            </div>
          </FadeContent>

          {/* Form Card */}
          <FadeContent blur={true} duration={1000} delay={0.2}>
            <div className="bg-zinc-900/40 backdrop-blur-2xl p-8 md:p-10 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.05)] border border-emerald-500/20 transition-all hover:border-emerald-500/40">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Main Input */}
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <Link2 className="text-zinc-500 group-focus-within:text-emerald-400 transition-colors" size={24} />
                  </div>
                  <input
                    type="url"
                    required
                    placeholder="Paste your long URL here..."
                    className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl pl-14 pr-6 py-5 text-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:outline-none transition-all placeholder-zinc-500 shadow-inner"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setAdvancedOpen(!advancedOpen)}
                      className="p-2 text-zinc-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-xl transition-all"
                      title="Advanced Settings"
                    >
                      <Settings2 size={20} />
                    </button>
                  </div>
                </div>

                {/* Advanced Panel */}
                {advancedOpen && (
                  <FadeContent blur={false} duration={300}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-zinc-950/40 p-6 rounded-2xl border border-zinc-800 border-t-emerald-500/30">
                      <div>
                        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Custom Alias</label>
                        <input
                          type="text"
                          placeholder="e.g. summer-sale"
                          className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 focus:ring-1 focus:ring-amber-500 focus:outline-none placeholder-zinc-600 transition-colors"
                          value={customAlias}
                          onChange={(e) => setCustomAlias(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 text-amber-400/80">Password Protect <Lock size={10} className="inline mb-1"/></label>
                        <input
                          type="password"
                          placeholder="Secret password"
                          className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 focus:ring-1 focus:ring-amber-500 focus:outline-none placeholder-zinc-600 transition-colors"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 text-emerald-400/80">Expiry (Hours) <Clock size={10} className="inline mb-1"/></label>
                        <input
                          type="number"
                          placeholder="e.g. 24"
                          min="1"
                          className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 focus:ring-1 focus:ring-emerald-500 focus:outline-none placeholder-zinc-600 transition-colors"
                          value={expiresIn}
                          onChange={(e) => setExpiresIn(e.target.value)}
                        />
                      </div>
                    </div>
                  </FadeContent>
                )}

                {error && (
                  <div className="text-red-400 text-sm font-medium bg-red-500/10 p-4 rounded-xl border border-red-500/20 text-center">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-lg py-5 px-8 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all transform hover:scale-[1.01] active:scale-95 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2 group"
                >
                  {loading ? 'Forging Link...' : 'Shorten URL'} 
                  {!loading && <Zap className="group-hover:translate-x-1 transition-transform" size={20} />}
                </button>
              </form>

              {/* Success Result */}
              {result && (
                <Bounce>
                  <div className="mt-8 p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                    <p className="text-sm text-emerald-400 mb-2 font-semibold tracking-wide uppercase">Your exquisite link is ready</p>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <a 
                        href={result.shortUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-2xl font-bold text-white hover:text-emerald-300 transition-colors break-all flex-1"
                      >
                        {result.shortUrl}
                      </a>
                      <div className="flex gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                        <button 
                          onClick={copyToClipboard}
                          className="flex-1 sm:flex-none flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 px-6 py-3 rounded-xl transition-colors font-medium border border-zinc-600 hover:border-emerald-500/50"
                        >
                          {isCopied ? 'Copied!' : <><Copy size={18} className="mr-2" /> Copy</>}
                        </button>
                        <button 
                          onClick={() => setQrModalOpen(true)}
                          className="flex items-center justify-center bg-zinc-800 hover:bg-emerald-500 hover:text-zinc-950 px-4 py-3 rounded-xl transition-colors font-medium border border-zinc-600 hover:border-transparent"
                        >
                          <QrCode size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </Bounce>
              )}
            </div>
          </FadeContent>

          {/* Links Table */}
          {links.length > 0 && (
            <FadeContent blur={true} duration={1000} delay={0.4}>
              <div className="bg-zinc-900/40 backdrop-blur-2xl rounded-3xl border border-emerald-500/20 overflow-hidden shadow-2xl">
                <div className="px-8 py-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
                  <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-amber-400">
                    Recent Links
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-zinc-950/50 text-xs uppercase text-zinc-500 font-bold tracking-wider">
                        <th className="p-5 pl-8 font-medium">Original URL</th>
                        <th className="p-5 font-medium">Short Link</th>
                        <th className="p-5 font-medium">Status & Security</th>
                        <th className="p-5 pr-8 text-right font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                      {links.map(link => (
                        <tr key={link.id} className="hover:bg-zinc-800/30 transition-colors group">
                          <td className="p-5 pl-8 max-w-[200px] truncate text-zinc-300 font-medium">
                            {link.original_url}
                          </td>
                          <td className="p-5 font-medium">
                            <a href={`${API_URL}/${link.custom_alias || link.short_code}`} target="_blank" rel="noreferrer" className="text-emerald-400 hover:text-emerald-300 flex items-center gap-2">
                              /{link.custom_alias || link.short_code}
                            </a>
                          </td>
                          <td className="p-5">
                            <div className="flex flex-col gap-1 text-xs font-semibold">
                              {link.password && <span className="inline-flex items-center w-max gap-1 bg-amber-500/10 text-amber-500 px-2 py-1 rounded-md border border-amber-500/20"><Lock size={10}/> Protected</span>}
                              {link.expires_at ? (
                                new Date() > new Date(link.expires_at) 
                                  ? <span className="inline-flex items-center w-max gap-1 bg-red-500/10 text-red-500 px-2 py-1 rounded-md border border-red-500/20"><Clock size={10}/> Expired</span>
                                  : <span className="inline-flex items-center w-max gap-1 bg-sky-500/10 text-sky-400 px-2 py-1 rounded-md border border-sky-500/20"><Clock size={10}/> Expires soon</span>
                              ) : null}
                              {link.is_active === 0 && <span className="inline-flex items-center w-max gap-1 text-red-400 mt-1">Deactivated</span>}
                              {link.is_active !== 0 && !link.password && !link.expires_at && <span className="text-zinc-500">Public & Active</span>}
                            </div>
                          </td>
                          <td className="p-5 pr-8 flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleToggleActive(link.id, link.is_active !== 0)} 
                              className={`p-2.5 rounded-xl transition-colors shadow-sm ${link.is_active !== 0 ? 'text-emerald-400 hover:bg-emerald-500/20 bg-emerald-500/5 border border-emerald-500/10' : 'text-red-400 hover:bg-red-500/20 bg-red-500/5 border border-red-500/10'}`} 
                              title="Toggle Active"
                            >
                              <Power size={18} />
                            </button>
                            <button 
                              onClick={() => handleDelete(link.id)} 
                              className="p-2.5 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 rounded-xl transition-colors shadow-sm bg-rose-500/5 border border-rose-500/10" 
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                            <a href={`/dashboard/${link.short_code}`} className="inline-block p-2.5 text-amber-400 hover:text-amber-300 hover:bg-amber-500/20 rounded-xl transition-colors shadow-sm bg-amber-500/5 border border-amber-500/10" title="View Stats">
                              <BarChart2 size={18} />
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </FadeContent>
          )}

        </div>
      </div>
      
      {qrModalOpen && result && (
        <QRCodeModal url={result.shortUrl} onClose={() => setQrModalOpen(false)} />
      )}
    </ClickSpark>
  );
}
