import { useMemo, useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';

const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

export default function GeoMap({ data }) {
  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const maxClicks = useMemo(() => {
    return Math.max(1, ...data.map(d => d.clicks));
  }, [data]);

  const colorScale = scaleLinear()
    .domain([0, maxClicks])
    .range(["#064e3b", "#34d399"]); // deep emerald to light emerald

  return (
    <div className="w-full h-full bg-zinc-900/40 backdrop-blur-2xl border border-emerald-500/10 rounded-3xl p-6 relative shadow-xl">
      <h3 className="text-xl font-bold mb-6 text-zinc-100">Global Clicks Map</h3>
      <div className="w-full h-80 relative" onMouseLeave={() => setTooltipContent('')}>
        <ComposableMap 
          projection="geoMercator" 
          projectionConfig={{ scale: 120 }} 
          width={800} 
          height={400}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) => 
              geographies.map((geo) => {
                const countryName = geo.properties.name;
                const d = data.find(s => s.country === countryName || s.country.includes(countryName) || countryName.includes(s.country));
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={d ? colorScale(d.clicks) : "#27272a"}
                    stroke="#18181b"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: "none", transition: "all 250ms" },
                      hover: { fill: d ? "#6ee7b7" : "#3f3f46", outline: "none", transition: "all 250ms" },
                      pressed: { outline: "none" },
                    }}
                    onMouseEnter={(e) => {
                      if (d) {
                        setTooltipContent(`${countryName}: ${d.clicks} clicks`);
                      } else {
                        setTooltipContent(`${countryName}: 0 clicks`);
                      }
                    }}
                    onMouseMove={(e) => {
                      setTooltipPos({ x: e.clientX, y: e.clientY });
                    }}
                    onMouseLeave={() => setTooltipContent('')}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </div>
      
      {tooltipContent && (
        <div 
          className="fixed bg-zinc-800 border border-emerald-500/30 text-zinc-100 text-xs font-bold py-1.5 px-3 rounded-lg shadow-2xl pointer-events-none z-50 transform -translate-x-1/2 -translate-y-[150%]"
          style={{ top: tooltipPos.y, left: tooltipPos.x }}
        >
          {tooltipContent}
        </div>
      )}
    </div>
  );
}
