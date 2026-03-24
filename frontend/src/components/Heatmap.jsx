import React, { useMemo, useState } from 'react';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

export default function Heatmap({ data }) {
  const [tooltip, setTooltip] = useState(null);

  // Parse data into a matrix
  const matrix = useMemo(() => {
    const mat = Array.from({ length: 7 }, () => Array(24).fill(0));
    data.forEach(item => {
      mat[item.dayOfWeek][item.hour] += item.clicks;
    });
    return mat;
  }, [data]);

  const maxClicks = useMemo(() => {
    let max = 0;
    matrix.forEach(row => row.forEach(val => {
      if (val > max) max = val;
    }));
    return max;
  }, [matrix]);

  const formatHour = (h) => {
    if (h === 0) return '12A';
    if (h === 12) return '12P';
    return h < 12 ? `${h}A` : `${h - 12}P`;
  };

  const getIntensity = (val) => {
    if (val === 0) return 0;
    if (maxClicks === 0) return 0;
    // Map value linearly between 0.3 and 1.0 (emerald)
    const ratio = val / maxClicks;
    return 0.3 + (ratio * 0.7);
  };

  return (
    <div className="w-full h-full bg-zinc-900/40 backdrop-blur-2xl border border-emerald-500/10 rounded-3xl p-6 relative shadow-xl">
      <h3 className="text-xl font-bold mb-6 text-zinc-100">Click Heatmap</h3>
      
      <div className="flex">
        {/* Y Axis (Days) */}
        <div className="flex flex-col justify-around pr-4">
          {DAYS.map(day => (
            <div key={day} className="text-xs text-zinc-400 font-medium h-8 flex items-center tracking-wide">
              {day}
            </div>
          ))}
        </div>

        {/* Grid Area */}
        <div className="flex-1 overflow-x-auto pb-4">
          <div className="min-w-[600px]">
            {/* X Axis (Hours) */}
            <div className="grid gap-1 mb-2" style={{ gridTemplateColumns: 'repeat(24, minmax(0, 1fr))' }}>
              {HOURS.map(h => (
                <div key={h} className="text-[10px] text-zinc-500 text-center font-medium">
                  {formatHour(h)}
                </div>
              ))}
            </div>

            {/* Matrix */}
            <div className="flex flex-col gap-1 relative" onMouseLeave={() => setTooltip(null)}>
              {DAYS.map((day, dIdx) => (
                <div key={day} className="grid gap-1 h-8" style={{ gridTemplateColumns: 'repeat(24, minmax(0, 1fr))' }}>
                  {HOURS.map(h => {
                    const clicks = matrix[dIdx][h];
                    const intensity = getIntensity(clicks);
                    
                    return (
                      <div 
                        key={`${day}-${h}`}
                        className="rounded cursor-pointer transition-colors hover:ring-2 hover:ring-amber-400 z-10"
                        style={{
                          backgroundColor: clicks > 0 ? `rgba(16, 185, 129, ${intensity})` : '#18181b' // zinc-900
                        }}
                        onMouseEnter={(e) => {
                          const rect = e.target.getBoundingClientRect();
                          setTooltip({
                            text: `${clicks} click${clicks !== 1 ? 's' : ''} on ${day} at ${h === 0 ? '12 AM' : h < 12 ? h + ' AM' : h === 12 ? '12 PM' : (h - 12) + ' PM'}`,
                            x: rect.left + rect.width / 2,
                            y: rect.top - 10
                          });
                        }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div 
          className="fixed bg-zinc-800 text-zinc-100 text-xs font-bold py-1.5 px-3 rounded-lg shadow-2xl pointer-events-none z-50 transform -translate-x-1/2 -translate-y-full border border-emerald-500/30"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          {tooltip.text}
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center justify-end mt-4 gap-2 text-xs font-medium text-zinc-400">
        <span>Less</span>
        <div className="flex gap-1.5 items-center">
          <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: '#18181b' }}></div>
          <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: 'rgba(16, 185, 129, 0.4)' }}></div>
          <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: 'rgba(16, 185, 129, 0.7)' }}></div>
          <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: 'rgba(16, 185, 129, 1)' }}></div>
        </div>
        <span>More</span>
      </div>
      
    </div>
  );
}
