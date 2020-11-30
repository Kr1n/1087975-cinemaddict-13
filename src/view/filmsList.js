import {createElement} from "../utils.js";
import FilmCard from "./filmCard.js";

const EXTRA_CARD_COUNT = 2;
let allFilms = {};

const sortForTopRated = (a, b) => b.rating - a.rating;
const sortForMostCommented = (a, b) => b.comments.size - a.comments.size;

const createFilmsList = (films = {}, count) => {
  allFilms = films;
  return `<section class="films">` +
    createContentFilmsList(allFilms.slice(0, count)) +
    createTopRatedFilmsList(allFilms.sort(sortForTopRated).slice(0, EXTRA_CARD_COUNT)) +
    createMostCommentedFilmsList(allFilms.sort(sortForMostCommented).slice(0, EXTRA_CARD_COUNT)) + `
    </section>`;
};

const createContentFilmsList = (films) => {
  const cardList = films.reduce(
      (accumulator, item) => accumulator + (new FilmCard(item).getElement().outerHTML),
      ``);

  return `<section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
      <div class="films-list__container">` + cardList + `
      </div>
    </section>`;
};

const createTopRatedFilmsList = (films = {}) => {

  const cardList = films.reduce(
      (accumulator, item) => accumulator + (new FilmCard(item).getElement().outerHTML),
      ``);

  return `<section class="films-list films-list--extra">
      <h2 class="films-list__title">Top rated</h2>
      <div class="films-list__container">` + cardList + `
      </div>
    </section>`;
};

const createMostCommentedFilmsList = (films = {}) => {

  const cardList = films.reduce(
      (accumulator, item) => accumulator + (new FilmCard(item).getElement().outerHTML),
      ``);

  return `<section class="films-list films-list--extra">
      <h2 class="films-list__title">Most commented</h2>
      <div class="films-list__container">` + cardList + `
      </div>
    </section>`;
};

export default class FilmsList {
  constructor(films, count) {
    this._count = count;
    this._films = films;
    this._element = null;
  }

  getTemplate() {
    return createFilmsList(this._films, this._count);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
