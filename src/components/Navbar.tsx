import { useState } from 'react';
import { LogOut, Menu, ShoppingBag, User, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  bagCount: number;
  onOpenBag: () => void;
}

export function Navbar({ bagCount, onOpenBag }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, loading, signIn, signOut } = useAuth();

  const navLinks = [
    { label: 'Menu', href: '#menu' },
    { label: 'Roasts', href: '#menu' },
    { label: 'Heritage', href: '#heritage' },
    { label: 'Cafés', href: '#cafes' },
  ];

  const firstName = user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || 'Account';

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F7]/95 backdrop-blur-sm border-b border-[#1C1513]/10">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          className="font-display text-xl font-semibold tracking-tight text-[#1C1513] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A6192E]"
        >
          Café Coffee Day
        </a>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-8 text-sm font-medium text-[#5E5450]"
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="relative py-1 hover:text-[#1C1513] transition-colors duration-150 whitespace-nowrap shrink-0 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[1.5px] after:bg-[#A6192E] hover:after:w-full after:transition-all after:duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A6192E]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Account action + Primary Order Bag CTA */}
        <div className="flex items-center gap-3 shrink-0">
          {!loading &&
            (user ? (
              <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-[#5E5450]">
                <span className="truncate max-w-[110px] text-[#1C1513]">{firstName}</span>
                <button
                  type="button"
                  onClick={() => void signOut()}
                  aria-label="Sign out"
                  title="Sign out"
                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-[#5E5450] hover:text-[#A6192E] hover:bg-[#1C1513]/5 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => void signIn()}
                className="hidden sm:inline-flex items-center gap-1.5 min-h-[40px] px-3 py-2 rounded-lg text-sm font-medium text-[#5E5450] hover:text-[#1C1513] hover:bg-[#1C1513]/5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <User className="w-4 h-4 shrink-0" />
                <span>Sign In</span>
              </button>
            ))}

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-[#1C1513] hover:bg-[#1C1513]/5 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[#A6192E]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            type="button"
            onClick={onOpenBag}
            className="inline-flex items-center gap-2 min-h-[40px] px-4 py-2 rounded-lg bg-[#A6192E] hover:bg-[#8B1426] text-white text-sm font-medium transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A6192E]"
          >
            <ShoppingBag className="w-4 h-4 shrink-0" />
            <span>Order Bag</span>
            {bagCount > 0 && (
              <span className="tabular-nums font-semibold">· {bagCount}</span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <nav
          aria-label="Mobile navigation"
          className="md:hidden border-t border-[#1C1513]/10 bg-[#FAF9F7] px-6 py-4 flex flex-col gap-3"
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-sm font-medium text-[#1C1513] hover:text-[#A6192E] transition-colors"
            >
              {link.label}
            </a>
          ))}
          {!loading &&
            (user ? (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  void signOut();
                }}
                className="py-2 text-left text-sm font-medium text-[#5E5450] hover:text-[#A6192E] transition-colors cursor-pointer"
              >
                Sign out ({firstName})
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  void signIn();
                }}
                className="py-2 text-left text-sm font-medium text-[#A6192E] cursor-pointer"
              >
                Sign In with Google
              </button>
            ))}
        </nav>
      )}
    </header>
  );
}
