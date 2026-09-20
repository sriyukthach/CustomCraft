import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Search, Sparkles, Menu, X, ArrowRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentView, navigateTo, cartCount, searchQuery, setSearchQuery } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigateTo('products');
      setSearchOpen(false);
    }
  };

  return (
    <header
      id="main-navbar"
      className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-[#0B0D11]/90 backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Logo & Tagline */}
        <div className="flex items-center gap-6">
          <button
            type="button"
            id="brand-logo-btn"
            onClick={() => navigateTo('home')}
            className="flex items-center gap-2 group text-left focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 flex items-center justify-center text-pink-400 group-hover:border-pink-500/50 transition">
              <span className="font-display font-black text-sm tracking-tighter text-white">
                C<span className="text-pink-400">C</span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold text-base sm:text-lg tracking-wider text-white">
                  CUSTOMCRAFT
                </span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
              </div>
              <span className="hidden sm:block text-[9px] text-zinc-400 tracking-widest uppercase font-mono">
                Create it. Customize it. Cart it.
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 ml-4">
            <button
              type="button"
              id="nav-link-home"
              onClick={() => navigateTo('home')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold tracking-wider uppercase transition ${
                currentView === 'home'
                  ? 'text-white bg-zinc-800/80 border border-zinc-700/60'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/30'
              }`}
            >
              Home
            </button>
            <button
              type="button"
              id="nav-link-products"
              onClick={() => navigateTo('products')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold tracking-wider uppercase transition ${
                currentView === 'products' || currentView === 'product-details'
                  ? 'text-white bg-zinc-800/80 border border-zinc-700/60'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/30'
              }`}
            >
              Products
            </button>
            <button
              type="button"
              id="nav-link-customize"
              onClick={() => navigateTo('customize')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold tracking-wider uppercase transition ${
                currentView === 'customize'
                  ? 'text-pink-300 bg-pink-500/10 border border-pink-500/30'
                  : 'text-zinc-400 hover:text-pink-400 hover:bg-pink-500/5'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              Customize Studio
            </button>
          </nav>
        </div>

        {/* Right: Search bar & Cart */}
        <div className="flex items-center gap-3">
          {/* Desktop Search */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden sm:flex items-center relative w-48 lg:w-64"
          >
            <input
              type="text"
              id="navbar-search-input"
              placeholder="Search custom tees..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#12151D] border border-zinc-800 text-xs text-white placeholder-zinc-500 rounded-full pl-8 pr-3 py-1.5 focus:outline-none focus:border-zinc-600 transition"
            />
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 pointer-events-none" />
          </form>

          {/* Mobile Search Toggle */}
          <button
            type="button"
            id="mobile-search-toggle"
            onClick={() => setSearchOpen(!searchOpen)}
            className="sm:hidden p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Cart Icon & Count */}
          <button
            type="button"
            id="navbar-cart-btn"
            onClick={() => navigateTo('cart')}
            className="relative flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#161A23] hover:bg-zinc-800 border border-zinc-800 text-white transition focus:outline-none"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4 text-pink-400" />
            <span className="text-xs font-semibold hidden md:inline">Cart</span>
            {cartCount > 0 ? (
              <span
                id="navbar-cart-count"
                className="flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-pink-500 text-white text-[10px] font-bold shadow-sm"
              >
                {cartCount}
              </span>
            ) : (
              <span className="text-xs text-zinc-500">0</span>
            )}
          </button>

          {/* Mobile menu hamburger */}
          <button
            type="button"
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Search Input expand */}
      {searchOpen && (
        <div className="sm:hidden px-4 pb-3 border-b border-zinc-800 bg-[#0B0D11]">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              id="mobile-search-input"
              placeholder="Search custom tees..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              autoFocus
              className="w-full bg-[#161A23] border border-zinc-700 text-xs text-white placeholder-zinc-500 rounded-lg pl-8 pr-10 py-2 focus:outline-none focus:border-pink-500/50"
            />
            <Search className="w-4 h-4 text-zinc-400 absolute left-2.5 top-2.5 pointer-events-none" />
            <button
              type="submit"
              className="absolute right-2 top-1.5 p-1 rounded text-pink-400"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Mobile Menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-800 bg-[#0F1219] px-4 py-3 space-y-2">
          <button
            type="button"
            id="mobile-nav-home"
            onClick={() => {
              navigateTo('home');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-zinc-200 hover:bg-zinc-800/80 transition"
          >
            Home
          </button>
          <button
            type="button"
            id="mobile-nav-products"
            onClick={() => {
              navigateTo('products');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-zinc-200 hover:bg-zinc-800/80 transition"
          >
            Products
          </button>
          <button
            type="button"
            id="mobile-nav-customize"
            onClick={() => {
              navigateTo('customize');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-pink-400 bg-pink-500/10 border border-pink-500/20 flex items-center justify-between"
          >
            <span>Customize Studio</span>
            <Sparkles className="w-4 h-4" />
          </button>
          <button
            type="button"
            id="mobile-nav-cart"
            onClick={() => {
              navigateTo('cart');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-zinc-200 hover:bg-zinc-800/80 flex items-center justify-between"
          >
            <span>Shopping Cart</span>
            <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-xs font-bold text-pink-400">
              {cartCount}
            </span>
          </button>
        </div>
      )}
    </header>
  );
};
