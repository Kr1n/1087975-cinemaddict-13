import {createElement} from "../utils";

const createNavigationTemplate = (films) => {

  let navigationLabelCounters = {
    favorite: 0,
    watched: 0,
    watchlist: 0
  };

  if (films.length) {
    navigationLabelCounters = films.reduce(({favorite = 0, watched = 0, watchlist = 0}, item) => {
      return {
        favorite: favorite + Number(item.isFavorite),
        watched: watched + Number(item.isWatched),
        watchlist: watchlist + Number(item.inWatchlist)
      };
    });
  }

  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${navigationLabelCounters.watchlist}</span></a>
      <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${navigationLabelCounters.watched}</span></a>
      <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${navigationLabelCounters.favorite}</span></a>
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};


export default class Navigation {
  constructor(films) {
    this._films = films;
    this._element = null;
  }

  getTemplate() {
    return createNavigationTemplate(this._films);
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
