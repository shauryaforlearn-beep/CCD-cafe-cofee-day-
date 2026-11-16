import { useMemo, useState } from 'react';
import { Plus, Search, SlidersHorizontal } from 'lucide-react';
import { MENU_ITEMS, MenuCategory, MenuItem } from '../data/ccdData';
import { ImageWithFallback } from './ImageWithFallback';

interface MenuSectionProps {
  onSelectProduct: (item: MenuItem) => void;
  onQuickAdd: (item: MenuItem) => void;
}

const CATEGORIES: Array<'All' | MenuCategory> = [
  'All',
  'Cold Classics',
  'Hot Brews',
  'Estate Beans',
  'Bakery & Bites',
];

export function MenuSection({ onSelectProduct, onQuickAdd }: MenuSectionProps) {
  const [activeCategory, setActiveCategory] = useState<'All' | MenuCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [icedOnly, setIcedOnly] = useState(false);

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return MENU_ITEMS.filter((item) => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchesIced = !icedOnly || item.isIced;
      const matchesQuery =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.shortNote.toLowerCase().includes(query) ||
        item.tastingNotes.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);
      return matchesCategory && matchesIced && matchesQuery;
    });
  }, [activeCategory, searchQuery, icedOnly]);

  return (
    <section id="menu" className="max-w-[1280px] mx-auto px-6 lg:px-10 py-16 lg:py-20">
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
        <div>
          <p className="text-xs font-medium tracking-[0.14em] uppercase text-[#5E5450] mb-2">
            Crafted to Order
          </p>
          <h2
            className="font-display text-3xl lg:text-4xl font-semibold tracking-tight text-[#1C1513]"
            style={{ textWrap: 'balance' }}
          >
            Signature Brews &amp; Estate Roasts
          </h2>
        </div>

        {/* Search Input */}
        <div className="relative w-full lg:w-80">
          <Search
            className="w-4 h-4 text-[#5E5450] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search frappe, kaapi, beans..."
            aria-label="Search café menu"
            className="w-full min-h-[42px] pl-10 pr-4 py-2 rounded-lg bg-white border border-[#1C1513]/15 text-sm text-[#1C1513] placeholder:text-[#5E5450]/70 focus:outline-none focus:border-[#A6192E] transition-colors"
          />
        </div>
      </div>

      {/* Category Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-8 mb-10 border-b border-[#1C1513]/10">
        <div
          role="tablist"
          aria-label="Menu categories"
          className="flex flex-wrap items-center gap-1.5 p-1 bg-[#F2EFEA] rounded-lg"
        >
          {CATEGORIES.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveCategory(category)}
                className={`min-h-[38px] px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#A6192E] ${
                  isActive
                    ? 'bg-white text-[#1C1513] shadow-sm'
                    : 'text-[#5E5450] hover:text-[#1C1513]'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setIcedOnly((prev) => !prev)}
            aria-pressed={icedOnly}
            className={`inline-flex items-center gap-2 min-h-[38px] px-3.5 py-2 rounded-lg border text-xs font-medium transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#A6192E] ${
              icedOnly
                ? 'border-[#A6192E] bg-[#A6192E]/10 text-[#A6192E]'
                : 'border-[#1C1513]/15 bg-white text-[#5E5450] hover:text-[#1C1513]'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Iced Only</span>
          </button>

          <span className="text-xs text-[#5E5450] tabular-nums whitespace-nowrap">
            {filteredItems.length} {filteredItems.length === 1 ? 'selection' : 'selections'}
          </span>
        </div>
      </div>

      {/* Product Grid */}
      {filteredItems.length === 0 ? (
        <div className="py-16 text-center bg-[#F2EFEA]/60 rounded-2xl border border-[#1C1513]/10">
          <p className="font-display text-xl text-[#1C1513] mb-2">
            No matching brews found
          </p>
          <p className="text-sm text-[#5E5450] mb-6">
            Try clearing your search or switching back to all café categories.
          </p>
          <button
            type="button"
            onClick={() => {
              setActiveCategory('All');
              setSearchQuery('');
              setIcedOnly(false);
            }}
            className="min-h-[40px] px-5 py-2 rounded-lg bg-[#A6192E] hover:bg-[#8B1426] text-white text-sm font-medium transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <article
              key={item.id}
              className="group flex flex-col bg-white rounded-xl border border-[#1C1513]/10 overflow-hidden transition-transform duration-200 hover:-translate-y-0.5"
            >
              {/* 4:3 Image Frame */}
              <button
                type="button"
                onClick={() => onSelectProduct(item)}
                className="relative aspect-[4/3] w-full overflow-hidden bg-[#F2EFEA] text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#A6192E]"
                aria-label={`Customize and view details for ${item.name}`}
              >
                <ImageWithFallback
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </button>

              {/* Card Body */}
              <div className="flex-1 flex flex-col justify-between p-6">
                <div>
                  {/* Clean Unboxed Metadata */}
                  <p className="text-xs font-medium text-[#5E5450] mb-2">
                    <span className="uppercase tracking-[0.06em]">{item.category}</span>
                    <span aria-hidden="true"> · </span>
                    <span className="tabular-nums">{item.servingMeta}</span>
                  </p>

                  <h3 className="text-lg font-semibold text-[#1C1513] leading-snug mb-2">
                    <button
                      type="button"
                      onClick={() => onSelectProduct(item)}
                      className="text-left hover:text-[#A6192E] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#A6192E]"
                    >
                      {item.name}
                    </button>
                  </h3>

                  <p className="text-sm text-[#5E5450] leading-relaxed line-clamp-2 mb-5">
                    {item.shortNote}
                  </p>
                </div>

                {/* Price & Action Baseline */}
                <div className="pt-4 border-t border-[#1C1513]/8 flex items-center justify-between gap-4">
                  <span className="text-base font-semibold text-[#1C1513] tabular-nums">
                    ₹{item.price}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectProduct(item)}
                      className="min-h-[40px] px-3.5 py-2 rounded-lg text-xs font-semibold text-[#5E5450] hover:text-[#1C1513] hover:bg-[#F2EFEA] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#A6192E]"
                    >
                      Customize
                    </button>

                    <button
                      type="button"
                      onClick={() => onQuickAdd(item)}
                      className="inline-flex items-center gap-1.5 min-h-[40px] px-4 py-2 rounded-lg bg-[#1C1513] hover:bg-[#A6192E] text-white text-xs font-semibold transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#A6192E]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
