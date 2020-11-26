import {createFilmCardTemplate} from "./filmCard.js";


const EXTRA_CARD_COUNT = 2;
let allFilms = {};

export const createFilmsList = (films = {}, count) => {
  allFilms = films;
  return `
    <section class="films">` +
    createContentFilmsList(allFilms.slice(0, count)) +
    createTopRatedFilmsList(allFilms.slice(0, EXTRA_CARD_COUNT)) +
    createMostCommentedFilmsList(allFilms.slice(0, EXTRA_CARD_COUNT)) + `
    </section>`;
};

const createContentFilmsList = (films) => {

  let cardList = ``;
  for (let i = 0; i < films.length; i++) {
    cardList += createFilmCardTemplate(films[i]);
  }
  return `
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
      <div class="films-list__container">` + cardList + `
      </div>
    </section>`;
};

const createTopRatedFilmsList = (films = {}) => {
  let cardList = ``;
  for (let i = 0; i < films.length; i++) {
    cardList += createFilmCardTemplate(films[i]);
  }

  return `
    <section class="films-list films-list--extra">
      <h2 class="films-list__title">Top rated</h2>
      <div class="films-list__container">` + cardList + `
      </div>
    </section>`;
};

const createMostCommentedFilmsList = (films = {}) => {
  let cardList = ``;
  for (let i = 0; i < films.length; i++) {
    cardList += createFilmCardTemplate(films[i]);
  }

  return `
    <section class="films-list films-list--extra">
      <h2 class="films-list__title">Most commented</h2>
      <div class="films-list__container">` + cardList + `
      </div>
    </section>`;
};
