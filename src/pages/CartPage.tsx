import React from 'react';
import { useApp } from '../context/AppContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Sparkles, ShieldCheck } from 'lucide-react';
import { COLOR_CONFIG } from '../components/TShirtPreview';

export const CartPage: React.FC = () => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    cartSubtotal,
    cartCustomizationTotal,
    cartGrandTotal,
    navigateTo,
  } = useApp();

  if (cart.length === 0) {
    return (
      <div id="empty-cart-view" className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-[#141824] border border-zinc-800 flex items-center justify-center text-pink-400 mx-auto mb-6">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="font-display font-black text-2xl sm:text-3xl text-white mb-2 uppercase">
          Your cart is empty.
        </h2>
        <p className="text-zinc-400 text-sm max-w-md mx-auto mb-8">
          You haven't customized any garments yet. Explore our heavyweight collection and design something uniquely yours!
        </p>
        <button
          type="button"
          id="cart-explore-products-btn"
          onClick={() => navigateTo('products')}
          className="px-8 py-3.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs tracking-wider uppercase transition shadow-lg shadow-pink-500/20 inline-flex items-center gap-2"
        >
          <span>EXPLORE PRODUCTS</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div id="shopping-cart-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <span className="text-pink-400 text-xs font-bold tracking-widest uppercase block mb-1">
          Review Your Order
        </span>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight uppercase">
          SHOPPING CART ({cart.length} {cart.length === 1 ? 'ITEM' : 'ITEMS'})
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map(item => {
            const colorHex = COLOR_CONFIG[item.color]?.base || '#15171C';

            return (
              <div
                key={item.cart_item_id}
                id={`cart-item-${item.cart_item_id}`}
                className="bg-[#12151D] border border-zinc-800/90 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between shadow-lg"
              >
                {/* Thumbnail */}
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-700/80 shrink-0">
                    <img
                      src={item.product_image}
                      alt={item.product_name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div
                      className="absolute bottom-1 right-1 w-4 h-4 rounded-full border border-white/40 shadow-sm"
                      style={{ backgroundColor: colorHex }}
                      title={item.color}
                    />
                  </div>

                  {/* Product Details & Customization Specifications */}
                  <div className="space-y-1.5">
                    <h3 className="font-display font-bold text-base text-white">
                      {item.product_name}
                    </h3>

                    {/* Customization Specs Pills */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-800/80 border border-zinc-700 text-zinc-300">
                        <span
                          className="w-2 h-2 rounded-full border border-white/20"
                          style={{ backgroundColor: colorHex }}
                        />
                        {item.color}
                      </span>

                      <span className="px-2 py-0.5 rounded bg-zinc-800/80 border border-zinc-700 text-zinc-300 font-mono">
                        Size: {item.size}
                      </span>

                      {item.custom_text && (
                        <span className="px-2 py-0.5 rounded bg-pink-500/10 border border-pink-500/30 text-pink-300 font-mono font-semibold">
                          Text: "{item.custom_text}"
                        </span>
                      )}

                      {item.design && item.design !== 'None' && (
                        <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-300">
                          Design: {item.design}
                        </span>
                      )}

                      <span className="px-2 py-0.5 rounded bg-zinc-800/60 border border-zinc-700 text-zinc-400">
                        {item.print_type}
                      </span>
                    </div>

                    <div className="text-xs text-zinc-400 font-mono pt-1">
                      Unit: ₹{item.unit_price} (Base ₹{item.base_price} + Customization ₹{item.text_charge + item.design_charge + item.print_charge})
                    </div>
                  </div>
                </div>

                {/* Right: Quantity controls, Price & Remove */}
                <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-zinc-800">
                  {/* Quantity Controls */}
                  <div className="flex items-center bg-[#181D28] border border-zinc-700 rounded-xl p-1">
                    <button
                      type="button"
                      id={`qty-minus-${item.cart_item_id}`}
                      onClick={() => updateQuantity(item.cart_item_id, -1)}
                      className="w-7 h-7 rounded-lg text-zinc-300 hover:bg-zinc-800 flex items-center justify-center transition"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-mono font-bold text-white">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      id={`qty-plus-${item.cart_item_id}`}
                      onClick={() => updateQuantity(item.cart_item_id, 1)}
                      className="w-7 h-7 rounded-lg text-zinc-300 hover:bg-zinc-800 flex items-center justify-center transition"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Total item price */}
                  <div className="text-right">
                    <span className="text-base font-bold text-white font-mono block">
                      ₹{item.total_price}
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    id={`remove-${item.cart_item_id}`}
                    onClick={() => removeFromCart(item.cart_item_id)}
                    className="p-2 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Order Summary & Checkout Action */}
        <div className="lg:col-span-4 lg:sticky lg:top-24">
          <div className="bg-[#12151D] border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-5">
            <h3 className="font-display font-bold text-lg text-white uppercase tracking-wider pb-3 border-b border-zinc-800">
              Order Summary
            </h3>

            <div className="space-y-3 text-xs font-mono">
              <div className="flex items-center justify-between text-zinc-400">
                <span>Subtotal (Base Items):</span>
                <span className="text-zinc-200">₹{cartSubtotal}</span>
              </div>

              <div className="flex items-center justify-between text-zinc-400">
                <span>Customization Charges:</span>
                <span className="text-pink-400 font-bold">+₹{cartCustomizationTotal}</span>
              </div>

              <div className="flex items-center justify-between text-zinc-400">
                <span>Shipping & Handling:</span>
                <span className="text-emerald-400 font-medium">FREE</span>
              </div>

              <div className="pt-4 border-t border-zinc-800 flex items-center justify-between text-base font-bold text-white font-mono">
                <span>Grand Total:</span>
                <span className="text-xl text-pink-300 font-extrabold">₹{cartGrandTotal}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              type="button"
              id="proceed-to-checkout-btn"
              onClick={() => navigateTo('checkout')}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-extrabold text-xs tracking-wider uppercase transition flex items-center justify-center gap-2 shadow-xl shadow-pink-500/25"
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 text-center text-zinc-500 text-[11px] flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Safe & Secure Simulated Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
