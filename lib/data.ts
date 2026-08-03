/* =========================================================
   MUSE — GARMENT DATA
   ========================================================= */


/* =========================================================
   CATEGORIES
   ========================================================= */

export const categories = {
  Top: [
    'T-shirt',
    'Fitted T-shirt',
    'Oversized T-shirt',
    'Cropped T-shirt',
    'Tank top',
    'Camisole',
    'Blouse',
    'Button-up',
    'Oversized shirt',
    'Cropped shirt',
    'Sweater',
    'Oversized sweater',
    'Cropped sweater',
    'Cardigan',
    'Cropped cardigan',
    'Turtleneck',
    'Hoodie',
    'Bodysuit'
  ],

  Bottom: [
    'Straight jeans',
    'Wide-leg jeans',
    'Bootcut jeans',
    'Flare jeans',
    'Skinny jeans',
    'Baggy jeans',
    'Trousers',
    'Wide-leg trousers',
    'Straight trousers',
    'Flare trousers',
    'Cargo trousers',
    'Leggings',
    'Mini skirt',
    'Midi skirt',
    'Maxi skirt',
    'Denim skirt',
    'Shorts'
  ],

  Dress: [
    'Mini dress',
    'Midi dress',
    'Maxi dress',
    'Slip dress',
    'Bodycon dress',
    'Shirt dress',
    'Knitted dress'
  ],

  Outerwear: [
    'Blazer',
    'Oversized blazer',
    'Leather jacket',
    'Denim jacket',
    'Bomber jacket',
    'Trench coat',
    'Wool coat',
    'Puffer',
    'Parka',
    'Utility jacket'
  ],

  Shoes: [
    'Sneakers',
    'Loafers',
    'Heels',
    'Ankle boots',
    'Tall boots',
    'Chelsea boots',
    'Sandals',
    'Ballet flats',
    'Mary Janes'
  ]
} as const;


/* =========================================================
   COLORS
   ========================================================= */

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


/* =========================================================
   STYLES
   ========================================================= */

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


/* =========================================================
   OCCASIONS
   ========================================================= */

export const occasions = [
  'Everyday',
  'Work',
  'Date night',
  'Party',
  'Formal',
  'Weekend'
] as const;


/* =========================================================
   SEASONS
   ========================================================= */

export const seasons = [
  'All season',
  'Spring',
  'Summer',
  'Autumn',
  'Winter'
] as const;


/* =========================================================
   TYPES
   ========================================================= */

export type Category =
  keyof typeof categories;

export type Style =
  typeof styles[number];


export type Fit =
  | 'Fitted'
  | 'Regular'
  | 'Relaxed'
  | 'Oversized';


export type Volume =
  | 'Slim'
  | 'Balanced'
  | 'Wide'
  | 'Flared';


export type Length =
  | 'Cropped'
  | 'Regular'
  | 'Long';


