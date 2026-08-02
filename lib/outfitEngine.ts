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
    'Olive', 'Beige', 'Denim'
  ],

  Grey: [
    'Black', 'White', 'Burgundy',
    'Navy', 'Pink', 'Blue'
  ],

  Navy: [
    'White', 'Cream', 'Beige',
    'Grey', 'Burgundy', 'Pink'
  ],

  Beige: [
    'White', 'Brown', 'Black',
    'Navy', 'Olive', 'Burgundy'
  ],

  Brown: [
    'Cream', 'White', 'Beige',
    'Blue', 'Olive', 'Pink'
  ],

  Burgundy: [
    'Cream', 'Black', 'Grey',
    'Navy', 'Pink', 'Beige'
  ],

  Red: [
    'Black', 'White', 'Cream',
    'Navy', 'Denim'
  ],

  Pink: [
    'White', 'Cream', 'Grey',
    'Brown', 'Burgundy'
  ],

  Olive: [
    'Cream', 'White', 'Black',
    'Beige', 'Brown'
  ],

  Green: [
    'White', 'Cream', 'Black',
    'Navy', 'Brown'
  ],

  Blue: [
    'White', 'Cream', 'Brown',
    'Grey', 'Black'
  ],

  Denim: [
    'White', 'Cream', 'Black',
    'Grey', 'Burgundy'
  ]
};


/* =========================================================
   OCCASION TARGET FORMALITY
   ========================================================= */

const occasionFormality: Record<string, number> = {
  Everyday: 2,
  Weekend: 2,
  Work: 4,
  'Date night': 4,
  Party: 4,
  Formal: 5
};


/* =========================================================
   SEASON TARGET WARMTH
   ========================================================= */

const seasonWarmth: Record<string, number> = {
  'All season': 3,
  Spring: 2.5,
  Summer: 1,
  Autumn: 3.5,
  Winter: 5
};


/* =========================================================
   COLOR SCORING
   ========================================================= */

function colorPairScore(
  anchorColor: string,
  otherColor: string
): number {

  if (anchorColor === otherColor) {
    return 94;
  }

  const palette = palettes[anchorColor] || [];

  const index = palette.indexOf(otherColor);

  if (index === -1) {
    return 62;
  }

  return Math.max(
    76,
    100 - index * 3
  );
}


function outfitColorScore(
  anchorColor: string,
  colors: string[]
): number {

  if (!colors.length) {
    return 75;
  }

  const scores = colors.map(color =>
    colorPairScore(anchorColor, color)
  );

  return (
    scores.reduce((a, b) => a + b, 0) /
    scores.length
  );
}


/* =========================================================
   STYLE SCORING
   ========================================================= */

function styleScore(
  outfit: Garment[],
  style: Style
): number {

  if (!outfit.length) {
    return 50;
  }

  const scores = outfit.map(
    garment => garment.styles[style] || 3
  );

  const average =
    scores.reduce((a, b) => a + b, 0) /
    scores.length;

  return average * 20;
}


/* =========================================================
   FORMALITY SCORING
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

  const difference =
    Math.abs(target - average);

  return Math.max(
    45,
    100 - difference * 18
  );
}


/* =========================================================
   SEASON SCORING
   ========================================================= */

function warmthScore(
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

  const difference =
    Math.abs(target - average);

  return Math.max(
    40,
    100 - difference * 20
  );
}


/* =========================================================
   SILHOUETTE SCORING
   ========================================================= */

function silhouetteScore(
  outfit: Garment[]
): number {

  let score = 88;

  const widePieces =
    outfit.filter(
      garment =>
        garment.volume === 'Wide'
    ).length;

  const slimPieces =
    outfit.filter(
      garment =>
        garment.volume === 'Slim'
    ).length;

  const oversizedPieces =
    outfit.filter(
      garment =>
        garment.fit === 'Oversized'
    ).length;

  /*
    Too many wide / oversized pieces can
    make the outfit visually heavy.
  */

  if (widePieces >= 3) {
    score -= 18;
  }

  if (oversizedPieces >= 2) {
    score -= 12;
  }

  /*
    Wide + slim creates intentional
    silhouette contrast.
  */

  if (
    widePieces >= 1 &&
    slimPieces >= 1
  ) {
    score += 10;
  }

  return Math.max(
    50,
    Math.min(100, score)
  );
}


/* =========================================================
   TOTAL SCORE
   ========================================================= */

