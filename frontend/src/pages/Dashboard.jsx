import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Globe, MousePointerClick, Smartphone, Link as LinkIcon } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import AnimatedContent from '../components/reactbits/AnimatedContent';
import FadeContent from '../components/reactbits/FadeContent';
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
    const interval = setInterval(fetchData, 10000); // Live refresh every 10s
    return () => clearInterval(interval);
  }, [code, days]);

  if (loading && !data) return <div className="min-h-screen flex items-center justify-center text-zinc-100 bg-zinc-950">Loading...</div>;
  if (!data) return <div className="min-h-screen flex items-center justify-center text-zinc-100 bg-zinc-950">No data found</div>;

  return (
    <div className="min-h-screen text-zinc-100 bg-zinc-950 p-6 md:p-10 font-sans selection:bg-emerald-500/30">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <Link to="/" className="inline-flex items-center text-emerald-400 hover:text-emerald-300 transition-colors mb-2">
              <ArrowLeft size={16} className="mr-1" /> Back to Home
            </Link>
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold tracking-tight">Analytics for <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-400">/{code}</span></h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                <span className="text-sm text-emerald-400 font-semibold tracking-wide uppercase">Live</span>
              </div>
            </div>
          </div>
          
          <select 
            className="bg-zinc-900 border border-emerald-500/20 text-zinc-100 rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all shadow-[0_0_15px_rgba(16,185,129,0.05)] cursor-pointer"
            value={days}
            onChange={(e) => setDays(e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="30">Last 30 Days</option>
            <option value="7">Last 7 Days</option>
          </select>
        </div>

        {/* Top Stat Cards */}
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

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <FadeContent delay={0.2}>
            <div className="bg-zinc-900/40 backdrop-blur-2xl rounded-3xl p-6 border border-emerald-500/10 shadow-xl">
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
                    <Line type="monotone" dataKey="clicks" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6, fill: '#34d399' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </FadeContent>

          <FadeContent delay={0.3}>
            <div className="bg-zinc-900/40 backdrop-blur-2xl rounded-3xl p-6 border border-emerald-500/10 shadow-xl">
              <h3 className="text-xl font-bold mb-6 text-zinc-100">Device Breakdown</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.clicksByDevice}
                      innerRadius={60}
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
            </div>
          </FadeContent>

          <FadeContent delay={0.4}>
            <div className="bg-zinc-900/40 backdrop-blur-2xl rounded-3xl p-6 border border-emerald-500/10 shadow-xl">
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
            </div>
          </FadeContent>

          <FadeContent delay={0.5}>
            <div className="bg-zinc-900/40 backdrop-blur-2xl rounded-3xl p-6 border border-emerald-500/10 shadow-xl">
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
            </div>
          </FadeContent>
        </div>

        {/* Heatmap & GeoMap (Task 8 & 10) */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
          <FadeContent delay={0.6}>
            <Heatmap data={data.clicksByHour} />
          </FadeContent>
          <FadeContent delay={0.7}>
            <GeoMap data={data.clicksByCountry} />
          </FadeContent>
        </div>
        
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-zinc-900/60 backdrop-blur-2xl rounded-3xl p-6 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.03)] flex items-center gap-4 hover:border-emerald-500/40 transition-colors group">
      <div className="p-4 bg-emerald-500/10 rounded-2xl group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div className="overflow-hidden">
        <p className="text-sm text-zinc-400 font-semibold mb-1 truncate uppercase tracking-wider">{title}</p>
        <p className="text-3xl font-extrabold truncate text-zinc-100">{value}</p>
      </div>
    </div>
  );
}
