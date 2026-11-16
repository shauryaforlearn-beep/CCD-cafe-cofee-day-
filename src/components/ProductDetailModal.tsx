import { useEffect, useState } from 'react';
import { Check, Minus, Plus, X } from 'lucide-react';
import { MenuItem } from '../data/ccdData';
import { ImageWithFallback } from './ImageWithFallback';

interface ProductDetailModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToBag: (payload: {
    item: MenuItem;
    sizeLabel: string;
    prepLabel: string;
    hasAddon: boolean;
    unitPrice: number;
    quantity: number;
  }) => void;
}

export function ProductDetailModal({ item, onClose, onAddToBag }: ProductDetailModalProps) {
  const [selectedSizeId, setSelectedSizeId] = useState<string>('');
  const [selectedPrepId, setSelectedPrepId] = useState<string>('');
  const [hasAddon, setHasAddon] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (item) {
      setSelectedSizeId(item.sizeOptions[0]?.id ?? '');
      setSelectedPrepId(item.prepOptions[0]?.id ?? '');
      setHasAddon(false);
      setQuantity(1);
    }
  }, [item]);

  useEffect(() => {
    if (!item) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [item, onClose]);

  if (!item) return null;

  const selectedSize =
    item.sizeOptions.find((opt) => opt.id === selectedSizeId) ?? item.sizeOptions[0];
  const selectedPrep =
    item.prepOptions.find((opt) => opt.id === selectedPrepId) ?? item.prepOptions[0];

  const addonCost = hasAddon && item.addonPrice ? item.addonPrice : 0;
  const unitPrice = item.price + (selectedSize?.priceDelta ?? 0) + (selectedPrep?.priceDelta ?? 0) + addonCost;
  const lineTotal = unitPrice * quantity;

  const handleConfirmAdd = () => {
    onAddToBag({
      item,
      sizeLabel: selectedSize?.label ?? '',
      prepLabel: selectedPrep?.label ?? '',
      hasAddon,
      unitPrice,
      quantity,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#1C1513]/55 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#FAF9F7] rounded-2xl border border-[#1C1513]/10 shadow-xl grid grid-cols-1 lg:grid-cols-12">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close product details"
          className="absolute top-4 right-4 z-10 inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white/90 hover:bg-white text-[#1C1513] border border-[#1C1513]/10 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#A6192E]"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left: Sticky Media Column */}
        <div className="lg:col-span-6 bg-[#F2EFEA] flex flex-col">
          <div className="aspect-[4/3] lg:aspect-auto lg:flex-1 w-full overflow-hidden">
            <ImageWithFallback
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6 border-t border-[#1C1513]/10 space-y-1.5 text-xs text-[#5E5450]">
            <p className="font-semibold text-[#1C1513] uppercase tracking-[0.08em]">
              Tasting Notes
            </p>
            <p>{item.tastingNotes}</p>
            <p>
              <span className="text-[#1C1513] font-medium">Origin:</span> {item.origin}
            </p>
          </div>
        </div>

        {/* Right: Contiguous Purchase Module */}
        <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between gap-6">
          <div>
            <p className="text-xs font-medium text-[#5E5450] mb-2">
              <span className="uppercase tracking-[0.08em]">{item.category}</span>
              <span aria-hidden="true"> · </span>
              <span>{item.isVegetarian ? '100% Vegetarian' : 'Chef Special'}</span>
            </p>

            <h2
              id="product-modal-title"
              className="font-display text-2xl sm:text-3xl font-semibold text-[#1C1513] leading-tight mb-2"
            >
              {item.name}
            </h2>

            <p className="text-xl font-semibold text-[#A6192E] tabular-nums mb-4">
              ₹{unitPrice}
            </p>

            <p className="text-sm text-[#5E5450] leading-relaxed mb-6">{item.description}</p>

            {/* Size / Pack Options */}
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#1C1513] mb-2.5">
                Select Size / Pack
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {item.sizeOptions.map((opt) => {
                  const isSelected = opt.id === selectedSize?.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedSizeId(opt.id)}
                      className={`p-3 rounded-lg border text-left transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#A6192E] ${
                        isSelected
                          ? 'border-[#A6192E] bg-[#A6192E]/5 text-[#1C1513]'
                          : 'border-[#1C1513]/15 bg-white text-[#1C1513] hover:border-[#1C1513]/30'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold">{opt.label}</span>
                        {opt.priceDelta !== 0 && (
                          <span className="text-xs font-medium text-[#5E5450] tabular-nums">
                            {opt.priceDelta > 0 ? `+₹${opt.priceDelta}` : `-₹${Math.abs(opt.priceDelta)}`}
                          </span>
                        )}
                      </div>
                      <span className="block text-[11px] text-[#5E5450] mt-0.5 tabular-nums">
                        {opt.meta}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Milk / Preparation Options */}
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#1C1513] mb-2.5">
                Preparation &amp; Preference
              </p>
              <div className="space-y-2">
                {item.prepOptions.map((opt) => {
                  const isSelected = opt.id === selectedPrep?.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedPrepId(opt.id)}
                      className={`w-full min-h-[42px] px-3.5 py-2 rounded-lg border flex items-center justify-between text-left transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#A6192E] ${
                        isSelected
                          ? 'border-[#A6192E] bg-[#A6192E]/5 text-[#1C1513]'
                          : 'border-[#1C1513]/15 bg-white text-[#5E5450] hover:text-[#1C1513]'
                      }`}
                    >
                      <span className="text-xs font-medium text-[#1C1513]">{opt.label}</span>
                      <span className="text-xs tabular-nums text-[#5E5450]">
                        {opt.priceDelta > 0 ? `+₹${opt.priceDelta}` : 'Included'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Optional Barista Add-on */}
            {item.addonLabel && (
              <label className="flex items-center justify-between gap-3 p-3.5 rounded-lg border border-[#1C1513]/15 bg-white cursor-pointer hover:border-[#1C1513]/30 transition-colors">
                <span className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={hasAddon}
                    onChange={(e) => setHasAddon(e.target.checked)}
                    className="sr-only"
                  />
                  <span
                    className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                      hasAddon
                        ? 'bg-[#A6192E] border-[#A6192E] text-white'
                        : 'border-[#1C1513]/30 bg-white'
                    }`}
                  >
                    {hasAddon && <Check className="w-3.5 h-3.5" />}
                  </span>
                  <span className="text-xs font-medium text-[#1C1513]">{item.addonLabel}</span>
                </span>
                <span className="text-xs font-medium text-[#5E5450] tabular-nums">
                  {item.addonPrice && item.addonPrice > 0 ? `+₹${item.addonPrice}` : 'Complimentary'}
                </span>
              </label>
            )}
          </div>

          {/* Quantity & Add CTA */}
          <div className="pt-4 border-t border-[#1C1513]/10 flex items-center gap-3">
            <div className="inline-flex items-center border border-[#1C1513]/15 rounded-lg bg-white">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="w-10 h-11 inline-flex items-center justify-center text-[#1C1513] hover:bg-[#F2EFEA] rounded-l-lg transition-colors cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-10 text-center text-sm font-semibold tabular-nums">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Increase quantity"
                className="w-10 h-11 inline-flex items-center justify-center text-[#1C1513] hover:bg-[#F2EFEA] rounded-r-lg transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleConfirmAdd}
              className="flex-1 min-h-[44px] px-5 py-3 rounded-lg bg-[#A6192E] hover:bg-[#8B1426] text-white text-sm font-semibold transition-colors duration-150 tabular-nums cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A6192E]"
            >
              Add to Bag · ₹{lineTotal}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
