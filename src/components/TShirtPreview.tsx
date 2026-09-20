import React, { useState } from 'react';
import { TShirtColor, DesignOptionId, PrintType } from '../types';
import { ZoomIn, ZoomOut, Eye, ShieldCheck, Sparkles } from 'lucide-react';

interface TShirtPreviewProps {
  color: TShirtColor;
  size: string;
  customText: string;
  textStyle?: 'modern' | 'varsity' | 'serif' | 'script';
  textColor?: 'white' | 'charcoal' | 'gold' | 'soft-pink';
  design: DesignOptionId;
  printType: PrintType;
  showGuides?: boolean;
  className?: string;
  compact?: boolean;
}

// Color hex codes and shading presets
export const COLOR_CONFIG: Record<
  TShirtColor,
  {
    base: string;
    collar: string;
    shadow: string;
    highlight: string;
    seam: string;
    defaultTextColor: string;
    badgeBg: string;
  }
> = {
  Black: {
    base: '#15171C',
    collar: '#0D0E12',
    shadow: '#07080A',
    highlight: '#2B2F38',
    seam: '#252932',
    defaultTextColor: '#F9FAFB',
    badgeBg: 'bg-[#15171C] text-white border-zinc-700',
  },
  White: {
    base: '#F4F5F7',
    collar: '#E2E5E9',
    shadow: '#C5CBD3',
    highlight: '#FFFFFF',
    seam: '#D3D8E0',
    defaultTextColor: '#111827',
    badgeBg: 'bg-white text-zinc-900 border-zinc-300',
  },
  'Navy Blue': {
    base: '#0F1E38',
    collar: '#0A1324',
    shadow: '#060B14',
    highlight: '#1E355F',
    seam: '#192C4D',
    defaultTextColor: '#F9FAFB',
    badgeBg: 'bg-[#0F1E38] text-blue-100 border-blue-800',
  },
  Pink: {
    base: '#E89CB5',
    collar: '#D47E9A',
    shadow: '#AD5975',
    highlight: '#FAD1DE',
    seam: '#BF6C87',
    defaultTextColor: '#1F1318',
    badgeBg: 'bg-[#E89CB5] text-pink-950 border-pink-300',
  },
  Grey: {
    base: '#6B7688',
    collar: '#565F6E',
    shadow: '#3D4450',
    highlight: '#8E9AA0',
    seam: '#4F5765',
    defaultTextColor: '#F9FAFB',
    badgeBg: 'bg-[#6B7688] text-white border-zinc-500',
  },
};

