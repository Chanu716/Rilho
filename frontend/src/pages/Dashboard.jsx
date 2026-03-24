import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Globe, MousePointerClick, Smartphone, Link as LinkIcon, Activity } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import AnimatedContent from '../components/reactbits/AnimatedContent';
import FadeContent from '../components/reactbits/FadeContent';
import Aurora from '../components/reactbits/Aurora';
import SpotlightCard from '../components/reactbits/SpotlightCard';
import SplitText from '../components/reactbits/SplitText';
import Heatmap from '../components/Heatmap';
import GeoMap from '../components/GeoMap';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
const COLORS = ['#10b981', '#f59e0b', '#059669', '#d97706', '#34d399', '#fcd34d'];

const getFlag = (country) => {
  const map = {
    'United States': '🇺🇸', 'United Kingdom': '🇬🇧', 'India': '🇮🇳',
    'Canada': '🇨🇦', 'Australia': '🇦🇺', 'Germany': '🇩🇪', 'France': '🇫🇷',
    'Japan': '🇯🇵', 'Brazil': '🇧🇷', 'China': '🇨🇳'
  };
  return map[country] || '🌍';
};

export default function Dashboard() {
  const { code } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/api/analytics/${code}?days=${days}`);
        setData(res.data);
      } catch (e) {
        console.error('Error fetching analytics', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [code, days]);

  if (loading && !data) return <div className="min-h-screen flex items-center justify-center text-zinc-100 bg-zinc-950 font-sans">Scanning...</div>;
  if (!data) return <div className="min-h-screen flex items-center justify-center text-zinc-100 bg-zinc-950 font-sans">No data found</div>;

  return (
    <div className="min-h-screen text-zinc-100 bg-zinc-950 p-6 md:p-10 font-sans selection:bg-emerald-500/30 relative overflow-hidden">
      
      {/* Ambient Aurora Background */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
        <Aurora colorStops={["#064e3b", "#059669", "#10b981"]} speed={0.4} />
      </div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <Link to="/" className="inline-flex items-center text-emerald-400 hover:text-emerald-300 transition-colors mb-2 font-medium tracking-wide">
              <ArrowLeft size={16} className="mr-2" /> Return to Command Center
            </Link>
            <div className="flex flex-wrap items-center gap-4">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                <SplitText text="Analytics for" delay={0.03} className="text-zinc-100 mr-2" />
                <SplitText text={`/${code}`} delay={0.05} className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-400 drop-shadow-sm" />
              </h1>
              <div className="flex items-center gap-2 mt-1 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                <span className="text-xs text-emerald-400 font-bold tracking-widest uppercase">Live Link</span>
              </div>
            </div>
          </div>
          
          <select 
            className="bg-zinc-900/80 backdrop-blur-md border border-emerald-500/30 text-zinc-100 rounded-xl px-5 py-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all shadow-[0_0_20px_rgba(16,185,129,0.1)] cursor-pointer font-medium"
            value={days}
            onChange={(e) => setDays(e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="30">Last 30 Days</option>
            <option value="7">Last 7 Days</option>
          </select>
        </div>

        {/* Top Stat Cards wrapped in Spotlight */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <AnimatedContent delay={0.1}>
            <StatCard title="Total Clicks" value={data.totalClicks.toLocaleString()} icon={<MousePointerClick className="text-emerald-400" />} />
          </AnimatedContent>
          <AnimatedContent delay={0.2}>
            <StatCard title="Unique Countries" value={data.uniqueCountries} icon={<Globe className="text-amber-400" />} />
          </AnimatedContent>
          <AnimatedContent delay={0.3}>
            <StatCard title="Top Referrer" value={data.topReferrer} icon={<LinkIcon className="text-emerald-300" />} />
          </AnimatedContent>
          <AnimatedContent delay={0.4}>
            <StatCard title="Top Device" value={data.topDevice} icon={<Smartphone className="text-amber-300" />} />
          </AnimatedContent>
        </div>

        {/* Live Click Stream (NEW FEATURE) */}
        {data.recentClicks && data.recentClicks.length > 0 && (
          <FadeContent delay={0.3}>
            <SpotlightCard spotlightColor="rgba(245, 158, 11, 0.15)" className="p-0 border-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.05)]">
              <div className="px-6 py-5 border-b border-zinc-800/50 flex justify-between items-center bg-zinc-900/30">
                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-emerald-400 flex items-center gap-2">
                  <Activity size={20} className="text-amber-400 animate-pulse" /> Live Click Stream
                </h3>
              </div>
              <div className="overflow-x-auto max-h-[300px] overflow-y-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-zinc-900/90 backdrop-blur-xl z-20">
                    <tr className="text-xs uppercase text-zinc-500 font-bold tracking-wider">
                      <th className="p-4 pl-6">IP Address</th>
                      <th className="p-4">Location</th>
                      <th className="p-4">Device</th>
                      <th className="p-4">System</th>
                      <th className="p-4 pr-6 text-right">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/40">
                    {data.recentClicks.map((click, i) => (
                      <tr key={i} className="hover:bg-zinc-800/40 transition-colors">
                        <td className="p-4 pl-6 text-zinc-300 font-mono text-sm">{click.ip || 'Unknown'}</td>
                        <td className="p-4 text-emerald-400 flex items-center gap-2">
                          {getFlag(click.country)} <span className="truncate max-w-[120px]">{click.city !== 'Unknown' ? click.city : click.country}</span>
                        </td>
                        <td className="p-4 text-amber-400 capitalize">{click.device}</td>
                        <td className="p-4 text-zinc-400 text-sm">{click.os} • {click.browser}</td>
                        <td className="p-4 pr-6 text-right text-zinc-500 text-sm whitespace-nowrap">
                          {new Date(click.clicked_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SpotlightCard>
          </FadeContent>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <FadeContent delay={0.4}>
            <SpotlightCard className="h-full">
              <h3 className="text-xl font-bold mb-6 text-zinc-100">Clicks Over Time</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.clicksByDay}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="date" stroke="#71717a" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#71717a" tick={{ fontSize: 12 }} allowDecimals={false} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#18181b', borderColor: '#047857', color: '#f4f4f5', borderRadius: '0.75rem' }}
                      itemStyle={{ color: '#10b981' }}
                    />
                    <Line type="monotone" dataKey="clicks" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6, fill: '#34d399', strokeWidth: 0 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </SpotlightCard>
          </FadeContent>

          <FadeContent delay={0.5}>
            <SpotlightCard className="h-full">
              <h3 className="text-xl font-bold mb-6 text-zinc-100">Device Breakdown</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.clicksByDevice}
                      innerRadius={65}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="clicks"
                      nameKey="device"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {data.clicksByDevice.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#047857', color: '#f4f4f5', borderRadius: '0.75rem' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </SpotlightCard>
          </FadeContent>

          <FadeContent delay={0.6}>
            <SpotlightCard className="h-full">
              <h3 className="text-xl font-bold mb-6 text-zinc-100">Top Countries</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.clicksByCountry} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={true} vertical={false} />
                    <XAxis type="number" stroke="#71717a" allowDecimals={false} />
                    <YAxis 
                      dataKey="country" 
                      type="category" 
                      stroke="#71717a" 
                      width={120} 
                      tickFormatter={(val) => `${getFlag(val)} ${val}`}
                      tick={{ fontSize: 12 }}
                    />
                    <RechartsTooltip cursor={{fill: '#27272a'}} contentStyle={{ backgroundColor: '#18181b', borderColor: '#047857', color: '#f4f4f5', borderRadius: '0.75rem' }} />
                    <Bar dataKey="clicks" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </SpotlightCard>
          </FadeContent>

          <FadeContent delay={0.7}>
            <SpotlightCard className="h-full">
              <h3 className="text-xl font-bold mb-6 text-zinc-100">Referrers & Browsers</h3>
              <div className="h-72 flex flex-col gap-4">
                <ResponsiveContainer width="100%" height="50%">
                  <BarChart data={data.clicksByReferrer} layout="vertical" margin={{ left: 20 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="referrer" type="category" stroke="#71717a" width={100} tick={{ fontSize: 11 }} />
                    <RechartsTooltip cursor={{fill: '#27272a'}} contentStyle={{ backgroundColor: '#18181b', borderColor: '#047857', color: '#f4f4f5', borderRadius: '0.75rem' }} />
                    <Bar dataKey="clicks" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={12} />
                  </BarChart>
                </ResponsiveContainer>
                
                <ResponsiveContainer width="100%" height="50%">
                  <BarChart data={data.clicksByBrowser} layout="vertical" margin={{ left: 20 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="browser" type="category" stroke="#71717a" width={100} tick={{ fontSize: 11 }} />
                    <RechartsTooltip cursor={{fill: '#27272a'}} contentStyle={{ backgroundColor: '#18181b', borderColor: '#047857', color: '#f4f4f5', borderRadius: '0.75rem' }} />
                    <Bar dataKey="clicks" fill="#059669" radius={[0, 4, 4, 0]} barSize={12} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </SpotlightCard>
          </FadeContent>
        </div>

        {/* Heatmap & GeoMap */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
          <FadeContent delay={0.8}>
            <Heatmap data={data.clicksByHour} />
          </FadeContent>
          <FadeContent delay={0.9}>
            <GeoMap data={data.clicksByCountry} />
          </FadeContent>
        </div>
        
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(24, 24, 27, 0.5); 
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(16, 185, 129, 0.3); 
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(16, 185, 129, 0.6); 
        }
      `}</style>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <SpotlightCard className="p-0 border-none bg-transparent">
      <div className="flex items-center gap-4 h-full">
        <div className="p-4 bg-emerald-500/10 rounded-2xl group-hover:scale-110 transition-transform shadow-inner border border-emerald-500/10">
          {icon}
        </div>
        <div className="overflow-hidden">
          <p className="text-xs text-zinc-400 font-bold mb-1 truncate uppercase tracking-widest">{title}</p>
          <p className="text-3xl font-extrabold truncate text-zinc-100">{value}</p>
        </div>
      </div>
    </SpotlightCard>
  );
}
