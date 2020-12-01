import FilmCard from "./film-card";
import {createElement} from "../utils";

const createContentFilmsList = (films) => {
  const cardList = films.reduce(
      (accumulator, item) => accumulator + (new FilmCard(item).getElement().outerHTML),
      ``);

  return `<section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
      <div class="films-list__container">${cardList}
      </div>
    </section>`;
};

export default class ContentFilms {
  constructor(films) {
    this._films = films;
    this._element = null;
  }

  getTemplate() {
    return createContentFilmsList(this._films);
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
