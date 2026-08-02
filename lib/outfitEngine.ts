const palettes: Record<string, string[]> = {
  Black: ['White', 'Cream', 'Grey', 'Burgundy', 'Pink', 'Olive', 'Blue'],
  White: ['Black', 'Navy', 'Beige', 'Brown', 'Blue', 'Olive', 'Pink'],
  Cream: ['Black', 'Brown', 'Navy', 'Burgundy', 'Olive', 'Beige'],
  Grey: ['Black', 'White', 'Burgundy', 'Navy', 'Pink', 'Blue'],
  Navy: ['White', 'Cream', 'Beige', 'Grey', 'Burgundy', 'Pink'],
  Beige: ['White', 'Brown', 'Black', 'Navy', 'Olive', 'Burgundy'],
  Brown: ['Cream', 'White', 'Beige', 'Blue', 'Olive', 'Pink'],
  Burgundy: ['Cream', 'Black', 'Grey', 'Navy', 'Pink'],
  Red: ['Black', 'White', 'Cream', 'Navy', 'Denim'],
  Pink: ['White', 'Cream', 'Grey', 'Brown', 'Burgundy'],
  Olive: ['Cream', 'White', 'Black', 'Beige', 'Brown'],
  Green: ['White', 'Cream', 'Black', 'Navy', 'Brown'],
  Blue: ['White', 'Cream', 'Brown', 'Grey', 'Black'],
  Denim: ['White', 'Cream', 'Black', 'Grey', 'Burgundy']
};

const tops = [
  'Fitted T-shirt',
  'Silk blouse',
  'Ribbed tank',
  'Crisp button-up',
  'Fine-knit sweater',
  'Soft cardigan'
];

const bottoms = [
  'Wide-leg trousers',
  'Straight jeans',
  'Midi skirt',
  'Tailored trousers',
  'Mini skirt'
];

const shoes = [
  'Leather loafers',
  'Minimal sneakers',
  'Ballet flats',
  'Ankle boots',
  'Slingback heels'
];

const outer = [
  'Oversized blazer',
  'Trench coat',
  'Leather jacket',
  'Wool coat'
];

export type Outfit = {
  title: string;
  items: string[];
  score: number;
  note: string;
};

/* -----------------------------
   COLOR SCORE
----------------------------- */

function colorScore(base: string, colors: string[]): number {
  const compatible = palettes[base] || [];

  if (!colors.length) return 70;

  let total = 0;

  colors.forEach(color => {
    if (color === base) {
      // Monochrome outfits can work very well
      total += 90;
    } else if (compatible.includes(color)) {
      const position = compatible.indexOf(color);

      // Colors earlier in the palette are considered
      // slightly stronger combinations.
      total += Math.max(75, 100 - position * 4);
    } else {
      total += 60;
    }
  });

  return total / colors.length;
}

/* -----------------------------
   STYLE SCORE
----------------------------- */

function styleScore(style: string, items: string[]): number {
  const text = items.join(' ').toLowerCase();

  const rules: Record<string, string[]> = {
    minimalist: [
      't-shirt',
      'trousers',
      'button-up',
      'sneakers',
      'loafers',
      'trench',
      'fine-knit'
    ],

    scandinavian: [
      'trousers',
      'fine-knit',
      'wool',
      'loafers',
      'sneakers',
      'button-up',
      'trench'
    ],

    feminine: [
      'silk',
      'skirt',
      'ballet',
      'slingback',
      'cardigan'
    ],

    streetwear: [
      't-shirt',
      'tank',
      'jeans',
      'sneakers',
      'leather',
      'oversized'
    ],

    preppy: [
      'button-up',
      'loafers',
      'blazer',
      'cardigan',
      'skirt'
    ],

    edgy: [
      'leather',
      'boots',
      'mini',
      'tank',
      'black'
    ]
  };

  const keywords = rules[style.toLowerCase()] || [];

  if (!keywords.length) return 80;

  const matches = keywords.filter(word =>
    text.includes(word)
  ).length;

  return Math.min(100, 70 + matches * 8);
}

/* -----------------------------
   OCCASION SCORE
----------------------------- */

function occasionScore(
  occasion: string,
  items: string[]
): number {

  const text = items.join(' ').toLowerCase();

  const rules: Record<string, string[]> = {
    everyday: [
      't-shirt',
      'jeans',
      'sneakers',
      'loafers',
      'cardigan',
      'sweater'
    ],

    work: [
      'trousers',
      'blouse',
      'button-up',
      'blazer',
      'loafers',
      'slingback'
    ],

    'date night': [
      'silk',
      'skirt',
      'slingback',
      'ballet',
      'leather'
    ],

    party: [
      'mini',
      'slingback',
      'leather',
      'tank'
    ],

    formal: [
      'silk',
      'tailored',
      'blazer',
      'slingback',
      'wool'
    ]
  };

  const keywords = rules[occasion.toLowerCase()] || [];

  if (!keywords.length) return 80;

  const matches = keywords.filter(word =>
    text.includes(word)
  ).length;

  return Math.min(100, 68 + matches * 9);
}

