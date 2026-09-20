import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Order, TShirtColor } from '../types';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Mail,
  Phone,
  Package,
  ArrowLeft,
  ShoppingBag,
  Sparkles,
  Search,
  AlertCircle,
} from 'lucide-react';
import { COLOR_CONFIG } from '../components/TShirtPreview';

export const OrderDetailsPage: React.FC = () => {
  const { currentOrderId, setCurrentOrderId, navigateTo } = useApp();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lookupInput, setLookupInput] = useState(currentOrderId || 'CC1024');

  const fetchOrder = (id: string) => {
    setLoading(true);
    setError('');
    fetch(`/api/orders/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          setOrder(data);
        } else {
          setError(data.error || 'Order not found');
          setOrder(null);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load order:', err);
        setError('Network error while retrieving order');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrder(currentOrderId || 'CC1024');
  }, [currentOrderId]);

  const handleLookupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lookupInput.trim()) {
      setCurrentOrderId(lookupInput.trim().toUpperCase());
    }
  };

  return (
    <div id="order-details-page-container" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Bar with Navigation & Lookup */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <button
          type="button"
          onClick={() => navigateTo('products')}
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white uppercase tracking-wider font-semibold transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </button>

        {/* Quick Order Lookup Form */}
        <form onSubmit={handleLookupSubmit} className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-48">
            <input
              type="text"
              value={lookupInput}
              onChange={e => setLookupInput(e.target.value)}
              placeholder="Search Order (e.g. CC1024)"
              className="w-full bg-[#181D28] border border-zinc-700 text-xs text-white rounded-xl pl-8 pr-3 py-1.5 focus:outline-none focus:border-pink-500 font-mono uppercase"
            />
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2.5 pointer-events-none" />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white transition"
          >
            Find
          </button>
        </form>
      </div>

      {loading ? (
        <div className="bg-[#12151D] border border-zinc-800 rounded-3xl p-8 animate-pulse space-y-6">
          <div className="h-8 w-48 bg-zinc-800 rounded" />
          <div className="h-24 bg-zinc-800/40 rounded-xl" />
          <div className="h-40 bg-zinc-800/40 rounded-xl" />
        </div>
      ) : error || !order ? (
        <div className="bg-[#12151D] border border-zinc-800 rounded-3xl p-10 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">Order Not Found</h2>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            We couldn't locate an order with ID "#{lookupInput}". Make sure the ID is correct (e.g. CC1024).
          </p>
          <button
            type="button"
            onClick={() => {
              setLookupInput('CC1024');
              setCurrentOrderId('CC1024');
            }}
            className="px-5 py-2.5 rounded-xl bg-pink-500 text-white text-xs font-bold uppercase"
          >
            Load Sample Order CC1024
          </button>
        </div>
      ) : (
        <div className="bg-[#12151D] border border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
          {/* Order Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-zinc-800 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-pink-400 font-mono tracking-wider uppercase font-semibold">
                  Official CustomCraft Invoice
                </span>
              </div>
              <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
                ORDER #{order.id}
              </h1>
              <p className="text-xs text-zinc-400 mt-1 font-mono">
                Placed on {new Date(order.created_at).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            {/* Status Badge */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider">
                Status: {order.status}
              </span>
            </div>
          </div>

          {/* Ordered Customized Items */}
          <div className="space-y-4">
            <h2 className="font-display font-bold text-sm uppercase tracking-wider text-zinc-400">
              Customized Garments ({order.items?.length || 0})
            </h2>

            <div className="space-y-4">
              {order.items?.map((item, idx) => {
                const colorHex = COLOR_CONFIG[item.color as TShirtColor]?.base || '#15171C';

                return (
                  <div
                    key={item.id || idx}
                    id={`order-item-${item.id}`}
                    className="p-5 rounded-2xl bg-[#161B26] border border-zinc-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
                  >
                    {/* Item Image & Info */}
                    <div className="flex items-center gap-4">
                      {item.product_image ? (
                        <img
                          src={item.product_image}
                          alt={item.product_name}
                          referrerPolicy="no-referrer"
                          className="w-16 h-20 object-cover rounded-xl bg-zinc-900 border border-zinc-700 shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-20 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-pink-400 shrink-0">
                          <Package className="w-8 h-8" />
                        </div>
                      )}

                      <div className="space-y-1.5">
                        <h3 className="font-display font-bold text-base text-white">
                          {item.product_name}
                        </h3>

                        {/* Customization Details List */}
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-200 font-medium">
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-white/20"
                              style={{ backgroundColor: colorHex }}
                            />
                            Color: {item.color}
                          </span>

                          <span className="px-2.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-200 font-mono">
                            Size: {item.size}
                          </span>

                          {item.custom_text && (
                            <span className="px-2.5 py-0.5 rounded bg-pink-500/10 border border-pink-500/30 text-pink-300 font-mono font-bold">
                              Text: {item.custom_text}
                            </span>
                          )}

                          {item.design && item.design !== 'None' && (
                            <span className="px-2.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-300">
                              Design: {item.design}
                            </span>
                          )}

                          <span className="px-2.5 py-0.5 rounded bg-zinc-800/80 border border-zinc-700 text-zinc-300">
                            Print: {item.print_type}
                          </span>
                        </div>

                        <div className="text-xs text-zinc-400 font-mono">
                          Quantity: <span className="text-white font-bold">{item.quantity}</span>
                        </div>
                      </div>
                    </div>

                    {/* Item Total Price */}
                    <div className="text-left sm:text-right pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-800 w-full sm:w-auto">
                      <span className="text-[10px] text-zinc-500 uppercase font-mono block">
                        Item Total
                      </span>
                      <span className="text-lg font-bold text-white font-mono">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Customer & Shipping Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-zinc-800">
            {/* Customer Details */}
            <div className="p-5 rounded-2xl bg-[#161B26] border border-zinc-800/80 space-y-3">
              <h3 className="font-display font-bold text-xs uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-pink-400" />
                <span>Shipping Address</span>
              </h3>

              <div className="space-y-1 text-xs text-zinc-300">
                <div className="font-bold text-white text-sm">{order.customer_name}</div>
                <div>{order.address}</div>
                <div>
                  {order.city}, {order.state} - <span className="font-mono">{order.pincode}</span>
                </div>
                <div className="text-zinc-400 pt-1">India</div>
              </div>
            </div>

            {/* Contact & Payment Summary */}
            <div className="p-5 rounded-2xl bg-[#161B26] border border-zinc-800/80 space-y-3">
              <h3 className="font-display font-bold text-xs uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span>Contact & Payment</span>
              </h3>

              <div className="space-y-1 text-xs text-zinc-300">
                <div className="flex items-center gap-2">
                  <span className="text-zinc-500">Email:</span>
                  <span className="font-mono">{order.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-500">Phone:</span>
                  <span className="font-mono">{order.phone}</span>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-zinc-500">Payment:</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-mono font-bold text-[10px] border border-emerald-500/20">
                    Paid / Confirmed
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Grand Total Footer */}
          <div className="p-6 rounded-2xl bg-[#0B0D11] border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] text-zinc-500 uppercase font-mono block">
                Order Amount
              </span>
              <span className="text-2xl font-black text-pink-300 font-mono">
                Total: ₹{order.total_amount}
              </span>
            </div>

            <button
              type="button"
              id="order-details-shop-more-btn"
              onClick={() => navigateTo('products')}
              className="px-6 py-3 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs tracking-wider uppercase transition flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Continue Shopping</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
