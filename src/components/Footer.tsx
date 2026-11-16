export function Footer() {
  return (
    <footer className="border-t border-[#1C1513]/10 bg-[#F2EFEA]/60">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-[#1C1513]/10">
          <div className="md:col-span-5">
            <p className="font-display text-xl font-semibold text-[#1C1513] mb-3">
              Café Coffee Day
            </p>
            <p className="text-sm text-[#5E5450] leading-relaxed max-w-[40ch]">
              India’s homegrown coffeehouse since 1996. Shade-grown Chikmagalur Arabica,
              small-batch roasting, and welcoming neighbourhood cafés.
            </p>
          </div>

          <div className="md:col-span-2 space-y-2.5 text-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#1C1513] mb-3">
              Explore
            </p>
            <a href="#menu" className="block text-[#5E5450] hover:text-[#1C1513] transition-colors">
              Signature Menu
            </a>
            <a href="#heritage" className="block text-[#5E5450] hover:text-[#1C1513] transition-colors">
              Chikmagalur Estates
            </a>
            <a href="#cafes" className="block text-[#5E5450] hover:text-[#1C1513] transition-colors">
              Café Locator
            </a>
          </div>

          <div className="md:col-span-3 space-y-2.5 text-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#1C1513] mb-3">
              Flagship Cities
            </p>
            <p className="text-[#5E5450]">Bengaluru · Brigade Road &amp; Indiranagar</p>
            <p className="text-[#5E5450]">Mumbai · Carter Road Promenade</p>
            <p className="text-[#5E5450]">New Delhi · Connaught Place</p>
          </div>

          <div className="md:col-span-2 space-y-2.5 text-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#1C1513] mb-3">
              Roastery Care
            </p>
            <p className="text-[#5E5450] tabular-nums">1800 102 5093</p>
            <p className="text-[#5E5450]">customercare@cafecoffeeday.com</p>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#5E5450]">
          <p>© 2026 Café Coffee Day. A lot can happen over coffee.</p>
          <p>Roasted in Bengaluru · 100% Shade-Grown Indian Arabica</p>
        </div>
      </div>
    </footer>
  );
}