/* -----------------------------
   SEASON SCORE
----------------------------- */

function seasonScore(
  season: string,
  items: string[]
): number {

  const text = items.join(' ').toLowerCase();

  const warmItems = [
    'wool',
    'sweater',
    'boots',
    'coat',
    'fine-knit'
  ];

  const lightItems = [
    'tank',
    't-shirt',
    'ballet',
    'slingback',
    'mini'
  ];

  const s = season.toLowerCase();

  let score = 82;

  if (s === 'winter' || s === 'autumn') {
    warmItems.forEach(item => {
      if (text.includes(item)) score += 5;
    });

    if (text.includes('tank')) score -= 8;
  }

  if (s === 'summer' || s === 'spring') {
    lightItems.forEach(item => {
      if (text.includes(item)) score += 4;
    });

    if (text.includes('wool coat')) score -= 12;
  }

  return Math.max(55, Math.min(100, score));
}

/* -----------------------------
   FINAL SCORE
----------------------------- */

function calculateScore(
  baseColor: string,
  generatedColors: string[],
  style: string,
  occasion: string,
  season: string,
  items: string[]
): number {

  const color = colorScore(baseColor, generatedColors);
  const styling = styleScore(style, items);
  const event = occasionScore(occasion, items);
  const seasonal = seasonScore(season, items);

  // Structure is guaranteed by our generator,
  // so valid outfits receive full structure points.
  const structure = 100;

  const final =
    color * 0.35 +
    styling * 0.25 +
    event * 0.20 +
    seasonal * 0.10 +
    structure * 0.10;

  return Math.round(
    Math.max(0, Math.min(100, final))
  );
}

/* -----------------------------
   GENERATOR
----------------------------- */

export function generateOutfits(
  category: string,
  item: string,
  color: string,
  style: string,
  occasion: string,
  season: string
): Outfit[] {

  const p = palettes[color] || ['White', 'Black', 'Cream'];

  const outfits: Outfit[] = Array.from(
    { length: 12 },
    (_, i) => {

      const c1 = p[i % p.length];
      const c2 = p[(i + 2) % p.length];
      const c3 = p[(i + 4) % p.length];

      const anchor = `${color} ${item}`;

      let parts: string[];

      if (category === 'Top') {

        parts = [
          anchor,
          `${c1} ${bottoms[i % bottoms.length]}`,
          `${c2} ${shoes[i % shoes.length]}`,
          `${c3} ${outer[i % outer.length]}`
        ];

      } else if (category === 'Bottom') {

        parts = [
          anchor,
          `${c1} ${tops[i % tops.length]}`,
          `${c2} ${shoes[i % shoes.length]}`,
          `${c3} ${outer[i % outer.length]}`
        ];

      } else if (category === 'Shoes') {

        parts = [
          anchor,
          `${c1} ${bottoms[i % bottoms.length]}`,
          `${c2} ${tops[i % tops.length]}`,
          `${c3} ${outer[i % outer.length]}`
        ];

      } else if (category === 'Outerwear') {

        parts = [
          anchor,
          `${c1} ${tops[i % tops.length]}`,
          `${c2} ${bottoms[i % bottoms.length]}`,
          `${c3} ${shoes[i % shoes.length]}`
        ];

      } else if (category === 'Dress') {

        parts = [
          anchor,
          `${c1} ${shoes[i % shoes.length]}`,
          `${c2} ${outer[i % outer.length]}`
        ];

      } else {

        parts = [
          anchor,
          `${c1} ${tops[i % tops.length]}`,
          `${c2} ${bottoms[i % bottoms.length]}`,
          `${c3} ${shoes[i % shoes.length]}`
        ];
      }

      const score = calculateScore(
        color,
        [c1, c2, c3],
        style,
        occasion,
        season,
        parts
      );

      const titles = [
        `${style} Balance`,
        'Polished Contrast',
        'Easy Layers',
        'Tonal Mix',
        'Statement Neutral',
        'Clean Silhouette',
        'Modern Classic',
        'Soft Contrast',
        'Elevated Essential',
        'Effortless Mix',
        'Refined Layers',
        'Everyday Edit'
      ];

      return {
        title: titles[i],
        items: parts,
        score,
        note:
          `Built for ${occasion.toLowerCase()} · ` +
          `${season.toLowerCase()}, balancing color, ` +
          `silhouette and ${style.toLowerCase()} styling.`
      };
    }
  );

  /*
    Generate 12 candidates,
    rank them by their actual score,
    then only show the best 6.
  */

  return outfits
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);
}
