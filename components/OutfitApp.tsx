'use client';

import { useEffect, useState } from 'react';
import {
  categories,
  colors,
  styles,
  occasions,
  seasons
} from '../lib/data';

import {
  generateOutfits,
  Outfit
} from '../lib/outfitEngine';


type Cat = keyof typeof categories;

type WardrobeItem = {
  id: string;
  name: string;
  category: Cat;
  garment: string;
  color: string;
  createdAt: number;
};


export default function OutfitApp() {

  /* =======================================================
     STYLER STATE
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
     SAVED OUTFITS
     ======================================================= */

  const [saved, setSaved] =
    useState<number[]>([]);


  /* =======================================================
     WARDROBE STATE
     ======================================================= */

  const [wardrobe, setWardrobe] =
    useState<WardrobeItem[]>([]);

  const [wardrobeOpen, setWardrobeOpen] =
    useState(false);

  const [addingItem, setAddingItem] =
    useState(false);

  const [wardrobeFilter, setWardrobeFilter] =
    useState<'All' | Cat>('All');


  /* =======================================================
     NEW ITEM FORM
     ======================================================= */

  const [newCategory, setNewCategory] =
    useState<Cat>('Top');

  const [newGarment, setNewGarment] =
    useState<string>(categories.Top[0]);

  const [newColor, setNewColor] =
    useState<string>('Black');

  const [newName, setNewName] =
    useState('');


  /* =======================================================
     LOAD LOCAL DATA
     ======================================================= */

  useEffect(() => {

    const savedData =
      localStorage.getItem('muse-saved');

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
        setWardrobe(
          JSON.parse(wardrobeData)
        );
      } catch {}
    }

  }, []);


  /* =======================================================
     STYLER
     ======================================================= */

  function chooseCat(c: Cat) {

    setCategory(c);

    setItem(
      categories[c][0]
    );
  }


  function generate() {

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


    setTimeout(() => {

      document
        .getElementById('results')
        ?.scrollIntoView({
          behavior: 'smooth'
        });

    }, 50);
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
    items: WardrobeItem[]
  ) {

    setWardrobe(items);

    localStorage.setItem(
      'muse-wardrobe',
      JSON.stringify(items)
    );
  }


  /* =======================================================
     ADD WARDROBE ITEM
     ======================================================= */

  function addWardrobeItem() {

    const wardrobeItem:
      WardrobeItem = {

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


    saveWardrobe([
      wardrobeItem,
      ...wardrobe
    ]);


    setNewName('');

    setAddingItem(false);
  }


  /* =======================================================
     DELETE WARDROBE ITEM
     ======================================================= */

  function deleteWardrobeItem(
    id: string
  ) {

    const next =
      wardrobe.filter(
        item =>
          item.id !== id
      );


    saveWardrobe(next);
  }


  /* =======================================================
     CHANGE NEW ITEM CATEGORY
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
     STYLE A WARDROBE ITEM
     ======================================================= */

  function styleWardrobeItem(
    wardrobeItem: WardrobeItem
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


    setWardrobeOpen(false);


    setTimeout(() => {

      document
        .getElementById('styler')
        ?.scrollIntoView({
          behavior: 'smooth'
        });

    }, 50);
  }


  /* =======================================================
     FILTERED WARDROBE
     ======================================================= */

  const filteredWardrobe =

    wardrobeFilter === 'All'

      ? wardrobe

      : wardrobe.filter(
          item =>
            item.category ===
            wardrobeFilter
        );


  /* =======================================================
     PAGE
     ======================================================= */

  return (
    <>

      {/* ===================================================
          NAVIGATION
          =================================================== */}

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

        {/* =================================================
            HERO
            ================================================= */}

        <section className="hero">

          <p className="eyebrow">
            YOUR WARDROBE, REIMAGINED
          </p>


          <h1>
            What are you
            <br />

            <em>
              styling?
            </em>
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


        {/* =================================================
            STYLER
            ================================================= */}

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
                Choose a category
              </h2>

              <p>
                Start with the piece
                you want to wear.
              </p>

            </div>

          </div>


          <div className="categoryGrid">

            {(Object.keys(categories) as Cat[])
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

                {categories[category]
                  .map(x => (

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


          <button
            className="generate"
            onClick={generate}
          >

            Generate my outfits

            <span>
              →
            </span>

          </button>

        </section>


        {/* =================================================
            RESULTS
            ================================================= */}

        {outfits.length > 0 && (

          <section
            id="results"
            className="results"
          >

            <p className="eyebrow">
              CURATED FOR YOU
            </p>


            <h2>
              Six ways to wear it.
            </h2>


            <p className="sub">

              Built around your

              {' '}

              <b>
                {color.toLowerCase()}
                {' '}
                {item.toLowerCase()}
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


        {/* =================================================
            HOW IT WORKS
            ================================================= */}

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

                Choose something from
                your wardrobe or add a
                new garment.

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

                Tell Muse your style,
                occasion and season.

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

                Our scoring engine ranks
                color, style and silhouette
                compatibility.

              </p>

            </div>

          </div>

        </section>

      </main>


      {/* ===================================================
          FOOTER
          =================================================== */}

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


      {/* ===================================================
          WARDROBE OVERLAY
          =================================================== */}

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

            {/* HEADER */}

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


            {/* ADD BUTTON */}

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


            {/* ADD ITEM FORM */}

            {addingItem && (

              <div className="wardrobeForm">

                <h3>
                  Add to wardrobe
                </h3>


                <label>

                  NAME
                  <span>
                    Optional
                  </span>

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
                      changeNewCategory(
                        e.target.value as Cat
                      )
                    }
                  >

                    {(Object.keys(categories) as Cat[])
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

                    {categories[newCategory]
                      .map(g => (

                        <option
                          key={g}
                        >
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

                      <option
                        key={c}
                      >
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

                    <span>
                      →
                    </span>

                  </button>

                </div>

              </div>

            )}


            {/* FILTERS */}

            {!addingItem && wardrobe.length > 0 && (

              <div className="wardrobeFilters">

                {[
                  'All',
                  ...Object.keys(categories)
                ].map(filter => (

                  <button

                    key={filter}

                    className={
                      wardrobeFilter === filter
                        ? 'wardrobeFilter active'
                        : 'wardrobeFilter'
                    }

                    onClick={() =>
                      setWardrobeFilter(
                        filter as 'All' | Cat
                      )
                    }
                  >

                    {filter}

                  </button>

                ))}

              </div>

            )}


            {/* EMPTY STATE */}

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
                  own and use them as the
                  starting point for your
                  outfits.

                </p>

                <button
                  className="generate"
                  onClick={() =>
                    setAddingItem(true)
                  }
                >

                  Add your first piece

                  <span>
                    →
                  </span>

                </button>

              </div>

            )}


            {/* WARDROBE GRID */}

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

                            <span>
                              →
                            </span>

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
   COLOR SWATCH
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
