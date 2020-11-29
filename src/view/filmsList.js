import {createFilmCardTemplate} from "./filmCard.js";


const EXTRA_CARD_COUNT = 2;
let allFilms = {};

const sortForTopRated = (a, b) => b.rating - a.rating;
const sortForMostCommented = (a, b) => b.comments.size - a.comments.size;

export const createFilmsList = (films = {}, count) => {
  allFilms = films;

  return `
    <section class="films">` +
    createContentFilmsList(allFilms.slice(0, count)) +
    createTopRatedFilmsList(allFilms.sort(sortForTopRated).slice(0, EXTRA_CARD_COUNT)) +
    createMostCommentedFilmsList(allFilms.sort(sortForMostCommented).slice(0, EXTRA_CARD_COUNT)) + `
    </section>`;
};

const createContentFilmsList = (films) => {

  const cardList = films.reduce(
      (accumulator, item) => accumulator + createFilmCardTemplate(item),
      ``);

  return `
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
      <div class="films-list__container">` + cardList + `
      </div>
    </section>`;
};

const createTopRatedFilmsList = (films = {}) => {

  const cardList = films.reduce(
      (accumulator, item) => accumulator + createFilmCardTemplate(item),
      ``);

  return `
    <section class="films-list films-list--extra">
      <h2 class="films-list__title">Top rated</h2>
      <div class="films-list__container">` + cardList + `
      </div>
    </section>`;
};

const createMostCommentedFilmsList = (films = {}) => {

  const cardList = films.reduce(
      (accumulator, item) => accumulator + createFilmCardTemplate(item),
      ``);

  return `
    <section class="films-list films-list--extra">
      <h2 class="films-list__title">Most commented</h2>
      <div class="films-list__container">` + cardList + `
      </div>
    </section>`;
};
