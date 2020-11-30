import {createElement} from "../utils.js";

const createProfileTemplate = (films) => {
  let watchedCount = 0;

  if (films) {
    watchedCount = films.reduce((watched, item) => watched + Number(item.isWatched), 0);
  }

  return `<section class="header__profile profile">
  <p class="profile__rating">${getRankLabel(watchedCount)}</p>
  <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
</section>`;
};

const getRankLabel = (watchedCount = 0) => {
  if (watchedCount > 1 && watchedCount <= 10) {
    return `novice`;
  } else if (watchedCount > 10 && watchedCount <= 20) {
    return `fan`;
  } else if (watchedCount > 20) {
    return `movie buff`;
  } else {
    return ``;
  }
};

export default class Profile {
  constructor(films) {
    this._films = films;
    this._element = null;
  }

  getTemplate() {
    return createProfileTemplate(this._films);
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
