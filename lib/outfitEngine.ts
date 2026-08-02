import {
  garments,
  getGarment,
  Garment,
  Category,
  Style
} from './data';


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

  // Monochromatic outfits
  if (colorA === colorB) {
    return 92;
  }

  const paletteA =
    palettes[colorA] || [];

  const paletteB =
    palettes[colorB] || [];

  const indexA =
    paletteA.indexOf(colorB);

  const indexB =
    paletteB.indexOf(colorA);

  /*
    Check compatibility in BOTH directions.
    This avoids the palette system being
    accidentally one-sided.
  */

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

  /*
    Neutral + neutral is usually safe.
  */

  if (
    neutrals.has(colorA) &&
    neutrals.has(colorB)
  ) {
    return 82;
  }

  /*
    Neutral + statement color is
    generally still wearable.
  */

  if (
    neutrals.has(colorA) ||
    neutrals.has(colorB)
  ) {
    return 74;
  }

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

  /*
    Compare EVERY color against every
    other color.

    Example:

    Grey coat
       ↕
    Cream sweater
       ↕
    Black trousers
       ↕
    Burgundy loafers

    This is much better than only
    comparing everything to the coat.
  */

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


  /*
    COLOR BALANCE

    Too many unrelated statement colors
    can make an outfit visually noisy.
  */

  const statementColors =
    colors.filter(
      color =>
        !neutrals.has(color)
    );

  const uniqueStatementColors =
    new Set(statementColors);


  if (
    uniqueStatementColors.size >= 3
  ) {
    score -= 8;
  }


  /*
    Reward outfits that use at least
    one neutral as an anchor.
  */

  if (
    colors.some(
      color =>
        neutrals.has(color)
    )
  ) {
    score += 3;
  }


  /*
    Reward intentional tonal dressing.
  */

  const uniqueColors =
    new Set(colors);

  if (
    uniqueColors.size <= 2 &&
    colors.length >= 3
  ) {
    score += 4;
  }


  return Math.max(
    45,
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


  /*
    Wide + slim often produces
    intentional visual balance.
  */

  if (
    wide >= 1 &&
    slim >= 1
  ) {
    score += 10;
  }


  /*
    Too much volume can overwhelm
    the silhouette.
  */

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
    RECOMMENDATION WEIGHTS

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

  /*
    Limit the search to strong colors.

    Searching all 14 colors for every
    garment would create an unnecessarily
    huge search space.

    Anchor + best palette options gives us
    plenty of variation.
  */

  return Array.from(
    new Set([
      anchorColor,
      ...palette.slice(0, 6)
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

  const colorScore =
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
    `${colorScore}% color harmony · ` +
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


  /*
    First generate garment structures.
  */

  const structures:
    Garment[][] = [];


  if (category === 'Top') {

    for (
      const bottom of bottoms
    ) {

      for (
        const shoe of shoes
      ) {

        structures.push([
          anchor,
          bottom,
          shoe
        ]);


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


  else if (
    category === 'Outerwear'
  ) {

    /*
      Selected item is already outerwear.
      No second jacket can be generated.
    */

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


  else if (
    category === 'Dress'
  ) {

    for (
      const shoe of shoes
    ) {

      structures.push([
        anchor,
        shoe
      ]);


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
      Instead of keeping every possible
      color combination, score them and
      keep the best few for this garment
      structure.
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

        .slice(0, 4);


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
          (piece, pieceIndex) =>
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
     REMOVE DUPLICATES
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
     PREVENT SIX NEAR-IDENTICAL RESULTS
     ======================================================= */

  const ranked =
    unique.sort(
      (a, b) =>
        b.score - a.score
    );


  const final:
    Outfit[] = [];

  const usedGarmentSets =
    new Set<string>();


  for (
    const outfit
    of ranked
  ) {

    /*
      Ignore colors here so the top six
      don't become the exact same garments
      in six slightly different colors.
    */

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


    usedGarmentSets.add(
      garmentKey
    );

    final.push(outfit);


    if (
      final.length === 6
    ) {
      break;
    }
  }


  return final;
}
