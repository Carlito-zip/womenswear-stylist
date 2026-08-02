import {
  garments,
  getGarment,
  Garment,
  Category,
  Style
} from './data';


/* =========================================================
   TYPES
   ========================================================= */

export type Outfit = {
  title: string;
  items: string[];
  score: number;
  note: string;
};
export type StyleProfile = {
  favoriteStyles: string[];
  lovedColors: string[];
  avoidedColors: string[];
  lovedGarments: string[];
  avoidedGarments: string[];
};
type Candidate = Outfit & {
  colors: string[];
  pieces: Garment[];
};


/* =========================================================
   COLOR DATA
   ========================================================= */

const palettes: Record<string, string[]> = {
  Black: ['White', 'Cream', 'Grey', 'Burgundy', 'Pink', 'Olive', 'Blue', 'Beige'],
  White: ['Black', 'Navy', 'Beige', 'Brown', 'Blue', 'Olive', 'Pink', 'Denim'],
  Cream: ['Black', 'Brown', 'Navy', 'Burgundy', 'Olive', 'Beige', 'Denim', 'White'],
  Grey: ['Black', 'White', 'Burgundy', 'Navy', 'Pink', 'Blue', 'Cream', 'Beige'],
  Navy: ['White', 'Cream', 'Beige', 'Grey', 'Burgundy', 'Pink', 'Brown', 'Blue'],
  Beige: ['White', 'Brown', 'Black', 'Navy', 'Olive', 'Burgundy', 'Cream'],
  Brown: ['Cream', 'White', 'Beige', 'Blue', 'Olive', 'Pink', 'Denim'],
  Burgundy: ['Cream', 'Black', 'Grey', 'Navy', 'Pink', 'Beige', 'White'],
  Red: ['Black', 'White', 'Cream', 'Navy', 'Denim', 'Grey'],
  Pink: ['White', 'Cream', 'Grey', 'Brown', 'Burgundy', 'Navy'],
  Olive: ['Cream', 'White', 'Black', 'Beige', 'Brown', 'Navy'],
  Green: ['White', 'Cream', 'Black', 'Navy', 'Brown', 'Beige'],
  Blue: ['White', 'Cream', 'Brown', 'Grey', 'Black', 'Beige', 'Navy'],
  Denim: ['White', 'Cream', 'Black', 'Grey', 'Burgundy', 'Brown']
};

const neutrals = new Set([
  'Black',
  'White',
  'Cream',
  'Grey',
  'Navy',
  'Beige',
  'Brown'
]);

const lightColors = new Set([
  'White',
  'Cream',
  'Beige',
  'Pink'
]);

const darkColors = new Set([
  'Black',
  'Navy',
  'Grey',
  'Brown',
  'Burgundy'
]);

const statementColors = new Set([
  'Burgundy',
  'Red',
  'Pink',
  'Olive',
  'Green',
  'Blue',
  'Denim'
]);


/* =========================================================
   OCCASION + SEASON
   ========================================================= */

const occasionFormality: Record<string, number> = {
  Everyday: 2,
  Weekend: 2,
  Work: 4,
  'Date night': 4,
  Party: 4,
  Formal: 5
};

const seasonWarmth: Record<string, number> = {
  'All season': 3,
  Spring: 2.5,
  Summer: 1,
  Autumn: 3.5,
  Winter: 5
};


/* =========================================================
   HELPERS
   ========================================================= */

function byCategory(category: Category): Garment[] {
  return garments.filter(
    garment => garment.category === category
  );
}

function clamp(value: number) {
  return Math.max(0, Math.min(100, value));
}


/* =========================================================
   COLOR COMPATIBILITY
   ========================================================= */

function colorPairScore(
  a: string,
  b: string
): number {

  if (a === b) {
    return 86;
  }

  const aPalette = palettes[a] || [];
  const bPalette = palettes[b] || [];

  const aIndex = aPalette.indexOf(b);
  const bIndex = bPalette.indexOf(a);

  if (aIndex !== -1 || bIndex !== -1) {

    const index = Math.min(
      aIndex === -1 ? 99 : aIndex,
      bIndex === -1 ? 99 : bIndex
    );

    return Math.max(
      78,
      100 - index * 3
    );
  }

  if (
    neutrals.has(a) &&
    neutrals.has(b)
  ) {
    return 82;
  }

  if (
    neutrals.has(a) ||
    neutrals.has(b)
  ) {
    return 73;
  }

  return 55;
}


