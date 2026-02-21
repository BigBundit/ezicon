import { useEffect, useRef } from 'react';
import { drawIcon } from '../lib/icon-generator';

interface IconPreviewProps {
  image: HTMLImageElement | null;
  size: number;
  padding: number;
  backgroundColor: string;
  isTransparent: boolean;
  shape: 'square' | 'circle' | 'squircle';
  applyShape: boolean;
  label: string;
}

export function IconPreview({
  image,
  size,
  padding,
  backgroundColor,
  isTransparent,
  shape,
  applyShape,
  label
}: IconPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (image) {
      drawIcon(ctx, image, size, padding, backgroundColor, isTransparent, shape, applyShape);
    } else {
      // Draw placeholder
      ctx.clearRect(0, 0, size, size);
      ctx.fillStyle = '#f3f4f6';
      ctx.fillRect(0, 0, size, size);
      ctx.strokeStyle = '#d1d5db';
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, size, size);
      
      ctx.fillStyle = '#9ca3af';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('No Image', size / 2, size / 2);
    }
  }, [image, size, padding, backgroundColor, isTransparent, shape, applyShape]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div 
        className="relative border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
        style={{ width: size, height: size }}
      >
        <div className="absolute inset-0 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/nYDCgBDAm9BGDWAAJyRCgLaBCAAgXwixzAS0pgAAAABJRU5ErkJggg==')] opacity-20 pointer-events-none" />
        <canvas 
          ref={canvasRef} 
          width={size} 
          height={size}
          className="block relative z-10"
        />
      </div>
      <span className="text-xs font-bold font-mono text-black bg-yellow-300 px-2 py-1 border-2 border-black rounded-md shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
        {label} ({size}px)
      </span>
    </div>
  );
}