export const TShirtPreview: React.FC<TShirtPreviewProps> = ({
  color,
  size,
  customText,
  textStyle = 'modern',
  textColor,
  design,
  printType,
  showGuides: initialShowGuides = false,
  className = '',
  compact = false,
}) => {
  const [view, setView] = useState<'front' | 'back'>('front');
  const [isZoomed, setIsZoomed] = useState(false);
  const [showPrintArea, setShowPrintArea] = useState(initialShowGuides);

  const colors = COLOR_CONFIG[color] || COLOR_CONFIG['Black'];

  // Determine rendered text color
  const resolvedTextColor = textColor
    ? textColor === 'white'
      ? '#FFFFFF'
      : textColor === 'charcoal'
      ? '#111827'
      : textColor === 'gold'
      ? '#F59E0B'
      : '#F472B6'
    : colors.defaultTextColor;

  // Text Font Family
  const fontClass =
    textStyle === 'varsity'
      ? 'font-mono font-black tracking-widest uppercase'
      : textStyle === 'serif'
      ? 'font-serif font-bold tracking-wider'
      : textStyle === 'script'
      ? 'italic font-medium tracking-wide'
      : 'font-sans font-extrabold tracking-tight uppercase';

  // Render Tasteful Vector Design Graphics
  const renderDesignGraphic = () => {
    const isDarkShirt = color === 'Black' || color === 'Navy Blue' || color === 'Grey';
    const graphicColor = isDarkShirt ? '#FFFFFF' : '#181C24';
    const accentPink = '#F472B6';

    switch (design) {
      case 'minimal-star':
        return (
          <svg className="w-16 h-16 md:w-20 md:h-20 mx-auto drop-shadow-sm" viewBox="0 0 100 100" fill="none">
            {/* 8-point celestial star */}
            <path
              d="M50 0L58 35L95 38L65 60L77 95L50 72L23 95L35 60L5 38L42 35Z"
              fill={graphicColor}
              opacity="0.95"
            />
            <circle cx="50" cy="50" r="6" fill={accentPink} />
            <circle cx="50" cy="50" r="16" stroke={graphicColor} strokeWidth="1.5" strokeDasharray="3 3" />
          </svg>
        );

      case 'lightning':
        return (
          <svg className="w-14 h-14 md:w-16 md:h-16 mx-auto drop-shadow-md" viewBox="0 0 100 100" fill="none">
            <path
              d="M55 5L20 55H48L38 95L80 42H50L65 5Z"
              fill={graphicColor}
              stroke={accentPink}
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <path d="M45 28L32 50H50L44 72L66 42H48L55 28Z" fill={accentPink} opacity="0.3" />
          </svg>
        );

      case 'floral':
        return (
          <svg className="w-16 h-16 md:w-20 md:h-20 mx-auto drop-shadow-sm" viewBox="0 0 100 100" fill="none">
            <path
              d="M50 20C42 10 30 15 32 30C20 32 18 45 28 52C20 62 28 75 42 70C46 80 54 80 58 70C72 75 80 62 72 52C82 45 80 32 68 30C70 15 58 10 50 20Z"
              stroke={graphicColor}
              strokeWidth="2.5"
              fill={graphicColor}
              fillOpacity="0.12"
            />
            <circle cx="50" cy="46" r="8" fill={accentPink} />
            <path d="M50 70V95M42 82C46 82 50 86 50 86M58 78C54 78 50 82 50 82" stroke={graphicColor} strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        );

      case 'abstract':
        return (
          <svg className="w-16 h-16 md:w-20 md:h-20 mx-auto drop-shadow-sm" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="38" stroke={graphicColor} strokeWidth="2" strokeDasharray="5 3" />
            <circle cx="50" cy="50" r="26" stroke={accentPink} strokeWidth="3" />
            <rect x="36" y="36" width="28" height="28" transform="rotate(45 50 50)" fill={graphicColor} opacity="0.9" />
            <circle cx="50" cy="50" r="4" fill={isDarkShirt ? '#121418' : '#FFFFFF'} />
          </svg>
        );

      case 'heart':
        return (
          <svg className="w-14 h-14 md:w-16 md:h-16 mx-auto drop-shadow-sm" viewBox="0 0 100 100" fill="none">
            <path
              d="M50 88L43.5 82C20.5 61 5 47 5 30C5 16 16 5 30 5C38 5 45.5 9 50 15C54.5 9 62 5 70 5C84 5 95 16 95 30C95 47 79.5 61 56.5 82L50 88Z"
              fill={graphicColor}
              stroke={accentPink}
              strokeWidth="3"
            />
            <path d="M28 22C23 25 20 32 20 38" stroke={accentPink} strokeWidth="3" strokeLinecap="round" />
          </svg>
        );

      case 'initials':
        const initialsText = customText.trim() ? customText.trim().substring(0, 2).toUpperCase() : 'CC';
        return (
          <div className="flex flex-col items-center justify-center">
            <div
              className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 flex items-center justify-center relative shadow-inner"
              style={{
                borderColor: graphicColor,
                backgroundColor: `${graphicColor}15`,
              }}
            >
              <div
                className="w-12 h-12 rounded-full border border-dashed flex items-center justify-center"
                style={{ borderColor: accentPink }}
              >
                <span
                  className="font-serif font-black text-xl md:text-2xl"
                  style={{ color: graphicColor }}
                >
                  {initialsText}
                </span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      id="tshirt-studio-preview"
      className={`relative flex flex-col items-center justify-center select-none ${className}`}
    >
      {/* Top Toolbar (only if not compact) */}
      {!compact && (
        <div className="w-full flex items-center justify-between px-3 py-2 bg-[#12151D]/90 backdrop-blur border border-zinc-800 rounded-t-xl z-20 text-xs text-zinc-300">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 font-medium text-zinc-200">
              <span
                className="w-2.5 h-2.5 rounded-full border border-white/20"
                style={{ backgroundColor: colors.base }}
              />
              {color} • {size}
            </span>
            {printType === 'Premium Print' && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-pink-500/10 text-pink-300 text-[10px] font-semibold border border-pink-500/30">
                <Sparkles className="w-2.5 h-2.5" />
                HD Vinyl
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              id="toggle-print-guides"
              onClick={() => setShowPrintArea(!showPrintArea)}
              title="Toggle Print Boundary"
              className={`p-1.5 rounded transition ${
                showPrintArea ? 'bg-pink-500/20 text-pink-400' : 'hover:bg-zinc-800 text-zinc-400'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              id="toggle-zoom"
              onClick={() => setIsZoomed(!isZoomed)}
              title="Toggle Zoom"
              className={`p-1.5 rounded transition ${
                isZoomed ? 'bg-zinc-700 text-white' : 'hover:bg-zinc-800 text-zinc-400'
              }`}
            >
              {isZoomed ? <ZoomOut className="w-3.5 h-3.5" /> : <ZoomIn className="w-3.5 h-3.5" />}
            </button>
            <div className="h-3 w-px bg-zinc-700 mx-1" />
            <div className="flex bg-[#0B0D11] p-0.5 rounded border border-zinc-800">
              <button
                type="button"
                id="view-front-btn"
                onClick={() => setView('front')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
                  view === 'front' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Front
              </button>
              <button
                type="button"
                id="view-back-btn"
                onClick={() => setView('back')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
                  view === 'back' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Canvas Area */}
      <div
        className={`relative w-full aspect-[4/4.5] flex items-center justify-center overflow-hidden transition-all duration-300 ${
          compact ? 'p-1' : 'p-4 md:p-8 bg-[#0E1118]/80 border-x border-b border-zinc-800 rounded-b-xl'
        }`}
      >
        {/* Subtle grid and lighting atmosphere */}
        <div className="absolute inset-0 bg-fabric-pattern opacity-40 pointer-events-none" />
        <div className="absolute inset-0 bg-radial from-white/[0.04] to-transparent pointer-events-none" />

        {/* Outer Shadow Pod */}
        <div
          className="absolute bottom-6 w-3/4 h-8 rounded-[100%] bg-black/40 blur-md pointer-events-none"
          style={{
            transform: isZoomed ? 'scale(1.3)' : 'scale(1)',
            transition: 'transform 0.3s ease',
          }}
        />

        {/* T-Shirt Vector Mockup Container */}
        <div
          className="relative w-full max-w-[420px] aspect-[4/4.3] flex items-center justify-center transition-transform duration-300"
          style={{
            transform: isZoomed ? 'scale(1.35) translateY(12%)' : 'scale(1)',
          }}
        >
          {/* SVG Real T-Shirt Silhouette with Layered Shading */}
          <svg
            viewBox="0 0 500 550"
            className="w-full h-full filter drop-shadow-xl"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Dynamic Fabric Base Gradient */}
              <linearGradient id={`shirtGrad-${color}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={colors.shadow} />
                <stop offset="15%" stopColor={colors.base} />
                <stop offset="50%" stopColor={colors.highlight} />
                <stop offset="85%" stopColor={colors.base} />
                <stop offset="100%" stopColor={colors.shadow} />
              </linearGradient>

              {/* Front Neck Ribbing Gradient */}
              <linearGradient id={`collarGrad-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={colors.shadow} />
                <stop offset="100%" stopColor={colors.collar} />
              </linearGradient>

              {/* Sleeve fold shadow */}
              <linearGradient id="sleeveFoldShadow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#000000" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.0" />
              </linearGradient>

              {/* Torso lighting / wrinkle overlay */}
              <linearGradient id="bodyCrease" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.1" />
                <stop offset="60%" stopColor="#000000" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.3" />
              </linearGradient>
            </defs>

            {/* Back Neck Inner Line when viewing Front */}
            {view === 'front' && (
              <path
                d="M195 72 C225 96 275 96 305 72 C295 60 205 60 195 72 Z"
                fill={colors.collar}
                stroke={colors.shadow}
                strokeWidth="1.5"
              />
            )}

            {/* Main T-Shirt Body & Sleeves Path */}
            <path
              d="M175 70 
                 C188 71 210 88 250 88 
                 C290 88 312 71 325 70 
                 L405 110 
                 C418 116 438 132 445 152 
                 L485 240 
                 C492 255 480 272 460 268 
                 L418 245 
                 C408 240 398 238 392 245 
                 L382 485 
                 C382 505 365 515 345 515 
                 L155 515 
                 C135 515 118 505 118 485 
                 L108 245 
                 C102 238 92 240 82 245 
                 L40 268 
                 C20 272 8 255 15 240 
                 L55 152 
                 C62 132 82 116 95 110 
                 Z"
              fill={`url(#shirtGrad-${color})`}
              stroke={colors.seam}
              strokeWidth="2"
            />

            {/* Shading/Depth Wrinkles & Texture Overlays */}
            <path
              d="M175 70 C210 88 250 88 325 70 L405 110 L485 240 L418 245 L382 485 L155 515 L118 485 L108 245 L40 268 L15 240 L95 110 Z"
              fill="url(#bodyCrease)"
              style={{ mixBlendMode: 'multiply' }}
            />

            {/* Armpit fold shadows */}
            <path
              d="M108 245 Q125 265 140 250"
              stroke="#000000"
              strokeWidth="4"
              strokeLinecap="round"
              opacity="0.3"
            />
            <path
              d="M392 245 Q375 265 360 250"
              stroke="#000000"
              strokeWidth="4"
              strokeLinecap="round"
              opacity="0.3"
            />

            {/* Left sleeve crease */}
            <path
              d="M95 110 L115 240"
              stroke="#000000"
              strokeWidth="2"
              strokeDasharray="2 3"
              opacity="0.2"
            />
            {/* Right sleeve crease */}
            <path
              d="M405 110 L385 240"
              stroke="#000000"
              strokeWidth="2"
              strokeDasharray="2 3"
              opacity="0.2"
            />

            {/* Crew Neckline Collar Band */}
            {view === 'front' ? (
              <path
                d="M175 70 C195 110 305 110 325 70 C305 95 195 95 175 70 Z"
                fill={`url(#collarGrad-${color})`}
                stroke={colors.seam}
                strokeWidth="2.5"
              />
            ) : (
              <path
                d="M175 70 C220 80 280 80 325 70 C285 64 215 64 175 70 Z"
                fill={`url(#collarGrad-${color})`}
                stroke={colors.seam}
                strokeWidth="2"
              />
            )}

            {/* Hem double needle stitch detail */}
            <path
              d="M125 500 L375 500"
              stroke={colors.seam}
              strokeWidth="1.5"
              strokeDasharray="4 2"
              opacity="0.6"
            />
            <path
              d="M125 506 L375 506"
              stroke={colors.seam}
              strokeWidth="1.5"
              strokeDasharray="4 2"
              opacity="0.6"
            />
          </svg>

          {/* FRONT VIEW: Live Custom Print Area */}
          {view === 'front' ? (
            <div
              className={`absolute top-[28%] left-[27%] w-[46%] h-[42%] flex flex-col items-center justify-center p-2 text-center pointer-events-none transition-all duration-200 ${
                showPrintArea ? 'border-2 border-dashed border-pink-400/70 bg-pink-500/5 rounded-lg' : ''
              }`}
            >
              {showPrintArea && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-pink-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full tracking-wider uppercase">
                  Print Area
                </span>
              )}

              {/* Visual Design Element */}
              {design && design !== 'none' && (
                <div
                  className={`relative transition-all duration-300 transform ${
                    printType === 'Premium Print' ? 'scale-105' : 'scale-100'
                  }`}
                  style={{
                    filter:
                      printType === 'Premium Print'
                        ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.5)) drop-shadow(0 0 8px rgba(244,114,182,0.3))'
                        : 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))',
                  }}
                >
                  {renderDesignGraphic()}
                </div>
              )}

              {/* Custom Text Element */}
              {customText.trim() && (
                <div
                  className={`mt-2.5 max-w-full px-2 text-center transition-all duration-200 ${fontClass}`}
                  style={{
                    color: resolvedTextColor,
                    fontSize:
                      customText.length > 20
                        ? '0.85rem'
                        : customText.length > 12
                        ? '1.05rem'
                        : customText.length > 6
                        ? '1.25rem'
                        : '1.45rem',
                    lineHeight: '1.2',
                    wordBreak: 'break-word',
                    textShadow:
                      printType === 'Premium Print'
                        ? '0 1px 2px rgba(0,0,0,0.8), 0 0 10px rgba(244,114,182,0.35)'
                        : '0 1px 2px rgba(0,0,0,0.6)',
                  }}
                >
                  {customText}
                </div>
              )}

              {/* Empty placeholder state if nothing is selected */}
              {(!design || design === 'none') && !customText.trim() && (
                <div className="flex flex-col items-center justify-center opacity-30 text-center">
                  <div className="w-10 h-10 border border-dashed border-current rounded-md flex items-center justify-center mb-1">
                    <span className="text-base font-bold">+</span>
                  </div>
                  <span className="text-[10px] tracking-wider uppercase font-semibold">
                    Customize Chest
                  </span>
                </div>
              )}
            </div>
          ) : (
            /* BACK VIEW: CustomCraft Neck Tag & Minimal Branding */
            <div className="absolute top-[18%] left-[34%] w-[32%] flex flex-col items-center justify-center text-center pointer-events-none opacity-80">
              <div className="px-3 py-1.5 rounded bg-black/40 border border-white/10 text-center">
                <span className="text-[10px] font-display font-bold tracking-widest text-zinc-300 block">
                  CUSTOMCRAFT
                </span>
                <span className="text-[8px] text-zinc-400 font-mono tracking-wider block">
                  100% COMBED COTTON • {size}
                </span>
                <span className="text-[7px] text-pink-400 font-mono block">
                  MADE TO ORDER
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Live Badge Indicator */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0B0D11]/90 border border-zinc-800 text-[11px] text-zinc-300 shadow-md">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Live 1:1 Rendering</span>
        </div>
      </div>
    </div>
  );
};