/* =========================================================
   COLOR SCORE
   ========================================================= */

function colorScore(
  colors: string[],
  pieces: Garment[],
  anchorColor: string
): number {

  let total = 0;
  let comparisons = 0;

  for (let i = 0; i < colors.length; i++) {

    for (
      let j = i + 1;
      j < colors.length;
      j++
    ) {

      total += colorPairScore(
        colors[i],
        colors[j]
      );

      comparisons++;
    }
  }

  let score =
    comparisons
      ? total / comparisons
      : 100;

  const unique =
    new Set(colors);

  const counts: Record<string, number> = {};

  colors.forEach(color => {
    counts[color] =
      (counts[color] || 0) + 1;
  });

  const maxRepeat =
    Math.max(...Object.values(counts));


  /* -------------------------------------------------------
     GENERAL VARIETY
     ------------------------------------------------------- */

  if (unique.size === 1) {
    score -= 20;
  }

  if (maxRepeat >= 3) {
    score -= 12;
  }

  if (unique.size === 2) {
    score += 2;
  }

  if (unique.size === 3) {
    score += 7;
  }

  if (unique.size >= 4) {
    score += 4;
  }


  /* -------------------------------------------------------
     TOP + BOTTOM REPETITION

     This directly addresses the problem
     where MUSE keeps returning a navy
     top with navy trousers.
     ------------------------------------------------------- */

  const topIndex =
    pieces.findIndex(
      piece => piece.category === 'Top'
    );

  const bottomIndex =
    pieces.findIndex(
      piece => piece.category === 'Bottom'
    );


  if (
    topIndex !== -1 &&
    bottomIndex !== -1
  ) {

    const topColor =
      colors[topIndex];

    const bottomColor =
      colors[bottomIndex];


    // Same top and bottom color is allowed,
    // but should not dominate recommendations.
    if (
      topColor === bottomColor
    ) {
      score -= 14;
    }


    // Even stronger penalty when both simply
    // copy the selected anchor color.
    if (
      topColor === anchorColor &&
      bottomColor === anchorColor
    ) {
      score -= 10;
    }


    // Reward intentional contrast.
    if (
      topColor !== bottomColor &&
      colorPairScore(
        topColor,
        bottomColor
      ) >= 82
    ) {
      score += 6;
    }
  }


  /* -------------------------------------------------------
     ACCENT CONTROL
     ------------------------------------------------------- */

  const accents =
    colors.filter(
      color =>
        statementColors.has(color)
    );

  const uniqueAccents =
    new Set(accents);

  if (
    uniqueAccents.size >= 3
  ) {
    score -= 8;
  }


  return clamp(score);
}


/* =========================================================
   STYLE SCORE
   ========================================================= */

function styleScore(
  outfit: Garment[],
  style: Style
): number {

  const average =
    outfit.reduce(
      (sum, garment) =>
        sum +
        (garment.styles[style] || 3),
      0
    ) / outfit.length;

  return average * 20;
}


/* =========================================================
   FORMALITY
   ========================================================= */

function formalityScore(
  outfit: Garment[],
  occasion: string
): number {

  const target =
    occasionFormality[occasion] ?? 3;

  const average =
    outfit.reduce(
      (sum, garment) =>
        sum + garment.formality,
      0
    ) / outfit.length;

  return clamp(
    100 -
    Math.abs(target - average) * 18
  );
}


/* =========================================================
   SEASON
   ========================================================= */

function seasonScore(
  outfit: Garment[],
  season: string
): number {

  if (season === 'All season') {
    return 88;
  }

  const target =
    seasonWarmth[season] ?? 3;

  const average =
    outfit.reduce(
      (sum, garment) =>
        sum + garment.warmth,
      0
    ) / outfit.length;

  return clamp(
    100 -
    Math.abs(target - average) * 20
  );
}


/* =========================================================
   SILHOUETTE
   ========================================================= */

function silhouetteScore(
  outfit: Garment[]
): number {

  let score = 88;

  const wide =
    outfit.filter(
      garment =>
        garment.volume === 'Wide'
    ).length;

  const slim =
    outfit.filter(
      garment =>
        garment.volume === 'Slim'
    ).length;

  const oversized =
    outfit.filter(
      garment =>
        garment.fit === 'Oversized'
    ).length;


  if (
    wide >= 1 &&
    slim >= 1
  ) {
    score += 10;
  }

  if (wide >= 3) {
    score -= 15;
  }

  if (oversized >= 2) {
    score -= 12;
  }

  return clamp(score);
}

