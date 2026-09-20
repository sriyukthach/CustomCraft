import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Product, ProductCategory } from '../types';
import { Sparkles, Star, Search, SlidersHorizontal, ArrowUpDown, ArrowRight, Eye } from 'lucide-react';

export const ProductsPage: React.FC = () => {
  const {
    navigateTo,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
  } = useApp();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortOption, setSortOption] = useState<'default' | 'low-to-high' | 'high-to-low'>('default');

  const categories: ProductCategory[] = ['ALL', 'T-SHIRTS', 'HOODIES', 'ACCESSORIES'];

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedCategory && selectedCategory !== 'ALL') {
      params.append('category', selectedCategory);
    }
    if (searchQuery.trim()) {
      params.append('search', searchQuery.trim());
    }
    if (sortOption !== 'default') {
      params.append('sort', sortOption);
    }

    fetch(`/api/products?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProducts(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch products:', err);
        setLoading(false);
      });
  }, [selectedCategory, searchQuery, sortOption]);

  return (
    <div id="products-catalog-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="mb-8">
        <span className="text-pink-400 text-xs font-bold tracking-widest uppercase block mb-1">
          Bespoke Apparel Catalog
        </span>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight uppercase">
          CUSTOMIZABLE PRODUCTS
        </h1>
        <p className="text-zinc-400 text-sm mt-2 max-w-xl">
          Choose a premium base garment engineered with combed cotton and tailored seams. Every item is ready for immediate live customization.
        </p>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-[#12151D] border border-zinc-800 rounded-2xl p-4 mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              id={`filter-category-${cat.toLowerCase()}`}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-pink-500 text-white shadow-md shadow-pink-500/20'
                  : 'bg-[#181D28] text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:w-60">
            <input
              type="text"
              id="catalog-search-input"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by name..."
              className="w-full bg-[#181D28] border border-zinc-700 text-xs text-white placeholder-zinc-500 rounded-xl pl-8 pr-3 py-2 focus:outline-none focus:border-pink-500"
            />
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-3 pointer-events-none" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-zinc-500 hover:text-zinc-300 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400 hidden sm:block" />
            <select
              id="sort-select"
              value={sortOption}
              onChange={e => setSortOption(e.target.value as any)}
              className="w-full sm:w-48 bg-[#181D28] border border-zinc-700 text-xs text-zinc-300 rounded-xl px-3 py-2 focus:outline-none focus:border-pink-500 cursor-pointer"
            >
              <option value="default">Sort: Featured</option>
              <option value="low-to-high">Price: Low to High</option>
              <option value="high-to-low">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-96 bg-zinc-800/40 rounded-2xl border border-zinc-800" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-[#12151D] border border-zinc-800 rounded-2xl p-8">
          <SlidersHorizontal className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
          <h3 className="font-display font-bold text-lg text-white mb-1">No Products Found</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto mb-4">
            No matching products found for "{searchQuery}". Try clearing filters or searching for cotton tees.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('ALL');
            }}
            className="px-4 py-2 rounded-lg bg-zinc-800 text-white text-xs font-semibold hover:bg-zinc-700 transition"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div
              key={product.id}
              id={`product-item-${product.id}`}
              className="group rounded-2xl bg-[#12151D] border border-zinc-800/90 overflow-hidden hover:border-zinc-700 transition-all duration-300 flex flex-col justify-between shadow-lg"
            >
              {/* Product Visual Container */}
              <div
                className="relative aspect-[4/3.8] bg-zinc-900 overflow-hidden cursor-pointer"
                onClick={() => navigateTo('product-details', { productId: product.id })}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-black/75 backdrop-blur text-[10px] font-mono text-pink-300 uppercase tracking-wider border border-white/10">
                    {product.category}
                  </span>
                </div>

                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/75 backdrop-blur text-[11px] font-semibold text-white flex items-center gap-1 border border-white/10">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span>{product.rating || 4.8}</span>
                </div>

                {/* Stock Indicator */}
                <div className="absolute bottom-3 left-3 text-[10px] text-zinc-300 bg-black/60 backdrop-blur px-2 py-0.5 rounded font-mono border border-white/5">
                  Stock: <span className="text-emerald-400 font-bold">{product.stock} units</span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3
                    onClick={() => navigateTo('product-details', { productId: product.id })}
                    className="font-display font-bold text-base text-white group-hover:text-pink-300 transition cursor-pointer"
                  >
                    {product.name}
                  </h3>
                  <p className="text-zinc-400 text-xs line-clamp-2 mt-1.5 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Colors Preview Dots */}
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-[10px] text-zinc-500 uppercase font-mono">Colors:</span>
                    <div className="flex items-center gap-1">
                      {product.available_colors.map(color => (
                        <span
                          key={color}
                          className="w-3.5 h-3.5 rounded-full border border-zinc-600 inline-block"
                          style={{
                            backgroundColor:
                              color === 'Black'
                                ? '#15171C'
                                : color === 'White'
                                ? '#F4F5F7'
                                : color === 'Navy Blue'
                                ? '#0F1E38'
                                : color === 'Pink'
                                ? '#E89CB5'
                                : '#6B7688',
                          }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Price and Action Buttons */}
                <div className="pt-3 border-t border-zinc-800 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-zinc-500 block uppercase font-mono">
                      Base Price
                    </span>
                    <span className="text-lg font-bold text-white font-mono">
                      ₹{product.base_price}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      id={`view-details-${product.id}`}
                      onClick={() => navigateTo('product-details', { productId: product.id })}
                      title="View Details"
                      className="p-2 rounded-lg bg-[#181D28] hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 transition"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      id={`customize-btn-${product.id}`}
                      onClick={() => navigateTo('customize', { productId: product.id })}
                      className="px-4 py-2 rounded-lg bg-pink-500 hover:bg-pink-600 text-white font-semibold text-xs tracking-wider uppercase transition flex items-center gap-1.5 shadow-md shadow-pink-500/20"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Customize</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
