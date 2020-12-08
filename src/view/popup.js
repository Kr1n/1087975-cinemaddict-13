import Comments from "./comments";
import Abstract from "./abstract";

const createPopupTemplate = (film) => {
  const {releaseDate, poster, ageLimit, title, rating, director, writers, actors, duration: {hours, minutes}, country, genres, description, inWatchlist, isFavorite, isWatched} = film;

  const genresElement = Array.from(genres).reduce(
      (accumulator, item) => accumulator + `<span class="film-details__genre">` + item + `</span>`,
      ``);

  return `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
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
              <td class="film-details__cell">${releaseDate.format(`D MMMM YYYY`)}</td>
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
        <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${inWatchlist ? `checked` : ``}>
          <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist ">Add to watchlist</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${isWatched ? `checked` : ``}>
            <label for="watched" class="film-details__control-label film-details__control-label--watched ">Already watched</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${isFavorite ? `checked` : ``}>
              <label for="favorite" class="film-details__control-label film-details__control-label--favorite ">Add to favorites</label>
      </section>
    </div>
    <div class="film-details__bottom-container">
    </div>
  </form>
</section>`;
};

export default class Popup extends Abstract {
  constructor(film, comments) {
    super();
    this._film = film;
    this._comments = comments;

    this._closeButtonHandler = this._closeButtonHandler.bind(this);
  }

  get film() {
    return this._film;
  }

  set film(newFilm) {
    this._film = newFilm;
  }

  get comments() {
    return this._comments;
  }

  set comments(newComments) {
    this._comments = newComments;
  }

  getTemplate() {
    return createPopupTemplate(this._film);
  }

  getElement() {
    const commentsContainer = super.getElement().querySelector(`.film-details__bottom-container`);
    const commentsElement = new Comments(this._comments);
    commentsContainer.appendChild(commentsElement.getElement());

    return super.getElement();
  }

  _closeButtonHandler(evt) {
    evt.preventDefault();
    this._callback.closeButtonClick();
  }

  setCloseButtonHandler(callback) {
    this._callback.closeButtonClick = callback;
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, this._closeButtonHandler);
  }

  removeElement() {
    super.removeElement();
    this.film = null;
    this.comments = null;
  }
}
