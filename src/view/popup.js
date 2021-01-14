import dayjs from "dayjs";
import Abstract from "./abstract";

const createCommentsTemplate = (data) => {
  const {comments} = data;

  return `<div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.size}</span></h3>

        <ul class="film-details__comments-list">

        </ul>
      </section>
    </div>`;
};

const createFilmDetailsTemplate = (data) => {
  const {releaseDate, poster, ageLimit, title, rating, director, writers, actors, duration: {hours, minutes}, country, genres, description, inWatchlist, isFavorite, isWatched} = data;

  const date = dayjs(releaseDate);

  const genresElement = Array.from(genres).reduce(
      (accumulator, item) => `${accumulator}<span class="film-details__genre">${item}</span>`,
      ``);

  return `<div class="film-details__top-container">
    <div class="film-details__close">
      <button class="film-details__close-btn" type="button">close</button>
    </div>
    <div class="film-details__info-wrap">
      <div class="film-details__poster">
        <img class="film-details__poster-img" src=${poster} alt="">

          <p class="film-details__age">${ageLimit}</p>
      </div>

      <div class="film-details__info">
        <div class="film-details__info-head">
          <div class="film-details__title-wrap">
            <h3 class="film-details__title">${title}</h3>
            <p class="film-details__title-original">Original: ${title}</p>
          </div>

          <div class="film-details__rating">
            <p class="film-details__total-rating">${rating}</p>
          </div>
        </div>

        <table class="film-details__table">
          <tr class="film-details__row">
            <td class="film-details__term">Director</td>
            <td class="film-details__cell">${director}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Writers</td>
            <td class="film-details__cell">${writers}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Actors</td>
            <td class="film-details__cell">${actors}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Release Date</td>
            <td class="film-details__cell">${date.format(`D MMMM YYYY`)}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Runtime</td>
            <td class="film-details__cell">${hours}h ${minutes}m</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Country</td>
            <td class="film-details__cell">${country}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">${(genres.size > 1) ? `Genres` : `Genre`}</td>
            <td class="film-details__cell">${genresElement}</td>
          </tr>
        </table>

        <p class="film-details__film-description">
          ${description}
        </p>
      </div>
    </div>

    <section class="film-details__controls">
      <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist"
             ${inWatchlist ? `checked` : ``}>
        <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist ">Add
          to watchlist</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched"
               ${isWatched ? `checked` : ``}>
          <label for="watched" class="film-details__control-label film-details__control-label--watched ">Already
            watched</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite"
                 ${isFavorite ? `checked` : ``}>
            <label for="favorite" class="film-details__control-label film-details__control-label--favorite ">Add
              to favorites</label>
    </section>
  </div>`;
};

const createPopupTemplate = (data) => {
  return `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    ${createFilmDetailsTemplate(data)}
    ${createCommentsTemplate(data)}
  </form>
</section>`;
};

export default class Popup extends Abstract {
  constructor(film) {
    super();

    this._film = film;
    this._callbacks = [];

    this._closeButtonHandler = this._closeButtonHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
  }

  getScrollTop() {
    return this.getElement().scrollTop;
  }

  setScrollTop(value) {
    this.getElement().scrollTop = value;
  }

  _closeButtonHandler(evt) {
    evt.preventDefault();
    this._callbacks.closeButtonClick();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callbacks.favoriteClick();
  }

  _watchedClickHandler(evt) {
    evt.preventDefault();
    this._callbacks.watchedClickHandler();
  }

  _watchlistClickHandler(evt) {
    evt.preventDefault();
    this._callbacks.watchlistClickHandler();
  }


  setCloseButtonHandler(callback) {
    this._callbacks.closeButtonClick = callback;
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, this._closeButtonHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callbacks.favoriteClick = callback;
    this.getElement().querySelector(`.film-details__control-label--favorite`).addEventListener(`click`, this._favoriteClickHandler);
  }

  setWatchedClickHandler(callback) {
    this._callbacks.watchedClickHandler = callback;
    this.getElement().querySelector(`.film-details__control-label--watched`).addEventListener(`click`, this._watchedClickHandler);
  }

  setWatchlistClickHandler(callback) {
    this._callbacks.watchlistClickHandler = callback;
    this.getElement().querySelector(`.film-details__control-label--watchlist`).addEventListener(`click`, this._watchlistClickHandler);
  }

  getTemplate() {
    return createPopupTemplate(this._film);
  }
}
