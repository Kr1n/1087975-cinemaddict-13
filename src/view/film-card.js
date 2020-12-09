import Abstract from "./abstract";

const createFilmCardTemplate = (film) => {
  let template = ``;
  if (film) {
    const {title, rating, genre, releaseDate, poster, description, comments, duration: {hours, minutes}, isWatched, isFavorite, inWatchlist} = film;
    let shortDescription = (description.length > 140) ? description.substring(0, 139) + `...` : description;

    template = `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${releaseDate.year()}</span>
        <span class="film-card__duration">${hours}h ${minutes}m</span>
        <span class="film-card__genre">${genre}</span>
      </p>
      <img src=${poster} alt="" class="film-card__poster">
      <p class="film-card__description">${shortDescription}</p>
      <a class="film-card__comments">${comments.size} comments</a>
      <div class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${inWatchlist ? `film-card__controls-item--active` : ``}" type="button">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${isWatched ? `film-card__controls-item--active` : ``}" type="button">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite ${isFavorite ? `film-card__controls-item--active` : ``}" type="button">Mark as favorite</button>
      </div>
    </article>`;
  }
  return template;
};

export default class FilmCard extends Abstract {
  constructor(film) {
    super();
    this._film = film;

    this._clickPosterHandler = this._clickPosterHandler.bind(this);
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  get film() {
    return this._film;
  }

  _posterClickHandler(evt) {
    evt.preventDefault();
    this._callback.clickPoster();
  }

  setClickPosterHandler(callback) {
    this._callback.clickPoster = callback;
    this.getElement().querySelector(`.film-card__poster`).addEventListener(`click`, this._posterClickHandler);
    this.getElement().querySelector(`.film-card__title`).addEventListener(`click`, this._posterClickHandler);
    this.getElement().querySelector(`.film-card__comments`).addEventListener(`click`, this._posterClickHandler);
  }
}