/* =========================================================
   PERSONAL STYLE PROFILE
   ========================================================= */

function preferenceScore(
  pieces: Garment[],
  colors: string[],
  selectedStyle: Style,
  profile?: StyleProfile
): number {

  if (!profile) {
    return 75;
  }

  let score = 70;

  const garmentNames =
    pieces.map(piece => piece.name);

  /* Favorite style */

  if (
    profile.favoriteStyles.includes(
      selectedStyle
    )
  ) {
    score += 12;
  }

  /* Loved colors */

  for (const color of colors) {
    if (
      profile.lovedColors.includes(color)
    ) {
      score += 6;
    }
  }

  /* Avoided colors */

  for (const color of colors) {
    if (
      profile.avoidedColors.includes(color)
    ) {
      score -= 22;
    }
  }

  /* Loved garments */

  for (const garment of garmentNames) {
    if (
      profile.lovedGarments.includes(garment)
    ) {
      score += 8;
    }
  }

  /* Avoided garments */

  for (const garment of garmentNames) {
    if (
      profile.avoidedGarments.includes(garment)
    ) {
      score -= 28;
    }
  }

  return clamp(score);
}

/* =========================================================
   COMPLETE SCORE
   ========================================================= */

function calculateScore(
  pieces: Garment[],
  colors: string[],
  anchorColor: string,
  style: Style,
  occasion: string,
  season: string,
  profile?: StyleProfile
): number {

  const color =
    colorScore(
      colors,
      pieces,
      anchorColor
    );

  const styling =
    styleScore(
      pieces,
      style
    );

  const formality =
    formalityScore(
      pieces,
      occasion
    );

  const seasonal =
    seasonScore(
      pieces,
      season
    );

  const silhouette =
    silhouetteScore(
      pieces
    );

  const preference =
    preferenceScore(
      pieces,
      colors,
      style,
      profile
    );

  return Math.round(
    clamp(
      color * 0.25 +
      styling * 0.20 +
      formality * 0.15 +
      seasonal * 0.10 +
      silhouette * 0.10 +
      preference * 0.20
    )
  );
}


  const color =
    colorScore(
      colors,
      pieces,
      anchorColor
    );

  const styling =
    styleScore(
      pieces,
      style
    );

  const formality =
    formalityScore(
      pieces,
      occasion
    );

  const seasonal =
    seasonScore(
      pieces,
      season
    );

  const silhouette =
    silhouetteScore(
      pieces
    );


  return Math.round(
    clamp(
      color * 0.30 +
      styling * 0.25 +
      formality * 0.20 +
      seasonal * 0.15 +
      silhouette * 0.10
    )
  );
}


/* =========================================================
   COLOR SEARCH
   ========================================================= */

function getCandidateColors(
  anchorColor: string
): string[] {

  return Array.from(
    new Set([
      anchorColor,
      ...(palettes[anchorColor] || [])
    ])
  );
}


function generateColorCombinations(
  anchorColor: string,
  count: number
): string[][] {

  const available =
    getCandidateColors(anchorColor);

  const result: string[][] = [];


  function build(
    current: string[],
    depth: number
  ) {

    if (depth === count) {

      result.push([
        anchorColor,
        ...current
      ]);

      return;
    }


    for (
      const color of available
    ) {

      build(
        [...current, color],
        depth + 1
      );
    }
  }


  build([], 0);

  return result;
}


/* =========================================================
   BUILD GARMENT STRUCTURES
   ========================================================= */

