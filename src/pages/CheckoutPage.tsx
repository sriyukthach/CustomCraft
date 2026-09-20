import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CustomerDetails } from '../types';
import {
  ShieldCheck,
  CreditCard,
  Smartphone,
  Truck,
  ArrowRight,
  ArrowLeft,
  Lock,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CheckoutPage: React.FC = () => {
  const { cart, cartGrandTotal, cartSubtotal, cartCustomizationTotal, clearCart, navigateTo, showToast } = useApp();

  const [formData, setFormData] = useState<CustomerDetails>({
    customer_name: 'Yuktha Sharma',
    email: 'yuktha@example.com',
    phone: '+91 98765 43210',
    address: '104, Horizon Heights, MG Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560001',
    payment_method: 'UPI',
  });

  const [upiOption, setUpiOption] = useState<'gpay' | 'phonepe' | 'paytm' | 'custom'>('gpay');
  const [upiId, setUpiId] = useState('yuktha@oksbi');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Your Cart is Empty</h2>
        <p className="text-xs text-zinc-400 mb-6">Add customized items before checking out.</p>
        <button
          type="button"
          onClick={() => navigateTo('products')}
          className="px-6 py-2.5 rounded-xl bg-pink-500 text-white font-bold text-xs uppercase"
        >
          Browse Products
        </button>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation
    if (!formData.customer_name.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('Please enter a valid email address');
      return;
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 8) {
      setErrorMessage('Please enter a valid phone number');
      return;
    }
    if (!formData.address.trim()) {
      setErrorMessage('Please enter your delivery street address');
      return;
    }
    if (!formData.city.trim()) {
      setErrorMessage('Please enter your city');
      return;
    }
    if (!formData.state.trim()) {
      setErrorMessage('Please enter your state');
      return;
    }
    if (!formData.pincode.trim() || formData.pincode.trim().length < 5) {
      setErrorMessage('Please enter a valid PIN code');
      return;
    }

    setLoading(true);

    try {
      // Prepare payload
      const payload = {
        customer_name: formData.customer_name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim(),
        payment_method: formData.payment_method,
        items: cart.map(item => ({
          product_id: item.product_id,
          product_name: item.product_name,
          product_image: item.product_image,
          quantity: item.quantity,
          color: item.color,
          size: item.size,
          custom_text: item.custom_text,
          design: item.design,
          print_type: item.print_type,
          unit_price: item.unit_price,
        })),
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to place order');
      }

      // Celebrate with confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F472B6', '#3B82F6', '#10B981', '#F59E0B'],
        });
      } catch {}

      // Clear Cart
      clearCart();
      showToast(`Order placed successfully! ID: ${data.order.id}`, 'success');

      // Navigate to Order Success
      navigateTo('order-success', { orderId: data.order.id });
    } catch (err: any) {
      console.error('Order creation error:', err);
      setErrorMessage(err.message || 'An error occurred while creating your order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="checkout-page-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <button
            type="button"
            onClick={() => navigateTo('cart')}
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white mb-2 uppercase tracking-wider font-semibold transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Cart</span>
          </button>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight uppercase">
            SECURE CHECKOUT
          </h1>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
          <Lock className="w-3.5 h-3.5" />
          <span>SSL 256-Bit Encrypted Demo</span>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Customer & Shipping Information + Simulated Payment */}
        <div className="lg:col-span-7 space-y-6">
          {/* Customer & Delivery Form */}
          <div className="bg-[#12151D] border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
            <h2 className="font-display font-bold text-lg text-white uppercase tracking-wider pb-3 border-b border-zinc-800 flex items-center justify-between">
              <span>1. Customer & Shipping Details</span>
              <span className="text-xs text-pink-400 font-mono">Required</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="checkout-name-input"
                  name="customer_name"
                  required
                  value={formData.customer_name}
                  onChange={handleChange}
                  placeholder="e.g. Yuktha Sharma"
                  className="w-full bg-[#181D28] border border-zinc-700 text-xs text-white rounded-xl px-4 py-3 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="checkout-email-input"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. yuktha@example.com"
                  className="w-full bg-[#181D28] border border-zinc-700 text-xs text-white rounded-xl px-4 py-3 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="checkout-phone-input"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full bg-[#181D28] border border-zinc-700 text-xs text-white rounded-xl px-4 py-3 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Delivery Street Address *
                </label>
                <input
                  type="text"
                  id="checkout-address-input"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Flat / House No., Building, Street Area"
                  className="w-full bg-[#181D28] border border-zinc-700 text-xs text-white rounded-xl px-4 py-3 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  City *
                </label>
                <input
                  type="text"
                  id="checkout-city-input"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Bengaluru"
                  className="w-full bg-[#181D28] border border-zinc-700 text-xs text-white rounded-xl px-4 py-3 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  State *
                </label>
                <input
                  type="text"
                  id="checkout-state-input"
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="e.g. Karnataka"
                  className="w-full bg-[#181D28] border border-zinc-700 text-xs text-white rounded-xl px-4 py-3 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  PIN Code *
                </label>
                <input
                  type="text"
                  id="checkout-pincode-input"
                  name="pincode"
                  required
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="e.g. 560001"
                  className="w-full bg-[#181D28] border border-zinc-700 text-xs text-white rounded-xl px-4 py-3 focus:outline-none focus:border-pink-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Country
                </label>
                <input
                  type="text"
                  disabled
                  value="India (Pan-India Shipping)"
                  className="w-full bg-[#141722] border border-zinc-800 text-xs text-zinc-400 rounded-xl px-4 py-3 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selection (Simulated) */}
          <div className="bg-[#12151D] border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h2 className="font-display font-bold text-lg text-white uppercase tracking-wider">
                2. Payment Method
              </h2>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Simulated Sandbox
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* UPI */}
              <button
                type="button"
                id="payment-method-upi"
                onClick={() => setFormData(prev => ({ ...prev, payment_method: 'UPI' }))}
                className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${
                  formData.payment_method === 'UPI'
                    ? 'border-pink-500 bg-pink-500/10 ring-1 ring-pink-500'
                    : 'border-zinc-800 bg-[#181D28] hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <Smartphone className="w-5 h-5 text-pink-400" />
                  <span className="text-[10px] font-bold text-pink-300 font-mono">Instant</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">UPI</h4>
                  <p className="text-[11px] text-zinc-400">GPay, PhonePe, Paytm</p>
                </div>
              </button>

              {/* Card */}
              <button
                type="button"
                id="payment-method-card"
                onClick={() => setFormData(prev => ({ ...prev, payment_method: 'Card' }))}
                className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${
                  formData.payment_method === 'Card'
                    ? 'border-pink-500 bg-pink-500/10 ring-1 ring-pink-500'
                    : 'border-zinc-800 bg-[#181D28] hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <CreditCard className="w-5 h-5 text-blue-400" />
                  <span className="text-[10px] text-zinc-400 font-mono">Debit/Credit</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Card</h4>
                  <p className="text-[11px] text-zinc-400">Visa, Mastercard, RuPay</p>
                </div>
              </button>

              {/* Cash on Delivery */}
              <button
                type="button"
                id="payment-method-cod"
                onClick={() => setFormData(prev => ({ ...prev, payment_method: 'Cash on Delivery' }))}
                className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${
                  formData.payment_method === 'Cash on Delivery'
                    ? 'border-pink-500 bg-pink-500/10 ring-1 ring-pink-500'
                    : 'border-zinc-800 bg-[#181D28] hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <Truck className="w-5 h-5 text-emerald-400" />
                  <span className="text-[10px] text-zinc-400 font-mono">Doorstep</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Cash on Delivery</h4>
                  <p className="text-[11px] text-zinc-400">Pay upon delivery</p>
                </div>
              </button>
            </div>

            {/* UPI Sub-options if UPI selected */}
            {formData.payment_method === 'UPI' && (
              <div className="p-4 rounded-2xl bg-[#161B26] border border-zinc-800 space-y-3">
                <div className="text-xs font-bold text-zinc-300">Selected UPI Provider:</div>
                <div className="flex flex-wrap gap-2">
                  {(['gpay', 'phonepe', 'paytm', 'custom'] as const).map(app => (
                    <button
                      key={app}
                      type="button"
                      onClick={() => setUpiOption(app)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize border transition ${
                        upiOption === app
                          ? 'bg-pink-500 text-white border-pink-500'
                          : 'bg-[#12151D] text-zinc-400 border-zinc-700'
                      }`}
                    >
                      {app === 'gpay' ? 'Google Pay' : app === 'phonepe' ? 'PhonePe' : app === 'paytm' ? 'Paytm UPI' : 'Custom UPI ID'}
                    </button>
                  ))}
                </div>
                <div className="pt-1">
                  <input
                    type="text"
                    value={upiId}
                    onChange={e => setUpiId(e.target.value)}
                    placeholder="Enter UPI VPA (e.g. yourname@oksbi)"
                    className="w-full bg-[#12151D] border border-zinc-700 text-xs text-white rounded-xl px-3 py-2 font-mono"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary & Place Order */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-5">
          <div className="bg-[#12151D] border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-5">
            <h3 className="font-display font-bold text-lg text-white uppercase tracking-wider pb-3 border-b border-zinc-800">
              Order Summary ({cart.length})
            </h3>

            {/* Items List */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {cart.map(item => (
                <div
                  key={item.cart_item_id}
                  className="p-3 rounded-xl bg-[#181D28] border border-zinc-800/80 flex items-center justify-between text-xs gap-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product_image}
                      alt={item.product_name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-14 object-cover rounded-lg bg-zinc-900 border border-zinc-700 shrink-0"
                    />
                    <div>
                      <h4 className="font-bold text-white text-xs">{item.product_name}</h4>
                      <div className="text-[11px] text-zinc-400 font-mono">
                        {item.color} • {item.size} • Qty {item.quantity}
                      </div>
                      {item.custom_text && (
                        <div className="text-[10px] text-pink-400 font-mono font-medium">
                          Text: "{item.custom_text}"
                        </div>
                      )}
                      {item.design && item.design !== 'None' && (
                        <div className="text-[10px] text-blue-400">
                          Design: {item.design}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right font-mono font-bold text-white">
                    ₹{item.total_price}
                  </div>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="pt-3 border-t border-zinc-800 space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between text-zinc-400">
                <span>Base Subtotal:</span>
                <span className="text-zinc-200">₹{cartSubtotal}</span>
              </div>
              <div className="flex items-center justify-between text-zinc-400">
                <span>Customization Charges:</span>
                <span className="text-pink-400 font-bold">+₹{cartCustomizationTotal}</span>
              </div>
              <div className="flex items-center justify-between text-zinc-400">
                <span>Shipping:</span>
                <span className="text-emerald-400 font-semibold">FREE</span>
              </div>
              <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-sm font-bold text-white">
                <span>Total Amount:</span>
                <span className="text-xl text-pink-300 font-extrabold font-mono">
                  ₹{cartGrandTotal}
                </span>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              type="submit"
              id="place-order-btn"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-black text-xs tracking-wider uppercase transition flex items-center justify-center gap-2 shadow-xl shadow-pink-500/25 disabled:opacity-50"
            >
              {loading ? (
                <span>CREATING ORDER IN DATABASE...</span>
              ) : (
                <>
                  <span>PLACE ORDER • ₹{cartGrandTotal}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-[11px] text-zinc-500 text-center leading-relaxed">
              By placing this order, your custom artwork specifications and customer details will be securely recorded in the CustomCraft SQLite database.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};
