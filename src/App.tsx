/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback } from 'react';
import type { ChangeEvent, DragEvent } from 'react';
import { Upload, Download, RefreshCw, Image as ImageIcon, Settings, Layers } from 'lucide-react';
import { IconPreview } from './components/IconPreview';
import { generateIcons } from './lib/icon-generator';
import { cn } from './lib/utils';

export default function App() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [padding, setPadding] = useState(0);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [isTransparent, setIsTransparent] = useState(true);
  const [shape, setShape] = useState<'legacy' | 'round' | 'squircle'>('legacy');
  const [applyShape, setApplyShape] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => setImage(img);
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => setImage(img);
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleDownload = async () => {
    if (!image) return;
    setIsGenerating(true);
    try {
      await generateIcons(image, {
        padding,
        backgroundColor,
        isTransparent,
        shape,
        applyShape
      });
    } catch (error) {
      console.error('Failed to generate icons', error);
      alert('Failed to generate icons. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF4E0] text-black font-sans selection:bg-pink-300">
      {/* Header */}
      <header className="bg-white border-b-4 border-black sticky top-0 z-20 shadow-[0px_4px_0px_0px_rgba(0,0,0,0.1)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-pink-400 p-2.5 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <Layers className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-black italic transform -rotate-2">EzIcon</h1>
              <p className="text-xs font-bold text-gray-600 -mt-1 ml-1">Android Icon Generator</p>
            </div>
          </div>
          
          <div className="flex flex-col items-end">
             <div className="bg-yellow-300 px-3 py-1 rounded-lg border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transform rotate-2 hover:rotate-0 transition-transform">
                <span className="text-sm font-bold">สร้างโดย : BigBundit</span>
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Controls */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Upload Card */}
            <div className="bg-white rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
              <div className="p-4 border-b-4 border-black bg-blue-300 flex items-center gap-2">
                <Upload className="w-5 h-5 text-black" />
                <h2 className="font-black text-lg text-black uppercase tracking-wide">1. Source Image</h2>
              </div>
              <div className="p-6 bg-white">
                <div 
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  onDrop={handleDrop}
                  className={cn(
                    "border-4 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer group",
                    image 
                      ? "border-green-500 bg-green-50" 
                      : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"
                  )}
                >
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    className="hidden" 
                    id="icon-upload"
                  />
                  <label htmlFor="icon-upload" className="cursor-pointer w-full h-full flex flex-col items-center">
                    {image ? (
                      <>
                        <div className="w-24 h-24 mb-4 object-contain rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white p-2">
                          <img src={image.src} alt="Source" className="w-full h-full object-contain" />
                        </div>
                        <p className="text-base font-bold text-black truncate max-w-[200px] bg-yellow-200 px-2 border border-black rounded">{fileName}</p>
                        <p className="text-xs font-bold text-gray-500 mt-2 group-hover:text-blue-600">Click to replace</p>
                      </>
                    ) : (
                      <>
                        <div className="bg-blue-100 p-4 rounded-full mb-4 border-2 border-black group-hover:scale-110 transition-transform">
                          <ImageIcon className="w-10 h-10 text-blue-600" />
                        </div>
                        <p className="text-base font-bold text-black">Click to upload</p>
                        <p className="text-xs font-bold text-gray-500 mt-1">or drag and drop PNG/JPG</p>
                      </>
                    )}
                  </label>
                </div>
              </div>
            </div>

            {/* Adjustments Card */}
            <div className="bg-white rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
              <div className="p-4 border-b-4 border-black bg-green-300 flex items-center gap-2">
                <Settings className="w-5 h-5 text-black" />
                <h2 className="font-black text-lg text-black uppercase tracking-wide">2. Adjustments</h2>
              </div>
              <div className="p-6 space-y-6 bg-white">
                
                {/* Padding */}
                <div>
                  <div className="flex justify-between mb-2 items-center">
                    <label className="text-sm font-bold text-black uppercase">Padding</label>
                    <span className="text-xs font-black font-mono bg-black text-white px-2 py-0.5 rounded">{Math.round(padding * 100)}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="0.5" 
                    step="0.01" 
                    value={padding} 
                    onChange={(e) => setPadding(parseFloat(e.target.value))}
                    className="w-full accent-black h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer border-2 border-black"
                  />
                </div>

                {/* Background */}
                <div>
                  <label className="text-sm font-bold text-black block mb-2 uppercase">Background</label>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setIsTransparent(!isTransparent)}
                      className={cn(
                        "flex-1 py-2 px-3 rounded-xl text-sm font-bold border-2 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none",
                        isTransparent 
                          ? "bg-pink-400 border-black text-white" 
                          : "bg-white border-black text-black hover:bg-gray-50"
                      )}
                    >
                      Transparent
                    </button>
                    <div className={cn(
                      "flex items-center gap-2 flex-1 transition-opacity",
                      isTransparent ? "opacity-50 pointer-events-none" : "opacity-100"
                    )}>
                      <div className="relative w-10 h-10 rounded-lg border-2 border-black overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <input 
                          type="color" 
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer p-0 border-0"
                        />
                      </div>
                      <span className="text-xs font-mono font-bold text-black bg-white border border-black px-1 rounded">{backgroundColor}</span>
                    </div>
                  </div>
                </div>

                {/* Shape Mask */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-bold text-black uppercase">Shape Mask</label>
                    <div className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded-lg border border-black">
                        <input 
                            type="checkbox" 
                            id="applyShape"
                            checked={applyShape}
                            onChange={(e) => setApplyShape(e.target.checked)}
                            className="w-4 h-4 text-black rounded border-black focus:ring-0 focus:ring-offset-0"
                        />
                        <label htmlFor="applyShape" className="text-xs font-bold text-black select-none cursor-pointer">Crop</label>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {(['legacy', 'squircle', 'round'] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => setShape(s)}
                        className={cn(
                          "p-2 border-2 rounded-xl flex flex-col items-center gap-1 transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-[3px] active:shadow-none",
                          shape === s 
                            ? "border-black bg-yellow-300 text-black" 
                            : "border-black bg-white hover:bg-gray-50 text-gray-600"
                        )}
                      >
                        <div className={cn(
                          "w-6 h-6 bg-current opacity-80 border border-black",
                          s === 'round' && "rounded-full",
                          s === 'squircle' && "rounded-[22%]",
                          s === 'legacy' && "rounded-none"
                        )} />
                        <span className="text-[10px] uppercase font-black">{s}</span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Action */}
            <button
              onClick={handleDownload}
              disabled={!image || isGenerating}
              className={cn(
                "w-full py-4 px-6 rounded-2xl font-black text-lg text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border-4 border-black transition-all flex items-center justify-center gap-3 uppercase tracking-wider",
                !image || isGenerating
                  ? "bg-gray-400 cursor-not-allowed shadow-none border-gray-600" 
                  : "bg-purple-600 hover:bg-purple-500 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              )}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-6 h-6 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-6 h-6" />
                  Download ZIP
                </>
              )}
            </button>

          </div>

          {/* Right Column: Preview */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden min-h-[600px]">
              <div className="p-5 border-b-4 border-black bg-yellow-300 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-black p-1.5 rounded-lg">
                    <ImageIcon className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="font-black text-xl text-black uppercase tracking-wide">Preview</h2>
                </div>
                <span className="text-xs font-bold text-black bg-white px-3 py-1 rounded-full border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  All standard mipmap sizes
                </span>
              </div>
              
              <div className="p-8 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNlNTVhNTQiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] h-full">
                {image ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-12 justify-items-center items-end pb-12">
                    <IconPreview 
                      image={image} 
                      size={192} 
                      padding={padding} 
                      backgroundColor={backgroundColor} 
                      isTransparent={isTransparent}
                      shape={shape}
                      applyShape={applyShape}
                      label="xxxhdpi"
                    />
                    <IconPreview 
                      image={image} 
                      size={144} 
                      padding={padding} 
                      backgroundColor={backgroundColor} 
                      isTransparent={isTransparent}
                      shape={shape}
                      applyShape={applyShape}
                      label="xxhdpi"
                    />
                    <IconPreview 
                      image={image} 
                      size={96} 
                      padding={padding} 
                      backgroundColor={backgroundColor} 
                      isTransparent={isTransparent}
                      shape={shape}
                      applyShape={applyShape}
                      label="xhdpi"
                    />
                    <IconPreview 
                      image={image} 
                      size={72} 
                      padding={padding} 
                      backgroundColor={backgroundColor} 
                      isTransparent={isTransparent}
                      shape={shape}
                      applyShape={applyShape}
                      label="hdpi"
                    />
                    <IconPreview 
                      image={image} 
                      size={48} 
                      padding={padding} 
                      backgroundColor={backgroundColor} 
                      isTransparent={isTransparent}
                      shape={shape}
                      applyShape={applyShape}
                      label="mdpi"
                    />
                    <div className="col-span-2 sm:col-span-3 mt-8 pt-8 border-t-4 border-dashed border-black/20 w-full flex flex-col items-center">
                        <IconPreview 
                        image={image} 
                        size={512} 
                        padding={padding} 
                        backgroundColor={backgroundColor} 
                        isTransparent={isTransparent}
                        shape={shape}
                        applyShape={applyShape}
                        label="Play Store"
                        />
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 min-h-[400px]">
                    <div className="relative">
                      <div className="absolute -inset-4 bg-yellow-200 rounded-full blur-xl opacity-50 animate-pulse"></div>
                      <ImageIcon className="w-24 h-24 mb-4 text-black opacity-20 relative z-10" />
                    </div>
                    <p className="text-xl font-black text-black opacity-40 uppercase tracking-widest">Upload Image</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