function buildStructures(
  category: string,
  anchor: Garment
): Garment[][] {

  const tops =
    byCategory('Top');

  const bottoms =
    byCategory('Bottom');

  const shoes =
    byCategory('Shoes');

  const outerwear =
    byCategory('Outerwear');

  const structures: Garment[][] = [];


  if (category === 'Top') {

    for (const bottom of bottoms) {
      for (const shoe of shoes) {

        structures.push([
          anchor,
          bottom,
          shoe
        ]);

        for (
          const outer of outerwear
        ) {

          structures.push([
            anchor,
            bottom,
            shoe,
            outer
          ]);
        }
      }
    }
  }


  else if (
    category === 'Bottom'
  ) {

    for (const top of tops) {
      for (const shoe of shoes) {

        structures.push([
          anchor,
          top,
          shoe
        ]);

        for (
          const outer of outerwear
        ) {

          structures.push([
            anchor,
            top,
            shoe,
            outer
          ]);
        }
      }
    }
  }


  else if (
    category === 'Shoes'
  ) {

    for (const top of tops) {
      for (const bottom of bottoms) {

        structures.push([
          anchor,
          top,
          bottom
        ]);

        for (
          const outer of outerwear
        ) {

          structures.push([
            anchor,
            top,
            bottom,
            outer
          ]);
        }
      }
    }
  }


  else if (
    category === 'Outerwear'
  ) {

    for (const top of tops) {
      for (const bottom of bottoms) {
        for (const shoe of shoes) {

          structures.push([
            anchor,
            top,
            bottom,
            shoe
          ]);
        }
      }
    }
  }


  else if (
    category === 'Dress'
  ) {

    for (const shoe of shoes) {

      structures.push([
        anchor,
        shoe
      ]);

      for (
        const outer of outerwear
      ) {

        structures.push([
          anchor,
          shoe,
          outer
        ]);
      }
    }
  }


  return structures;
}


/* =========================================================
   DISPLAY HELPERS
   ========================================================= */

function makeItems(
  pieces: Garment[],
  colors: string[]
): string[] {

  return pieces.map(
    (piece, index) =>
      `${colors[index]} ${piece.name}`
  );
}


function createNote(
  pieces: Garment[],
  colors: string[],
  anchorColor: string,
  style: Style,
  occasion: string,
  season: string
): string {

  const harmony =
    Math.round(
      colorScore(
        colors,
        pieces,
        anchorColor
      )
    );

  const styleMatch =
    Math.round(
      styleScore(
        pieces,
        style
      )
    );

  return (
    `${style} styling · ` +
    `${harmony}% color harmony · ` +
    `${styleMatch}% style match · ` +
    `balanced for ${occasion.toLowerCase()} ` +
    `and ${season.toLowerCase()}.`
  );
}


/* =========================================================
   PALETTE PERSONALITIES
   ========================================================= */

function isTonal(
  candidate: Candidate
): boolean {

  const unique =
    new Set(candidate.colors);

  return (
    unique.size <= 2
  );
}


function isNeutralAccent(
  candidate: Candidate
): boolean {

  const neutralCount =
    candidate.colors.filter(
      color =>
        neutrals.has(color)
    ).length;

  const accentCount =
    candidate.colors.filter(
      color =>
        statementColors.has(color)
    ).length;

  return (
    neutralCount >= 2 &&
    accentCount >= 1
  );
}


function isLightContrast(
  candidate: Candidate
): boolean {

  const hasLight =
    candidate.colors.some(
      color =>
        lightColors.has(color)
    );

  const hasDark =
    candidate.colors.some(
      color =>
        darkColors.has(color)
    );

  return hasLight && hasDark;
}


function isDarkContrast(
  candidate: Candidate
): boolean {

  const darkCount =
    candidate.colors.filter(
      color =>
        darkColors.has(color)
    ).length;

  const hasDifferentColor =
    new Set(
      candidate.colors
    ).size >= 3;

  return (
    darkCount >= 2 &&
    hasDifferentColor
  );
}


function isColorForward(
  candidate: Candidate
): boolean {

  const accents =
    new Set(
      candidate.colors.filter(
        color =>
          statementColors.has(color)
      )
    );

  return accents.size >= 1;
}


/* =========================================================
   DIVERSITY COMPARISON
   ========================================================= */

function garmentSignature(
  candidate: Candidate
): string {

  return candidate.pieces
    .map(piece => piece.name)
    .sort()
    .join('|');
}


function colorSignature(
  candidate: Candidate
): string {

  return candidate.colors
    .slice()
    .sort()
    .join('|');
}


function topBottomSignature(
  candidate: Candidate
): string {

  const parts: string[] = [];

  candidate.pieces.forEach(
    (piece, index) => {

      if (
        piece.category === 'Top' ||
        piece.category === 'Bottom'
      ) {

        parts.push(
          `${piece.category}:${candidate.colors[index]}`
        );
      }
    }
  );

  return parts
    .sort()
    .join('|');
}


/* =========================================================
   PICK A DIVERSE RESULT
   ========================================================= */