export type Garment = {
  name: string;

  category: Category;

  /*
    1 = very casual
    5 = very formal
  */
  formality: number;

  /*
    1 = very light
    5 = very warm
  */
  warmth: number;

  /*
    How closely the garment follows
    the body.
  */
  fit: Fit;

  /*
    Overall visual volume / shape.
  */
  volume: Volume;

  /*
    Simplified proportional length.

    For bottoms and dresses, "Long"
    generally represents full/maxi
    length.

    For shoes this mainly acts as
    neutral metadata for now.
  */
  length: Length;

  /*
    1 = weak association
    5 = very strong association
  */
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

  /* =======================================================
     TOPS
     ======================================================= */

  {
    name: 'T-shirt',
    category: 'Top',
    formality: 1,
    warmth: 1,
    fit: 'Regular',
    volume: 'Balanced',
    length: 'Regular',
    styles: styleScores(
      5, 4, 5, 2, 2, 3, 4, 3
    )
  },

  {
    name: 'Fitted T-shirt',
    category: 'Top',
    formality: 1,
    warmth: 1,
    fit: 'Fitted',
    volume: 'Slim',
    length: 'Regular',
    styles: styleScores(
      5, 4, 4, 3, 4, 3, 5, 4
    )
  },

  {
    name: 'Oversized T-shirt',
    category: 'Top',
    formality: 1,
    warmth: 1,
    fit: 'Oversized',
    volume: 'Wide',
    length: 'Long',
    styles: styleScores(
      3, 4, 5, 1, 1, 4, 5, 2
    )
  },

  {
    name: 'Cropped T-shirt',
    category: 'Top',
    formality: 1,
    warmth: 1,
    fit: 'Fitted',
    volume: 'Slim',
    length: 'Cropped',
    styles: styleScores(
      3, 3, 5, 2, 4, 4, 5, 2
    )
  },

  {
    name: 'Tank top',
    category: 'Top',
    formality: 1,
    warmth: 1,
    fit: 'Fitted',
    volume: 'Slim',
    length: 'Regular',
    styles: styleScores(
      4, 3, 4, 1, 4, 4, 5, 2
    )
  },

  {
    name: 'Camisole',
    category: 'Top',
    formality: 2,
    warmth: 1,
    fit: 'Fitted',
    volume: 'Slim',
    length: 'Regular',
    styles: styleScores(
      4, 3, 2, 2, 5, 3, 5, 3
    )
  },

  {
    name: 'Blouse',
    category: 'Top',
    formality: 4,
    warmth: 2,
    fit: 'Regular',
    volume: 'Balanced',
    length: 'Regular',
    styles: styleScores(
      4, 4, 2, 4, 5, 2, 2, 5
    )
  },

  {
    name: 'Button-up',
    category: 'Top',
    formality: 4,
    warmth: 2,
    fit: 'Regular',
    volume: 'Balanced',
    length: 'Regular',
    styles: styleScores(
      5, 5, 3, 5, 3, 2, 3, 5
    )
  },

  {
    name: 'Oversized shirt',
    category: 'Top',
    formality: 3,
    warmth: 2,
    fit: 'Oversized',
    volume: 'Wide',
    length: 'Long',
    styles: styleScores(
      5, 5, 5, 3, 3, 3, 4, 4
    )
  },

  {
    name: 'Cropped shirt',
    category: 'Top',
    formality: 3,
    warmth: 2,
    fit: 'Regular',
    volume: 'Balanced',
    length: 'Cropped',
    styles: styleScores(
      4, 4, 3, 4, 5, 3, 5, 4
    )
  },

  {
    name: 'Sweater',
    category: 'Top',
    formality: 2,
    warmth: 4,
    fit: 'Relaxed',
    volume: 'Balanced',
    length: 'Regular',
    styles: styleScores(
      5, 5, 3, 4, 4, 2, 3, 5
    )
  },

  {
    name: 'Oversized sweater',
    category: 'Top',
    formality: 2,
    warmth: 5,
    fit: 'Oversized',
    volume: 'Wide',
    length: 'Long',
    styles: styleScores(
      4, 5, 5, 3, 3, 3, 4, 3
    )
  },

  {
    name: 'Cropped sweater',
    category: 'Top',
    formality: 2,
    warmth: 3,
    fit: 'Regular',
    volume: 'Balanced',
    length: 'Cropped',
    styles: styleScores(
      4, 4, 3, 4, 5, 3, 5, 3
    )
  },

  {
    name: 'Cardigan',
    category: 'Top',
    formality: 2,
    warmth: 3,
    fit: 'Relaxed',
    volume: 'Balanced',
    length: 'Regular',
    styles: styleScores(
      4, 5, 2, 5, 5, 1, 4, 5
    )
  },

  {
    name: 'Cropped cardigan',
    category: 'Top',
    formality: 2,
    warmth: 3,
    fit: 'Fitted',
    volume: 'Slim',
    length: 'Cropped',
    styles: styleScores(
      4, 4, 2, 5, 5, 2, 5, 4
    )
  },

  {
    name: 'Turtleneck',
    category: 'Top',
    formality: 3,
    warmth: 4,
    fit: 'Fitted',
    volume: 'Slim',
    length: 'Regular',
    styles: styleScores(
      5, 5, 2, 4, 4, 3, 2, 5
    )
  },

  {
    name: 'Hoodie',
    category: 'Top',
    formality: 1,
    warmth: 4,
    fit: 'Relaxed',
    volume: 'Wide',
    length: 'Regular',
    styles: styleScores(
      2, 4, 5, 1, 1, 3, 5, 1
    )
  },

  {
    name: 'Bodysuit',
    category: 'Top',
    formality: 2,
    warmth: 1,
    fit: 'Fitted',
    volume: 'Slim',
    length: 'Regular',
    styles: styleScores(
      4, 3, 4, 2, 5, 4, 5, 3
    )
  },


  /* =======================================================
     BOTTOMS
     ======================================================= */

  {
    name: 'Straight jeans',
    category: 'Bottom',
    formality: 1,
    warmth: 3,
    fit: 'Regular',
    volume: 'Balanced',
    length: 'Long',
    styles: styleScores(
      5, 5, 5, 3, 3, 4, 4, 4
    )
  },

  {
    name: 'Wide-leg jeans',
    category: 'Bottom',
    formality: 1,
    warmth: 3,
    fit: 'Relaxed',
    volume: 'Wide',
    length: 'Long',
    styles: styleScores(
      4, 5, 5, 2, 3, 4, 5, 3
    )
  },

  {
    name: 'Bootcut jeans',
    category: 'Bottom',
    formality: 2,
    warmth: 3,
    fit: 'Fitted',
    volume: 'Flared',
    length: 'Long',
    styles: styleScores(
      4, 4, 4, 3, 5, 4, 5, 4
    )
  },

  {
    name: 'Flare jeans',
    category: 'Bottom',
    formality: 1,
    warmth: 3,
    fit: 'Fitted',
    volume: 'Flared',
    length: 'Long',
    styles: styleScores(
      3, 3, 4, 2, 5, 5, 5, 3
    )
  },

  {
    name: 'Skinny jeans',
    category: 'Bottom',
    formality: 1,
    warmth: 3,
    fit: 'Fitted',
    volume: 'Slim',
    length: 'Long',
    styles: styleScores(
      3, 3, 3, 3, 4, 4, 4, 3
    )
  },

  {
    name: 'Baggy jeans',
    category: 'Bottom',
    formality: 1,
    warmth: 3,
    fit: 'Oversized',
    volume: 'Wide',
    length: 'Long',
    styles: styleScores(
      2, 4, 5, 1, 2, 5, 5, 2
    )
  },

  {
    name: 'Trousers',
    category: 'Bottom',
    formality: 4,
    warmth: 3,
    fit: 'Regular',
    volume: 'Balanced',
    length: 'Long',
    styles: styleScores(
      5, 5, 2, 5, 4, 2, 2, 5
    )
  },

  {
    name: 'Wide-leg trousers',
    category: 'Bottom',
    formality: 4,
    warmth: 3,
    fit: 'Relaxed',
    volume: 'Wide',
    length: 'Long',
    styles: styleScores(
      5, 5, 3, 4, 4, 3, 4, 5
    )
  },

  {
    name: 'Straight trousers',
    category: 'Bottom',
    formality: 4,
    warmth: 3,
    fit: 'Regular',
    volume: 'Balanced',
    length: 'Long',
    styles: styleScores(
      5, 5, 2, 5, 4, 2, 2, 5
    )
  },

  {
    name: 'Flare trousers',
    category: 'Bottom',
    formality: 4,
    warmth: 3,
    fit: 'Fitted',
    volume: 'Flared',
    length: 'Long',
    styles: styleScores(
      4, 4, 3, 4, 5, 4, 5, 4
    )
  },

  {
    name: 'Cargo trousers',
    category: 'Bottom',
    formality: 1,
    warmth: 3,
    fit: 'Relaxed',
    volume: 'Wide',
    length: 'Long',
    styles: styleScores(
      2, 3, 5, 1, 1, 5, 5, 2
    )
  },

  {
    name: 'Leggings',
    category: 'Bottom',
    formality: 1,
    warmth: 2,
    fit: 'Fitted',
    volume: 'Slim',
    length: 'Long',
    styles: styleScores(
      3, 4, 4, 1, 3, 2, 4, 2
    )
  },

  {
    name: 'Mini skirt',
    category: 'Bottom',
    formality: 2,
    warmth: 1,
    fit: 'Fitted',
    volume: 'Slim',
    length: 'Cropped',
    styles: styleScores(
      2, 2, 4, 4, 5, 5, 5, 3
    )
  },

  {
    name: 'Midi skirt',
    category: 'Bottom',
    formality: 3,
    warmth: 2,
    fit: 'Regular',
    volume: 'Balanced',
    length: 'Regular',
    styles: styleScores(
      5, 5, 2, 5, 5, 2, 3, 5
    )
  },

  {
    name: 'Maxi skirt',
    category: 'Bottom',
    formality: 3,
    warmth: 2,
    fit: 'Relaxed',
    volume: 'Wide',
    length: 'Long',
    styles: styleScores(
      4, 4, 3, 3, 5, 3, 4, 4
    )
  },

  {
    name: 'Denim skirt',
    category: 'Bottom',
    formality: 1,
    warmth: 2,
    fit: 'Regular',
    volume: 'Balanced',
    length: 'Regular',
    styles: styleScores(
      3, 3, 4, 3, 4, 4, 5, 3
    )
  },

  {
    name: 'Shorts',
    category: 'Bottom',
    formality: 1,
    warmth: 1,
    fit: 'Regular',
    volume: 'Balanced',
    length: 'Cropped',
    styles: styleScores(
      4, 4, 5, 3, 3, 3, 5, 3
    )
  },


  /* =======================================================
     DRESSES
     ======================================================= */

  {
    name: 'Mini dress',
    category: 'Dress',
    formality: 3,
    warmth: 1,
    fit: 'Fitted',
    volume: 'Slim',
    length: 'Cropped',
    styles: styleScores(
      3, 2, 3, 3, 5, 4, 5, 4
    )
  },

  {
    name: 'Midi dress',
    category: 'Dress',
    formality: 4,
    warmth: 2,
    fit: 'Regular',
    volume: 'Balanced',
    length: 'Regular',
    styles: styleScores(
      5, 4, 1, 4, 5, 2, 2, 5
    )
  },

  {
    name: 'Maxi dress',
    category: 'Dress',
    formality: 4,
    warmth: 2,
    fit: 'Relaxed',
    volume: 'Wide',
    length: 'Long',
    styles: styleScores(
      4, 4, 2, 3, 5, 2, 3, 5
    )
  },

  {
    name: 'Slip dress',
    category: 'Dress',
    formality: 4,
    warmth: 1,
    fit: 'Regular',
    volume: 'Slim',
    length: 'Regular',
    styles: styleScores(
      5, 4, 2, 2, 5, 4, 5, 4
    )
  },

  {
    name: 'Bodycon dress',
    category: 'Dress',
    formality: 3,
    warmth: 1,
    fit: 'Fitted',
    volume: 'Slim',
    length: 'Regular',
    styles: styleScores(
      2, 2, 3, 2, 5, 4, 5, 3
    )
  },

  {
    name: 'Shirt dress',
    category: 'Dress',
    formality: 4,
    warmth: 2,
    fit: 'Regular',
    volume: 'Balanced',
    length: 'Regular',
    styles: styleScores(
      5, 5, 2, 5, 4, 2, 2, 5
    )
  },

  {
    name: 'Knitted dress',
    category: 'Dress',
    formality: 3,
    warmth: 4,
    fit: 'Fitted',
    volume: 'Slim',
    length: 'Regular',
    styles: styleScores(
      5, 5, 2, 4, 5, 2, 3, 5
    )
  },


  /* =======================================================
     OUTERWEAR
     ======================================================= */

  {
    name: 'Blazer',
    category: 'Outerwear',
    formality: 4,
    warmth: 3,
    fit: 'Regular',
    volume: 'Balanced',
    length: 'Regular',
    styles: styleScores(
      5, 5, 4, 5, 4, 3, 4, 5
    )
  },

  {
    name: 'Oversized blazer',
    category: 'Outerwear',
    formality: 4,
    warmth: 3,
    fit: 'Oversized',
    volume: 'Wide',
    length: 'Long',
    styles: styleScores(
      5, 5, 5, 3, 3, 4, 5, 4
    )
  },

  {
    name: 'Leather jacket',
    category: 'Outerwear',
    formality: 2,
    warmth: 3,
    fit: 'Regular',
    volume: 'Balanced',
    length: 'Regular',
    styles: styleScores(
      3, 3, 5, 1, 2, 5, 5, 3
    )
  },

  {
    name: 'Denim jacket',
    category: 'Outerwear',
    formality: 1,
    warmth: 2,
    fit: 'Relaxed',
    volume: 'Balanced',
    length: 'Regular',
    styles: styleScores(
      4, 4, 5, 2, 3, 4, 5, 3
    )
  },

  {
    name: 'Bomber jacket',
    category: 'Outerwear',
    formality: 1,
    warmth: 3,
    fit: 'Relaxed',
    volume: 'Wide',
    length: 'Regular',
    styles: styleScores(
      2, 3, 5, 1, 1, 5, 5, 2
    )
  },

  {
    name: 'Trench coat',
    category: 'Outerwear',
    formality: 4,
    warmth: 3,
    fit: 'Relaxed',
    volume: 'Balanced',
    length: 'Long',
    styles: styleScores(
      5, 5, 3, 5, 4, 2, 2, 5
    )
  },

  {
    name: 'Wool coat',
    category: 'Outerwear',
    formality: 4,
    warmth: 5,
    fit: 'Relaxed',
    volume: 'Balanced',
    length: 'Long',
    styles: styleScores(
      5, 5, 2, 4, 4, 2, 2, 5
    )
  },

  {
    name: 'Puffer',
    category: 'Outerwear',
    formality: 1,
    warmth: 5,
    fit: 'Oversized',
    volume: 'Wide',
    length: 'Regular',
    styles: styleScores(
      3, 5, 5, 1, 1, 3, 4, 2
    )
  },

  {
    name: 'Parka',
    category: 'Outerwear',
    formality: 1,
    warmth: 5,
    fit: 'Relaxed',
    volume: 'Wide',
    length: 'Long',
    styles: styleScores(
      3, 5, 5, 1, 1, 3, 3, 2
    )
  },

  {
    name: 'Utility jacket',
    category: 'Outerwear',
    formality: 1,
    warmth: 3,
    fit: 'Relaxed',
    volume: 'Balanced',
    length: 'Regular',
    styles: styleScores(
      3, 4, 5, 1, 1, 4, 4, 3
    )
  },


  /* =======================================================
     SHOES
     ======================================================= */

  {
    name: 'Sneakers',
    category: 'Shoes',
    formality: 1,
    warmth: 2,
    fit: 'Regular',
    volume: 'Balanced',
    length: 'Regular',
    styles: styleScores(
      5, 5, 5, 3, 2, 3, 5, 3
    )
  },

  {
    name: 'Loafers',
    category: 'Shoes',
    formality: 4,
    warmth: 2,
    fit: 'Regular',
    volume: 'Balanced',
    length: 'Regular',
    styles: styleScores(
      5, 5, 3, 5, 4, 2, 3, 5
    )
  },

  {
    name: 'Heels',
    category: 'Shoes',
    formality: 5,
    warmth: 1,
    fit: 'Regular',
    volume: 'Slim',
    length: 'Regular',
    styles: styleScores(
      4, 3, 1, 4, 5, 3, 4, 5
    )
  },

  {
    name: 'Ankle boots',
    category: 'Shoes',
    formality: 3,
    warmth: 4,
    fit: 'Regular',
    volume: 'Balanced',
    length: 'Regular',
    styles: styleScores(
      5, 5, 4, 3, 4, 5, 4, 5
    )
  },

  {
    name: 'Tall boots',
    category: 'Shoes',
    formality: 4,
    warmth: 4,
    fit: 'Regular',
    volume: 'Balanced',
    length: 'Long',
    styles: styleScores(
      4, 4, 3, 4, 5, 5, 4, 5
    )
  },

  {
    name: 'Chelsea boots',
    category: 'Shoes',
    formality: 3,
    warmth: 4,
    fit: 'Regular',
    volume: 'Balanced',
    length: 'Regular',
    styles: styleScores(
      5, 5, 3, 4, 3, 4, 3, 5
    )
  },

  {
    name: 'Sandals',
    category: 'Shoes',
    formality: 2,
    warmth: 1,
    fit: 'Regular',
    volume: 'Slim',
    length: 'Regular',
    styles: styleScores(
      5, 4, 2, 3, 5, 2, 3, 4
    )
  },

  {
    name: 'Ballet flats',
    category: 'Shoes',
    formality: 3,
    warmth: 1,
    fit: 'Regular',
    volume: 'Slim',
    length: 'Regular',
    styles: styleScores(
      5, 4, 2, 5, 5, 1, 3, 5
    )
  },

  {
    name: 'Mary Janes',
    category: 'Shoes',
    formality: 3,
    warmth: 2,
    fit: 'Regular',
    volume: 'Slim',
    length: 'Regular',
    styles: styleScores(
      4, 4, 2, 5, 5, 2, 5, 5
    )
  }
];


/* =========================================================
   DATABASE HELPERS
   ========================================================= */

export function getGarment(
  name: string
): Garment | undefined {

  return garments.find(
    garment =>
      garment.name === name
  );
}


export function getGarmentsByCategory(
  category: Category
): Garment[] {

  return garments.filter(
    garment =>
      garment.category === category
  );
}
