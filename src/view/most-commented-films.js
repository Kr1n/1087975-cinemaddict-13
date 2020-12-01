import {createElement} from "../utils.js";
import FilmCard from "./film-card";

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

export default class MostCommentedFilms {
  constructor(films) {
    this._films = films;
    this._element = null;
  }

  getTemplate() {
    return createMostCommentedFilmsList(this._films);
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