function chooseCandidate(
  candidates: Candidate[],
  used: Candidate[],
  test?: (
    candidate: Candidate
  ) => boolean
): Candidate | undefined {

  const pool =
    test
      ? candidates.filter(test)
      : candidates;


  for (
    const candidate of pool
  ) {

    const garmentKey =
      garmentSignature(candidate);

    const colorKey =
      colorSignature(candidate);

    const topBottomKey =
      topBottomSignature(candidate);


    const tooSimilar =
      used.some(previous => {

        /*
          Reject the exact same garment set.
        */

        if (
          garmentSignature(previous) ===
          garmentKey
        ) {
          return true;
        }


        /*
          Reject the exact same complete
          color arrangement.
        */

        if (
          colorSignature(previous) ===
          colorKey
        ) {
          return true;
        }


        /*
          Crucially, reject repeated
          top/bottom color formulas.

          Example:

          Navy top + Navy trousers

          can't keep appearing simply with
          different shoes and jackets.
        */

        if (
          topBottomKey &&
          topBottomSignature(previous) ===
          topBottomKey
        ) {
          return true;
        }


        return false;
      });


    if (!tooSimilar) {
      return candidate;
    }
  }


  return undefined;
}


/* =========================================================
   MAIN GENERATOR
   ========================================================= */

export function generateOutfits(
  category: string,
  item: string,
  color: string,
  style: string,
  occasion: string,
  season: string,
  profile?: StyleProfile
): Outfit[] {

  const anchor =
    getGarment(item);


  if (!anchor) {
    return [];
  }


  const selectedStyle =
    style as Style;


  const structures =
    buildStructures(
      category,
      anchor
    );


  const candidates:
    Candidate[] = [];


  /* =======================================================
     GENERATE + SCORE
     ======================================================= */

  for (
    const structure of structures
  ) {

    const colorOptions =
      generateColorCombinations(
        color,
        structure.length - 1
      );


    /*
      Keep a broad set of strong color
      options for every garment structure.

      This is intentionally much wider
      than before so unusual but strong
      palettes survive long enough to be
      selected later.
    */

    const bestColorOptions =
      colorOptions
        .map(colors => ({

          colors,

          harmony:
            colorScore(
              colors,
              structure,
              color
            )

        }))

        .sort(
          (a, b) =>
            b.harmony -
            a.harmony
        )

        .slice(0, 30);


    for (
      const option
      of bestColorOptions
    ) {

      const score =
  calculateScore(
    structure,
    option.colors,
    color,
    selectedStyle,
    occasion,
    season,
    profile
  );


      candidates.push({

        title: '',

        items:
          makeItems(
            structure,
            option.colors
          ),

        score,

        note:
          createNote(
            structure,
            option.colors,
            color,
            selectedStyle,
            occasion,
            season
          ),

        colors:
          option.colors,

        pieces:
          structure

      });
    }
  }


  /* =======================================================
     RANK CANDIDATES
     ======================================================= */

  candidates.sort(
    (a, b) =>
      b.score - a.score
  );


  /* =======================================================
     SIX DIFFERENT STYLING DIRECTIONS
     ======================================================= */

  const selected:
    Candidate[] = [];


  /*
    1 — BEST OVERALL
  */

  const best =
    chooseCandidate(
      candidates,
      selected
    );


  if (best) {
    best.title =
      'Best Overall';

    selected.push(best);
  }


  /*
    2 — TONAL

    Intentionally cohesive.
    Only ONE result is allowed to take
    this monochromatic direction.
  */

  const tonal =
    chooseCandidate(
      candidates,
      selected,
      isTonal
    );


  if (tonal) {
    tonal.title =
      'Tonal Edit';

    selected.push(tonal);
  }


  /*
    3 — NEUTRAL + ACCENT
  */

  const accent =
    chooseCandidate(
      candidates,
      selected,
      isNeutralAccent
    );


  if (accent) {
    accent.title =
      'Neutral + Accent';

    selected.push(accent);
  }


  /*
    4 — LIGHT CONTRAST
  */

  const light =
    chooseCandidate(
      candidates,
      selected,
      isLightContrast
    );


  if (light) {
    light.title =
      'Light Contrast';

    selected.push(light);
  }


  /*
    5 — DARK CONTRAST
  */

  const dark =
    chooseCandidate(
      candidates,
      selected,
      isDarkContrast
    );


  if (dark) {
    dark.title =
      'Dark Contrast';

    selected.push(dark);
  }


  /*
    6 — COLOR FORWARD
  */

  const colorful =
    chooseCandidate(
      candidates,
      selected,
      isColorForward
    );


  if (colorful) {
    colorful.title =
      'Color Forward';

    selected.push(colorful);
  }


  /* =======================================================
     FALLBACK

     In unusual searches one of the
     categories above may have no valid
     candidate.

     Fill remaining positions while
     retaining the diversity rules.
     ======================================================= */

  while (
    selected.length < 6
  ) {

    const fallback =
      chooseCandidate(
        candidates,
        selected
      );


    if (!fallback) {
      break;
    }


    fallback.title =
      'Alternative Edit';


    selected.push(
      fallback
    );
  }


  /* =======================================================
     RETURN PUBLIC OUTFIT TYPE
     ======================================================= */

  return selected.map(
    candidate => ({

      title:
        candidate.title,

      items:
        candidate.items,

      score:
        candidate.score,

      note:
        candidate.note

    })
  );
}
/* =========================================================
   WARDROBE GENERATOR
   ========================================================= */

