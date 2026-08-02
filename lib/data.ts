export const categories = {
  Top: [
    'T-shirt',
    'Tank top',
    'Blouse',
    'Button-up',
    'Sweater',
    'Cardigan',
    'Bodysuit'
  ],
  Bottom: [
    'Straight jeans',
    'Wide-leg jeans',
    'Trousers',
    'Wide-leg trousers',
    'Mini skirt',
    'Midi skirt',
    'Maxi skirt',
    'Shorts'
  ],
  Dress: [
    'Mini dress',
    'Midi dress',
    'Maxi dress'
  ],
  Outerwear: [
    'Blazer',
    'Leather jacket',
    'Denim jacket',
    'Trench coat',
    'Wool coat',
    'Puffer'
  ],
  Shoes: [
    'Sneakers',
    'Loafers',
    'Heels',
    'Ankle boots',
    'Tall boots',
    'Sandals',
    'Ballet flats'
  ]
} as const;

export const colors = [
  'Black',
  'White',
  'Cream',
  'Grey',
  'Navy',
  'Beige',
  'Brown',
  'Burgundy',
  'Red',
  'Pink',
  'Olive',
  'Green',
  'Blue',
  'Denim'
] as const;

export const styles = [
  'Minimalist',
  'Scandinavian',
  'Streetwear',
  'Preppy',
  'Feminine',
  'Edgy',
  'Y2K',
  'Classic'
] as const;

export const occasions = [
  'Everyday',
  'Work',
  'Date night',
  'Party',
  'Formal',
  'Weekend'
] as const;

export const seasons = [
  'All season',
  'Spring',
  'Summer',
  'Autumn',
  'Winter'
] as const;


/* =========================================================
   GARMENT INTELLIGENCE
   ========================================================= */

export type Category = keyof typeof categories;

export type Style = typeof styles[number];

export type Fit =
  | 'Fitted'
  | 'Regular'
  | 'Relaxed'
  | 'Oversized';

export type Volume =
  | 'Slim'
  | 'Balanced'
  | 'Wide';

export type Garment = {
  name: string;
  category: Category;

  // 1 = casual, 5 = formal
  formality: number;

  // 1 = very light, 5 = very warm
  warmth: number;

  fit: Fit;
  volume: Volume;

  styles: Record<Style, number>;
};


/* =========================================================
   STYLE SCORE HELPER
   ========================================================= */

function styleScores(
  Minimalist: number,
  Scandinavian: number,
  Streetwear: number,
  Preppy: number,
  Feminine: number,
  Edgy: number,
  Y2K: number,
  Classic: number
): Record<Style, number> {
  return {
    Minimalist,
    Scandinavian,
    Streetwear,
    Preppy,
    Feminine,
    Edgy,
    Y2K,
    Classic
  };
}


/* =========================================================
   GARMENT DATABASE
   ========================================================= */