function calculateScore(
  outfit: Garment[],
  anchorColor: string,
  colors: string[],
  style: Style,
  occasion: string,
  season: string
): number {

  const color =
    outfitColorScore(
      anchorColor,
      colors
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
    warmthScore(
      outfit,
      season
    );

  const silhouette =
    silhouetteScore(outfit);

  /*
    Weighting system:

    Color       30%
    Style       25%
    Formality   20%
    Season      15%
    Silhouette  10%
  */

  const score =
    color * 0.30 +
    styling * 0.25 +
    formality * 0.20 +
    seasonal * 0.15 +
    silhouette * 0.10;

  return Math.round(
    Math.max(
      0,
      Math.min(100, score)
    )
  );
}


/* =========================================================
   HELPERS
   ========================================================= */

function byCategory(
  category: Category
): Garment[] {

  return garments.filter(
    garment =>
      garment.category === category
  );
}


function chooseColor(
  palette: string[],
  index: number
): string {

  return palette[
    index % palette.length
  ];
}


/* =========================================================
   GENERATOR
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

  const palette =
    palettes[color] ||
    ['White', 'Black', 'Cream'];

  const tops =
    byCategory('Top');

  const bottoms =
    byCategory('Bottom');

  const dresses =
    byCategory('Dress');

  const outerwear =
    byCategory('Outerwear');

  const shoes =
    byCategory('Shoes');

  const candidates: Outfit[] = [];

  let candidateIndex = 0;


  /* =======================================================
     NORMAL OUTFIT BUILDER
     ======================================================= */

  function addCandidate(
    pieces: Garment[]
  ) {

    /*
      Never allow two pieces from
      the same structural category,
      except where intentionally supplied.
    */

    const generatedColors =
      pieces
        .slice(1)
        .map((_, index) =>
          chooseColor(
            palette,
            candidateIndex + index
          )
        );

    const displayItems =
      pieces.map(
        (piece, index) => {

          if (index === 0) {
            return `${color} ${piece.name}`;
          }

          return `${
            generatedColors[index - 1]
          } ${piece.name}`;
        }
      );

    const score =
      calculateScore(
        pieces,
        color,
        generatedColors,
        selectedStyle,
        occasion,
        season
      );

    candidates.push({
      title: createTitle(
        selectedStyle,
        score,
        candidateIndex
      ),

      items: displayItems,

      score,

      note: createNote(
        pieces,
        selectedStyle,
        occasion,
        season
      )
    });

    candidateIndex++;
  }


  /* =======================================================
     BUILD COMBINATIONS
     ======================================================= */

  if (category === 'Top') {

    for (const bottom of bottoms) {
      for (const shoe of shoes) {

        /*
          Some outfits intentionally have
          no outerwear.
        */

        addCandidate([
          anchor,
          bottom,
          shoe
        ]);

        for (
          const jacket of outerwear
        ) {

          addCandidate([
            anchor,
            bottom,
            shoe,
            jacket
          ]);
        }
      }
    }
  }


  else if (category === 'Bottom') {

    for (const top of tops) {
      for (const shoe of shoes) {

        addCandidate([
          anchor,
          top,
          shoe
        ]);

        for (
          const jacket of outerwear
        ) {

          addCandidate([
            anchor,
            top,
            shoe,
            jacket
          ]);
        }
      }
    }
  }


  else if (category === 'Shoes') {

    for (const top of tops) {
      for (
        const bottom of bottoms
      ) {

        addCandidate([
          anchor,
          top,
          bottom
        ]);

        for (
          const jacket of outerwear
        ) {

          addCandidate([
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
      Important:
      because the anchor is already
      outerwear, NEVER add another
      outerwear piece.
    */

    for (const top of tops) {
      for (
        const bottom of bottoms
      ) {
        for (
          const shoe of shoes
        ) {

          addCandidate([
            anchor,
            top,
            bottom,
            shoe
          ]);
        }
      }
    }
  }


  else if (category === 'Dress') {

    /*
      A dress replaces the normal
      top + bottom structure.
    */

    for (const shoe of shoes) {

      addCandidate([
        anchor,
        shoe
      ]);

      for (
        const jacket of outerwear
      ) {

        addCandidate([
          anchor,
          shoe,
          jacket
        ]);
      }
    }
  }


  /* =======================================================
     REMOVE DUPLICATES
     ======================================================= */

  const unique =
    candidates.filter(
      (outfit, index, array) => {

        const key =
          outfit.items
            .slice()
            .sort()
            .join('|');

        return (
          array.findIndex(other =>
            other.items
              .slice()
              .sort()
              .join('|') === key
          ) === index
        );
      }
    );


  /* =======================================================
     RANK OUTFITS
     ======================================================= */

  return unique
    .sort(
      (a, b) =>
        b.score - a.score
    )
    .slice(0, 6);
}


/* =========================================================
   TITLES
   ========================================================= */

function createTitle(
  style: Style,
  score: number,
  index: number
): string {

  const strong = [
    `${style} Essential`,
    'Best Match',
    'Refined Balance',
    'Styled Harmony'
  ];

  const normal = [
    'Polished Contrast',
    'Easy Layers',
    'Modern Mix',
    'Clean Silhouette',
    'Elevated Essential',
    'Effortless Edit'
  ];

  const options =
    score >= 90
      ? strong
      : normal;

  return options[
    index % options.length
  ];
}


/* =========================================================
   EXPLANATIONS
   ========================================================= */

function createNote(
  pieces: Garment[],
  style: Style,
  occasion: string,
  season: string
): string {

  const averageFormality =
    pieces.reduce(
      (sum, piece) =>
        sum + piece.formality,
      0
    ) / pieces.length;

  let formalityText =
    'balanced';

  if (averageFormality >= 4) {
    formalityText =
      'polished';
  }

  else if (
    averageFormality <= 2
  ) {
    formalityText =
      'relaxed';
  }

  return (
    `${formalityText} ${style.toLowerCase()} styling ` +
    `for ${occasion.toLowerCase()}, ` +
    `with silhouette and warmth balanced ` +
    `for ${season.toLowerCase()}.`
  );
}