export type WardrobeGarment = {
  id: string;
  name: string;
  category: Category;
  garment: string;
  color: string;
  createdAt?: number;
};

type WardrobeCandidate = {
  outfit: Outfit;
  ids: string[];
  colors: string[];
  pieces: Garment[];
};


/* =========================================================
   CONVERT WARDROBE ITEM TO ENGINE GARMENT
   ========================================================= */

function wardrobeToGarment(
  wardrobeItem: WardrobeGarment
): Garment | null {

  const garment =
    getGarment(
      wardrobeItem.garment
    );

  return garment || null;
}


/* =========================================================
   BUILD WARDROBE STRUCTURES
   ========================================================= */

function buildWardrobeStructures(
  anchorItem: WardrobeGarment,
  wardrobe: WardrobeGarment[]
): WardrobeGarment[][] {

  /*
    Never allow the anchor item to appear
    twice in the same outfit.
  */

  const available =
    wardrobe.filter(
      item =>
        item.id !== anchorItem.id
    );


  const tops =
    available.filter(
      item =>
        item.category === 'Top'
    );


  const bottoms =
    available.filter(
      item =>
        item.category === 'Bottom'
    );


  const shoes =
    available.filter(
      item =>
        item.category === 'Shoes'
    );


  const outerwear =
    available.filter(
      item =>
        item.category === 'Outerwear'
    );


  const structures:
    WardrobeGarment[][] = [];


  /* -------------------------------------------------------
     TOP ANCHOR
     ------------------------------------------------------- */

  if (
    anchorItem.category === 'Top'
  ) {

    for (
      const bottom of bottoms
    ) {

      for (
        const shoe of shoes
      ) {

        /*
          Basic outfit:
          top + bottom + shoes
        */

        structures.push([
          anchorItem,
          bottom,
          shoe
        ]);


        /*
          Layered outfit:
          top + bottom + shoes + outerwear
        */

        for (
          const outer of outerwear
        ) {

          structures.push([
            anchorItem,
            bottom,
            shoe,
            outer
          ]);
        }
      }
    }
  }


  /* -------------------------------------------------------
     BOTTOM ANCHOR
     ------------------------------------------------------- */

  else if (
    anchorItem.category === 'Bottom'
  ) {

    for (
      const top of tops
    ) {

      for (
        const shoe of shoes
      ) {

        structures.push([
          anchorItem,
          top,
          shoe
        ]);


        for (
          const outer of outerwear
        ) {

          structures.push([
            anchorItem,
            top,
            shoe,
            outer
          ]);
        }
      }
    }
  }


  /* -------------------------------------------------------
     SHOES ANCHOR
     ------------------------------------------------------- */

  else if (
    anchorItem.category === 'Shoes'
  ) {

    for (
      const top of tops
    ) {

      for (
        const bottom of bottoms
      ) {

        structures.push([
          anchorItem,
          top,
          bottom
        ]);


        for (
          const outer of outerwear
        ) {

          structures.push([
            anchorItem,
            top,
            bottom,
            outer
          ]);
        }
      }
    }
  }


  /* -------------------------------------------------------
     OUTERWEAR ANCHOR
     ------------------------------------------------------- */

  else if (
    anchorItem.category === 'Outerwear'
  ) {

    for (
      const top of tops
    ) {

      for (
        const bottom of bottoms
      ) {

        for (
          const shoe of shoes
        ) {

          structures.push([
            anchorItem,
            top,
            bottom,
            shoe
          ]);
        }
      }
    }
  }


  /* -------------------------------------------------------
     DRESS ANCHOR
     ------------------------------------------------------- */

  else if (
    anchorItem.category === 'Dress'
  ) {

    for (
      const shoe of shoes
    ) {

      /*
        Dress + shoes
      */

      structures.push([
        anchorItem,
        shoe
      ]);


      /*
        Dress + shoes + outerwear
      */

      for (
        const outer of outerwear
      ) {

        structures.push([
          anchorItem,
          shoe,
          outer
        ]);
      }
    }
  }


  return structures;
}


