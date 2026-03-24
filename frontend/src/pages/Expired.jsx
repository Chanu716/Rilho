import { Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import Aurora from '../components/reactbits/Aurora';
import FadeContent from '../components/reactbits/FadeContent';

export default function Expired() {
  return (
    <div className="min-h-screen text-zinc-100 relative flex flex-col items-center justify-center p-6 bg-zinc-950 overflow-hidden font-sans">
      <div className="fixed inset-0 z-0 opacity-40">
        <Aurora colorStops={["#064e3b", "#059669", "#10b981"]} speed={0.8} />
      </div>
      
      <FadeContent delay={0.2} blur={true} duration={800}>
        <div className="bg-zinc-900/40 backdrop-blur-2xl border border-emerald-500/20 p-10 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.05)] max-w-lg w-full text-center relative z-10 transition-all hover:border-emerald-500/40">
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-3xl w-24 h-24 mx-auto flex items-center justify-center mb-8 shadow-inner">
            <Clock size={48} strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl font-extrabold mb-4 tracking-tight">410 Gone</h1>
          <p className="text-zinc-400 mb-10 text-lg font-medium">
            This link has permanently expired from our temporal records and is no longer accessible.
          </p>
          <Link 
            to="/" 
            className="inline-block w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold py-4 px-10 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all transform hover:scale-[1.02] active:scale-95 tracking-wide"
          >
            Forge a New Link
          </Link>
        </div>
      </FadeContent>
    </div>
  );
}
