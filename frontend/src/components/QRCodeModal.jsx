import { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Download } from 'lucide-react';
import FadeContent from './reactbits/FadeContent';

export default function QRCodeModal({ url, onClose }) {
  const [size, setSize] = useState(256); // M
  const [fgColor, setFgColor] = useState('#064e3b'); // Emerald-900 as default instead of black
  const svgRef = useRef(null);

  const handleDownloadSVG = () => {
    const svg = svgRef.current;
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const domUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = domUrl;
    link.download = 'qrcode.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPNG = () => {
    const svg = svgRef.current;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = size;
      canvas.height = size;
      ctx.fillStyle = '#ffffff'; // White background instead of transparent
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      
      const link = document.createElement('a');
      link.download = 'qrcode.png';
      link.href = pngFile;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm font-sans">
      <div className="absolute inset-0" onClick={onClose}></div>
      <FadeContent delay={0}>
        <div className="relative bg-zinc-900/60 backdrop-blur-2xl border border-emerald-500/20 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.05)] w-full max-w-md p-8 pt-10">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-zinc-500 hover:text-emerald-400 transition-colors bg-zinc-950/50 rounded-full p-2 border border-zinc-800"
          >
            <X size={20} />
          </button>
          
          <h2 className="text-2xl font-bold text-zinc-100 mb-6 text-center tracking-tight">Your QR Code</h2>
          
          <div className="flex justify-center mb-8 bg-zinc-100 p-4 rounded-2xl shadow-inner w-fit mx-auto border border-emerald-500/30">
            <QRCodeSVG 
              value={url} 
              size={size} 
              level="H" 
              fgColor={fgColor} 
              ref={svgRef}
              includeMargin={true}
            />
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Size</label>
              <div className="flex bg-zinc-950 border border-zinc-800 rounded-xl p-1">
                <button 
                  onClick={() => setSize(128)} 
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${size === 128 ? 'bg-emerald-500 text-zinc-950 shadow-md' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  Small
                </button>
                <button 
                  onClick={() => setSize(256)} 
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${size === 256 ? 'bg-emerald-500 text-zinc-950 shadow-md' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  Medium
                </button>
                <button 
                  onClick={() => setSize(512)} 
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${size === 512 ? 'bg-emerald-500 text-zinc-950 shadow-md' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  Large
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Color</label>
              <div className="flex items-center gap-3">
                <input 
                  type="color" 
                  value={fgColor} 
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-12 h-12 rounded-lg cursor-pointer border-0 bg-transparent p-0 flex-shrink-0"
                />
                <span className="text-emerald-400 font-mono text-sm bg-zinc-950 border border-zinc-800 px-3 py-2 rounded-lg">{fgColor}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-zinc-800/50">
              <button 
                onClick={handleDownloadPNG}
                className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 hover:text-emerald-400 text-zinc-100 py-3 px-4 rounded-xl transition-colors font-medium border border-zinc-700"
              >
                <Download size={18} /> PNG
              </button>
              <button 
                onClick={handleDownloadSVG}
                className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 py-3 px-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-95 font-bold shadow-[0_0_15px_rgba(245,158,11,0.2)]"
              >
                <Download size={18} /> SVG
              </button>
            </div>
          </div>
        </div>
      </FadeContent>
    </div>
  );
}