/* =========================================================
   WARDROBE SIGNATURES
   ========================================================= */

function wardrobeGarmentSignature(
  candidate: WardrobeCandidate
): string {

  return candidate.ids
    .slice()
    .sort()
    .join('|');
}


function wardrobeColorSignature(
  candidate: WardrobeCandidate
): string {

  return candidate.colors
    .slice()
    .sort()
    .join('|');
}


function wardrobeTopBottomSignature(
  candidate: WardrobeCandidate
): string {

  const parts: string[] = [];


  candidate.pieces.forEach(
    (piece, index) => {

      if (
        piece.category === 'Top' ||
        piece.category === 'Bottom'
      ) {

        parts.push(
          `${piece.category}:${candidate.colors[index]}`
        );
      }
    }
  );


  return parts
    .sort()
    .join('|');
}


/* =========================================================
   WARDROBE DIVERSITY PICKER
   ========================================================= */

function chooseWardrobeCandidate(
  candidates: WardrobeCandidate[],
  used: WardrobeCandidate[],
  test?: (
    candidate: WardrobeCandidate
  ) => boolean
): WardrobeCandidate | undefined {

  const pool =
    test
      ? candidates.filter(test)
      : candidates;


  for (
    const candidate of pool
  ) {

    const garmentKey =
      wardrobeGarmentSignature(
        candidate
      );


    const colorKey =
      wardrobeColorSignature(
        candidate
      );


    const topBottomKey =
      wardrobeTopBottomSignature(
        candidate
      );


    const tooSimilar =
      used.some(previous => {

        /*
          Don't return exactly the same
          physical garments twice.
        */

        if (
          wardrobeGarmentSignature(
            previous
          ) === garmentKey
        ) {
          return true;
        }


        /*
          Avoid identical complete palettes.
        */

        if (
          wardrobeColorSignature(
            previous
          ) === colorKey
        ) {
          return true;
        }


        /*
          Avoid repeating the same
          top/bottom color formula when
          other options are available.
        */

        if (
          topBottomKey &&
          wardrobeTopBottomSignature(
            previous
          ) === topBottomKey
        ) {
          return true;
        }


        return false;
      });


    if (!tooSimilar) {
      return candidate;
    }
  }


  return undefined;
}


/* =========================================================
   WARDROBE GENERATOR
   ========================================================= */

