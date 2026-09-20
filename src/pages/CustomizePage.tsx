import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Product,
  TShirtColor,
  TShirtSize,
  DesignOptionId,
  PrintType,
  DesignOption,
} from '../types';
import { TShirtPreview } from '../components/TShirtPreview';
import {
  Sparkles,
  ShoppingBag,
  Check,
  Zap,
  Star,
  Layers,
  HelpCircle,
  RotateCcw,
  ArrowRight,
  Shirt,
} from 'lucide-react';

const DESIGN_OPTIONS: { id: DesignOptionId; name: string; icon: string; desc: string }[] = [
  { id: 'none', name: 'No Artwork', icon: '⊘', desc: 'Minimal clean finish' },
  { id: 'minimal-star', name: 'Minimal Star', icon: '✦', desc: 'Celestial 8-point geometric star' },
  { id: 'lightning', name: 'Lightning', icon: '⚡', desc: 'Modern streetwear lightning stroke' },
  { id: 'floral', name: 'Floral', icon: '❀', desc: 'Botanical rose line-art emblem' },
  { id: 'abstract', name: 'Abstract', icon: '◈', desc: 'Bauhaus modern concentric vortex' },
  { id: 'heart', name: 'Heart', icon: '♥', desc: 'Minimalist linear heart contour' },
  { id: 'initials', name: 'Initials', icon: '🅲', desc: 'Bespoke monogram crest' },
];

const COLOR_OPTIONS: { name: TShirtColor; hex: string; desc: string }[] = [
  { name: 'Black', hex: '#15171C', desc: 'Deep Charcoal' },
  { name: 'White', hex: '#F4F5F7', desc: 'Pure Cotton' },
  { name: 'Navy Blue', hex: '#0F1E38', desc: 'Midnight Blue' },
  { name: 'Pink', hex: '#E89CB5', desc: 'Muted Rose' },
  { name: 'Grey', hex: '#6B7688', desc: 'Heather Slate' },
];

const SIZE_OPTIONS: TShirtSize[] = ['S', 'M', 'L', 'XL', 'XXL'];

