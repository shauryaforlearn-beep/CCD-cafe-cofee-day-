import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { CAFE_LOCATIONS, CafeLocation, CartItem, MenuItem } from './data/ccdData';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { MenuSection } from './components/MenuSection';
import { ProductDetailModal } from './components/ProductDetailModal';
import { HeritageAndLocator } from './components/HeritageAndLocator';
import { OrderBagDrawer } from './components/OrderBagDrawer';
import { Footer } from './components/Footer';

export default function App() {
  const [selectedCafe, setSelectedCafe] = useState<CafeLocation>(CAFE_LOCATIONS[0]);
  const [activeProduct, setActiveProduct] = useState<MenuItem | null>(null);
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!feedbackMessage) return;
    const timer = window.setTimeout(() => setFeedbackMessage(null), 2600);
    return () => window.clearTimeout(timer);
  }, [feedbackMessage]);

  const addConfiguredItemToBag = (payload: {
    item: MenuItem;
    sizeLabel: string;
    prepLabel: string;
    hasAddon: boolean;
    unitPrice: number;
    quantity: number;
  }) => {
    const cartKey = `${payload.item.id}__${payload.sizeLabel}__${payload.prepLabel}__${payload.hasAddon}`;
    setCartItems((prev) => {
      const existing = prev.find((entry) => entry.cartKey === cartKey);
      if (existing) {
        return prev.map((entry) =>
          entry.cartKey === cartKey
            ? { ...entry, quantity: entry.quantity + payload.quantity }
            : entry
        );
      }
      return [...prev, { ...payload, cartKey }];
    });
    setFeedbackMessage(`Added ${payload.item.name} to bag`);
  };

  const handleQuickAdd = (item: MenuItem) => {
    const defaultSize = item.sizeOptions[0];
    const defaultPrep = item.prepOptions[0];
    addConfiguredItemToBag({
      item,
      sizeLabel: defaultSize?.label ?? '',
      prepLabel: defaultPrep?.label ?? '',
      hasAddon: false,
      unitPrice: item.price + (defaultSize?.priceDelta ?? 0) + (defaultPrep?.priceDelta ?? 0),
      quantity: 1,
    });
  };

  const handleUpdateQuantity = (cartKey: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((entry) =>
          entry.cartKey === cartKey
            ? { ...entry, quantity: entry.quantity + delta }
            : entry
        )
        .filter((entry) => entry.quantity > 0)
    );
  };

  const handleRemoveItem = (cartKey: string) => {
    setCartItems((prev) => prev.filter((entry) => entry.cartKey !== cartKey));
  };

  const handleSelectPickupCafe = (cafe: CafeLocation) => {
    setSelectedCafe(cafe);
    setFeedbackMessage(`Pickup café set to ${cafe.name}`);
  };

  const totalBagCount = cartItems.reduce((sum, entry) => sum + entry.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F7] text-[#1C1513]">
      <Navbar bagCount={totalBagCount} onOpenBag={() => setIsBagOpen(true)} />

      <main className="flex-1">
        <HeroSection selectedCafe={selectedCafe} />
        <MenuSection
          onSelectProduct={(item) => setActiveProduct(item)}
          onQuickAdd={handleQuickAdd}
        />
        <HeritageAndLocator
          selectedCafe={selectedCafe}
          onSelectPickupCafe={handleSelectPickupCafe}
        />
      </main>

      <Footer />

      <ProductDetailModal
        item={activeProduct}
        onClose={() => setActiveProduct(null)}
        onAddToBag={addConfiguredItemToBag}
      />

      <OrderBagDrawer
        isOpen={isBagOpen}
        onClose={() => setIsBagOpen(false)}
        items={cartItems}
        selectedCafe={selectedCafe}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearBag={() => setCartItems([])}
      />

      {/* Brief accessible feedback toast when adding items or changing café */}
      {feedbackMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-40 flex items-center gap-3 px-4 py-3 rounded-xl bg-[#1C1513] text-white text-sm shadow-lg"
        >
          <Check className="w-4 h-4 text-white shrink-0" />
          <span>{feedbackMessage}</span>
          <button
            type="button"
            onClick={() => setIsBagOpen(true)}
            className="text-xs font-semibold underline underline-offset-2 hover:text-white/80 cursor-pointer ml-1"
          >
            View Bag
          </button>
        </div>
      )}
    </div>
  );
}
