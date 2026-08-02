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

export function generateOutfits(
  category: string,
  item: string,
  color: string,
  style: string,
  occasion: string,
  season: string
): Outfit[] {

  const p = palettes[color] || ['White', 'Black', 'Cream'];

  return Array.from({ length: 6 }, (_, i) => {
    const c1 = p[i % p.length];
    const c2 = p[(i + 2) % p.length];
    const c3 = p[(i + 4) % p.length];

    const anchor = `${color} ${item}`;

    let parts: string[];

    if (category === 'Top') {
      // Selected top + bottom + shoes + optional outerwear
      parts = [
        anchor,
        `${c1} ${bottoms[i % bottoms.length]}`,
        `${c2} ${shoes[i % shoes.length]}`,
        `${c3} ${outer[i % outer.length]}`
      ];

    } else if (category === 'Bottom') {
      // Selected bottom + top + shoes + optional outerwear
      parts = [
        anchor,
        `${c1} ${tops[i % tops.length]}`,
        `${c2} ${shoes[i % shoes.length]}`,
        `${c3} ${outer[i % outer.length]}`
      ];

    } else if (category === 'Shoes') {
      // Selected shoes + bottom + top + outerwear
      parts = [
        anchor,
        `${c1} ${bottoms[i % bottoms.length]}`,
        `${c2} ${tops[i % tops.length]}`,
        `${c3} ${outer[i % outer.length]}`
      ];

    } else if (category === 'Outerwear') {
      // Selected outerwear + top + bottom + shoes
      // Never generate a second outerwear piece
      parts = [
        anchor,
        `${c1} ${tops[i % tops.length]}`,
        `${c2} ${bottoms[i % bottoms.length]}`,
        `${c3} ${shoes[i % shoes.length]}`
      ];

    } else if (category === 'Dress') {
      // Dress replaces the normal top + bottom combination
      parts = [
        anchor,
        `${c1} ${shoes[i % shoes.length]}`,
        `${c2} ${outer[i % outer.length]}`
      ];

    } else {
      // Safe fallback
      parts = [
        anchor,
        `${c1} ${tops[i % tops.length]}`,
        `${c2} ${bottoms[i % bottoms.length]}`,
        `${c3} ${shoes[i % shoes.length]}`
      ];
    }

    const titles = [
      `${style} balance`,
      'Polished contrast',
      'Easy layers',
      'Tonal mix',
      'Statement neutral',
      'Clean silhouette'
    ];

    return {
      title: titles[i],
      items: parts,
      score: 96 - i * 3,
      note: `Built for ${occasion.toLowerCase()} · ${season.toLowerCase()}, balancing color, silhouette and ${style.toLowerCase()} styling.`
    };
  });
}
