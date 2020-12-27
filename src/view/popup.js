import Smart from "./smart";

const createCommentsTemplate = (data) => {
  const commentReducer = (accumulator, {id, message, author, date, emoji}) => {
    accumulator += `
      <li class="film-details__comment">
        <span class="film-details__comment-emoji">
          <img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">
        </span>
        <div>
          <p class="film-details__comment-text">${message}</p>
          <p class="film-details__comment-info">
            <span class="film-details__comment-author">${author}</span>
            <span class="film-details__comment-day">${date.format(`DD/MM/YYYY HH:mm`)}</span>
            <button class="film-details__comment-delete" data-comment-id="${id}">Delete</button>
          </p>
        </div>
      </li>
    `;
    return accumulator;
  };

  const {_comments, selectedEmoji, newCommentText} = data;
  const commentsElements = _comments.reduce(commentReducer, ``);

  return `<div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${_comments.length}</span></h3>

        <ul class="film-details__comments-list">
          ${commentsElements}
        </ul>

        <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label">
          ${selectedEmoji ? `<img src="images/emoji/${selectedEmoji}.png" width="55" height="55" alt="emoji-${selectedEmoji}">` : ``}
        </div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${newCommentText}</textarea>
          </label>

          <div class="film-details__emoji-list">
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
              <label class="film-details__emoji-label" for="emoji-smile">
                <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
                <label class="film-details__emoji-label" for="emoji-sleeping">
                  <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
                  <label class="film-details__emoji-label" for="emoji-puke">
                    <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                  </label>

                  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
                    <label class="film-details__emoji-label" for="emoji-angry">
                      <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
                    </label>
          </div>
        </div>
      </section>
    </div>`;
};

const createFilmDetailsTemplate = (data) => {
  const {releaseDate, poster, ageLimit, title, rating, director, writers, actors, duration: {hours, minutes}, country, genres, description, inWatchlist, isFavorite, isWatched} = data;

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

export default class Popup extends Smart {
  constructor(film, comments) {
    super();

    this._data = Popup.convertFilmToData(film, comments);
    this._callbacks = [];
    this._deleteClickHandler = this._deleteClickHandler.bind(this);
    this._closeButtonHandler = this._closeButtonHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);

    this._commentTextInputHandler = this._commentTextInputHandler.bind(this);
    this._emojiChangeHandler = this._emojiChangeHandler.bind(this);

    this._setInnerHandlers();
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector(`.film-details__emoji-list`)
      .addEventListener(`change`, this._emojiChangeHandler);

    this.getElement()
      .querySelector(`.film-details__comment-input`)
      .addEventListener(`input`, this._commentTextInputHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setFormSubmitHandler(this._callbacks.formSubmit);
    this.setCloseButtonHandler(this._callbacks.closeButtonClick);
    this.setFavoriteClickHandler(this._callbacks.favoriteClick);
    this.setWatchedClickHandler(this._callbacks.watchedClickHandler);
    this.setWatchlistClickHandler(this._callbacks.watchlistClickHandler);
    this.setDeleteClickHandler(this._callbacks.deleteClick);
  }

  _commentTextInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      newCommentText: evt.target.value
    }, true);
  }

  _emojiChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      selectedEmoji: evt.target.value
    });
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

  _deleteClickHandler(evt) {
    evt.preventDefault();
    const comment = this._data._comments.find((item) => item.id === Number(evt.target.dataset.commentId));
    const film = Popup.convertDataToFilm(this._data);

    this._callbacks.deleteClick({comment, film});
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callbacks.formSubmit();
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

  setDeleteClickHandler(callback) {
    this._callbacks.deleteClick = callback;
    const deleteButtons = this.getElement().querySelectorAll(`.film-details__comment-delete`);

    for (const button of deleteButtons) {
      button.addEventListener(`click`, this._deleteClickHandler);
    }
  }

  setFormSubmitHandler(callback) {
    this._callbacks.formSubmit = callback;
    this.getElement().querySelector(`form`).addEventListener(`submit`, this._formSubmitHandler);
  }

  getTemplate() {
    return createPopupTemplate(this._data);
  }

  static convertFilmToData(film, _comments) {
    return Object.assign(
        {},
        film,
        {
          _comments,
          selectedEmoji: null,
          newCommentText: ``
        }
    );
  }

  static convertDataToFilm(data) {
    data = Object.assign({}, data);

    delete data._comments;
    delete data.selectedEmoji;
    delete data.newCommentText;

    return data;
  }
}
