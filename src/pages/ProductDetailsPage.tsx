import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Product, TShirtColor, TShirtSize } from '../types';
import { Sparkles, Star, ShieldCheck, Truck, RefreshCw, ArrowLeft, Check } from 'lucide-react';

export const ProductDetailsPage: React.FC = () => {
  const { selectedProductId, navigateTo } = useApp();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeColor, setActiveColor] = useState<TShirtColor>('Black');
  const [activeSize, setActiveSize] = useState<TShirtSize>('M');

  useEffect(() => {
    setLoading(true);
    fetch(`/api/products/${selectedProductId}`)
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          setProduct(data);
          if (data.available_colors && data.available_colors.length > 0) {
            setActiveColor(data.available_colors[0]);
          }
          if (data.available_sizes && data.available_sizes.length > 0) {
            setActiveSize(data.available_sizes[0]);
          }
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching product details:', err);
        setLoading(false);
      });
  }, [selectedProductId]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center animate-pulse">
        <div className="h-96 bg-zinc-800/40 rounded-2xl max-w-2xl mx-auto mb-6" />
        <div className="h-6 w-48 bg-zinc-800 rounded mx-auto" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-white mb-3">Product Not Found</h2>
        <button
          type="button"
          onClick={() => navigateTo('products')}
          className="px-6 py-2.5 rounded-xl bg-pink-500 text-white text-xs font-bold uppercase tracking-wider"
        >
          Return to Products
        </button>
      </div>
    );
  }

  return (
    <div id="product-details-container" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back button */}
      <button
        type="button"
        id="back-to-catalog-btn"
        onClick={() => navigateTo('products')}
        className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white mb-6 uppercase tracking-wider font-semibold transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Products</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-[#12151D] border border-zinc-800 rounded-3xl p-6 md:p-10 shadow-2xl">
        {/* Left: Product Image */}
        <div className="lg:col-span-6 flex flex-col">
          <div className="relative aspect-[4/4.5] w-full rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800">
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />

            <div className="absolute top-4 left-4 px-2.5 py-1 rounded bg-black/75 backdrop-blur text-xs font-mono text-pink-300 uppercase tracking-wider border border-white/10">
              {product.category}
            </div>

            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/75 backdrop-blur text-xs font-semibold text-white flex items-center gap-1 border border-white/10">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>{product.rating || 4.8} ({product.reviews_count || 120} reviews)</span>
            </div>
          </div>
        </div>

        {/* Right: Product Details & Customize Now */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <span className="text-pink-400 text-xs font-bold tracking-widest uppercase block mb-1">
                CustomCraft Studio Garment
              </span>
              <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
                {product.name}
              </h1>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-white font-mono">
                ₹{product.base_price}
              </span>
              <span className="text-xs text-zinc-400">
                Base garment price (Customization charges calculated in studio)
              </span>
            </div>

            <p className="text-sm text-zinc-300 leading-relaxed pt-2">
              {product.description}
            </p>

            {/* Stock Availability */}
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                In Stock: {product.stock} units ready for instant printing
              </div>
            </div>

            {/* Available Colors preview */}
            <div className="pt-4 border-t border-zinc-800/80">
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                Available Fabric Colors:
              </label>
              <div className="flex items-center gap-3">
                {product.available_colors.map(col => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => setActiveColor(col)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition ${
                      activeColor === col
                        ? 'border-pink-500 bg-pink-500/10 text-white'
                        : 'border-zinc-700 bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white/20 inline-block"
                      style={{
                        backgroundColor:
                          col === 'Black'
                            ? '#15171C'
                            : col === 'White'
                            ? '#F4F5F7'
                            : col === 'Navy Blue'
                            ? '#0F1E38'
                            : col === 'Pink'
                            ? '#E89CB5'
                            : '#6B7688',
                      }}
                    />
                    <span>{col}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Available Sizes preview */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                Available Sizes:
              </label>
              <div className="flex items-center gap-2">
                {product.available_sizes.map(sz => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setActiveSize(sz)}
                    className={`w-10 h-10 rounded-xl font-mono text-xs font-bold transition flex items-center justify-center border ${
                      activeSize === sz
                        ? 'bg-pink-500 border-pink-500 text-white shadow-md shadow-pink-500/20'
                        : 'bg-[#181D28] border-zinc-700 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Customize Now Primary Action */}
          <div className="pt-6 border-t border-zinc-800 space-y-4">
            <button
              type="button"
              id="product-details-customize-now-btn"
              onClick={() => navigateTo('customize', { productId: product.id })}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-extrabold text-sm tracking-wider uppercase transition flex items-center justify-center gap-2.5 shadow-xl shadow-pink-500/25"
            >
              <Sparkles className="w-5 h-5" />
              <span>Customize Now</span>
            </button>

            <div className="grid grid-cols-2 gap-3 text-xs text-zinc-400 pt-2">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-pink-400 shrink-0" />
                <span>Pan-India 48hr Dispatch</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Premium Quality Guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
