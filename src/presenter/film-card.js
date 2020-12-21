import {remove, render, replace, RenderPosition} from "../utils";
import FilmCard from "../view/film-card";
import Popup from "../view/popup";

export default class filmCard {
  constructor(container, changeData, openPopup) {
    this._container = container;
    this._changeData = changeData;
    this._openPopup = openPopup;

    this._popupComponent = null;
    this._filmCardComponent = null;
    this._isPopupOpened = false;

    this.closePopup = this.closePopup.bind(this);
    this._onFavoriteClick = this._onFavoriteClick.bind(this);
    this._onWatchlistClick = this._onWatchlistClick.bind(this);
    this._onWatchedClick = this._onWatchedClick.bind(this);

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._onFilmCardClick = this._onFilmCardClick.bind(this);
    this._onClosePopupClick = this._onClosePopupClick.bind(this);
    this._onFormSubmit = this._onFormSubmit.bind(this);
    this._onDeleteClick = this._onDeleteClick.bind(this);
  }

  init(film, comments) {
    const prevFilmComponent = this._filmCardComponent;
    const prevPopupComponent = this._popupComponent;

    this._film = film;
    this._comments = comments;

    const popupComments = this._comments.filter((item) => (this._film).comments.has(item.id));

    this._filmCardComponent = new FilmCard(this._film);
    this._popupComponent = new Popup(this._film, popupComments);

    this._filmCardComponent.setClickPosterHandler(this._onFilmCardClick);
    this._filmCardComponent.setFavoriteClickHandler(this._onFavoriteClick);
    this._filmCardComponent.setWatchlistClickHandler(this._onWatchlistClick);
    this._filmCardComponent.setWatchedClickHandler(this._onWatchedClick);

    this._popupComponent.setFavoriteClickHandler(this._onFavoriteClick);
    this._popupComponent.setWatchlistClickHandler(this._onWatchlistClick);
    this._popupComponent.setWatchedClickHandler(this._onWatchedClick);
    this._popupComponent.setCloseButtonHandler(this._onClosePopupClick);
    this._popupComponent.setFormSubmitHandler(this._onFormSubmit);
    this._popupComponent.setDeleteClickHandler(this._onDeleteClick);


    if (prevFilmComponent === null || prevPopupComponent === null) {
      render(this._container, this._filmCardComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._filmCardComponent, prevFilmComponent);

    if (this._isPopupOpened) {
      replace(this._popupComponent, prevPopupComponent);
    }

    remove(prevFilmComponent);
    remove(prevPopupComponent);
  }

  getPopupID() {

  }

  _onDeleteClick() {
    console.log(`deleteClick`);
  }

  _onFormSubmit() {
    console.log(`onFormSubmit`);
  }

  _onFilmCardClick() {
    // this._onClosePopupClick();
    this._showPopup();
  }

  _onEscKeyDown(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this.closePopup();
    }
  }

  _onClosePopupClick() {
    this.closePopup();
  }

  closePopup() {
    if (!this._isPopupOpened) {
      return;
    }
    const bodyContainer = document.querySelector(`body`);

    bodyContainer.removeChild(this._popupComponent.getElement());
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    document.querySelector(`body`).classList.remove(`hide-overflow`);
    this._isPopupOpened = false;
  }

  _showPopup() {
    // todo
    // почему не работает
    if (this._isPopupOpened) {
      return;
    }
    this._openPopup(this._film.id);
    const bodyContainer = document.querySelector(`body`);

    bodyContainer.appendChild(this._popupComponent.getElement());
    document.addEventListener(`keydown`, this._onEscKeyDown);
    document.querySelector(`body`).classList.add(`hide-overflow`);
    this._isPopupOpened = true;
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

  destroy() {
    remove(this._popupComponent);
    remove(this._filmCardComponent);
  }
}
