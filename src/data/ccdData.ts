export type MenuCategory = 'Cold Classics' | 'Hot Brews' | 'Estate Beans' | 'Bakery & Bites';

export interface SizeOption {
  id: string;
  label: string;
  priceDelta: number;
  meta: string;
}

export interface PrepOption {
  id: string;
  label: string;
  priceDelta: number;
}

export interface MenuItem {
  id: string;
  name: string;
  category: MenuCategory;
  price: number;
  servingMeta: string;
  shortNote: string;
  description: string;
  tastingNotes: string;
  origin: string;
  isVegetarian: boolean;
  isIced: boolean;
  image: string;
  sizeOptions: SizeOption[];
  prepOptions: PrepOption[];
  addonLabel?: string;
  addonPrice?: number;
}

export interface CafeLocation {
  id: string;
  name: string;
  city: 'Bengaluru' | 'Mumbai' | 'New Delhi' | 'Pune' | 'Hyderabad';
  address: string;
  hours: string;
  prepMinutes: number;
  amenities: string[];
  tableStatus: string;
}

export interface CartItem {
  cartKey: string;
  item: MenuItem;
  sizeLabel: string;
  prepLabel: string;
  hasAddon: boolean;
  unitPrice: number;
  quantity: number;
}

export const HERO_IMAGE = '/src/assets/images/hero_ccd_cafe_1794833488984.jpg';

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'devils-own',
    name: "The Devil's Own",
    category: 'Cold Classics',
    price: 245,
    servingMeta: '350 ml · 320 kcal',
    shortNote: 'Signature iced chocolate coffee blended with vanilla cream and cocoa.',
    description:
      'Our most beloved cold classic since the early Brigade Road years. Double-pulled Chikmagalur espresso blended smooth with rich dark chocolate ganache, chilled cream, and a crisp cocoa dusting.',
    tastingNotes: 'Dark Cocoa · Roasted Hazelnut · Velvety Cream',
    origin: 'Chikmagalur Estate Arabica',
    isVegetarian: true,
    isIced: true,
    image: '/src/assets/images/brew_devils_own_1794833488894.jpg',
    sizeOptions: [
      { id: 'regular', label: 'Regular · 350 ml', priceDelta: 0, meta: '320 kcal' },
      { id: 'king', label: 'King · 450 ml', priceDelta: 45, meta: '410 kcal' },
    ],
    prepOptions: [
      { id: 'whole-milk', label: 'Fresh Dairy Cream', priceDelta: 0 },
      { id: 'oat-milk', label: 'Barista Oat Milk', priceDelta: 45 },
      { id: 'less-sweet', label: 'Less Sweet · Extra Cocoa', priceDelta: 0 },
    ],
    addonLabel: 'Extra Chikmagalur Espresso Shot',
    addonPrice: 40,
  },
  {
    id: 'artisan-cappuccino',
    name: 'Artisan Cappuccino',
    category: 'Hot Brews',
    price: 195,
    servingMeta: '240 ml · 135 kcal',
    shortNote: 'Balanced double espresso folded into silky micro-textured steamed milk.',
    description:
      'Pulled at 9 bars from freshly ground medium-dark Chikmagalur Arabica beans and crowned with dense, glossy steamed milk microfoam.',
    tastingNotes: 'Toasted Almond · Caramel · Sweet Milk',
    origin: 'Chikmagalur & Baba Budangiri Blend',
    isVegetarian: true,
    isIced: false,
    image: '/src/assets/images/brew_cappuccino_art_1794833489280.jpg',
    sizeOptions: [
      { id: 'regular', label: 'Regular · 240 ml', priceDelta: 0, meta: '135 kcal' },
      { id: 'king', label: 'King · 330 ml', priceDelta: 35, meta: '185 kcal' },
    ],
    prepOptions: [
      { id: 'whole-milk', label: 'Whole Milk', priceDelta: 0 },
      { id: 'skim-milk', label: 'Skimmed Milk', priceDelta: 0 },
      { id: 'oat-milk', label: 'Barista Oat Milk', priceDelta: 45 },
    ],
    addonLabel: 'Add Hazelnut Syrup Infusion',
    addonPrice: 35,
  },
  {
    id: 'filter-kaapi-reserve',
    name: 'Filter Kaapi Reserve',
    category: 'Hot Brews',
    price: 165,
    servingMeta: '180 ml · 110 kcal',
    shortNote: 'Slow-dripped brass filter decoction whisked with frothed farm milk.',
    description:
      'A tribute to Southern Indian coffee heritage. Slow-percolated peaberry and plantation Arabica decoction poured frothy into a traditional brass davara tumbler.',
    tastingNotes: 'Jaggery Caramel · Warm Spice · Full Body',
    origin: 'Coorg & Chikmagalur Peaberry',
    isVegetarian: true,
    isIced: false,
    image: '/src/assets/images/brew_filter_kaapi_1794833490712.jpg',
    sizeOptions: [
      { id: 'davara', label: 'Traditional · 180 ml', priceDelta: 0, meta: '110 kcal' },
      { id: 'tall', label: 'Tall Mug · 280 ml', priceDelta: 35, meta: '165 kcal' },
    ],
    prepOptions: [
      { id: 'classic-sweet', label: 'Classic Unrefined Sugar', priceDelta: 0 },
      { id: 'no-sugar', label: 'Unsweetened Decoction', priceDelta: 0 },
      { id: 'extra-strong', label: 'Strong First-Press', priceDelta: 20 },
    ],
    addonLabel: 'Side of Cardamom Shortbread',
    addonPrice: 55,
  },
  {
    id: 'espresso-tonic',
    name: 'Chikmagalur Espresso Tonic',
    category: 'Cold Classics',
    price: 215,
    servingMeta: '300 ml · 95 kcal',
    shortNote: 'Bright single-estate espresso poured over crisp botanical tonic and citrus.',
    description:
      'High-altitude washed Arabica pulled crisp and layered gently over sparkling Indian botanical tonic water, finished with fresh Nagpur orange peel and garden thyme.',
    tastingNotes: 'Candied Orange · Bergamot · Crisp Tonic',
    origin: 'Ratnagiri Estate, Chikmagalur',
    isVegetarian: true,
    isIced: true,
    image: '/src/assets/images/brew_iced_americano_1794833509729.jpg',
    sizeOptions: [
      { id: 'regular', label: 'Tall Glass · 300 ml', priceDelta: 0, meta: '95 kcal' },
      { id: 'king', label: 'Carafe · 420 ml', priceDelta: 50, meta: '125 kcal' },
    ],
    prepOptions: [
      { id: 'classic-tonic', label: 'Classic Botanical Tonic', priceDelta: 0 },
      { id: 'zero-sugar-tonic', label: 'Light Sparkling Water', priceDelta: 0 },
    ],
    addonLabel: 'Extra Single-Origin Espresso Shot',
    addonPrice: 40,
  },
  {
    id: 'chikmagalur-estate-beans',
    name: 'Chikmagalur Single Estate',
    category: 'Estate Beans',
    price: 480,
    servingMeta: '250 g Pouch · Medium Roast',
    shortNote: '100% shade-grown Arabica harvested at 1,300 m in the Western Ghats.',
    description:
      'Small-batch drum roasted in Bengaluru every Tuesday. Expect clean sweetness, cocoa nib depth, and a lingering spiced finish suited for pour-over, moka pot, or home espresso.',
    tastingNotes: 'Roasted Cacao · Cinnamon Bark · Sweet Fig',
    origin: 'Chikmagalur, Karnataka (1,300 m)',
    isVegetarian: true,
    isIced: false,
    image: '/src/assets/images/roast_estate_pouch_1794833509586.jpg',
    sizeOptions: [
      { id: '250g', label: '250 g Pouch', priceDelta: 0, meta: 'Approx. 18 brews' },
      { id: '500g', label: '500 g Estate Tin', priceDelta: 420, meta: 'Approx. 36 brews' },
    ],
    prepOptions: [
      { id: 'whole-bean', label: 'Whole Bean', priceDelta: 0 },
      { id: 'espresso-grind', label: 'Fine · Espresso / Moka', priceDelta: 0 },
      { id: 'filter-grind', label: 'Medium · Pour-Over / Filter', priceDelta: 0 },
    ],
    addonLabel: 'Include Brewing Recipe Card',
    addonPrice: 0,
  },
  {
    id: 'truffle-croissant-duo',
    name: 'Dark Truffle & Butter Croissant',
    category: 'Bakery & Bites',
    price: 260,
    servingMeta: 'Freshly Baked · Vegetarian',
    shortNote: 'Rich 54% cocoa ganache pastry paired with a flaky cultured-butter croissant.',
    description:
      'Baked fresh each morning for our café counters. Layers of dark chocolate truffle sponge alongside a laminated French-style butter croissant warmed to order.',
    tastingNotes: '54% Dark Cocoa · Cultured Butter · Flaky Pastry',
    origin: 'CCD Artisan Bakery Kitchen',
    isVegetarian: true,
    isIced: false,
    image: '/src/assets/images/bite_chocolate_pastry_1794833490013.jpg',
    sizeOptions: [
      { id: 'duo', label: 'Truffle & Croissant Duo', priceDelta: 0, meta: '2 pieces' },
      { id: 'slice-only', label: 'Dark Truffle Pastry Only', priceDelta: -75, meta: '150 g slice' },
    ],
    prepOptions: [
      { id: 'warm-croissant', label: 'Warm Croissant · Chilled Truffle', priceDelta: 0 },
      { id: 'pack-separate', label: 'Packaged Separately for Takeaway', priceDelta: 0 },
    ],
    addonLabel: 'Pair with Warm Chocolate Sauce',
    addonPrice: 30,
  },
];

