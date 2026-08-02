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


/* =========================================================
   COLOR SYSTEM
   ========================================================= */

const palettes: Record<string, string[]> = {
  Black: [
    'White', 'Cream', 'Grey', 'Burgundy',
    'Pink', 'Olive', 'Blue', 'Beige'
  ],

  White: [
    'Black', 'Navy', 'Beige', 'Brown',
    'Blue', 'Olive', 'Pink', 'Denim'
  ],

  Cream: [
    'Black', 'Brown', 'Navy', 'Burgundy',
    'Olive', 'Beige', 'Denim', 'White'
  ],

  Grey: [
    'Black', 'White', 'Burgundy', 'Navy',
    'Pink', 'Blue', 'Cream', 'Beige'
  ],

  Navy: [
    'White', 'Cream', 'Beige', 'Grey',
    'Burgundy', 'Pink', 'Brown'
  ],

  Beige: [
    'White', 'Brown', 'Black', 'Navy',
    'Olive', 'Burgundy', 'Cream'
  ],

  Brown: [
    'Cream', 'White', 'Beige', 'Blue',
    'Olive', 'Pink', 'Denim'
  ],

  Burgundy: [
    'Cream', 'Black', 'Grey', 'Navy',
    'Pink', 'Beige', 'White'
  ],

  Red: [
    'Black', 'White', 'Cream',
    'Navy', 'Denim', 'Grey'
  ],

  Pink: [
    'White', 'Cream', 'Grey', 'Brown',
    'Burgundy', 'Navy'
  ],

  Olive: [
    'Cream', 'White', 'Black', 'Beige',
    'Brown', 'Navy'
  ],

  Green: [
    'White', 'Cream', 'Black',
    'Navy', 'Brown', 'Beige'
  ],

  Blue: [
    'White', 'Cream', 'Brown',
    'Grey', 'Black', 'Beige'
  ],

  Denim: [
    'White', 'Cream', 'Black',
    'Grey', 'Burgundy', 'Brown'
  ]
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


/* =========================================================
   OCCASION + SEASON TARGETS
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
   GARMENT HELPERS
   ========================================================= */

function byCategory(
  category: Category
): Garment[] {

  return garments.filter(
    garment =>
      garment.category === category
  );
}


/* =========================================================
   COLOR PAIR SCORING
   ========================================================= */

function colorPairScore(
  colorA: string,
  colorB: string
): number {

  // Monochromatic combinations are valid,
  // but no longer automatically dominate.
  if (colorA === colorB) {
    return 90;
  }

  const paletteA =
    palettes[colorA] || [];

  const paletteB =
    palettes[colorB] || [];

  const indexA =
    paletteA.indexOf(colorB);

  const indexB =
    paletteB.indexOf(colorA);


  // Check compatibility in both directions.
  if (
    indexA !== -1 ||
    indexB !== -1
  ) {

    const bestIndex =
      Math.min(
        indexA === -1
          ? 99
          : indexA,

        indexB === -1
          ? 99
          : indexB
      );

    return Math.max(
      78,
      100 - bestIndex * 3
    );
  }


  // Neutral + neutral
  if (
    neutrals.has(colorA) &&
    neutrals.has(colorB)
  ) {
    return 82;
  }


  // Neutral + statement color
  if (
    neutrals.has(colorA) ||
    neutrals.has(colorB)
  ) {
    return 74;
  }


  // Two unsupported statement colors
  return 58;
}


/* =========================================================
   WHOLE OUTFIT COLOR SCORE
   ========================================================= */

function outfitColorScore(
  colors: string[]
): number {

  if (colors.length <= 1) {
    return 100;
  }

  let total = 0;
  let comparisons = 0;


  // Compare every color with every other color.
  for (
    let i = 0;
    i < colors.length;
    i++
  ) {

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
    total / comparisons;


  const uniqueColors =
    new Set(colors);

  const uniqueCount =
    uniqueColors.size;


  const counts:
    Record<string, number> = {};


  colors.forEach(color => {

    counts[color] =
      (counts[color] || 0) + 1;

  });


  const highestRepeat =
    Math.max(
      ...Object.values(counts)
    );


  /* -------------------------------------------------------
     REPETITION PENALTIES
     ------------------------------------------------------- */

  // A four-piece outfit entirely in one
  // color is possible, but shouldn't
  // automatically win every search.
  if (
    colors.length >= 4 &&
    uniqueCount === 1
  ) {
    score -= 18;
  }


  // Three or more garments in exactly
  // the same color becomes repetitive.
  if (highestRepeat >= 3) {
    score -= 10;
  }


  /* -------------------------------------------------------
     DIVERSITY REWARDS
     ------------------------------------------------------- */

  // Two colors = clean and cohesive.
  if (
    uniqueCount === 2 &&
    colors.length >= 3
  ) {
    score += 2;
  }


  // Three colors is generally the
  // strongest balance between harmony
  // and visual interest.
  if (uniqueCount === 3) {
    score += 7;
  }


  // Four colors can work when all of
  // them are compatible.
  if (uniqueCount === 4) {
    score += 3;
  }


  /* -------------------------------------------------------
     STATEMENT COLOR CONTROL
     ------------------------------------------------------- */

  const statementColors =
    colors.filter(
      color =>
        !neutrals.has(color)
    );


  const uniqueStatements =
    new Set(statementColors);


  // Too many statement colors can make
  // the outfit visually noisy.
  if (
    uniqueStatements.size >= 3
  ) {
    score -= 10;
  }


  /* -------------------------------------------------------
     NEUTRAL FOUNDATION
     ------------------------------------------------------- */

  const neutralCount =
    colors.filter(
      color =>
        neutrals.has(color)
    ).length;


  if (neutralCount >= 1) {
    score += 2;
  }


  // Several neutrals + one accent color
  // is a reliable styling formula.
  if (
    neutralCount >= 2 &&
    uniqueStatements.size === 1
  ) {
    score += 5;
  }


  return Math.max(
    40,
    Math.min(100, score)
  );
}


/* =========================================================
   STYLE SCORE
   ========================================================= */

function styleScore(
  outfit: Garment[],
  style: Style
): number {

  const scores =
    outfit.map(
      garment =>
        garment.styles[style] || 3
    );


  const average =
    scores.reduce(
      (a, b) => a + b,
      0
    ) / scores.length;


  return average * 20;
}


/* =========================================================
   FORMALITY SCORE
   ========================================================= */

function formalityScore(
  outfit: Garment[],
  occasion: string
): number {

  const target =
    occasionFormality[
      occasion
    ] ?? 3;


  const average =
    outfit.reduce(
      (sum, garment) =>
        sum +
        garment.formality,
      0
    ) / outfit.length;


  const difference =
    Math.abs(
      target - average
    );


  return Math.max(
    40,
    100 - difference * 18
  );
}


/* =========================================================
   SEASON SCORE
   ========================================================= */

function seasonScore(
  outfit: Garment[],
  season: string
): number {

  if (
    season === 'All season'
  ) {
    return 88;
  }


  const target =
    seasonWarmth[
      season
    ] ?? 3;


  const average =
    outfit.reduce(
      (sum, garment) =>
        sum + garment.warmth,
      0
    ) / outfit.length;


  const difference =
    Math.abs(
      target - average
    );


  return Math.max(
    35,
    100 - difference * 20
  );
}


/* =========================================================
   SILHOUETTE SCORE
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


  // Wide + slim creates intentional
  // silhouette contrast.
  if (
    wide >= 1 &&
    slim >= 1
  ) {
    score += 10;
  }


  // Too much volume.
  if (wide >= 3) {
    score -= 15;
  }


  if (oversized >= 2) {
    score -= 12;
  }


  return Math.max(
    50,
    Math.min(100, score)
  );
}


/* =========================================================
   COMPLETE OUTFIT SCORE
   ========================================================= */

function calculateScore(
  outfit: Garment[],
  outfitColors: string[],
  style: Style,
  occasion: string,
  season: string
): number {

  const color =
    outfitColorScore(
      outfitColors
    );


  const styling =
    styleScore(
      outfit,
      style
    );


  const formality =
    formalityScore(
      outfit,
      occasion
    );


  const seasonal =
    seasonScore(
      outfit,
      season
    );


  const silhouette =
    silhouetteScore(
      outfit
    );


  /*
    FINAL WEIGHTS

    Color        30%
    Style        25%
    Formality    20%
    Season       15%
    Silhouette   10%
  */

  const total =
    color * 0.30 +
    styling * 0.25 +
    formality * 0.20 +
    seasonal * 0.15 +
    silhouette * 0.10;


  return Math.round(
    Math.max(
      0,
      Math.min(100, total)
    )
  );
}


/* =========================================================
   COLOR CANDIDATES
   ========================================================= */

function getCandidateColors(
  anchorColor: string
): string[] {

  const palette =
    palettes[anchorColor] || [];


  return Array.from(
    new Set([
      anchorColor,
      ...palette.slice(0, 7)
    ])
  );
}


/* =========================================================
   GENERATE COLOR COMBINATIONS
   ========================================================= */

function generateColorCombinations(
  anchorColor: string,
  otherPieceCount: number
): string[][] {

  const candidates =
    getCandidateColors(
      anchorColor
    );


  const results:
    string[][] = [];


  function build(
    current: string[],
    depth: number
  ) {

    if (
      depth ===
      otherPieceCount
    ) {

      results.push([
        anchorColor,
        ...current
      ]);

      return;
    }


    for (
      const color of candidates
    ) {

      build(
        [...current, color],
        depth + 1
      );

    }
  }


  build([], 0);


  return results;
}


/* =========================================================
   TITLES
   ========================================================= */

function createTitle(
  style: Style,
  score: number,
  index: number
): string {

  if (score >= 92) {

    const names = [
      `${style} Essential`,
      'Best Match',
      'Styled Harmony',
      'Editor Pick'
    ];


    return names[
      index % names.length
    ];
  }


  const names = [
    'Polished Contrast',
    'Tonal Balance',
    'Easy Layers',
    'Modern Mix',
    'Clean Silhouette',
    'Effortless Edit'
  ];


  return names[
    index % names.length
  ];
}


/* =========================================================
   EXPLANATION
   ========================================================= */

function createNote(
  pieces: Garment[],
  colors: string[],
  style: Style,
  occasion: string,
  season: string
): string {

  const colorHarmony =
    Math.round(
      outfitColorScore(
        colors
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
    `${colorHarmony}% color harmony · ` +
    `${styleMatch}% style match · ` +
    `balanced for ${occasion.toLowerCase()} ` +
    `and ${season.toLowerCase()}.`
  );
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
  season: string
): Outfit[] {

  const anchor =
    getGarment(item);


  if (!anchor) {
    return [];
  }


  const selectedStyle =
    style as Style;


  const tops =
    byCategory('Top');


  const bottoms =
    byCategory('Bottom');


  const outerwear =
    byCategory('Outerwear');


  const shoes =
    byCategory('Shoes');


  const structures:
    Garment[][] = [];


  /* -------------------------------------------------------
     TOP SELECTED
     ------------------------------------------------------- */

  if (category === 'Top') {

    for (
      const bottom of bottoms
    ) {

      for (
        const shoe of shoes
      ) {

        // Outfit without outerwear
        structures.push([
          anchor,
          bottom,
          shoe
        ]);


        // Outfit with outerwear
        for (
          const jacket
          of outerwear
        ) {

          structures.push([
            anchor,
            bottom,
            shoe,
            jacket
          ]);
        }
      }
    }
  }


  /* -------------------------------------------------------
     BOTTOM SELECTED
     ------------------------------------------------------- */

  else if (
    category === 'Bottom'
  ) {

    for (
      const top of tops
    ) {

      for (
        const shoe of shoes
      ) {

        structures.push([
          anchor,
          top,
          shoe
        ]);


        for (
          const jacket
          of outerwear
        ) {

          structures.push([
            anchor,
            top,
            shoe,
            jacket
          ]);
        }
      }
    }
  }


  /* -------------------------------------------------------
     SHOES SELECTED
     ------------------------------------------------------- */

  else if (
    category === 'Shoes'
  ) {

    for (
      const top of tops
    ) {

      for (
        const bottom
        of bottoms
      ) {

        structures.push([
          anchor,
          top,
          bottom
        ]);


        for (
          const jacket
          of outerwear
        ) {

          structures.push([
            anchor,
            top,
            bottom,
            jacket
          ]);
        }
      }
    }
  }


  /* -------------------------------------------------------
     OUTERWEAR SELECTED
     ------------------------------------------------------- */

  else if (
    category === 'Outerwear'
  ) {

    // The anchor is already outerwear,
    // so another jacket is never added.

    for (
      const top of tops
    ) {

      for (
        const bottom
        of bottoms
      ) {

        for (
          const shoe of shoes
        ) {

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


  /* -------------------------------------------------------
     DRESS SELECTED
     ------------------------------------------------------- */

  else if (
    category === 'Dress'
  ) {

    for (
      const shoe of shoes
    ) {

      // Dress + shoes
      structures.push([
        anchor,
        shoe
      ]);


      // Dress + shoes + outerwear
      for (
        const jacket
        of outerwear
      ) {

        structures.push([
          anchor,
          shoe,
          jacket
        ]);
      }
    }
  }


  /* =======================================================
     SEARCH GARMENTS + COLORS
     ======================================================= */

  const candidates:
    Outfit[] = [];


  let index = 0;


  for (
    const structure
    of structures
  ) {

    const colorCombinations =
      generateColorCombinations(
        color,
        structure.length - 1
      );


    /*
      Find the strongest color options
      for this particular garment set.
    */

    const scoredColors =
      colorCombinations
        .map(colors => ({

          colors,

          score:
            outfitColorScore(
              colors
            )

        }))

        .sort(
          (a, b) =>
            b.score - a.score
        )

        // Keep several palette options
        // so variation remains possible.
        .slice(0, 8);


    for (
      const colorOption
      of scoredColors
    ) {

      const score =
        calculateScore(
          structure,
          colorOption.colors,
          selectedStyle,
          occasion,
          season
        );


      const items =
        structure.map(
          (
            piece,
            pieceIndex
          ) =>

            `${
              colorOption
                .colors[
                  pieceIndex
                ]
            } ${piece.name}`

        );


      candidates.push({

        title:
          createTitle(
            selectedStyle,
            score,
            index
          ),

        items,

        score,

        note:
          createNote(
            structure,
            colorOption.colors,
            selectedStyle,
            occasion,
            season
          )

      });


      index++;
    }
  }


  /* =======================================================
     REMOVE EXACT DUPLICATES
     ======================================================= */

  const seen =
    new Set<string>();


  const unique =
    candidates.filter(
      outfit => {

        const key =
          outfit.items
            .slice()
            .sort()
            .join('|');


        if (
          seen.has(key)
        ) {
          return false;
        }


        seen.add(key);

        return true;
      }
    );


  /* =======================================================
     RANK EVERYTHING
     ======================================================= */

  const ranked =
    unique.sort(
      (a, b) =>
        b.score - a.score
    );


  /* =======================================================
     RESULT DIVERSITY
     ======================================================= */

  const final:
    Outfit[] = [];


  const usedGarmentSets =
    new Set<string>();


  const usedColorPalettes =
    new Set<string>();


  for (
    const outfit
    of ranked
  ) {

    /* -----------------------------------------------------
       GARMENT DIVERSITY

       Prevent the six results from being
       the same garments recolored.
       ----------------------------------------------------- */

    const garmentKey =
      outfit.items
        .map(item =>
          item.replace(
            /^(Black|White|Cream|Grey|Navy|Beige|Brown|Burgundy|Red|Pink|Olive|Green|Blue|Denim)\s/,
            ''
          )
        )
        .sort()
        .join('|');


    if (
      usedGarmentSets.has(
        garmentKey
      )
    ) {
      continue;
    }


    /* -----------------------------------------------------
       COLOR DIVERSITY

       Navy + White + Cream is considered
       the same basic palette regardless
       of which garment uses each color.
       ----------------------------------------------------- */

    const outfitColors =
      outfit.items.map(
        item =>
          item.split(' ')[0]
      );


    const paletteKey =
      Array.from(
        new Set(outfitColors)
      )
        .sort()
        .join('|');


    if (
      usedColorPalettes.has(
        paletteKey
      )
    ) {
      continue;
    }


    usedGarmentSets.add(
      garmentKey
    );


    usedColorPalettes.add(
      paletteKey
    );


    final.push(outfit);


    if (
      final.length === 6
    ) {
      break;
    }
  }


  /* =======================================================
     FALLBACK

     If strict diversity somehow leaves
     fewer than six results, fill remaining
     positions with the best unused outfits.
     ======================================================= */

  if (
    final.length < 6
  ) {

    const alreadyUsed =
      new Set(
        final.map(
          outfit =>
            outfit.items
              .slice()
              .sort()
              .join('|')
        )
      );


    for (
      const outfit
      of ranked
    ) {

      const key =
        outfit.items
          .slice()
          .sort()
          .join('|');


      if (
        alreadyUsed.has(key)
      ) {
        continue;
      }


      final.push(outfit);

      alreadyUsed.add(key);


      if (
        final.length === 6
      ) {
        break;
      }
    }
  }


  return final;
}
