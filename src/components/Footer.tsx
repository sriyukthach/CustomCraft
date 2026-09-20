import React from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Truck, RefreshCw, Sparkles, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <footer className="border-t border-zinc-800/80 bg-[#08090C] text-zinc-400 text-xs mt-auto">
      {/* Trust Badges */}
      <div className="border-b border-zinc-800/60 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-pink-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-xs">Live Customization</h4>
              <p className="text-[11px] text-zinc-500">Photorealistic 1:1 real-time preview</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-pink-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-xs">Pan-India Delivery</h4>
              <p className="text-[11px] text-zinc-500">Dispatched in 48 hours</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-pink-400 shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-xs">HD Vinyl & DTG Print</h4>
              <p className="text-[11px] text-zinc-500">50+ wash durability test</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-pink-400 shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-xs">Easy Exchanges</h4>
              <p className="text-[11px] text-zinc-500">Hassle-free size replacement</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-zinc-800 border border-zinc-700 flex items-center justify-center text-pink-400">
              <span className="font-display font-black text-xs text-white">CC</span>
            </div>
            <span className="font-display font-extrabold text-base tracking-wider text-white">
              CUSTOMCRAFT
            </span>
          </div>
          <p className="text-zinc-500 text-xs leading-relaxed">
            Create it. Customize it. Cart it. Premium custom-engineered streetwear, heavyweight basics, and signature personalized apparel.
          </p>
          <div className="text-[11px] text-pink-400/80 font-mono">
            Direct-to-garment & Vinyl Customization Studio
          </div>
        </div>

        <div>
          <h5 className="text-white font-semibold mb-3 tracking-wider uppercase text-[11px]">
            Catalog
          </h5>
          <ul className="space-y-2 text-zinc-400 text-xs">
            <li>
              <button
                type="button"
                onClick={() => navigateTo('products')}
                className="hover:text-white transition"
              >
                All Custom Products
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => navigateTo('products')}
                className="hover:text-white transition"
              >
                Custom T-Shirts
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => navigateTo('products')}
                className="hover:text-white transition"
              >
                Oversized Drop-Shoulder
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => navigateTo('products')}
                className="hover:text-white transition"
              >
                Heavyweight Hoodies
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="text-white font-semibold mb-3 tracking-wider uppercase text-[11px]">
            Custom Studio
          </h5>
          <ul className="space-y-2 text-zinc-400 text-xs">
            <li>
              <button
                type="button"
                onClick={() => navigateTo('customize')}
                className="hover:text-white transition text-pink-300"
              >
                Launch Studio
              </button>
            </li>
            <li>
              <span className="text-zinc-500">Live 3D-Like Preview</span>
            </li>
            <li>
              <span className="text-zinc-500">Dynamic Pricing Calculator</span>
            </li>
            <li>
              <span className="text-zinc-500">Vector Motif & Monograms</span>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="text-white font-semibold mb-3 tracking-wider uppercase text-[11px]">
            Demo Assistance
          </h5>
          <p className="text-zinc-500 text-xs mb-3 leading-relaxed">
            CustomCraft is a modern fashion e-commerce prototype with live SQLite database order persistence.
          </p>
          <div className="px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400 font-mono">
            Currency: INR (₹) • Free Shipping over ₹999
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-800/40 py-4 text-center text-zinc-600 text-[11px]">
        © 2026 CustomCraft. All rights reserved. Built with precision for customizable fashion.
      </div>
    </footer>
  );
};