export const CAFE_LOCATIONS: CafeLocation[] = [
  {
    id: 'brigade-road',
    name: 'Brigade Road Flagship',
    city: 'Bengaluru',
    address: '23/2, Brigade Road, Shanthala Nagar, Ashok Nagar, Bengaluru 560001',
    hours: '7:30 AM – 11:30 PM',
    prepMinutes: 10,
    amenities: ['Heritage Lounge', 'High-Speed Wi-Fi', 'Outdoor Courtyard'],
    tableStatus: 'Seating Available',
  },
  {
    id: 'indiranagar-100ft',
    name: 'Indiranagar 100ft Road',
    city: 'Bengaluru',
    address: '742, 100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru 560038',
    hours: '8:00 AM – 12:00 AM',
    prepMinutes: 12,
    amenities: ['Pour-Over Bar', 'Quiet Work Desks', 'Valet Parking'],
    tableStatus: 'Seating Available',
  },
  {
    id: 'carter-road',
    name: 'Carter Road Promenade',
    city: 'Mumbai',
    address: 'Ground Floor, Gagangiri Co-op Society, Carter Road, Bandra West, Mumbai 400050',
    hours: '7:00 AM – 1:00 AM',
    prepMinutes: 14,
    amenities: ['Sea-Facing Deck', 'Late Night Brew', 'Pet Friendly Patio'],
    tableStatus: '2 Courtyard Tables Left',
  },
  {
    id: 'connaught-place',
    name: 'Connaught Place Outer Circle',
    city: 'New Delhi',
    address: 'Block N-18, Outer Circle, Connaught Place, New Delhi 110001',
    hours: '8:00 AM – 11:00 PM',
    prepMinutes: 11,
    amenities: ['Heritage Arcade', 'Book Corner', 'Express Pickup Window'],
    tableStatus: 'Seating Available',
  },
  {
    id: 'koregaon-park',
    name: 'Koregaon Park Lane 7',
    city: 'Pune',
    address: 'Plot 14, Lane 7, Koregaon Park, Pune 411001',
    hours: '8:00 AM – 11:30 PM',
    prepMinutes: 9,
    amenities: ['Banyan Garden Patio', 'Acoustic Evenings', 'Wi-Fi'],
    tableStatus: 'Seating Available',
  },
  {
    id: 'jubilee-hills',
    name: 'Jubilee Hills Road 36',
    city: 'Hyderabad',
    address: '8-2-293/82/A, Road No. 36, Jubilee Hills, Hyderabad 500033',
    hours: '7:30 AM – 12:00 AM',
    prepMinutes: 12,
    amenities: ['Roastery Tasting Room', 'Drive-Up Pickup', 'Power Outlets'],
    tableStatus: 'Seating Available',
  },
];

export const CRAFT_PILLARS = [
  {
    index: '01.',
    title: 'Shade-Grown in Chikmagalur',
    detail:
      'Every cup begins at 1,300 metres beneath silver oak and pepper canopies in Karnataka, where slow-ripening cherries develop dense natural sweetness.',
  },
  {
    index: '02.',
    title: 'Small-Batch Roasted Weekly',
    detail:
      'Our roasters in Bengaluru profile each harvest lot separately — balancing bright citrus clarity for cold brews and deep cocoa richness for espresso.',
  },
  {
    index: '03.',
    title: 'India’s Neighbourhood Third Place',
    detail:
      'Since opening our first café on Brigade Road in 1996, every table has been built for unhurried conversations, late-night study, and daily rituals.',
  },
];
