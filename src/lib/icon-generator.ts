import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export type IconSize = {
  name: string;
  size: number;
  folder: string;
};

export const ANDROID_ICON_SIZES: IconSize[] = [
  { name: 'ic_launcher.png', size: 48, folder: 'mipmap-mdpi' },
  { name: 'ic_launcher_foreground.png', size: 48, folder: 'mipmap-mdpi' },
  { name: 'ic_launcher_round.png', size: 48, folder: 'mipmap-mdpi' },
  { name: 'ic_launcher.png', size: 72, folder: 'mipmap-hdpi' },
  { name: 'ic_launcher_foreground.png', size: 72, folder: 'mipmap-hdpi' },
  { name: 'ic_launcher_round.png', size: 72, folder: 'mipmap-hdpi' },
  { name: 'ic_launcher.png', size: 96, folder: 'mipmap-xhdpi' },
  { name: 'ic_launcher_foreground.png', size: 96, folder: 'mipmap-xhdpi' },
  { name: 'ic_launcher_round.png', size: 96, folder: 'mipmap-xhdpi' },
  { name: 'ic_launcher.png', size: 144, folder: 'mipmap-xxhdpi' },
  { name: 'ic_launcher_foreground.png', size: 144, folder: 'mipmap-xxhdpi' },
  { name: 'ic_launcher_round.png', size: 144, folder: 'mipmap-xxhdpi' },
  { name: 'ic_launcher.png', size: 192, folder: 'mipmap-xxxhdpi' },
  { name: 'ic_launcher_foreground.png', size: 192, folder: 'mipmap-xxxhdpi' },
  { name: 'ic_launcher_round.png', size: 192, folder: 'mipmap-xxxhdpi' },
  { name: 'ic_launcher-web.png', size: 512, folder: '.' }, // Play Store icon
];

interface GenerateOptions {
  image: HTMLImageElement;
  padding: number; // 0 to 0.5 (0% to 50%)
  backgroundColor: string; // hex or rgba
  isTransparent: boolean;
  shape: 'square' | 'circle' | 'squircle'; // For masking if applied
  applyShape: boolean; // Whether to actually crop the output image
}

export function drawIcon(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  size: number,
  padding: number, // 0 to 0.5
  backgroundColor: string,
  isTransparent: boolean,
  shape: 'square' | 'circle' | 'squircle',
  applyShape: boolean
) {
  const width = size;
  const height = size;

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  // Draw background
  if (!isTransparent) {
    ctx.fillStyle = backgroundColor;
    
    if (applyShape) {
      drawShapePath(ctx, width, height, shape);
      ctx.fill();
    } else {
      ctx.fillRect(0, 0, width, height);
    }
  }

  // Calculate dimensions with padding
  const paddingPx = size * padding;
  const drawSize = size - (paddingPx * 2);
  
  // Save context for clipping if shape applied to image
  ctx.save();

  if (applyShape) {
      drawShapePath(ctx, width, height, shape);
      ctx.clip();
  }

  // Draw image centered
  ctx.drawImage(
    image, 
    paddingPx, 
    paddingPx, 
    drawSize, 
    drawSize
  );

  ctx.restore();
}

export const generateIcons = async (
  image: HTMLImageElement,
  options: {
    padding: number;
    backgroundColor: string;
    isTransparent: boolean;
    shape: 'square' | 'circle' | 'squircle';
    applyShape: boolean;
  }
) => {
  const zip = new JSZip();
  // Create mipmap folders
  const sizes = ANDROID_ICON_SIZES;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('No canvas context');

  for (const iconSize of sizes) {
    canvas.width = iconSize.size;
    canvas.height = iconSize.size;
    
    drawIcon(
      ctx,
      image,
      iconSize.size,
      options.padding,
      options.backgroundColor,
      options.isTransparent,
      options.shape,
      options.applyShape
    );

    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
    if (blob) {
      if (iconSize.folder === '.') {
        zip.file(iconSize.name, blob);
      } else {
        zip.folder('res')?.folder(iconSize.folder)?.file(iconSize.name, blob);
      }
    }
  }

  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, 'android_icons.zip');
};

function drawShapePath(ctx: CanvasRenderingContext2D, width: number, height: number, shape: 'square' | 'circle' | 'squircle') {
  ctx.beginPath();
  const centerX = width / 2;
  const centerY = height / 2;
  const size = Math.min(width, height);

  if (shape === 'circle') {
    ctx.arc(centerX, centerY, size / 2, 0, Math.PI * 2);
  } else if (shape === 'squircle') {
    // Squircle path
    const radius = size * 0.22; 
    const x = 0;
    const y = 0;
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + size - radius, y);
    ctx.quadraticCurveTo(x + size, y, x + size, y + radius);
    ctx.lineTo(x + size, y + size - radius);
    ctx.quadraticCurveTo(x + size, y + size, x + size - radius, y + size);
    ctx.lineTo(x + radius, y + size);
    ctx.quadraticCurveTo(x, y + size, x, y + size - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
  } else {
    ctx.rect(0, 0, width, height);
  }
  ctx.closePath();
}