export const CustomizePage: React.FC = () => {
  const { selectedProductId, setSelectedProductId, addToCart, navigateTo } = useApp();

  const [products, setProducts] = useState<Product[]>([]);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // Customization States
  const [selectedColor, setSelectedColor] = useState<TShirtColor>('Black');
  const [selectedSize, setSelectedSize] = useState<TShirtSize>('M');
  const [customText, setCustomText] = useState<string>('');
  const [textStyle, setTextStyle] = useState<'modern' | 'varsity' | 'serif' | 'script'>('modern');
  const [selectedDesign, setSelectedDesign] = useState<DesignOptionId>('minimal-star');
  const [printType, setPrintType] = useState<PrintType>('Standard Print');
  const [quantity, setQuantity] = useState<number>(1);

  // Fetch all products so user can switch base garment if desired
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProducts(data);
          const found = data.find((p: Product) => p.id === selectedProductId) || data[0];
          setCurrentProduct(found);
          if (found && found.available_colors?.length) {
            // keep existing color if supported, else pick first
            if (!found.available_colors.includes(selectedColor)) {
              setSelectedColor(found.available_colors[0]);
            }
          }
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load products for studio:', err);
        setLoading(false);
      });
  }, [selectedProductId]);

  const handleProductChange = (productId: string) => {
    setSelectedProductId(productId);
    const p = products.find(prod => prod.id === productId);
    if (p) {
      setCurrentProduct(p);
      if (p.available_colors && !p.available_colors.includes(selectedColor)) {
        setSelectedColor(p.available_colors[0]);
      }
    }
  };

  // Dynamic Pricing Calculation
  const basePrice = currentProduct?.base_price || 599;
  const textCharge = customText.trim().length > 0 ? 50 : 0;
  const designCharge = selectedDesign !== 'none' ? 100 : 0;
  const printCharge = printType === 'Premium Print' ? 100 : 0;

  const unitPrice = basePrice + textCharge + designCharge + printCharge;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    if (!currentProduct) return;

    addToCart({
      product_id: currentProduct.id,
      product_name: currentProduct.name,
      product_image: currentProduct.image,
      color: selectedColor,
      size: selectedSize,
      custom_text: customText.trim(),
      text_style: textStyle,
      design: selectedDesign === 'none' ? 'None' : (DESIGN_OPTIONS.find(d => d.id === selectedDesign)?.name || 'Custom'),
      print_type: printType,
      quantity,
      base_price: basePrice,
      text_charge: textCharge,
      design_charge: designCharge,
      print_charge: printCharge,
      unit_price: unitPrice,
      total_price: totalPrice,
    });
  };

  const handleReset = () => {
    setSelectedColor('Black');
    setSelectedSize('M');
    setCustomText('');
    setSelectedDesign('none');
    setPrintType('Standard Print');
    setQuantity(1);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center animate-pulse">
        <div className="h-12 w-64 bg-zinc-800 rounded mx-auto mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 h-[500px] bg-zinc-800/40 rounded-3xl" />
          <div className="lg:col-span-5 h-[500px] bg-zinc-800/40 rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div id="customization-studio-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 mb-8 border-b border-zinc-800 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-400 animate-pulse" />
            <span className="text-pink-400 text-xs font-bold tracking-widest uppercase">
              CustomCraft Studio • Direct-to-Garment
            </span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight uppercase">
            DESIGN & CUSTOMIZE STUDIO
          </h1>
        </div>

        {/* Base Garment Selector Pill */}
        <div className="flex items-center gap-2 bg-[#12151D] border border-zinc-800 rounded-xl px-3 py-1.5">
          <Shirt className="w-4 h-4 text-pink-400" />
          <span className="text-xs text-zinc-400 font-medium">Garment:</span>
          <select
            id="base-garment-select"
            value={currentProduct?.id || selectedProductId}
            onChange={e => handleProductChange(e.target.value)}
            className="bg-transparent text-xs text-white font-semibold focus:outline-none cursor-pointer"
          >
            {products.map(p => (
              <option key={p.id} value={p.id} className="bg-[#12151D] text-white">
                {p.name} (₹{p.base_price})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Studio Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Large Live T-Shirt Preview */}
        <div className="lg:col-span-7 lg:sticky lg:top-24 space-y-4">
          <div className="bg-[#12151D] border border-zinc-800 rounded-3xl p-4 md:p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-3 px-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  {currentProduct?.name || 'Classic Cotton Tee'}
                </span>
                <span className="text-[11px] font-mono text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded border border-pink-500/20">
                  {selectedColor} • {selectedSize}
                </span>
              </div>
              <button
                type="button"
                id="reset-customization-btn"
                onClick={handleReset}
                className="text-[11px] text-zinc-500 hover:text-zinc-300 flex items-center gap-1 transition"
                title="Reset customization"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Live TShirt Canvas Component */}
            <TShirtPreview
              color={selectedColor}
              size={selectedSize}
              customText={customText}
              textStyle={textStyle}
              design={selectedDesign}
              printType={printType}
              showGuides={true}
              compact={false}
            />

            {/* Dynamic Status Callout below preview */}
            <div className="mt-4 pt-3 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-400">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Print: {printType}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span>Motif: {DESIGN_OPTIONS.find(d => d.id === selectedDesign)?.name}</span>
              </span>
              <span className="flex items-center gap-1.5 font-mono text-zinc-300">
                Text: {customText.trim() ? `"${customText}"` : 'None'}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Customization Controls & Dynamic Pricing */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#12151D] border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-6">
            {/* Section A: Color Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-pink-500/20 text-pink-400 text-[10px] font-mono flex items-center justify-center">
                    A
                  </span>
                  <span>Fabric Color</span>
                </label>
                <span className="text-xs font-bold text-pink-400">{selectedColor}</span>
              </div>

              <div className="grid grid-cols-5 gap-2.5">
                {COLOR_OPTIONS.map(color => {
                  const isSelected = selectedColor === color.name;
                  return (
                    <button
                      key={color.name}
                      type="button"
                      id={`color-opt-${color.name.toLowerCase().replace(/\s+/g, '-')}`}
                      onClick={() => setSelectedColor(color.name)}
                      className={`flex flex-col items-center p-2 rounded-xl border transition-all ${
                        isSelected
                          ? 'border-pink-500 bg-pink-500/10 ring-1 ring-pink-500'
                          : 'border-zinc-800 bg-[#161B26] hover:border-zinc-700'
                      }`}
                    >
                      <span
                        className="w-7 h-7 rounded-full border border-white/20 shadow-inner flex items-center justify-center transition-transform hover:scale-105"
                        style={{ backgroundColor: color.hex }}
                      >
                        {isSelected && (
                          <Check
                            className={`w-3.5 h-3.5 ${
                              color.name === 'White' || color.name === 'Pink'
                                ? 'text-zinc-900'
                                : 'text-white'
                            }`}
                          />
                        )}
                      </span>
                      <span className="text-[10px] font-medium text-zinc-300 mt-1.5 whitespace-nowrap">
                        {color.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section B: Size Selection */}
            <div className="pt-4 border-t border-zinc-800/80">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-pink-500/20 text-pink-400 text-[10px] font-mono flex items-center justify-center">
                    B
                  </span>
                  <span>Size</span>
                </label>
                <span className="text-xs font-mono text-zinc-400">Regular Fit Standard</span>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {SIZE_OPTIONS.map(size => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      id={`size-opt-${size.toLowerCase()}`}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2.5 rounded-xl font-mono text-xs font-bold transition flex items-center justify-center border ${
                        isSelected
                          ? 'bg-pink-500 border-pink-500 text-white shadow-md shadow-pink-500/25'
                          : 'bg-[#161B26] border-zinc-800 text-zinc-300 hover:border-zinc-700'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section C: Custom Text Input */}
            <div className="pt-4 border-t border-zinc-800/80">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-pink-500/20 text-pink-400 text-[10px] font-mono flex items-center justify-center">
                    C
                  </span>
                  <span>Custom Chest Text (+₹50)</span>
                </label>
                <span className="text-[11px] font-mono text-zinc-500">
                  {customText.length}/30 chars
                </span>
              </div>

              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    id="custom-text-input"
                    maxLength={30}
                    value={customText}
                    onChange={e => setCustomText(e.target.value)}
                    placeholder="Enter your text (e.g. YUKTHA)"
                    className="w-full bg-[#161B26] border border-zinc-700 text-sm text-white placeholder-zinc-500 rounded-xl px-4 py-3 focus:outline-none focus:border-pink-500 font-mono tracking-wider"
                  />
                  {customText && (
                    <button
                      type="button"
                      onClick={() => setCustomText('')}
                      className="absolute right-3 top-3 text-zinc-400 hover:text-white text-xs p-1"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Typography style selection */}
                {customText.trim().length > 0 && (
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[11px] text-zinc-400 font-medium">Font:</span>
                    <div className="grid grid-cols-4 gap-1.5 flex-1">
                      {(
                        [
                          { id: 'modern', label: 'Bold Modern' },
                          { id: 'varsity', label: 'Varsity' },
                          { id: 'serif', label: 'Luxe Serif' },
                          { id: 'script', label: 'Script' },
                        ] as const
                      ).map(t => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setTextStyle(t.id)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-medium border transition ${
                            textStyle === t.id
                              ? 'border-pink-500 bg-pink-500/20 text-pink-300'
                              : 'border-zinc-800 bg-[#141722] text-zinc-400 hover:text-white'
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Section D: Design / Vector Motif */}
            <div className="pt-4 border-t border-zinc-800/80">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-pink-500/20 text-pink-400 text-[10px] font-mono flex items-center justify-center">
                    D
                  </span>
                  <span>Vector Motif Design (+₹100)</span>
                </label>
                <span className="text-xs font-mono text-zinc-400">
                  {selectedDesign !== 'none' ? '+₹100' : 'None'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {DESIGN_OPTIONS.map(design => {
                  const isSelected = selectedDesign === design.id;
                  return (
                    <button
                      key={design.id}
                      type="button"
                      id={`design-opt-${design.id}`}
                      onClick={() => setSelectedDesign(design.id)}
                      className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2.5 ${
                        isSelected
                          ? 'border-pink-500 bg-pink-500/10 ring-1 ring-pink-500'
                          : 'border-zinc-800 bg-[#161B26] hover:border-zinc-700'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                          isSelected
                            ? 'bg-pink-500 text-white'
                            : 'bg-zinc-800 text-zinc-300'
                        }`}
                      >
                        {design.icon}
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-xs font-bold text-white truncate">
                          {design.name}
                        </div>
                        <div className="text-[10px] text-zinc-500 truncate">
                          {design.id === 'none' ? 'Free' : '+₹100'}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section E: Print Type */}
            <div className="pt-4 border-t border-zinc-800/80">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-pink-500/20 text-pink-400 text-[10px] font-mono flex items-center justify-center">
                    E
                  </span>
                  <span>Print Type</span>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  id="print-type-standard"
                  onClick={() => setPrintType('Standard Print')}
                  className={`p-3 rounded-xl border text-left transition ${
                    printType === 'Standard Print'
                      ? 'border-pink-500 bg-pink-500/10 ring-1 ring-pink-500'
                      : 'border-zinc-800 bg-[#161B26] hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white">Standard Print</span>
                    <span className="text-[10px] font-mono text-zinc-400">+₹0</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-snug">
                    Breathable Direct-to-Garment water-based ink.
                  </p>
                </button>

                <button
                  type="button"
                  id="print-type-premium"
                  onClick={() => setPrintType('Premium Print')}
                  className={`p-3 rounded-xl border text-left transition ${
                    printType === 'Premium Print'
                      ? 'border-pink-500 bg-pink-500/10 ring-1 ring-pink-500'
                      : 'border-zinc-800 bg-[#161B26] hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white flex items-center gap-1">
                      <span>Premium Print</span>
                      <Sparkles className="w-3 h-3 text-pink-400" />
                    </span>
                    <span className="text-[10px] font-mono text-pink-400 font-bold">+₹100</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-snug">
                    HD textured vinyl with raised sheen & 50+ wash longevity.
                  </p>
                </button>
              </div>
            </div>

            {/* Dynamic Price Breakdown Box */}
            <div
              id="dynamic-price-box"
              className="pt-5 border-t border-zinc-800 bg-[#0E1118] -mx-6 -mb-6 p-6 rounded-b-3xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Dynamic Price Breakdown
                </span>
                <span className="text-[11px] text-emerald-400 font-mono">Live Calculated</span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between text-zinc-300">
                  <span>Base Price ({currentProduct?.name || 'Classic Tee'}):</span>
                  <span>₹{basePrice}</span>
                </div>

                <div className="flex items-center justify-between text-zinc-400">
                  <span>
                    Custom Text ({customText.trim() ? `"${customText.trim()}"` : 'None'}):
                  </span>
                  <span className={textCharge > 0 ? 'text-pink-400 font-bold' : ''}>
                    +{textCharge > 0 ? `₹${textCharge}` : '₹0'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-zinc-400">
                  <span>
                    Custom Design (
                    {DESIGN_OPTIONS.find(d => d.id === selectedDesign)?.name || 'None'}):
                  </span>
                  <span className={designCharge > 0 ? 'text-pink-400 font-bold' : ''}>
                    +{designCharge > 0 ? `₹${designCharge}` : '₹0'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-zinc-400">
                  <span>{printType}:</span>
                  <span className={printCharge > 0 ? 'text-pink-400 font-bold' : ''}>
                    +{printCharge > 0 ? `₹${printCharge}` : '₹0'}
                  </span>
                </div>

                <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-sm font-bold text-white font-mono">
                  <span>Unit Price:</span>
                  <span className="text-base text-pink-300">₹{unitPrice}</span>
                </div>
              </div>

              {/* Quantity selector & Add to Cart button */}
              <div className="pt-2 flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center bg-[#161B26] border border-zinc-700 rounded-xl p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-lg text-zinc-300 hover:bg-zinc-800 flex items-center justify-center font-bold text-sm"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-mono font-bold text-white">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-lg text-zinc-300 hover:bg-zinc-800 flex items-center justify-center font-bold text-sm"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  type="button"
                  id="add-to-cart-btn"
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-extrabold text-xs tracking-wider uppercase transition flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>ADD TO CART • ₹{totalPrice}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
