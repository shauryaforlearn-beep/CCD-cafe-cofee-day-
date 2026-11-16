import { ArrowRight, MapPin } from 'lucide-react';
import { CafeLocation, HERO_IMAGE } from '../data/ccdData';
import { ImageWithFallback } from './ImageWithFallback';

interface HeroSectionProps {
  selectedCafe: CafeLocation;
}

const HERITAGE_METRICS = [
  { value: '1996', label: 'First café opened on Brigade Road, Bengaluru' },
  { value: '1,300m', label: 'Chikmagalur shade-grown Arabica elevation' },
  { value: '100%', label: 'Single-origin Indian estate Arabica beans' },
  { value: '450+', label: 'Neighbourhood cafés across India' },
];

export function HeroSection({ selectedCafe }: HeroSectionProps) {
  return (
    <section id="top" className="border-b border-[#1C1513]/10">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 pt-10 pb-12 lg:pt-14 lg:pb-16">
        {/* 2-Column Editorial Hero Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-between py-2">
            <div>
              <p className="text-xs font-medium tracking-[0.14em] uppercase text-[#5E5450] mb-5">
                Bengaluru · Since 1996 · Single-Estate Arabica
              </p>

              <h1
                className="font-display font-semibold tracking-tight text-[#1C1513] leading-[1.06] mb-6"
                style={{ fontSize: 'clamp(2.4rem, 4.2vw, 3.85rem)', textWrap: 'balance' }}
              >
                A lot can happen over coffee.
              </h1>

              <p className="text-base lg:text-lg text-[#5E5450] leading-relaxed max-w-[54ch] mb-8">
                Shade-grown on misty Chikmagalur slopes, small-batch roasted each week, and
                poured fresh at your neighbourhood Café Coffee Day table.
              </p>

              <div className="flex flex-wrap items-center gap-5 mb-10">
                <a
                  href="#menu"
                  className="inline-flex items-center gap-2 min-h-[44px] px-6 py-3 rounded-lg bg-[#A6192E] hover:bg-[#8B1426] text-white text-sm font-semibold transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A6192E]"
                >
                  <span>Explore the Menu</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href="#cafes"
                  className="inline-flex items-center gap-2 min-h-[44px] px-3 py-2 text-sm font-semibold text-[#1C1513] hover:text-[#A6192E] transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A6192E]"
                >
                  <span>Find a Café</span>
                </a>
              </div>
            </div>

            {/* Active Pickup Café Strip — unboxed metadata */}
            <div className="pt-6 border-t border-[#1C1513]/10 flex flex-wrap items-center justify-between gap-4 text-sm">
              <div className="flex items-center gap-2.5 text-[#1C1513]">
                <MapPin className="w-4 h-4 text-[#A6192E] shrink-0" />
                <span>
                  <span className="text-[#5E5450]">Pickup Café:</span>{' '}
                  <span className="font-semibold">{selectedCafe.name}</span>
                  <span className="text-[#5E5450]" aria-hidden="true"> · </span>
                  <span className="text-[#5E5450] tabular-nums">
                    Ready in {selectedCafe.prepMinutes} mins
                  </span>
                </span>
              </div>
              <a
                href="#cafes"
                className="text-xs font-semibold text-[#A6192E] hover:underline whitespace-nowrap shrink-0"
              >
                Change Café
              </a>
            </div>
          </div>

          {/* Right Media Column */}
          <div className="lg:col-span-6">
            <div className="relative h-full min-h-[300px] lg:min-h-[460px] rounded-2xl overflow-hidden bg-[#F2EFEA]">
              <ImageWithFallback
                src={HERO_IMAGE}
                alt="Barista serving freshly poured Café Coffee Day cappuccino on a sunlit teak wood table"
                className="w-full h-full lg:h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Full-Width 4-Column Heritage Strip */}
        <div className="mt-12 pt-8 border-t border-[#1C1513]/10 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {HERITAGE_METRICS.map((metric) => (
            <div key={metric.label} className="space-y-1">
              <p className="font-display text-2xl lg:text-3xl font-semibold text-[#1C1513] tabular-nums">
                {metric.value}
              </p>
              <p className="text-xs sm:text-sm text-[#5E5450] leading-snug">{metric.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
