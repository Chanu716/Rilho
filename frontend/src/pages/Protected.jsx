import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Lock, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import Aurora from '../components/reactbits/Aurora';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export default function Protected() {
  const { code } = useParams();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post(`${API_URL}/api/verify-password`, {
        code, password
      });
      // Redirect to original URL
      window.location.href = res.data.original_url;
    } catch (err) {
      setError(err.response?.data?.error || 'Incorrect password');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-zinc-100 relative flex flex-col items-center justify-center p-6 bg-zinc-950 overflow-hidden font-sans">
      <div className="fixed inset-0 z-0 opacity-40">
        <Aurora colorStops={["#064e3b", "#059669", "#10b981"]} speed={0.8} />
      </div>
      
      <motion.div 
        animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md z-10"
      >
        <div className="bg-zinc-900/40 backdrop-blur-2xl border border-emerald-500/20 p-10 rounded-3xl shadow-[0_0_40px_rgba(16,185,129,0.05)] w-full transition-all hover:border-emerald-500/40">
          <div className="text-center mb-10">
            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-500 p-4 rounded-3xl w-20 h-20 mx-auto flex items-center justify-center mb-6 shadow-inner">
              <Lock size={40} strokeWidth={1.5} />
            </div>
            <h1 className="text-3xl font-extrabold mb-2 tracking-tight">Authorization</h1>
            <p className="text-sm font-medium text-zinc-400">The destination for <span className="text-emerald-400">/{code}</span> is protected</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="password"
                required
                placeholder="Enter access sequence"
                className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl px-5 py-4 text-center text-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent focus:outline-none transition-all placeholder-zinc-600 shadow-inner"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-red-400 text-sm text-center font-medium bg-red-500/10 border border-red-500/20 p-3 rounded-xl">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold py-4 px-6 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 tracking-wide"
            >
              {loading ? 'Authenticating...' : 'Unlock Destination'}
            </button>
          </form>

          <div className="mt-10 text-center">
            <Link to="/" className="inline-flex items-center text-zinc-500 hover:text-emerald-400 text-sm transition-colors font-medium">
              <ArrowLeft size={16} className="mr-2" /> Return to Safety
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
