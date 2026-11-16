import { useCallback, useEffect, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from 'lucide-react';
import { CafeLocation, CartItem } from '../data/ccdData';
import { useAuth } from '../context/AuthContext';
import { ImageWithFallback } from './ImageWithFallback';

interface OrderBagDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  selectedCafe: CafeLocation;
  onUpdateQuantity: (cartKey: string, delta: number) => void;
  onRemoveItem: (cartKey: string) => void;
  onClearBag: () => void;
}

interface PersistedOrderItem {
  id: number;
  menuItemId: string;
  itemName: string;
  sizeLabel: string;
  prepLabel: string;
  addonLabel: string | null;
  unitPrice: number;
  quantity: number;
}

interface PersistedOrder {
  id: number;
  orderNumber: string;
  customerName: string;
  fulfillment: 'pickup' | 'delivery';
  cafeName: string;
  prepMinutes: number;
  total: number;
  status: string;
  createdAt: string;
  items: PersistedOrderItem[];
}

export function OrderBagDrawer({
  isOpen,
  onClose,
  items,
  selectedCafe,
  onUpdateQuantity,
  onRemoveItem,
  onClearBag,
}: OrderBagDrawerProps) {
  const { user, signIn, getIdToken, authError } = useAuth();
  const [fulfillment, setFulfillment] = useState<'pickup' | 'delivery'>('pickup');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<PersistedOrder | null>(null);
  const [pastOrders, setPastOrders] = useState<PersistedOrder[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState('');
  const [activeTab, setActiveTab] = useState<'bag' | 'history'>('bag');

  useEffect(() => {
    if (user?.displayName && !customerName) {
      setCustomerName(user.displayName);
    }
  }, [user, customerName]);

  const fetchOrderHistory = useCallback(async () => {
    if (!user) {
      setPastOrders([]);
      return;
    }
    setHistoryLoading(true);
    setHistoryError('');
    try {
      const token = await getIdToken();
      if (!token) return;
      const response = await fetch('/api/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = (await response.json()) as { orders?: PersistedOrder[]; error?: string };
      if (!response.ok) {
        throw new Error(data.error || 'Could not load past orders.');
      }
      setPastOrders(data.orders ?? []);
    } catch (error) {
      setHistoryError(
        error instanceof Error ? error.message : 'Unable to load past orders.'
      );
    } finally {
      setHistoryLoading(false);
    }
  }, [user, getIdToken]);

  useEffect(() => {
    if (isOpen && user) {
      void fetchOrderHistory();
    }
  }, [isOpen, user, fetchOrderHistory]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, entry) => sum + entry.unitPrice * entry.quantity, 0);
  const gst = Math.round(subtotal * 0.05);
  const deliveryFee = fulfillment === 'delivery' && subtotal > 0 ? 40 : 0;
  const grandTotal = subtotal + gst + deliveryFee;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setFormError('Please enter your name for the barista order slip.');
      return;
    }
    if (!/^\d{10}$/.test(customerPhone.replace(/\s+/g, ''))) {
      setFormError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (fulfillment === 'delivery' && !deliveryAddress.trim()) {
      setFormError('Please enter your delivery street address.');
      return;
    }

    setFormError('');
    setSubmitting(true);

    try {
      let activeUser = user;
      if (!activeUser) {
        activeUser = await signIn();
        if (!activeUser) {
          setSubmitting(false);
          return;
        }
      }

      const token = await activeUser.getIdToken();
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customerName: customerName.trim(),
          customerPhone: customerPhone.replace(/\s+/g, ''),
          fulfillment,
          deliveryAddress: fulfillment === 'delivery' ? deliveryAddress.trim() : null,
          cafeId: selectedCafe.id,
          cafeName: selectedCafe.name,
          prepMinutes: selectedCafe.prepMinutes,
          items: items.map((entry) => ({
            menuItemId: entry.item.id,
            itemName: entry.item.name,
            sizeLabel: entry.sizeLabel,
            prepLabel: entry.prepLabel,
            addonLabel:
              entry.hasAddon && entry.item.addonLabel ? entry.item.addonLabel : null,
            unitPrice: entry.unitPrice,
            quantity: entry.quantity,
          })),
        }),
      });

      const data = (await response.json()) as { order?: PersistedOrder; error?: string };
      if (!response.ok || !data.order) {
        throw new Error(data.error || 'Could not confirm your order.');
      }

      setConfirmedOrder(data.order);
      onClearBag();
      void fetchOrderHistory();
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : 'Unable to place order. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setConfirmedOrder(null);
    setActiveTab('bag');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#1C1513]/50 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label="Order bag and checkout"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleResetAndClose();
      }}
    >
      <aside className="w-full max-w-md h-full bg-[#FAF9F7] border-l border-[#1C1513]/10 shadow-2xl flex flex-col">
        {/* Drawer Header */}
        <div className="px-6 h-16 border-b border-[#1C1513]/10 flex items-center justify-between shrink-0">
          <h2 className="font-display text-xl font-semibold text-[#1C1513]">
            {confirmedOrder ? 'Order Receipt' : 'Your Order Bag'}
          </h2>
          <button
            type="button"
            onClick={handleResetAndClose}
            aria-label="Close order bag"
            className="w-10 h-10 inline-flex items-center justify-center rounded-lg text-[#5E5450] hover:text-[#1C1513] hover:bg-[#F2EFEA] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher when user has signed in and isn't on final receipt */}
        {!confirmedOrder && user && (
          <div className="px-6 pt-4 shrink-0">
            <div className="p-1 bg-[#F2EFEA] rounded-lg grid grid-cols-2 gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('bag')}
                className={`min-h-[36px] px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'bag'
                    ? 'bg-white text-[#1C1513] shadow-sm'
                    : 'text-[#5E5450] hover:text-[#1C1513]'
                }`}
              >
                Current Bag ({items.reduce((s, i) => s + i.quantity, 0)})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('history')}
                className={`min-h-[36px] px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'history'
                    ? 'bg-white text-[#1C1513] shadow-sm'
                    : 'text-[#5E5450] hover:text-[#1C1513]'
                }`}
              >
                Past Orders ({pastOrders.length})
              </button>
            </div>
          </div>
        )}

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {confirmedOrder ? (
            <div className="space-y-6">
              <div className="p-5 rounded-xl bg-white border border-[#1C1513]/10 space-y-3">
                <div className="flex items-center gap-2.5 text-[#A6192E]">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span className="text-xs font-semibold uppercase tracking-[0.08em]">
                    Order Confirmed
                  </span>
                </div>
                <h3 className="font-display text-2xl font-semibold text-[#1C1513] tabular-nums">
                  Order #{confirmedOrder.orderNumber}
                </h3>
                <p className="text-sm text-[#5E5450] leading-relaxed">
                  {confirmedOrder.fulfillment === 'pickup'
                    ? `Preparing fresh at ${confirmedOrder.cafeName} for ${confirmedOrder.customerName}. Estimated counter pickup in ${confirmedOrder.prepMinutes} mins.`
                    : `Preparing at ${confirmedOrder.cafeName} for express courier dispatch to ${confirmedOrder.customerName}.`}
                </p>
              </div>

              <div className="border-t border-b border-[#1C1513]/10 py-4 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#5E5450]">
                  Receipt Summary
                </p>
                {confirmedOrder.items.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-start justify-between gap-4 text-sm"
                  >
                    <div>
                      <p className="font-medium text-[#1C1513]">
                        {entry.quantity} × {entry.itemName}
                      </p>
                      <p className="text-xs text-[#5E5450]">
                        {entry.sizeLabel} · {entry.prepLabel}
                      </p>
                    </div>
                    <span className="font-medium text-[#1C1513] tabular-nums">
                      ₹{entry.unitPrice * entry.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-base font-semibold text-[#1C1513] tabular-nums">
                <span>Total Paid (incl. GST)</span>
                <span>₹{confirmedOrder.total}</span>
              </div>

              <button
                type="button"
                onClick={handleResetAndClose}
                className="w-full min-h-[44px] px-5 py-3 rounded-lg bg-[#1C1513] hover:bg-[#A6192E] text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                Back to Café Menu
              </button>
            </div>
          ) : activeTab === 'history' && user ? (
            <div className="space-y-4">
              {historyLoading ? (
                <p className="text-sm text-[#5E5450] py-8 text-center">
                  Loading your past café orders...
                </p>
              ) : historyError ? (
                <p className="text-sm text-[#A6192E] py-4" role="alert">
                  {historyError}
                </p>
              ) : pastOrders.length === 0 ? (
                <div className="py-12 text-center space-y-2">
                  <Clock className="w-8 h-8 text-[#5E5450]/50 mx-auto" />
                  <p className="font-display text-lg font-semibold text-[#1C1513]">
                    No orders yet
                  </p>
                  <p className="text-sm text-[#5E5450]">
                    Your confirmed café pickups and deliveries will appear here.
                  </p>
                </div>
              ) : (
                pastOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 rounded-xl bg-white border border-[#1C1513]/10 space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-display font-semibold text-[#1C1513] tabular-nums">
                        #{order.orderNumber}
                      </span>
                      <span className="text-sm font-semibold text-[#1C1513] tabular-nums">
                        ₹{order.total}
                      </span>
                    </div>
                    <p className="text-xs text-[#5E5450]">
                      {order.cafeName} · {order.fulfillment === 'pickup' ? 'Café Pickup' : 'Delivery'}
                    </p>
                    <div className="pt-2 border-t border-[#1C1513]/10 space-y-1">
                      {order.items.map((item) => (
                        <p key={item.id} className="text-xs text-[#1C1513]">
                          {item.quantity} × {item.itemName} ({item.sizeLabel})
                        </p>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <ShoppingBag className="w-10 h-10 text-[#5E5450]/50 mb-4" strokeWidth={1.5} />
              <p className="font-display text-xl font-semibold text-[#1C1513] mb-2">
                Your café bag is empty
              </p>
              <p className="text-sm text-[#5E5450] max-w-[30ch] mb-6">
                Add a Devil’s Own, Filter Kaapi, or Chikmagalur roast to start your café order.
              </p>
              <a
                href="#menu"
                onClick={onClose}
                className="inline-flex items-center justify-center min-h-[42px] px-5 py-2.5 rounded-lg bg-[#A6192E] hover:bg-[#8B1426] text-white text-sm font-semibold transition-colors"
              >
                Browse Menu
              </a>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Fulfillment Mode Selector */}
              <div className="p-1 bg-[#F2EFEA] rounded-lg grid grid-cols-2 gap-1">
                <button
                  type="button"
                  onClick={() => setFulfillment('pickup')}
                  className={`min-h-[40px] px-3 py-2 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                    fulfillment === 'pickup'
                      ? 'bg-white text-[#1C1513] shadow-sm'
                      : 'text-[#5E5450] hover:text-[#1C1513]'
                  }`}
                >
                  Café Pickup · Free
                </button>
                <button
                  type="button"
                  onClick={() => setFulfillment('delivery')}
                  className={`min-h-[40px] px-3 py-2 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                    fulfillment === 'delivery'
                      ? 'bg-white text-[#1C1513] shadow-sm'
                      : 'text-[#5E5450] hover:text-[#1C1513]'
                  }`}
                >
                  Express Delivery · ₹40
                </button>
              </div>

              {/* Selected Café Notice */}
              <div className="flex items-start justify-between gap-3 p-3.5 rounded-lg bg-white border border-[#1C1513]/10 text-xs">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#A6192E] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#1C1513]">{selectedCafe.name}</p>
                    <p className="text-[#5E5450] mt-0.5 tabular-nums">
                      {selectedCafe.city} · Est. {selectedCafe.prepMinutes} mins
                    </p>
                  </div>
                </div>
                <a
                  href="#cafes"
                  onClick={onClose}
                  className="font-semibold text-[#A6192E] hover:underline whitespace-nowrap shrink-0"
                >
                  Change
                </a>
              </div>

              {/* Itemized List */}
              <div className="divide-y divide-[#1C1513]/10 border-t border-b border-[#1C1513]/10">
                {items.map((entry) => (
                  <div key={entry.cartKey} className="py-4 flex gap-3.5">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#F2EFEA] shrink-0">
                      <ImageWithFallback
                        src={entry.item.image}
                        alt={entry.item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-semibold text-[#1C1513] truncate">
                          {entry.item.name}
                        </h3>
                        <span className="text-sm font-semibold text-[#1C1513] tabular-nums shrink-0">
                          ₹{entry.unitPrice * entry.quantity}
                        </span>
                      </div>
                      <p className="text-xs text-[#5E5450] mt-0.5">
                        {entry.sizeLabel} · {entry.prepLabel}
                        {entry.hasAddon && entry.item.addonLabel ? ` · ${entry.item.addonLabel}` : ''}
                      </p>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="inline-flex items-center border border-[#1C1513]/15 rounded-md bg-white">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(entry.cartKey, -1)}
                            aria-label={`Decrease quantity of ${entry.item.name}`}
                            className="w-8 h-8 inline-flex items-center justify-center text-[#1C1513] hover:bg-[#F2EFEA] cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center text-xs font-semibold tabular-nums">
                            {entry.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(entry.cartKey, 1)}
                            aria-label={`Increase quantity of ${entry.item.name}`}
                            className="w-8 h-8 inline-flex items-center justify-center text-[#1C1513] hover:bg-[#F2EFEA] cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => onRemoveItem(entry.cartKey)}
                          aria-label={`Remove ${entry.item.name}`}
                          className="inline-flex items-center gap-1 text-xs text-[#5E5450] hover:text-[#A6192E] transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-[#5E5450] tabular-nums">
                  <span>Item Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-[#5E5450] tabular-nums">
                  <span>GST (5%)</span>
                  <span>₹{gst}</span>
                </div>
                <div className="flex justify-between text-[#5E5450] tabular-nums">
                  <span>{fulfillment === 'pickup' ? 'Café Pickup' : 'Express Delivery'}</span>
                  <span>{deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`}</span>
                </div>
                <div className="pt-2 border-t border-[#1C1513]/10 flex justify-between text-base font-semibold text-[#1C1513] tabular-nums">
                  <span>Grand Total</span>
                  <span>₹{grandTotal}</span>
                </div>
              </div>

              {/* Checkout Verification Form */}
              <form onSubmit={(e) => void handlePlaceOrder(e)} className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#1C1513]">
                    Guest Details
                  </p>
                  {!user && (
                    <button
                      type="button"
                      onClick={() => void signIn()}
                      className="text-xs font-semibold text-[#A6192E] hover:underline cursor-pointer"
                    >
                      Sign in with Google
                    </button>
                  )}
                </div>

                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Your full name"
                  aria-label="Full name"
                  className="w-full min-h-[42px] px-3.5 py-2 rounded-lg bg-white border border-[#1C1513]/15 text-sm text-[#1C1513] focus:outline-none focus:border-[#A6192E]"
                />

                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                  aria-label="Mobile number"
                  className="w-full min-h-[42px] px-3.5 py-2 rounded-lg bg-white border border-[#1C1513]/15 text-sm text-[#1C1513] tabular-nums focus:outline-none focus:border-[#A6192E]"
                />

                {fulfillment === 'delivery' && (
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Street address, landmark, and PIN code"
                    aria-label="Delivery address"
                    className="w-full min-h-[42px] px-3.5 py-2 rounded-lg bg-white border border-[#1C1513]/15 text-sm text-[#1C1513] focus:outline-none focus:border-[#A6192E]"
                  />
                )}

                {(formError || authError) && (
                  <p className="text-xs font-medium text-[#A6192E]" role="alert">
                    {formError || authError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full min-h-[46px] px-5 py-3 rounded-lg bg-[#A6192E] hover:bg-[#8B1426] disabled:opacity-60 text-white text-sm font-semibold transition-colors tabular-nums cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A6192E]"
                >
                  {submitting
                    ? 'Confirming Order...'
                    : user
                    ? `Confirm Order · ₹${grandTotal}`
                    : `Sign in & Confirm Order · ₹${grandTotal}`}
                </button>
              </form>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