export const garments: Garment[] = [

  /* ---------------- TOPS ---------------- */

  {
    name: 'T-shirt',
    category: 'Top',
    formality: 1,
    warmth: 1,
    fit: 'Regular',
    volume: 'Balanced',
    styles: styleScores(5, 4, 5, 2, 2, 3, 4, 3)
  },

  {
    name: 'Tank top',
    category: 'Top',
    formality: 1,
    warmth: 1,
    fit: 'Fitted',
    volume: 'Slim',
    styles: styleScores(4, 3, 4, 1, 4, 4, 5, 2)
  },

  {
    name: 'Blouse',
    category: 'Top',
    formality: 4,
    warmth: 2,
    fit: 'Regular',
    volume: 'Balanced',
    styles: styleScores(4, 4, 2, 4, 5, 2, 2, 5)
  },

  {
    name: 'Button-up',
    category: 'Top',
    formality: 4,
    warmth: 2,
    fit: 'Regular',
    volume: 'Balanced',
    styles: styleScores(5, 5, 3, 5, 3, 2, 3, 5)
  },

  {
    name: 'Sweater',
    category: 'Top',
    formality: 2,
    warmth: 4,
    fit: 'Relaxed',
    volume: 'Balanced',
    styles: styleScores(5, 5, 3, 4, 4, 2, 3, 5)
  },

  {
    name: 'Cardigan',
    category: 'Top',
    formality: 2,
    warmth: 3,
    fit: 'Relaxed',
    volume: 'Balanced',
    styles: styleScores(4, 5, 2, 5, 5, 1, 4, 5)
  },

  {
    name: 'Bodysuit',
    category: 'Top',
    formality: 2,
    warmth: 1,
    fit: 'Fitted',
    volume: 'Slim',
    styles: styleScores(4, 3, 4, 2, 5, 4, 5, 3)
  },


  /* ---------------- BOTTOMS ---------------- */

  {
    name: 'Straight jeans',
    category: 'Bottom',
    formality: 1,
    warmth: 3,
    fit: 'Regular',
    volume: 'Balanced',
    styles: styleScores(5, 5, 5, 3, 3, 4, 4, 4)
  },

  {
    name: 'Wide-leg jeans',
    category: 'Bottom',
    formality: 1,
    warmth: 3,
    fit: 'Relaxed',
    volume: 'Wide',
    styles: styleScores(4, 5, 5, 2, 3, 4, 5, 3)
  },

  {
    name: 'Trousers',
    category: 'Bottom',
    formality: 4,
    warmth: 3,
    fit: 'Regular',
    volume: 'Balanced',
    styles: styleScores(5, 5, 2, 5, 4, 2, 2, 5)
  },

  {
    name: 'Wide-leg trousers',
    category: 'Bottom',
    formality: 4,
    warmth: 3,
    fit: 'Relaxed',
    volume: 'Wide',
    styles: styleScores(5, 5, 3, 4, 4, 3, 4, 5)
  },

  {
    name: 'Mini skirt',
    category: 'Bottom',
    formality: 2,
    warmth: 1,
    fit: 'Fitted',
    volume: 'Slim',
    styles: styleScores(2, 2, 4, 4, 5, 5, 5, 3)
  },

  {
    name: 'Midi skirt',
    category: 'Bottom',
    formality: 3,
    warmth: 2,
    fit: 'Regular',
    volume: 'Balanced',
    styles: styleScores(5, 5, 2, 5, 5, 2, 3, 5)
  },

  {
    name: 'Maxi skirt',
    category: 'Bottom',
    formality: 3,
    warmth: 2,
    fit: 'Relaxed',
    volume: 'Wide',
    styles: styleScores(4, 4, 3, 3, 5, 3, 4, 4)
  },

  {
    name: 'Shorts',
    category: 'Bottom',
    formality: 1,
    warmth: 1,
    fit: 'Regular',
    volume: 'Balanced',
    styles: styleScores(4, 4, 5, 3, 3, 3, 5, 3)
  },


  /* ---------------- DRESSES ---------------- */

  {
    name: 'Mini dress',
    category: 'Dress',
    formality: 3,
    warmth: 1,
    fit: 'Fitted',
    volume: 'Slim',
    styles: styleScores(3, 2, 3, 3, 5, 4, 5, 4)
  },

  {
    name: 'Midi dress',
    category: 'Dress',
    formality: 4,
    warmth: 2,
    fit: 'Regular',
    volume: 'Balanced',
    styles: styleScores(5, 4, 1, 4, 5, 2, 2, 5)
  },

  {
    name: 'Maxi dress',
    category: 'Dress',
    formality: 4,
    warmth: 2,
    fit: 'Relaxed',
    volume: 'Wide',
    styles: styleScores(4, 4, 2, 3, 5, 2, 3, 5)
  },


  /* ---------------- OUTERWEAR ---------------- */

  {
    name: 'Blazer',
    category: 'Outerwear',
    formality: 4,
    warmth: 3,
    fit: 'Regular',
    volume: 'Balanced',
    styles: styleScores(5, 5, 4, 5, 4, 3, 4, 5)
  },

  {
    name: 'Leather jacket',
    category: 'Outerwear',
    formality: 2,
    warmth: 3,
    fit: 'Regular',
    volume: 'Balanced',
    styles: styleScores(3, 3, 5, 1, 2, 5, 5, 3)
  },

  {
    name: 'Denim jacket',
    category: 'Outerwear',
    formality: 1,
    warmth: 2,
    fit: 'Relaxed',
    volume: 'Balanced',
    styles: styleScores(4, 4, 5, 2, 3, 4, 5, 3)
  },

  {
    name: 'Trench coat',
    category: 'Outerwear',
    formality: 4,
    warmth: 3,
    fit: 'Relaxed',
    volume: 'Balanced',
    styles: styleScores(5, 5, 3, 5, 4, 2, 2, 5)
  },

  {
    name: 'Wool coat',
    category: 'Outerwear',
    formality: 4,
    warmth: 5,
    fit: 'Relaxed',
    volume: 'Balanced',
    styles: styleScores(5, 5, 2, 4, 4, 2, 2, 5)
  },

  {
    name: 'Puffer',
    category: 'Outerwear',
    formality: 1,
    warmth: 5,
    fit: 'Oversized',
    volume: 'Wide',
    styles: styleScores(3, 5, 5, 1, 1, 3, 4, 2)
  },


  /* ---------------- SHOES ---------------- */

  {
    name: 'Sneakers',
    category: 'Shoes',
    formality: 1,
    warmth: 2,
    fit: 'Regular',
    volume: 'Balanced',
    styles: styleScores(5, 5, 5, 3, 2, 3, 5, 3)
  },

  {
    name: 'Loafers',
    category: 'Shoes',
    formality: 4,
    warmth: 2,
    fit: 'Regular',
    volume: 'Balanced',
    styles: styleScores(5, 5, 3, 5, 4, 2, 3, 5)
  },

  {
    name: 'Heels',
    category: 'Shoes',
    formality: 5,
    warmth: 1,
    fit: 'Regular',
    volume: 'Slim',
    styles: styleScores(4, 3, 1, 4, 5, 3, 4, 5)
  },

  {
    name: 'Ankle boots',
    category: 'Shoes',
    formality: 3,
    warmth: 4,
    fit: 'Regular',
    volume: 'Balanced',
    styles: styleScores(5, 5, 4, 3, 4, 5, 4, 5)
  },

  {
    name: 'Tall boots',
    category: 'Shoes',
    formality: 4,
    warmth: 4,
    fit: 'Regular',
    volume: 'Balanced',
    styles: styleScores(4, 4, 3, 4, 5, 5, 4, 5)
  },

  {
    name: 'Sandals',
    category: 'Shoes',
    formality: 2,
    warmth: 1,
    fit: 'Regular',
    volume: 'Slim',
    styles: styleScores(5, 4, 2, 3, 5, 2, 3, 4)
  },

  {
    name: 'Ballet flats',
    category: 'Shoes',
    formality: 3,
    warmth: 1,
    fit: 'Regular',
    volume: 'Slim',
    styles: styleScores(5, 4, 2, 5, 5, 1, 3, 5)
  }
];


/* =========================================================
   DATABASE HELPERS
   ========================================================= */

export function getGarment(name: string): Garment | undefined {
  return garments.find(garment => garment.name === name);
}

export function getGarmentsByCategory(
  category: Category
): Garment[] {
  return garments.filter(
    garment => garment.category === category
  );
}
