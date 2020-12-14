import {remove, render, replace, RenderPosition} from "../utils";
import FilmCard from "../view/film-card";
import {popup} from "../view/popup";

export default class filmCard {
  constructor(container, changeData) {
    this._container = container;
    this._changeData = changeData;

    this._popup = popup;
    this._filmCard = null;

    this._onFavoriteClick = this._onFavoriteClick.bind(this);
    this._onWatchlistClick = this._onWatchlistClick.bind(this);
    this._onWatchedClick = this._onWatchedClick.bind(this);

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._onFilmCardClick = this._onFilmCardClick.bind(this);
    this._closePopup = this._closePopup.bind(this);
  }

  init(film, comments) {
    this._film = film;
    this._comments = comments;

    const prevFilmComponent = this._filmCard;

    this._filmCard = new FilmCard(this._film);
    this._filmCard.setClickPosterHandler(this._onFilmCardClick);

    this._filmCard.setFavoriteClickHandler(this._onFavoriteClick);
    this._filmCard.setWatchlistClickHandler(this._onWatchlistClick);
    this._filmCard.setWatchedClickHandler(this._onWatchedClick);

    if (prevFilmComponent === null) {
      render(this._container, this._filmCard, RenderPosition.BEFOREEND);
      return;
    }
    replace(this._filmCard, prevFilmComponent);
  }

  _onEscKeyDown(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._closePopup();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

  _onFilmCardClick() {
    const popupComments = this._comments.filter((item) => (this._film).comments.has(item.id));
    this._closePopup();
    this._showPopup(this._film, popupComments);
  }

  _closePopup() {
    if (this._popup.film) {
      remove(this._popup);
    }
    document.querySelector(`body`).classList.remove(`hide-overflow`);
  }

  _showPopup(film, popupComments) {
    const bodyContainer = document.querySelector(`body`);

    this._popup.film = film;
    this._popup.comments = popupComments;

    this._popup.setFavoriteClickHandler(this._onFavoriteClick);
    this._popup.setWatchlistClickHandler(this._onWatchlistClick);
    this._popup.setWatchedClickHandler(this._onWatchedClick);

    bodyContainer.appendChild(this._popup.getElement());
    this._popup.setCloseButtonHandler(this._closePopup);


    document.addEventListener(`keydown`, this._onEscKeyDown);
    document.querySelector(`body`).classList.add(`hide-overflow`);
  }

  _onFavoriteClick() {
    this._changeData(
        Object.assign(
            {},
            this._film,
            {
              isFavorite: !this._film.isFavorite
            }
        )
    );
  }

  _onWatchedClick() {
    this._changeData(
        Object.assign(
            {},
            this._film,
            {
              isWatched: !this._film.isWatched
            }
        )
    );
  }

  _onWatchlistClick() {
    this._changeData(
        Object.assign(
            {},
            this._film,
            {
              inWatchlist: !this._film.inWatchlist
            }
        )
    );
  }

}
