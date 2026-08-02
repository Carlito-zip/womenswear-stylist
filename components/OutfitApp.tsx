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


export default function OutfitApp() {

  /* =======================================================
     STYLER
     ======================================================= */

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


  /* =======================================================
     GENERATOR MODE
     ======================================================= */

  const [generatorMode, setGeneratorMode] =
    useState<GeneratorMode>('catalog');

  const [selectedWardrobeId, setSelectedWardrobeId] =
    useState<string>('');


  /* =======================================================
     MESSAGE
     ======================================================= */

  const [generatorMessage, setGeneratorMessage] =
    useState('');


  /* =======================================================
     SAVED
     ======================================================= */

  const [saved, setSaved] =
    useState<number[]>([]);


  /* =======================================================
     WARDROBE
     ======================================================= */

  const [wardrobe, setWardrobe] =
    useState<WardrobeGarment[]>([]);

  const [wardrobeOpen, setWardrobeOpen] =
    useState(false);

  const [addingItem, setAddingItem] =
    useState(false);

  const [wardrobeFilter, setWardrobeFilter] =
    useState<'All' | Cat>('All');


  /* =======================================================
     ADD ITEM
     ======================================================= */

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


  /* =======================================================
     LOAD STORAGE
     ======================================================= */

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


        if (
          parsed.length > 0
        ) {

          setSelectedWardrobeId(
            parsed[0].id
          );
        }

      } catch {}
    }

  }, []);


  /* =======================================================
     CATEGORY
     ======================================================= */

  function chooseCat(c: Cat) {

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


  /* =======================================================
     NORMAL GENERATION
     ======================================================= */

  function generate() {

    setGeneratorMessage('');


    if (
      generatorMode ===
      'wardrobe'
    ) {

      if (
        !selectedWardrobeId
      ) {

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
          season
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
          season
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


  /* =======================================================
     WARDROBE HELP
     ======================================================= */

  function getWardrobeHelpMessage() {

    const selected =
      wardrobe.find(
        wardrobeItem =>
          wardrobeItem.id ===
          selectedWardrobeId
      );


    if (!selected) {
      return 'Choose a piece from My Wardrobe first.';
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


    const missing: string[] = [];


    if (
      selected.category !== 'Dress' &&
      selected.category !== 'Top' &&
      !hasTop
    ) {
      missing.push('a top');
    }


    if (
      selected.category !== 'Dress' &&
      selected.category !== 'Bottom' &&
      !hasBottom
    ) {
      missing.push('a bottom');
    }


    if (
      selected.category !== 'Shoes' &&
      !hasShoes
    ) {
      missing.push('shoes');
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


  /* =======================================================
     SAVED OUTFITS
     ======================================================= */

  function toggle(i: number) {

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


  /* =======================================================
     WARDROBE STORAGE
     ======================================================= */

  function saveWardrobe(
    items: WardrobeGarment[]
  ) {

    setWardrobe(items);

    localStorage.setItem(
      'muse-wardrobe',
      JSON.stringify(items)
    );
  }


  /* =======================================================
     ADD ITEM
     ======================================================= */

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


  /* =======================================================
     DELETE
     ======================================================= */

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
      selectedWardrobeId === id
    ) {

      setSelectedWardrobeId(
        next[0]?.id || ''
      );
    }
  }


  /* =======================================================
     ADD CATEGORY
     ======================================================= */

  function changeNewCategory(
    c: Cat
  ) {

    setNewCategory(c);

    setNewGarment(
      categories[c][0]
    );
  }


  /* =======================================================
     STYLE WARDROBE ITEM
     ======================================================= */

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


  /* =======================================================
     MODE SWITCH
     ======================================================= */

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


  /* =======================================================
     CHANGE WARDROBE ANCHOR
     ======================================================= */

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


  /* =======================================================
     FILTER
     ======================================================= */

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


  /* =======================================================
     UI
     ======================================================= */

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


        <button
          className="ghost"
          onClick={() =>
            setWardrobeOpen(true)
          }
        >

          My wardrobe

          <span>
            {wardrobe.length}
          </span>

        </button>

      </nav>


      <main>

        {/* HERO */}

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


        {/* STYLER */}

        <section
          id="styler"
          className="styler"
        >

          <div className="step">

            <b>01</b>

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


          {/* MODE SELECTOR */}

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


          {/* CATALOG MODE */}

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

                      <option key={x}>
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

                      <option key={x}>
                        {x}
                      </option>

                    ))}

                  </select>

                </label>

              </div>

            </>
          )}


          {/* WARDROBE MODE */}

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


          {/* COMMON SETTINGS */}

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

                  <option key={x}>
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

                  <option key={x}>
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

                  <option key={x}>
                    {x}
                  </option>

                ))}

              </select>

            </label>

          </div>


          {generatorMessage && (

            <div className="generatorMessage">

              <span>i</span>

              <p>
                {generatorMessage}
              </p>

              {generatorMode ===
                'wardrobe' && (

                <button
                  onClick={() =>
                    setWardrobeOpen(true)
                  }
                >
                  Open wardrobe →
                </button>

              )}

            </div>

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

            <span>→</span>

          </button>

        </section>


        {/* RESULTS */}

        {outfits.length > 0 && (

          <section
            id="results"
            className="results"
          >

            <p className="eyebrow">

              {
                generatorMode ===
                'wardrobe'

                  ? 'FROM PIECES YOU OWN'

                  : 'CURATED FOR YOU'
              }

            </p>


            <h2>

              {
                generatorMode ===
                'wardrobe'

                  ? 'Your wardrobe, remixed.'

                  : 'Six ways to wear it.'
              }

            </h2>


            <p className="sub">

              Built around your

              {' '}

              <b>
                {
                  selectedWardrobeItem &&
                  generatorMode ===
                    'wardrobe'

                    ? selectedWardrobeItem.name

                    : `${color.toLowerCase()} ${item.toLowerCase()}`
                }
              </b>.

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
                              key={`${x}-${j}`}
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


        {/* ABOUT */}

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
              <b>01</b>
              <h3>Pick a piece</h3>
              <p>
                Start with a garment
                you actually own or
                explore the MUSE catalog.
              </p>
            </div>

            <div>
              <b>02</b>
              <h3>Set the mood</h3>
              <p>
                Tell MUSE your style,
                occasion and season.
              </p>
            </div>

            <div>
              <b>03</b>
              <h3>Get dressed</h3>
              <p>
                MUSE ranks color, style,
                season and silhouette
                compatibility.
              </p>
            </div>

          </div>

        </section>

      </main>


      <footer>

        <strong>MUSE.</strong>

        <span>
          Your personal outfit engine.
        </span>

        <span>
          Local-first MVP · No account needed
        </span>

      </footer>


      {/* WARDROBE */}

      {wardrobeOpen && (

        <div
          className="wardrobeOverlay"
          onClick={() =>
            setWardrobeOpen(false)
          }
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
                  YOUR COLLECTION
                </p>

                <h2>
                  My Wardrobe
                </h2>

                <p>
                  {wardrobe.length}
                  {' '}
                  {
                    wardrobe.length === 1
                      ? 'piece'
                      : 'pieces'
                  }
                </p>

              </div>


              <button
                className="wardrobeClose"
                onClick={() =>
                  setWardrobeOpen(false)
                }
              >
                ×
              </button>

            </div>


            {!addingItem && (

              <button
                className="wardrobeAdd"
                onClick={() =>
                  setAddingItem(true)
                }
              >
                + Add a garment
              </button>

            )}


            {addingItem && (

              <div className="wardrobeForm">

                <h3>
                  Add to wardrobe
                </h3>


                <label>

                  NAME
                  <span>Optional</span>

                  <input
                    value={newName}
                    onChange={e =>
                      setNewName(
                        e.target.value
                      )
                    }
                    placeholder={
                      `${newColor} ${newGarment}`
                    }
                  />

                </label>


                <label>

                  CATEGORY

                  <select
                    value={newCategory}
                    onChange={e =>
                      changeNewCategory(e.target.value as Cat)
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
                    value={newGarment}
                    onChange={e =>
                      setNewGarment(
                        e.target.value
                      )
                    }
                  >

                    {categories[
                      newCategory
                    ].map(g => (

                      <option key={g}>
                        {g}
                      </option>

                    ))}

                  </select>

                </label>


                <label>

                  COLOR

                  <select
                    value={newColor}
                    onChange={e =>
                      setNewColor(
                        e.target.value
                      )
                    }
                  >

                    {colors.map(c => (

                      <option key={c}>
                        {c}
                      </option>

                    ))}

                  </select>

                </label>


                <div className="wardrobeFormActions">

                  <button
                    className="ghost"
                    onClick={() =>
                      setAddingItem(false)
                    }
                  >
                    Cancel
                  </button>


                  <button
                    className="generate"
                    onClick={
                      addWardrobeItem
                    }
                  >
                    Add to wardrobe
                    <span>→</span>
                  </button>

                </div>

              </div>

            )}


            {!addingItem &&
              wardrobe.length > 0 && (

              <div className="wardrobeFilters">

                {[
                  'All',
                  ...Object.keys(
                    categories
                  )
                ].map(filter => (

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
                        filter as
                          'All' | Cat
                      )
                    }
                  >
                    {filter}
                  </button>

                ))}

              </div>

            )}


            {!addingItem &&
              wardrobe.length === 0 && (

              <div className="wardrobeEmpty">

                <div className="wardrobeEmptyIcon">
                  ♧
                </div>

                <h3>
                  Your wardrobe is empty.
                </h3>

                <p>
                  Add pieces you actually
                  own and MUSE can build
                  outfits from them.
                </p>

                <button
                  className="generate"
                  onClick={() =>
                    setAddingItem(true)
                  }
                >
                  Add your first piece
                  <span>→</span>
                </button>

              </div>

            )}


            {!addingItem &&
              wardrobe.length > 0 && (

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

                        <div
                          className="wardrobeSwatch"
                          style={{
                            background:
                              swatch(
                                wardrobeItem.color
                              )
                          }}
                        />

                        <span className="wardrobeCategory">
                          {
                            wardrobeItem.category
                          }
                        </span>

                      </div>


                      <div className="wardrobeCardBody">

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
                            className="styleItem"
                            onClick={() =>
                              styleWardrobeItem(
                                wardrobeItem
                              )
                            }
                          >
                            Style this
                            <span>→</span>
                          </button>


                          <button
                            className="deleteItem"
                            onClick={() =>
                              deleteWardrobeItem(
                                wardrobeItem.id
                              )
                            }
                            aria-label="Delete garment"
                          >
                            ×
                          </button>

                        </div>

                      </div>

                    </article>

                  )
                )}

              </div>

            )}

          </div>

        </div>

      )}

    </>
  );
}


/* =========================================================
   ICONS
   ========================================================= */

const icons:
  Record<string, string> = {

  Top: '♧',
  Bottom: '♢',
  Dress: '♙',
  Outerwear: '♤',
  Shoes: '⌁'

};


/* =========================================================
   SWATCH
   ========================================================= */

function swatch(s: string) {

  const map:
    Record<string, string> = {

    Black: '#222',
    White: '#f6f4ef',
    Cream: '#e8ddc5',
    Grey: '#999',
    Navy: '#27354f',
    Beige: '#c9ad8a',
    Brown: '#765442',
    Burgundy: '#6f2537',
    Red: '#b63832',
    Pink: '#dba9af',
    Olive: '#687052',
    Green: '#42604c',
    Blue: '#718da9',
    Denim: '#6682a2'

  };


  return (
    Object
      .entries(map)
      .find(
        ([k]) =>
          s.includes(k)
      )?.[1]
    ||
    '#d8d0c5'
  );
}