export function generateWardrobeOutfits(
  anchorId: string,
  wardrobe: WardrobeGarment[],
  style: string,
  occasion: string,
  season: string,
  profile?: StyleProfile
): Outfit[] {

  /*
    Find the exact physical item the user
    selected from My Wardrobe.
  */

  const anchorItem =
    wardrobe.find(
      item =>
        item.id === anchorId
    );


  if (!anchorItem) {
    return [];
  }


  const selectedStyle =
    style as Style;


  const structures =
    buildWardrobeStructures(
      anchorItem,
      wardrobe
    );


  const candidates:
    WardrobeCandidate[] = [];


  /* =======================================================
     SCORE REAL WARDROBE COMBINATIONS
     ======================================================= */

  for (
    const structure of structures
  ) {

    /*
      Convert wardrobe entries into the
      garment metadata used by the normal
      MUSE scoring engine.
    */

    const enginePieces =
      structure.map(
        wardrobeItem =>
          wardrobeToGarment(
            wardrobeItem
          )
      );


    /*
      If an old/corrupt wardrobe item no
      longer exists in data.ts, skip it.
    */

    if (
      enginePieces.some(
        piece => !piece
      )
    ) {
      continue;
    }


    const pieces =
      enginePieces as Garment[];


    /*
      IMPORTANT:

      Unlike catalog generation, these
      colors are NEVER generated.

      They are the actual colors stored
      in My Wardrobe.
    */

    const realColors =
      structure.map(
        wardrobeItem =>
          wardrobeItem.color
      );


    const score =
  calculateScore(
    pieces,
    realColors,
    anchorItem.color,
    selectedStyle,
    occasion,
    season,
    profile
  );


    const harmony =
      Math.round(
        colorScore(
          realColors,
          pieces,
          anchorItem.color
        )
      );


    const styleMatch =
      Math.round(
        styleScore(
          pieces,
          selectedStyle
        )
      );


    /*
      Use the user's custom wardrobe name
      where available.

      Example:

      "My vintage blazer"

      instead of merely:

      "Black Blazer"
    */

    const displayItems =
      structure.map(
        wardrobeItem => {

          const defaultName =
            `${wardrobeItem.color} ${wardrobeItem.garment}`;


          if (
            wardrobeItem.name &&
            wardrobeItem.name !== defaultName
          ) {

            return (
              `${wardrobeItem.color} ` +
              `${wardrobeItem.name}`
            );
          }


          return defaultName;
        }
      );


    candidates.push({

      outfit: {

        title: '',

        items:
          displayItems,

        score,

        note:
          `${selectedStyle} styling · ` +
          `${harmony}% color harmony · ` +
          `${styleMatch}% style match · ` +
          `made entirely from your wardrobe.`

      },

      ids:
        structure.map(
          wardrobeItem =>
            wardrobeItem.id
        ),

      colors:
        realColors,

      pieces

    });
  }


  /* =======================================================
     RANK
     ======================================================= */

  candidates.sort(
    (a, b) =>
      b.outfit.score -
      a.outfit.score
  );


  if (
    candidates.length === 0
  ) {
    return [];
  }


  /* =======================================================
     SELECT DIVERSE REAL OUTFITS
     ======================================================= */

  const selected:
    WardrobeCandidate[] = [];


  /*
    BEST OVERALL
  */

  const best =
    chooseWardrobeCandidate(
      candidates,
      selected
    );


  if (best) {

    best.outfit.title =
      'Best From Your Wardrobe';

    selected.push(best);
  }


  /*
    TONAL
  */

  const tonal =
    chooseWardrobeCandidate(
      candidates,
      selected,
      candidate => {

        return (
          new Set(
            candidate.colors
          ).size <= 2
        );
      }
    );


  if (tonal) {

    tonal.outfit.title =
      'Tonal Wardrobe Edit';

    selected.push(tonal);
  }


  /*
    NEUTRAL + ACCENT
  */

  const accent =
    chooseWardrobeCandidate(
      candidates,
      selected,
      candidate => {

        const neutralCount =
          candidate.colors.filter(
            color =>
              neutrals.has(color)
          ).length;


        const accentCount =
          candidate.colors.filter(
            color =>
              statementColors.has(color)
          ).length;


        return (
          neutralCount >= 2 &&
          accentCount >= 1
        );
      }
    );


  if (accent) {

    accent.outfit.title =
      'Neutral + Accent';

    selected.push(accent);
  }


  /*
    LIGHT / DARK CONTRAST
  */

  const contrast =
    chooseWardrobeCandidate(
      candidates,
      selected,
      candidate => {

        const hasLight =
          candidate.colors.some(
            color =>
              lightColors.has(color)
          );


        const hasDark =
          candidate.colors.some(
            color =>
              darkColors.has(color)
          );


        return (
          hasLight &&
          hasDark
        );
      }
    );


  if (contrast) {

    contrast.outfit.title =
      'Wardrobe Contrast';

    selected.push(contrast);
  }


  /*
    COLOR FORWARD
  */

  const colorful =
    chooseWardrobeCandidate(
      candidates,
      selected,
      candidate => {

        return candidate.colors.some(
          color =>
            statementColors.has(color)
        );
      }
    );


  if (colorful) {

    colorful.outfit.title =
      'Color Forward';

    selected.push(colorful);
  }


  /*
    Fill any remaining slots with the
    strongest sufficiently different
    wardrobe combinations.
  */

  while (
    selected.length < 6
  ) {

    const next =
      chooseWardrobeCandidate(
        candidates,
        selected
      );


    if (!next) {
      break;
    }


    next.outfit.title =
      'Wardrobe Alternative';


    selected.push(next);
  }


  /*
    A small wardrobe may legitimately
    produce only 1, 2 or 3 outfits.

    We intentionally DON'T invent
    clothing just to reach six.
  */

  return selected.map(
    candidate =>
      candidate.outfit
  );
}
