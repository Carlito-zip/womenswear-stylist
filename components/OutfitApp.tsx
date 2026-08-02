'use client';

import {
  useEffect,
  useState
} from 'react';

import {
  categories,
  colors,
  styles,
  occasions,
  seasons
} from '../lib/data';

import {
  generateOutfits,
  generateWardrobeOutfits,
  Outfit,
  WardrobeGarment
} from '../lib/outfitEngine';


type Cat =
  keyof typeof categories;

type GeneratorMode =
  'catalog' |
  'wardrobe';

type StyleProfile = {
  favoriteStyles: string[];
  lovedColors: string[];
  avoidedColors: string[];
  lovedGarments: string[];
  avoidedGarments: string[];
};


export default function OutfitApp() {

  const [category, setCategory] =
    useState<Cat>('Bottom');

  const [item, setItem] =
    useState('Wide-leg trousers');

  const [color, setColor] =
    useState('Black');

  const [style, setStyle] =
    useState('Scandinavian');

  const [occasion, setOccasion] =
    useState('Everyday');

  const [season, setSeason] =
    useState('All season');

  const [outfits, setOutfits] =
    useState<Outfit[]>([]);

  const [generatorMode, setGeneratorMode] =
    useState<GeneratorMode>('catalog');

  const [selectedWardrobeId, setSelectedWardrobeId] =
    useState('');

  const [generatorMessage, setGeneratorMessage] =
    useState('');

  const [saved, setSaved] =
    useState<number[]>([]);

  const [wardrobe, setWardrobe] =
    useState<WardrobeGarment[]>([]);

  const [wardrobeOpen, setWardrobeOpen] =
    useState(false);

  const [addingItem, setAddingItem] =
    useState(false);

  const [wardrobeFilter, setWardrobeFilter] =
    useState<'All' | Cat>('All');

  const [newCategory, setNewCategory] =
    useState<Cat>('Top');

  const [newGarment, setNewGarment] =
    useState<string>(
      categories.Top[0]
    );

  const [newColor, setNewColor] =
    useState('Black');

  const [newName, setNewName] =
    useState('');

  const [styleProfileOpen, setStyleProfileOpen] =
    useState(false);

  const [styleProfile, setStyleProfile] =
    useState<StyleProfile>({
      favoriteStyles: [],
      lovedColors: [],
      avoidedColors: [],
      lovedGarments: [],
      avoidedGarments: []
    });


  useEffect(() => {

    const savedData =
      localStorage.getItem(
        'muse-saved'
      );

    if (savedData) {
      try {
        setSaved(
          JSON.parse(savedData)
        );
      } catch {}
    }


    const profileData =
      localStorage.getItem(
        'muse-style-profile'
      );

    if (profileData) {
      try {

        const parsed =
          JSON.parse(profileData);

        setStyleProfile({
          favoriteStyles:
            parsed.favoriteStyles || [],
          lovedColors:
            parsed.lovedColors || [],
          avoidedColors:
            parsed.avoidedColors || [],
          lovedGarments:
            parsed.lovedGarments || [],
          avoidedGarments:
            parsed.avoidedGarments || []
        });

      } catch {}
    }


    const wardrobeData =
      localStorage.getItem(
        'muse-wardrobe'
      );

    if (wardrobeData) {
      try {

        const parsed =
          JSON.parse(
            wardrobeData
          ) as WardrobeGarment[];

        setWardrobe(parsed);

        if (parsed.length > 0) {
          setSelectedWardrobeId(
            parsed[0].id
          );
        }

      } catch {}
    }

  }, []);


  function saveStyleProfile(
    next: StyleProfile
  ) {

    setStyleProfile(next);

    localStorage.setItem(
      'muse-style-profile',
      JSON.stringify(next)
    );
  }


  function toggleProfileValue(
    field: keyof StyleProfile,
    value: string
  ) {

    const current =
      styleProfile[field];

    const nextValues =
      current.includes(value)
        ? current.filter(
            x => x !== value
          )
        : [
            ...current,
            value
          ];


    const nextProfile:
      StyleProfile = {
        ...styleProfile,
        [field]: nextValues
      };


    if (
      field ===
      'lovedColors'
    ) {

      nextProfile.avoidedColors =
        nextProfile.avoidedColors.filter(
          x => x !== value
        );
    }


    if (
      field ===
      'avoidedColors'
    ) {

      nextProfile.lovedColors =
        nextProfile.lovedColors.filter(
          x => x !== value
        );
    }


    if (
      field ===
      'lovedGarments'
    ) {

      nextProfile.avoidedGarments =
        nextProfile.avoidedGarments.filter(
          x => x !== value
        );
    }


    if (
      field ===
      'avoidedGarments'
    ) {

      nextProfile.lovedGarments =
        nextProfile.lovedGarments.filter(
          x => x !== value
        );
    }


    saveStyleProfile(
      nextProfile
    );
  }


  function clearStyleProfile() {

    saveStyleProfile({
      favoriteStyles: [],
      lovedColors: [],
      avoidedColors: [],
      lovedGarments: [],
      avoidedGarments: []
    });
  }


  function chooseCat(
    c: Cat
  ) {

    setCategory(c);

    setItem(
      categories[c][0]
    );

    setGeneratorMode(
      'catalog'
    );

    setSelectedWardrobeId('');

    setGeneratorMessage('');
  }


  function generate() {

    setGeneratorMessage('');


    if (
      generatorMode ===
      'wardrobe'
    ) {

      if (!selectedWardrobeId) {

        setOutfits([]);

        setGeneratorMessage(
          'Choose a piece from My Wardrobe first.'
        );

        return;
      }


      const results =
  generateWardrobeOutfits(
    selectedWardrobeId,
    wardrobe,
    style,
    occasion,
    season,
    styleProfile
  );


      setOutfits(results);


      if (
        results.length === 0
      ) {

        setGeneratorMessage(
          getWardrobeHelpMessage()
        );

        return;
      }


      if (
        results.length < 6
      ) {

        setGeneratorMessage(
          `MUSE found ${results.length} complete ${
            results.length === 1
              ? 'outfit'
              : 'outfits'
          } using only pieces you own. Add more wardrobe pieces for more combinations.`
        );
      }

    } else {

setOutfits(
        generateOutfits(
          category,
          item,
          color,
          style,
          occasion,
          season,
          styleProfile
        )
      );

    }      
    

    setTimeout(() => {

      document
        .getElementById(
          'results'
        )
        ?.scrollIntoView({
          behavior: 'smooth'
        });

    }, 50);
  }


  function getWardrobeHelpMessage() {

    const selected =
      wardrobe.find(
        wardrobeItem =>
          wardrobeItem.id ===
          selectedWardrobeId
      );


    if (!selected) {

      return (
        'Choose a piece from My Wardrobe first.'
      );
    }


    const hasTop =
      wardrobe.some(
        wardrobeItem =>
          wardrobeItem.category ===
          'Top'
      );

    const hasBottom =
      wardrobe.some(
        wardrobeItem =>
          wardrobeItem.category ===
          'Bottom'
      );

    const hasShoes =
      wardrobe.some(
        wardrobeItem =>
          wardrobeItem.category ===
          'Shoes'
      );


    const missing:
      string[] = [];


    if (
      selected.category !== 'Dress' &&
      selected.category !== 'Top' &&
      !hasTop
    ) {
      missing.push(
        'a top'
      );
    }


    if (
      selected.category !== 'Dress' &&
      selected.category !== 'Bottom' &&
      !hasBottom
    ) {
      missing.push(
        'a bottom'
      );
    }


    if (
      selected.category !== 'Shoes' &&
      !hasShoes
    ) {
      missing.push(
        'shoes'
      );
    }


    if (
      missing.length > 0
    ) {

      return (
        `Add ${missing.join(
          ', '
        )} to My Wardrobe so MUSE can build a complete outfit around this piece.`
      );
    }


    return (
      'MUSE could not build a complete outfit from the current wardrobe. Try adding a few more pieces.'
    );
  }


  function toggle(
    i: number
  ) {

    const next =
      saved.includes(i)
        ? saved.filter(
            x => x !== i
          )
        : [
            ...saved,
            i
          ];


    setSaved(next);

    localStorage.setItem(
      'muse-saved',
      JSON.stringify(next)
    );
  }


  function saveWardrobe(
    items: WardrobeGarment[]
  ) {

    setWardrobe(items);

    localStorage.setItem(
      'muse-wardrobe',
      JSON.stringify(items)
    );
  }


  function addWardrobeItem() {

    const wardrobeItem:
      WardrobeGarment = {

        id:
          `${Date.now()}-${Math.random()}`,

        name:
          newName.trim() ||
          `${newColor} ${newGarment}`,

        category:
          newCategory,

        garment:
          newGarment,

        color:
          newColor,

        createdAt:
          Date.now()
      };


    const next = [
      wardrobeItem,
      ...wardrobe
    ];


    saveWardrobe(next);

    setSelectedWardrobeId(
      wardrobeItem.id
    );

    setNewName('');

    setAddingItem(false);
  }


  function deleteWardrobeItem(
    id: string
  ) {

    const next =
      wardrobe.filter(
        wardrobeItem =>
          wardrobeItem.id !== id
      );


    saveWardrobe(next);


    if (
      selectedWardrobeId ===
      id
    ) {

      setSelectedWardrobeId(
        next[0]?.id || ''
      );
    }
  }


  function changeNewCategory(
    c: Cat
  ) {

    setNewCategory(c);

    setNewGarment(
      categories[c][0]
    );
  }


  function styleWardrobeItem(
    wardrobeItem:
      WardrobeGarment
  ) {

    setCategory(
      wardrobeItem.category
    );

    setItem(
      wardrobeItem.garment
    );

    setColor(
      wardrobeItem.color
    );

    setSelectedWardrobeId(
      wardrobeItem.id
    );

    setGeneratorMode(
      'wardrobe'
    );

    setGeneratorMessage('');

    setWardrobeOpen(false);


    setTimeout(() => {

      document
        .getElementById(
          'styler'
        )
        ?.scrollIntoView({
          behavior: 'smooth'
        });

    }, 50);
  }


  function switchToCatalog() {

    setGeneratorMode(
      'catalog'
    );

    setGeneratorMessage('');
  }


  function switchToWardrobe() {

    setGeneratorMode(
      'wardrobe'
    );

    setGeneratorMessage('');


    if (
      !selectedWardrobeId &&
      wardrobe.length > 0
    ) {

      const first =
        wardrobe[0];

      setSelectedWardrobeId(
        first.id
      );

      setCategory(
        first.category
      );

      setItem(
        first.garment
      );

      setColor(
        first.color
      );
    }
  }


  function changeWardrobeAnchor(
    id: string
  ) {

    setSelectedWardrobeId(id);


    const selected =
      wardrobe.find(
        wardrobeItem =>
          wardrobeItem.id === id
      );


    if (!selected) {
      return;
    }


    setCategory(
      selected.category
    );

    setItem(
      selected.garment
    );

    setColor(
      selected.color
    );

    setGeneratorMessage('');
  }


  const filteredWardrobe =

    wardrobeFilter === 'All'

      ? wardrobe

      : wardrobe.filter(
          wardrobeItem =>
            wardrobeItem.category ===
            wardrobeFilter
        );


  const selectedWardrobeItem =
    wardrobe.find(
      wardrobeItem =>
        wardrobeItem.id ===
        selectedWardrobeId
    );


  return (
    <>

      <nav>

        <a className="logo">
          MUSE.
        </a>


        <div className="navlinks">

          <a href="#styler">
            Styler
          </a>

          <a href="#results">
            Outfits
          </a>

          <a href="#about">
            How it works
          </a>

        </div>


        <div className="navActions">

          <button
            className="ghost"
            onClick={() =>
              setStyleProfileOpen(
                true
              )
            }
          >
            Style profile
          </button>


          <button
            className="ghost"
            onClick={() =>
              setWardrobeOpen(
                true
              )
            }
          >

            My wardrobe

            <span>
              {wardrobe.length}
            </span>

          </button>

        </div>

      </nav>


      <main>

        <section className="hero">

          <p className="eyebrow">
            YOUR WARDROBE, REIMAGINED
          </p>


          <h1>
            What are you
            <br />
            <em>styling?</em>
          </h1>


          <p className="lead">

            Pick one piece. We'll build
            the rest of the look around
            it — tuned to your style,
            occasion and season.

          </p>


          <a
            href="#styler"
            className="down"
          >
            ↓ Start styling
          </a>

        </section>


        <section
          id="styler"
          className="styler"
        >

          <div className="step">

            <b>
              01
            </b>

            <div>

              <h2>
                Choose your starting piece
              </h2>

              <p>
                Style from the MUSE catalog
                or build a look entirely
                from clothes you own.
              </p>

            </div>

          </div>


          <div className="generatorModes">

            <button
              className={
                generatorMode ===
                'catalog'
                  ? 'generatorMode active'
                  : 'generatorMode'
              }
              onClick={
                switchToCatalog
              }
            >

              <strong>
                MUSE catalog
              </strong>

              <span>
                Explore styling ideas
              </span>

            </button>


            <button
              className={
                generatorMode ===
                'wardrobe'
                  ? 'generatorMode active'
                  : 'generatorMode'
              }
              onClick={
                switchToWardrobe
              }
            >

              <strong>
                My wardrobe
              </strong>

              <span>
                Use only clothes I own
              </span>

            </button>

          </div>


          {generatorMode ===
            'catalog' && (
            <>

              <div className="categoryGrid">

                {(Object.keys(
                  categories
                ) as Cat[])
                  .map(c => (

                    <button
                      className={
                        category === c
                          ? 'cat active'
                          : 'cat'
                      }
                      onClick={() =>
                        chooseCat(c)
                      }
                      key={c}
                    >

                      <span>
                        {icons[c]}
                      </span>

                      {c}

                    </button>

                  ))}

              </div>


              <div className="formGrid">

                <label>

                  GARMENT

                  <select
                    value={item}
                    onChange={e =>
                      setItem(
                        e.target.value
                      )
                    }
                  >

                    {categories[
                      category
                    ].map(x => (

                      <option
                        key={x}
                      >
                        {x}
                      </option>

                    ))}

                  </select>

                </label>


                <label>

                  COLOR

                  <select
                    value={color}
                    onChange={e =>
                      setColor(
                        e.target.value
                      )
                    }
                  >

                    {colors.map(x => (

                      <option
                        key={x}
                      >
                        {x}
                      </option>

                    ))}

                  </select>

                </label>

              </div>

            </>
          )}


          {generatorMode ===
            'wardrobe' && (

            <div className="wardrobeStyler">

              {wardrobe.length === 0
                ? (

                  <div className="wardrobeStylerEmpty">

                    <h3>
                      Your wardrobe is empty.
                    </h3>

                    <p>
                      Add some clothes first,
                      then MUSE can build
                      outfits using only
                      pieces you own.
                    </p>

                    <button
                      className="wardrobeAdd"
                      onClick={() => {
                        setWardrobeOpen(true);
                        setAddingItem(true);
                      }}
                    >
                      + Add your first garment
                    </button>

                  </div>

                )
                : (

                  <label>

                    START WITH

                    <select
                      value={
                        selectedWardrobeId
                      }
                      onChange={e =>
                        changeWardrobeAnchor(
                          e.target.value
                        )
                      }
                    >

                      {wardrobe.map(
                        wardrobeItem => (

                          <option
                            value={
                              wardrobeItem.id
                            }
                            key={
                              wardrobeItem.id
                            }
                          >

                            {
                              wardrobeItem.name
                            }
                            {' · '}
                            {
                              wardrobeItem.color
                            }

                          </option>

                        )
                      )}

                    </select>

                  </label>

                )
              }


              {selectedWardrobeItem && (

                <div className="selectedWardrobePiece">

                  <i
                    style={{
                      background:
                        swatch(
                          selectedWardrobeItem.color
                        )
                    }}
                  />

                  <div>

                    <span>
                      STYLING FROM YOUR WARDROBE
                    </span>

                    <strong>
                      {
                        selectedWardrobeItem.name
                      }
                    </strong>

                    <p>
                      {
                        selectedWardrobeItem.color
                      }
                      {' · '}
                      {
                        selectedWardrobeItem.garment
                      }
                    </p>

                  </div>

                </div>

              )}

            </div>

          )}


          <div className="formGrid wardrobeSettings">

            <label>

              YOUR STYLE

              <select
                value={style}
                onChange={e =>
                  setStyle(
                    e.target.value
                  )
                }
              >

                {styles.map(x => (

                  <option
                    key={x}
                  >
                    {x}
                  </option>

                ))}

              </select>

            </label>


            <label>

              OCCASION

              <select
                value={occasion}
                onChange={e =>
                  setOccasion(
                    e.target.value
                  )
                }
              >

                {occasions.map(x => (

                  <option
                    key={x}
                  >
                    {x}
                  </option>

                ))}

              </select>

            </label>


            <label>

              SEASON

              <select
                value={season}
                onChange={e =>
                  setSeason(
                    e.target.value
                  )
                }
              >

                {seasons.map(x => (

                  <option
                    key={x}
                  >
                    {x}
                  </option>

                ))}

              </select>

            </label>

          </div>


          {generatorMessage && (

            <div className="generatorMessage">

              <span>
                i
              </span>

              <p>
                {generatorMessage}
              </p>


              {generatorMode ===
                'wardrobe' && (

                <button
                  onClick={() =>
                    setWardrobeOpen(
                      true
                    )
                  }
                >
                  Open wardrobe →
                </button>

              )}

            </div>

          )}


          {(styleProfile.favoriteStyles.length > 0 ||
            styleProfile.lovedColors.length > 0 ||
            styleProfile.lovedGarments.length > 0) && (

            <button
              className="profileSummary"
              onClick={() =>
                setStyleProfileOpen(
                  true
                )
              }
            >

              <span>
                PERSONALIZED FOR YOU
              </span>

              <strong>

                {[
                  ...styleProfile.favoriteStyles.slice(
                    0,
                    2
                  ),
                  ...styleProfile.lovedColors.slice(
                    0,
                    2
                  ),
                  ...styleProfile.lovedGarments.slice(
                    0,
                    2
                  )
                ].join(' · ')}

              </strong>

              <small>
                Edit style profile →
              </small>

            </button>

          )}


          <button
            className="generate"
            onClick={generate}
            disabled={
              generatorMode ===
                'wardrobe' &&
              wardrobe.length === 0
            }
          >

            {
              generatorMode ===
              'wardrobe'

                ? 'Build from my wardrobe'

                : 'Generate my outfits'
            }

            <span>
              →
            </span>

          </button>

        </section>


        {outfits.length > 0 && (

          <section
            id="results"
            className="results"
          >

            <p className="eyebrow">

              {
                generatorMode ===
                  'wardrobe'

                  ? 'FROM YOUR WARDROBE'

                  : 'CURATED FOR YOU'
              }

            </p>


            <h2>

              {
                generatorMode ===
                  'wardrobe'

                  ? 'Looks you already own.'

                  : 'Six ways to wear it.'
              }

            </h2>


            <p className="sub">

              {generatorMode ===
                'wardrobe'
                ? (
                  <>

                    Built around{' '}

                    <b>
                      {
                        selectedWardrobeItem
                          ?.name
                      }
                    </b>

                    {' '}using only pieces
                    saved in My Wardrobe.

                  </>
                )
                : (
                  <>

                    Built around your{' '}

                    <b>
                      {color.toLowerCase()}{' '}
                      {item.toLowerCase()}
                    </b>.

                  </>
                )
              }

            </p>


            <div className="outfitGrid">

              {outfits.map(
                (o, i) => (

                  <article
                    className="card"
                    key={i}
                  >

                    <div className="visual">

                      <span className="number">
                        0{i + 1}
                      </span>


                      <div className="stack">

                        {o.items.map(
                          (x, j) => (

                            <div
                              className="piece"
                              key={
                                `${x}-${j}`
                              }
                            >

                              <i
                                style={{
                                  background:
                                    swatch(x)
                                }}
                              />

                              <span>
                                {x}
                              </span>

                            </div>

                          )
                        )}

                      </div>


                      <button
                        className={
                          saved.includes(i)
                            ? 'heart saved'
                            : 'heart'
                        }
                        onClick={() =>
                          toggle(i)
                        }
                      >

                        {
                          saved.includes(i)
                            ? '♥'
                            : '♡'
                        }

                      </button>

                    </div>


                    <div className="cardbody">

                      <div className="score">
                        {o.score}% MATCH
                      </div>

                      <h3>
                        {o.title}
                      </h3>

                      <p>
                        {o.note}
                      </p>

                    </div>

                  </article>

                )
              )}

            </div>

          </section>

        )}


        <section
          id="about"
          className="about"
        >

          <p className="eyebrow">
            HOW IT WORKS
          </p>


          <h2>
            Less scrolling.
            <br />
            More wearing.
          </h2>


          <div className="three">

            <div>

              <b>
                01
              </b>

              <h3>
                Pick a piece
              </h3>

              <p>
                Choose from the MUSE
                catalog or start with
                something already saved
                in My Wardrobe.
              </p>

            </div>


            <div>

              <b>
                02
              </b>

              <h3>
                Set the mood
              </h3>

              <p>
                Tell MUSE your style,
                occasion and season.
                Your Style Profile keeps
                track of the things you
                love and avoid.
              </p>

            </div>


            <div>

              <b>
                03
              </b>

              <h3>
                Get dressed
              </h3>

              <p>
                MUSE ranks color,
                style, silhouette and
                wardrobe compatibility
                to build complete looks.
              </p>

            </div>

          </div>

        </section>

      </main>


      <footer>

        <strong>
          MUSE.
        </strong>

        <span>
          Your personal outfit engine.
        </span>

        <span>
          Local-first MVP · No account needed
        </span>

      </footer>


      {styleProfileOpen && (

        <div
          className="wardrobeOverlay"
          onClick={() =>
            setStyleProfileOpen(
              false
            )
          }
        >

          <div
            className="wardrobePanel styleProfilePanel"
            onClick={e =>
              e.stopPropagation()
            }
          >

            <div className="wardrobeHeader">

              <div>

                <p className="eyebrow">
                  PERSONALIZE MUSE
                </p>

                <h2>
                  My Style Profile
                </h2>

                <p>
                  Tell MUSE what you love
                  and what you would rather
                  avoid.
                </p>

              </div>


              <button
                className="wardrobeClose"
                onClick={() =>
                  setStyleProfileOpen(
                    false
                  )
                }
              >
                ×
              </button>

            </div>


            <div className="profileSection">

              <div className="profileSectionHeading">

                <span>
                  01
                </span>

                <div>

                  <h3>
                    Your styles
                  </h3>

                  <p>
                    Choose as many as feel
                    like you.
                  </p>

                </div>

              </div>


              <div className="profileChoices">

                {styles.map(
                  profileStyle => (

                    <button
                      key={
                        profileStyle
                      }
                      className={
                        styleProfile
                          .favoriteStyles
                          .includes(
                            profileStyle
                          )

                          ? 'profileChoice active'

                          : 'profileChoice'
                      }
                      onClick={() =>
                        toggleProfileValue(
                          'favoriteStyles',
                          profileStyle
                        )
                      }
                    >

                      {profileStyle}

                      <span>

                        {
                          styleProfile
                            .favoriteStyles
                            .includes(
                              profileStyle
                            )

                            ? '♥'

                            : '♡'
                        }

                      </span>

                    </button>

                  )
                )}

              </div>

            </div>


            <div className="profileSection">

              <div className="profileSectionHeading">

                <span>
                  02
                </span>

                <div>

                  <h3>
                    Colors
                  </h3>

                  <p>
                    Choose colors you love
                    and colors you would
                    rather avoid.
                  </p>

                </div>

              </div>


              <p className="profileLabel">
                COLORS I LOVE
              </p>


              <div className="profileChoices colorChoices">

                {colors.map(
                  profileColor => (

                    <button
                      key={
                        `love-${profileColor}`
                      }
                      className={
                        styleProfile
                          .lovedColors
                          .includes(
                            profileColor
                          )

                          ? 'profileChoice colorChoice active'

                          : 'profileChoice colorChoice'
                      }
                      onClick={() =>
                        toggleProfileValue(
                          'lovedColors',
                          profileColor
                        )
                      }
                    >

                      <i
                        style={{
                          background:
                            swatch(
                              profileColor
                            )
                        }}
                      />

                      {profileColor}

                    </button>

                  )
                )}

              </div>


              <p className="profileLabel">
                COLORS I AVOID
              </p>


              <div className="profileChoices colorChoices">

                {colors.map(
                  profileColor => (

                    <button
                      key={
                        `avoid-${profileColor}`
                      }
                      className={
                        styleProfile
                          .avoidedColors
                          .includes(
                            profileColor
                          )

                          ? 'profileChoice colorChoice avoid active'

                          : 'profileChoice colorChoice avoid'
                      }
                      onClick={() =>
                        toggleProfileValue(
                          'avoidedColors',
                          profileColor
                        )
                      }
                    >

                      <i
  style={{
    background: swatch(profileColor)
  }}
/>

{profileColor}

<span>
  {styleProfile.avoidedColors.includes(profileColor) ? '👎' : ''}
</span>

</button>

                  )
                )}

              </div>

            </div>


            <div className="profileSection">

              <div className="profileSectionHeading">

                <span>
                  03
                </span>

                <div>

                  <h3>
                    Garments
                  </h3>

                  <p>
                    Tell MUSE which pieces
                    you reach for and which
                    ones are not for you.
                  </p>

                </div>

              </div>


              <p className="profileLabel">
                PIECES I LOVE
              </p>


              <div className="profileChoices garmentChoices">

                {allGarmentNames.map(
                  garmentName => (

                    <button
                      key={
                        `love-${garmentName}`
                      }
                      className={
                        styleProfile
                          .lovedGarments
                          .includes(
                            garmentName
                          )

                          ? 'profileChoice active'

                          : 'profileChoice'
                      }
                      onClick={() =>
                        toggleProfileValue(
                          'lovedGarments',
                          garmentName
                        )
                      }
                    >

                      {garmentName}

                      <span>

                        {
                          styleProfile
                            .lovedGarments
                            .includes(
                              garmentName
                            )

                            ? '♥'

                            : '♡'
                        }

                      </span>

                    </button>

                  )
                )}

              </div>


              <p className="profileLabel">
                PIECES I AVOID
              </p>


              <div className="profileChoices garmentChoices">

                {allGarmentNames.map(
                  garmentName => (

                    <button
                      key={
                        `avoid-${garmentName}`
                      }
                      className={
                        styleProfile
                          .avoidedGarments
                          .includes(
                            garmentName
                          )

                          ? 'profileChoice avoid active'

                          : 'profileChoice avoid'
                      }
                      onClick={() =>
                        toggleProfileValue(
                          'avoidedGarments',
                          garmentName
                        )
                      }
                    >

                      >
  {garmentName}

  <span>
    {styleProfile.avoidedGarments.includes(garmentName) ? '👎' : ''}
  </span>

</button>

                  )
                )}

              </div>

            </div>


            <div className="profileFooter">

              <button
                className="ghost"
                onClick={
                  clearStyleProfile
                }
              >
                Clear profile
              </button>


              <button
                className="generate"
                onClick={() =>
                  setStyleProfileOpen(
                    false
                  )
                }
              >

                Save my style

                <span>
                  →
                </span>

              </button>

            </div>

          </div>

        </div>

      )}


      {wardrobeOpen && (

        <div
          className="wardrobeOverlay"
          onClick={() => {
            setWardrobeOpen(false);
            setAddingItem(false);
          }}
        >

          <div
            className="wardrobePanel"
            onClick={e =>
              e.stopPropagation()
            }
          >

            <div className="wardrobeHeader">

              <div>

                <p className="eyebrow">
                  YOUR CLOSET
                </p>

                <h2>
                  My Wardrobe
                </h2>

                <p>
                  Save the pieces you
                  actually own. MUSE can
                  then build outfits using
                  only your clothes.
                </p>

              </div>


              <button
                className="wardrobeClose"
                onClick={() => {
                  setWardrobeOpen(false);
                  setAddingItem(false);
                }}
              >
                ×
              </button>

            </div>


            <div className="wardrobeToolbar">

              <div className="wardrobeFilters">

                {(
                  [
                    'All',
                    ...Object.keys(
                      categories
                    )
                  ] as (
                    'All' |
                    Cat
                  )[]
                ).map(filter => (

                  <button
                    key={filter}
                    className={
                      wardrobeFilter ===
                        filter

                        ? 'wardrobeFilter active'

                        : 'wardrobeFilter'
                    }
                    onClick={() =>
                      setWardrobeFilter(
                        filter
                      )
                    }
                  >
                    {filter}
                  </button>

                ))}

              </div>


              <button
                className="wardrobeAdd"
                onClick={() =>
                  setAddingItem(
                    !addingItem
                  )
                }
              >

                {
                  addingItem
                    ? 'Cancel'
                    : '+ Add garment'
                }

              </button>

            </div>


            {addingItem && (

              <div className="wardrobeForm">

                <div>

                  <p className="wardrobeFormTitle">
                    Add a new piece
                  </p>

                  <p className="wardrobeFormText">
                    Choose the closest
                    garment type and give
                    it a name if you want.
                  </p>

                </div>


                <div className="wardrobeFormGrid">

                  <label>

                    CATEGORY

                    <select
                      value={
                        newCategory
                      }
                      onChange={e =>
                        changeNewCategory(
                          e.target.value as Cat
                        )
                      }
                    >

                      {(Object.keys(
                        categories
                      ) as Cat[])
                        .map(c => (

                          <option
                            key={c}
                          >
                            {c}
                          </option>

                        ))}

                    </select>

                  </label>


                  <label>

                    GARMENT

                    <select
                      value={
                        newGarment
                      }
                      onChange={e =>
                        setNewGarment(
                          e.target.value
                        )
                      }
                    >

                      {categories[
                        newCategory
                      ].map(x => (

                        <option
                          key={x}
                        >
                          {x}
                        </option>

                      ))}

                    </select>

                  </label>


                  <label>

                    COLOR

                    <select
                      value={
                        newColor
                      }
                      onChange={e =>
                        setNewColor(
                          e.target.value
                        )
                      }
                    >

                      {colors.map(x => (

                        <option
                          key={x}
                        >
                          {x}
                        </option>

                      ))}

                    </select>

                  </label>


                  <label>

                    NAME

                    <input
                      value={
                        newName
                      }
                      onChange={e =>
                        setNewName(
                          e.target.value
                        )
                      }
                      placeholder={
                        `e.g. Favourite ${newGarment.toLowerCase()}`
                      }
                    />

                  </label>

                </div>


                <button
                  className="generate wardrobeSave"
                  onClick={
                    addWardrobeItem
                  }
                >

                  Save to My Wardrobe

                  <span>
                    →
                  </span>

                </button>

              </div>

            )}


            {wardrobe.length === 0
              ? (

                <div className="wardrobeEmpty">

                  <span>
                    ♧
                  </span>

                  <h3>
                    Your wardrobe is empty.
                  </h3>

                  <p>
                    Add your first garment
                    and start building a
                    digital closet.
                  </p>

                  <button
                    onClick={() =>
                      setAddingItem(
                        true
                      )
                    }
                  >
                    Add my first piece
                  </button>

                </div>

              )
              : (

                <div className="wardrobeGrid">

                  {filteredWardrobe.map(
                    wardrobeItem => (

                      <article
                        className="wardrobeCard"
                        key={
                          wardrobeItem.id
                        }
                      >

                        <div className="wardrobeVisual">

                          <span>
                            {
                              icons[
                                wardrobeItem.category
                              ]
                            }
                          </span>

                          <i
                            style={{
                              background:
                                swatch(
                                  wardrobeItem.color
                                )
                            }}
                          />

                        </div>


                        <div className="wardrobeCardBody">

                          <span className="wardrobeCategory">
                            {
                              wardrobeItem.category
                            }
                          </span>

                          <h3>
                            {
                              wardrobeItem.name
                            }
                          </h3>

                          <p>
                            {
                              wardrobeItem.color
                            }
                            {' · '}
                            {
                              wardrobeItem.garment
                            }
                          </p>


                          <div className="wardrobeActions">

                            <button
                              onClick={() =>
                                styleWardrobeItem(
                                  wardrobeItem
                                )
                              }
                            >
                              Style this →
                            </button>

                            <button
                              className="wardrobeDelete"
                              onClick={() =>
                                deleteWardrobeItem(
                                  wardrobeItem.id
                                )
                              }
                            >
                              Delete
                            </button>

                          </div>

                        </div>

                      </article>

                    )
                  )}

                </div>

              )
            }

          </div>

        </div>

      )}

    </>
  );
}


const allGarmentNames =
  Array.from(
    new Set(
      Object.values(
        categories
      ).flat()
    )
  );


const icons:
  Record<string, string> = {

    Top:
      '♧',

    Bottom:
      '♢',

    Dress:
      '♙',

    Outerwear:
      '♤',

    Shoes:
      '⌁'
  };


function swatch(
  s: string
) {

  const map:
    Record<string, string> = {

      Black:
        '#222',

      White:
        '#f6f4ef',

      Cream:
        '#e8ddc5',

      Grey:
        '#999',

      Navy:
        '#27354f',

      Beige:
        '#c9ad8a',

      Brown:
        '#765442',

      Burgundy:
        '#6f2537',

      Red:
        '#b63832',

      Pink:
        '#dba9af',

      Olive:
        '#687052',

      Green:
        '#42604c',

      Blue:
        '#718da9',

      Denim:
        '#6682a2'
    };


  return (
    Object
      .entries(map)
      .find(
        ([key]) =>
          s.includes(key)
      )?.[1]
    ||
    '#d8d0c5'
  );
}
