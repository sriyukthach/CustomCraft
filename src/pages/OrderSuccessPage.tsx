import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Sparkles, ArrowRight, ShoppingBag, Eye, Copy, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export const OrderSuccessPage: React.FC = () => {
  const { currentOrderId, navigateTo, showToast } = useApp();
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    // Run joyful confetti on mount
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.55 },
        colors: ['#F472B6', '#38BDF8', '#34D399', '#FBBF24'],
      });
    } catch {}
  }, []);

  const copyOrderId = () => {
    navigator.clipboard.writeText(currentOrderId);
    setCopied(true);
    showToast('Order ID copied to clipboard!', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="order-success-page" className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="bg-[#12151D] border border-zinc-800 rounded-3xl p-8 md:p-12 shadow-2xl space-y-6">
        {/* Large Success Icon */}
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto shadow-lg shadow-emerald-500/20">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        {/* Headlines */}
        <div className="space-y-2">
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight uppercase">
            ORDER PLACED!
          </h1>
          <p className="text-sm sm:text-base text-zinc-300 font-medium">
            Thank you for choosing CustomCraft.
          </p>
        </div>

        {/* Order ID Box */}
        <div className="py-4 px-6 rounded-2xl bg-[#161B26] border border-zinc-800 max-w-sm mx-auto flex items-center justify-between">
          <div className="text-left">
            <span className="text-[10px] text-zinc-400 uppercase font-mono block">
              Order ID
            </span>
            <span id="confirmed-order-id" className="font-mono text-xl font-black text-pink-400 tracking-wider">
              #{currentOrderId}
            </span>
          </div>

          <button
            type="button"
            onClick={copyOrderId}
            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition"
            title="Copy Order ID"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        {/* Message */}
        <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
          Your custom product has been successfully ordered. Your personalized specifications, fabric colors, and custom artwork have been recorded in our production database.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            type="button"
            id="view-order-details-btn"
            onClick={() => navigateTo('order-details', { orderId: currentOrderId })}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs tracking-wider uppercase transition shadow-lg shadow-pink-500/20 flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            <span>VIEW ORDER</span>
          </button>

          <button
            type="button"
            id="continue-shopping-btn"
            onClick={() => navigateTo('products')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#181D28] hover:bg-zinc-800 border border-zinc-700 text-zinc-200 font-semibold text-xs tracking-wider uppercase transition flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>CONTINUE SHOPPING</span>
          </button>
        </div>
      </div>
    </div>
  );
};
