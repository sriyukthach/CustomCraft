import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Product, TShirtColor } from '../types';
import { TShirtPreview } from '../components/TShirtPreview';
import { ArrowRight, Sparkles, Layers, Sliders, ShieldCheck, Star } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { navigateTo } = useApp();
  const [heroColor, setHeroColor] = useState<TShirtColor>('Navy Blue');
  const [heroText, setHeroText] = useState('CUSTOM');
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products?category=T-SHIRTS')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setFeaturedProducts(data.slice(0, 3));
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load featured products:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div id="home-page" className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24 border-b border-zinc-800/80 bg-gradient-to-b from-[#0F141F]/60 via-[#0B0D11] to-[#0B0D11]">
        {/* Ambient background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-900/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-semibold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                Customizable Fashion Platform
              </div>

              <h1 className="font-display font-extrabold text-4xl sm:text-6xl xl:text-7xl leading-[1.05] tracking-tight text-white uppercase">
                CREATE IT. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-pink-300">
                  CUSTOMIZE IT.
                </span>{' '}
                <br />
                CART IT.
              </h1>

              <p className="text-base sm:text-lg text-zinc-400 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Design products that are uniquely yours. Choose premium combed cotton, personalize your colors, type your custom text, select modern vector motifs, and watch your garment evolve live.
              </p>

              {/* Call to Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  type="button"
                  id="hero-start-creating-btn"
                  onClick={() => navigateTo('customize', { productId: 'classic-cotton-tee' })}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 font-bold text-sm tracking-wider uppercase transition flex items-center justify-center gap-2 shadow-lg hover:shadow-white/10"
                >
                  <span>START CREATING</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  id="hero-explore-products-btn"
                  onClick={() => navigateTo('products')}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#161B26] hover:bg-zinc-800 border border-zinc-700 text-zinc-200 font-semibold text-sm tracking-wider uppercase transition flex items-center justify-center"
                >
                  EXPLORE PRODUCTS
                </button>
              </div>

              {/* Micro specs */}
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-zinc-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Instant Live 1:1 Rendering
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-pink-400" />
                  No Minimum Orders
                </span>
              </div>
            </div>

            {/* Hero Right Visual: Live Interactive T-Shirt Preview Teaser */}
            <div className="lg:col-span-6 flex flex-col items-center">
              <div className="w-full max-w-md bg-[#12151D] border border-zinc-800/90 rounded-2xl p-4 shadow-2xl relative">
                {/* Visual Header */}
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping" />
                    <span className="font-semibold text-zinc-300">Live Customization Preview</span>
                  </div>
                  <span className="text-[11px] text-pink-400 font-mono font-bold bg-pink-500/10 px-2 py-0.5 rounded border border-pink-500/20">
                    Interactive Demo
                  </span>
                </div>

                {/* Render TShirt Preview */}
                <div className="py-2">
                  <TShirtPreview
                    color={heroColor}
                    size="M"
                    customText={heroText}
                    textStyle="varsity"
                    design="minimal-star"
                    printType="Premium Print"
                    showGuides={false}
                    compact={true}
                  />
                </div>

                {/* Interactive teaser controls */}
                <div className="mt-3 pt-3 border-t border-zinc-800/80 space-y-2.5">
                  {/* Color switcher */}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-zinc-400 font-medium">Preview Color:</span>
                    <div className="flex items-center gap-2">
                      {(['Navy Blue', 'Black', 'Pink', 'White', 'Grey'] as TShirtColor[]).map(c => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setHeroColor(c)}
                          className={`w-6 h-6 rounded-full border transition transform hover:scale-110 ${
                            heroColor === c ? 'ring-2 ring-pink-400 ring-offset-2 ring-offset-[#12151D]' : 'border-zinc-700'
                          }`}
                          style={{
                            backgroundColor:
                              c === 'Navy Blue'
                                ? '#0F1E38'
                                : c === 'Black'
                                ? '#15171C'
                                : c === 'Pink'
                                ? '#E89CB5'
                                : c === 'White'
                                ? '#F4F5F7'
                                : '#6B7688',
                          }}
                          title={c}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Quick text snippet edit */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-zinc-400 font-medium shrink-0">Try Text:</span>
                    <input
                      type="text"
                      maxLength={18}
                      value={heroText}
                      onChange={e => setHeroText(e.target.value)}
                      placeholder="Type custom text..."
                      className="w-full bg-[#181D28] border border-zinc-700 text-xs text-white rounded-lg px-2.5 py-1 focus:outline-none focus:border-pink-500 font-mono uppercase"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => navigateTo('customize', { productId: 'classic-cotton-tee' })}
                    className="w-full py-2 bg-pink-500/15 hover:bg-pink-500/25 border border-pink-500/30 text-pink-300 font-semibold text-xs rounded-lg transition flex items-center justify-center gap-1.5"
                  >
                    <span>Open Full Customization Studio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CUSTOMCRAFT? Feature Section */}
      <section className="py-16 md:py-20 bg-[#0B0D11]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-pink-400 text-xs font-bold tracking-widest uppercase block mb-2">
              Engineered For Perfection
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight uppercase">
              WHY CUSTOMCRAFT?
            </h2>
            <p className="text-sm text-zinc-400 mt-3">
              Standard stores force you into mass-market off-the-rack templates. CustomCraft puts creative control directly into your hands.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-[#12151D] border border-zinc-800 hover:border-zinc-700 transition space-y-4">
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-white uppercase tracking-wider">
                LIVE CUSTOMIZATION
              </h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                "See your design change instantly." Watch colors, custom typography, vector motifs, and chest coordinates update in real time with high fidelity.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-[#12151D] border border-zinc-800 hover:border-zinc-700 transition space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Sliders className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-white uppercase tracking-wider">
                DYNAMIC PRICING
              </h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                "Know exactly what your customization costs." Transparent itemized cost breakdown for base tee, custom text, vector artwork, and HD vinyl prints.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-[#12151D] border border-zinc-800 hover:border-zinc-700 transition space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-white uppercase tracking-wider">
                PERSONALIZED ORDERS
              </h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                "Your custom specifications stay attached to your order." From cart to checkout and SQLite database confirmation, every millimeter is captured.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS Section */}
      <section className="py-16 md:py-20 border-t border-zinc-800/80 bg-[#0E1118]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-pink-400 text-xs font-bold tracking-widest uppercase block mb-1">
                Curated Heavyweight Essentials
              </span>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight uppercase">
                FEATURED PRODUCTS
              </h2>
            </div>

            <button
              type="button"
              id="view-all-products-btn"
              onClick={() => navigateTo('products')}
              className="text-xs font-bold text-pink-400 hover:text-pink-300 uppercase tracking-wider flex items-center gap-1 group"
            >
              <span>View Full Catalog</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
              {[1, 2, 3].map(n => (
                <div key={n} className="h-80 bg-zinc-800/50 rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredProducts.map(product => (
                <div
                  key={product.id}
                  id={`product-card-${product.id}`}
                  className="group rounded-2xl bg-[#141824] border border-zinc-800 overflow-hidden hover:border-zinc-700 transition-all duration-300 flex flex-col"
                >
                  {/* Product Image */}
                  <div className="relative aspect-[4/3.5] overflow-hidden bg-zinc-900">
                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur text-[11px] font-semibold text-white flex items-center gap-1 border border-white/10">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span>{product.rating || 4.8}</span>
                    </div>

                    <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded bg-black/70 backdrop-blur text-[10px] font-mono text-pink-300 uppercase tracking-wider border border-white/10">
                      {product.category}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h4 className="font-display font-bold text-base text-white group-hover:text-pink-300 transition">
                        {product.name}
                      </h4>
                      <p className="text-zinc-400 text-xs line-clamp-2 mt-1 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-zinc-500 block uppercase">Base Price</span>
                        <span className="text-lg font-bold text-white font-mono">
                          ₹{product.base_price}
                        </span>
                      </div>

                      <button
                        type="button"
                        id={`customize-featured-${product.id}`}
                        onClick={() => navigateTo('customize', { productId: product.id })}
                        className="px-4 py-2 rounded-lg bg-pink-500 hover:bg-pink-600 text-white font-semibold text-xs tracking-wider uppercase transition flex items-center gap-1.5 shadow-md shadow-pink-500/20"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Customize</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
