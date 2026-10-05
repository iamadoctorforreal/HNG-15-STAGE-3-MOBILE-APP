export const COLORS = {
  primary: '#008751',
  primaryDark: '#005230',
  secondary: '#D4A843',
  goldLight: '#E8C468',
  cream: '#FAF8F5',
  cardBg: '#FFFFFF',
  textDark: '#2D2D2D',
  textMuted: '#666666',
  border: '#E5E7EB',
  danger: '#EF4444',
  success: '#10B981',
};

export const API_BASE_URL = 'https://shop.sawfywhite.com';

export interface MobileProduct {
  id: string;
  title: string;
  slug: string;
  description: string;
  base_price: number;
  currency: string;
  badge: string;
  weightInfo: string;
  image: string;
  is_digital: boolean;
}

export const PRODUCTS: MobileProduct[] = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    title: 'Whole Round-Curled Dried Catfish (Big Size - With Head)',
    slug: 'whole-round-curled-dried-catfish-big',
    description:
      'Traditionally curled into circular ring shape (Eja Kika). Farm-raised in Abeokuta fish farms, meticulously cleaned, and dried to golden-brown crisp perfection. 100% sand-free.',
    base_price: 18500,
    currency: 'NGN',
    badge: 'Artisanal Round Curl (Eja Kika)',
    weightInfo: 'Approx. 4-6 pieces per 1kg',
    image: 'https://shop.sawfywhite.com/images/catfish-real-glass-plate.png',
    is_digital: false,
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    title: 'Jumbo Straight Dried Catfish (Big Size - With Head)',
    slug: 'jumbo-straight-dried-catfish-big',
    description:
      'Large export grade dried African catfish. Farm-raised in Abeokuta aquaculture ponds, large sizing, crispy skin, deep savory aroma, and zero sand residue.',
    base_price: 21000,
    currency: 'NGN',
    badge: 'Jumbo Selection',
    weightInfo: 'Approx. 3-4 giant fish per 1kg',
    image: 'https://shop.sawfywhite.com/images/catfish-real-crate-batch.png',
    is_digital: false,
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    title: 'Medium Whole Dried Catfish (Family Soup Pack - With Head)',
    slug: 'medium-whole-dried-catfish-family',
    description:
      'The quintessential Nigerian kitchen staple. Plump medium dried catfish that reconstitute quickly in Egusi, Efo Riro, and Ila Alasepo soups.',
    base_price: 16000,
    currency: 'NGN',
    badge: 'Bestseller for Soups',
    weightInfo: 'Approx. 8-10 pieces per 1kg',
    image: 'https://shop.sawfywhite.com/images/catfish-real-bowl.png',
    is_digital: false,
  },
  {
    id: '00000000-0000-0000-0000-000000000004',
    title: 'Small Crispy Whole Dried Catfish (Crunchy Snacking & Soup Size)',
    slug: 'small-crispy-whole-dried-catfish',
    description:
      'Petite, golden-crisp dried catfish. Perfect for pounding into pepper soup bases or eating as a nutritious, crunchy, high-protein savory snack.',
    base_price: 7500,
    currency: 'NGN',
    badge: 'Extra Crunchy',
    weightInfo: 'Approx. 14-18 pieces per 500g',
    image: 'https://shop.sawfywhite.com/images/catfish-real-golden-curl.png',
    is_digital: false,
  },
  {
    id: '00000000-0000-0000-0000-000000000005',
    title: 'Deboned & Split Dried Catfish Butterfly Fillets (Clean Cut)',
    slug: 'deboned-split-dried-catfish-fillets',
    description:
      'Center-split butterflied catfish fillets with spines carefully extracted. Clean, zero-bone hassle, ready to soak and drop directly into stews.',
    base_price: 19500,
    currency: 'NGN',
    badge: 'Easy Cooking / Fillets',
    weightInfo: '500g vacuum pack',
    image: 'https://shop.sawfywhite.com/images/catfish-real-crate-batch.png',
    is_digital: false,
  },
  {
    id: '00000000-0000-0000-0000-000000000006',
    title: 'Artisanal Savory Dried Catfish Flakes (Sprinkle & Seasoning Shaker)',
    slug: 'artisanal-dried-catfish-flakes-shaker',
    description:
      'Finely hand-shredded dried catfish flakes seasoned with Abeokuta spices. Sprinkle directly over jollof rice, yam pottage, or vegetable stir-fries.',
    base_price: 6500,
    currency: 'NGN',
    badge: 'Gourmet Condiment',
    weightInfo: '250g shaker jar',
    image: 'https://shop.sawfywhite.com/images/catfish-real-sealed-pack.png',
    is_digital: false,
  },
  {
    id: '00000000-0000-0000-0000-000000000007',
    title: 'Crispy Dried Catfish Leisure Snack Pack (Ready-to-Eat Bites)',
    slug: 'crispy-dried-catfish-leisure-snack-pack',
    description:
      'Convenient foil-sealed snack pack of crunchy, oven-crisped dried catfish nuggets. High-protein, zero carbohydrates, clean snacking.',
    base_price: 4500,
    currency: 'NGN',
    badge: 'Leisure Snack',
    weightInfo: '150g pouch',
    image: 'https://shop.sawfywhite.com/images/catfish-real-bowl.png',
    is_digital: false,
  },
  {
    id: '00000000-0000-0000-0000-000000000008',
    title: 'Wholesale Master Export Carton (10kg Commercial Pack)',
    slug: 'wholesale-master-export-carton-10kg',
    description:
      'Heavy-duty export carton containing 10kg of vacuum-sealed premium Abeokuta dried catfish. Certified sand-free and prepared for air cargo.',
    base_price: 165000,
    currency: 'NGN',
    badge: 'Wholesale & Export',
    weightInfo: '10kg Master Carton',
    image: 'https://shop.sawfywhite.com/images/catfish-real-crate-batch.png',
    is_digital: false,
  },
  {
    id: '00000000-0000-0000-0000-000000000009',
    title: 'The Abeokuta Catfish Kitchen: 45 Authentic Recipes (Digital Cookbook)',
    slug: 'abeokuta-catfish-kitchen-cookbook',
    description:
      'Complete digital cookbook containing 45 time-tested Abeokuta recipes featuring dried catfish. Includes Efo Riro, Seafood Okro, Native Jollof.',
    base_price: 3500,
    currency: 'NGN',
    badge: 'Digital Cookbook',
    weightInfo: 'Instant PDF Download',
    image: 'https://shop.sawfywhite.com/images/cookbook-cover.jpg',
    is_digital: true,
  },
  {
    id: '00000000-0000-0000-0000-000000000010',
    title: 'Aquaculture to Table: The Complete Catfish Guide (Digital Masterclass)',
    slug: 'aquaculture-to-table-catfish-guide',
    description:
      'Master manual covering commercial catfish farming, sand-free drying methods, packaging for diaspora export, and preservation without chemicals.',
    base_price: 5000,
    currency: 'NGN',
    badge: 'Digital Masterclass',
    weightInfo: 'Instant PDF Download',
    image: 'https://shop.sawfywhite.com/images/waterfall-fish-farm.jpg',
    is_digital: true,
  },
];
