import { useCallback, useEffect, useMemo, useState } from 'react';
import { CalendarCheck, Check, Clock, MapPin, Search } from 'lucide-react';
import { CAFE_LOCATIONS, CRAFT_PILLARS, CafeLocation } from '../data/ccdData';
import { useAuth } from '../context/AuthContext';

interface HeritageAndLocatorProps {
  selectedCafe: CafeLocation;
  onSelectPickupCafe: (cafe: CafeLocation) => void;
}

interface PersistedReservation {
  id: number;
  cafeId: string;
  cafeName: string;
  guestCount: string;
  timeSlot: string;
  status: string;
  createdAt: string;
}

const CITIES: Array<'All Cities' | CafeLocation['city']> = [
  'All Cities',
  'Bengaluru',
  'Mumbai',
  'New Delhi',
  'Pune',
  'Hyderabad',
];

export function HeritageAndLocator({
  selectedCafe,
  onSelectPickupCafe,
}: HeritageAndLocatorProps) {
  const { user, signIn, getIdToken } = useAuth();
  const [activeCity, setActiveCity] = useState<'All Cities' | CafeLocation['city']>('All Cities');
  const [cafeQuery, setCafeQuery] = useState('');
  const [reservingCafeId, setReservingCafeId] = useState<string | null>(null);
  const [guestCount, setGuestCount] = useState('2 Guests');
  const [timeSlot, setTimeSlot] = useState('6:30 PM');
  const [reservationConfirmedFor, setReservationConfirmedFor] = useState<string | null>(null);
  const [reservingSubmitting, setReservingSubmitting] = useState(false);
  const [reservationError, setReservationError] = useState('');

  const loadLatestReservation = useCallback(async () => {
    if (!user) {
      setReservationConfirmedFor(null);
      return;
    }
    try {
      const token = await getIdToken();
      if (!token) return;
      const response = await fetch('/api/reservations', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) return;
      const data = (await response.json()) as { reservations?: PersistedReservation[] };
      const latest = data.reservations?.[0];
      if (latest) {
        setReservationConfirmedFor(
          `${latest.cafeName} · ${latest.guestCount} at ${latest.timeSlot}`
        );
      }
    } catch {
      // Keep UI interactive if initial reservation load fails
    }
  }, [user, getIdToken]);

  useEffect(() => {
    void loadLatestReservation();
  }, [loadLatestReservation]);

  const filteredCafes = useMemo(() => {
    const q = cafeQuery.trim().toLowerCase();
    return CAFE_LOCATIONS.filter((cafe) => {
      const matchesCity = activeCity === 'All Cities' || cafe.city === activeCity;
      const matchesQuery =
        !q ||
        cafe.name.toLowerCase().includes(q) ||
        cafe.address.toLowerCase().includes(q) ||
        cafe.city.toLowerCase().includes(q);
      return matchesCity && matchesQuery;
    });
  }, [activeCity, cafeQuery]);

  const handleConfirmReservation = async (cafe: CafeLocation) => {
    setReservationError('');
    setReservingSubmitting(true);
    try {
      let activeUser = user;
      if (!activeUser) {
        activeUser = await signIn();
        if (!activeUser) {
          setReservingSubmitting(false);
          return;
        }
      }

      const token = await activeUser.getIdToken();
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          cafeId: cafe.id,
          cafeName: cafe.name,
          guestCount,
          timeSlot,
        }),
      });

      const data = (await response.json()) as {
        reservation?: PersistedReservation;
        error?: string;
      };
      if (!response.ok || !data.reservation) {
        throw new Error(data.error || 'Could not hold table. Please try again.');
      }

      setReservationConfirmedFor(
        `${data.reservation.cafeName} · ${data.reservation.guestCount} at ${data.reservation.timeSlot}`
      );
      setReservingCafeId(null);
    } catch (error) {
      setReservationError(
        error instanceof Error ? error.message : 'Unable to reserve table right now.'
      );
    } finally {
      setReservingSubmitting(false);
    }
  };

  return (
    <>
      {/* Section 3: Chikmagalur Heritage & Craft */}
      <section
        id="heritage"
        className="border-t border-[#1C1513]/10 bg-[#F2EFEA]/70"
      >
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            <div className="lg:col-span-5">
              <p className="text-xs font-medium tracking-[0.14em] uppercase text-[#5E5450] mb-3">
                From Bean to Cup
              </p>
              <h2
                className="font-display text-3xl lg:text-4xl font-semibold tracking-tight text-[#1C1513] leading-tight mb-5"
                style={{ textWrap: 'balance' }}
              >
                Grown in the Western Ghats. Roasted for daily rituals.
              </h2>
              <p className="text-base text-[#5E5450] leading-relaxed">
                What started as India’s first cyber-café on Brigade Road in 1996 grew into a
                nationwide coffee culture anchored by our own estates in Chikmagalur,
                Karnataka.
              </p>
            </div>

            <div className="lg:col-span-7 divide-y divide-[#1C1513]/10 border-t border-b border-[#1C1513]/10">
              {CRAFT_PILLARS.map((pillar) => (
                <div
                  key={pillar.index}
                  className="py-6 grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-6 items-baseline"
                >
                  <span className="sm:col-span-2 font-display text-lg font-semibold text-[#A6192E] tabular-nums">
                    {pillar.index}
                  </span>
                  <div className="sm:col-span-10">
                    <h3 className="text-base font-semibold text-[#1C1513] mb-1.5">
                      {pillar.title}
                    </h3>
                    <p className="text-sm text-[#5E5450] leading-relaxed">{pillar.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Interactive Café Locator */}
      <section
        id="cafes"
        className="border-t border-[#1C1513]/10 max-w-[1280px] mx-auto px-6 lg:px-10 py-16 lg:py-20"
      >
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div>
            <p className="text-xs font-medium tracking-[0.14em] uppercase text-[#5E5450] mb-2">
              Neighbourhood Tables &amp; Express Pickup
            </p>
            <h2
              className="font-display text-3xl lg:text-4xl font-semibold tracking-tight text-[#1C1513]"
              style={{ textWrap: 'balance' }}
            >
              Find Your Nearest Café Coffee Day
            </h2>
          </div>

          <div className="relative w-full lg:w-80">
            <Search
              className="w-4 h-4 text-[#5E5450] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={cafeQuery}
              onChange={(e) => setCafeQuery(e.target.value)}
              placeholder="Search neighbourhood or city..."
              aria-label="Search café locations"
              className="w-full min-h-[42px] pl-10 pr-4 py-2 rounded-lg bg-white border border-[#1C1513]/15 text-sm text-[#1C1513] placeholder:text-[#5E5450]/70 focus:outline-none focus:border-[#A6192E] transition-colors"
            />
          </div>
        </div>

        {/* City Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-8 mb-8 border-b border-[#1C1513]/10">
          <div
            role="tablist"
            aria-label="Filter cafés by city"
            className="flex flex-wrap items-center gap-1.5 p-1 bg-[#F2EFEA] rounded-lg"
          >
            {CITIES.map((city) => {
              const isActive = activeCity === city;
              return (
                <button
                  key={city}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveCity(city)}
                  className={`min-h-[38px] px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#A6192E] ${
                    isActive
                      ? 'bg-white text-[#1C1513] shadow-sm'
                      : 'text-[#5E5450] hover:text-[#1C1513]'
                  }`}
                >
                  {city}
                </button>
              );
            })}
          </div>

          {reservationConfirmedFor && (
            <div className="inline-flex items-center gap-2 text-xs font-medium text-[#1C1513] bg-[#F2EFEA] px-3.5 py-2 rounded-lg border border-[#1C1513]/10">
              <CalendarCheck className="w-4 h-4 text-[#A6192E] shrink-0" />
              <span>Table held: {reservationConfirmedFor}</span>
            </div>
          )}
        </div>

        {/* Café Directory Grid */}
        {filteredCafes.length === 0 ? (
          <div className="py-12 text-center bg-[#F2EFEA]/60 rounded-2xl border border-[#1C1513]/10">
            <p className="font-display text-xl text-[#1C1513] mb-2">No cafés matched your search</p>
            <p className="text-sm text-[#5E5450] mb-5">
              Try searching another neighbourhood or view all flagship cities.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveCity('All Cities');
                setCafeQuery('');
              }}
              className="min-h-[40px] px-5 py-2 rounded-lg bg-[#A6192E] text-white text-sm font-medium cursor-pointer"
            >
              Show All Cafés
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCafes.map((cafe) => {
              const isSelectedPickup = selectedCafe.id === cafe.id;
              const isReserving = reservingCafeId === cafe.id;

              return (
                <article
                  key={cafe.id}
                  className={`flex flex-col justify-between p-6 rounded-xl border transition-colors ${
                    isSelectedPickup
                      ? 'bg-white border-[#A6192E]'
                      : 'bg-white border-[#1C1513]/10'
                  }`}
                >
                  <div>
                    {/* Unboxed Metadata */}
                    <p className="text-xs font-medium text-[#5E5450] mb-2">
                      <span className="uppercase tracking-[0.06em]">{cafe.city}</span>
                      <span aria-hidden="true"> · </span>
                      <span>{cafe.tableStatus}</span>
                    </p>

                    <h3 className="text-lg font-semibold text-[#1C1513] mb-2">{cafe.name}</h3>

                    <p className="text-sm text-[#5E5450] leading-relaxed mb-4 flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-[#5E5450] shrink-0 mt-0.5" />
                      <span>{cafe.address}</span>
                    </p>

                    <p className="text-xs text-[#5E5450] flex items-center gap-2 mb-3 tabular-nums">
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      <span>{cafe.hours}</span>
                      <span aria-hidden="true">·</span>
                      <span>Pickup ~{cafe.prepMinutes} mins</span>
                    </p>

                    <p className="text-xs text-[#5E5450] leading-relaxed">
                      {cafe.amenities.join(' · ')}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#1C1513]/10 space-y-3">
                    {isReserving ? (
                      <div className="space-y-3 bg-[#FAF9F7] p-3.5 rounded-lg border border-[#1C1513]/10">
                        <div className="grid grid-cols-2 gap-2">
                          <select
                            aria-label="Party size"
                            value={guestCount}
                            onChange={(e) => setGuestCount(e.target.value)}
                            className="min-h-[38px] px-2.5 py-1.5 rounded-md border border-[#1C1513]/15 bg-white text-xs text-[#1C1513]"
                          >
                            <option>2 Guests</option>
                            <option>4 Guests</option>
                            <option>6 Guests</option>
                          </select>
                          <select
                            aria-label="Reservation time"
                            value={timeSlot}
                            onChange={(e) => setTimeSlot(e.target.value)}
                            className="min-h-[38px] px-2.5 py-1.5 rounded-md border border-[#1C1513]/15 bg-white text-xs text-[#1C1513]"
                          >
                            <option>5:30 PM</option>
                            <option>6:30 PM</option>
                            <option>8:00 PM</option>
                          </select>
                        </div>

                        {reservationError && (
                          <p className="text-xs text-[#A6192E]" role="alert">
                            {reservationError}
                          </p>
                        )}

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            disabled={reservingSubmitting}
                            onClick={() => void handleConfirmReservation(cafe)}
                            className="flex-1 min-h-[38px] px-3 py-1.5 rounded-md bg-[#A6192E] hover:bg-[#8B1426] disabled:opacity-60 text-white text-xs font-semibold cursor-pointer"
                          >
                            {reservingSubmitting
                              ? 'Holding Table...'
                              : user
                              ? 'Confirm Table'
                              : 'Sign in & Reserve'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setReservingCafeId(null);
                              setReservationError('');
                            }}
                            className="min-h-[38px] px-3 py-1.5 rounded-md text-xs font-medium text-[#5E5450] hover:text-[#1C1513] cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => onSelectPickupCafe(cafe)}
                          className={`inline-flex items-center gap-1.5 min-h-[40px] px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#A6192E] ${
                            isSelectedPickup
                              ? 'bg-[#A6192E] text-white'
                              : 'bg-[#1C1513] hover:bg-[#A6192E] text-white'
                          }`}
                        >
                          {isSelectedPickup && <Check className="w-3.5 h-3.5" />}
                          <span>{isSelectedPickup ? 'Pickup Selected' : 'Set Pickup Café'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setReservingCafeId(cafe.id);
                            setReservationError('');
                          }}
                          className="min-h-[40px] px-3.5 py-2 rounded-lg text-xs font-semibold text-[#5E5450] hover:text-[#1C1513] hover:bg-[#F2EFEA] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#A6192E]"
                        >
                          Reserve Table
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
