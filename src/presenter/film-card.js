import {remove, render, replace, RenderPosition} from "../utils/common";
import FilmCard from "../view/film-card";
import Popup from "../view/popup";
import {UserAction, UpdateType} from "../consts.js";
import dayjs from "dayjs";
import Comments from "../view/comments";


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
    this._onCtrlEnterKeyDown = this._onCtrlEnterKeyDown.bind(this);
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
    this._commentsComponent = new Comments();

    this._filmCardComponent.setClickPosterHandler(this._onFilmCardClick);
    this._filmCardComponent.setFavoriteClickHandler(this._onFavoriteClick);
    this._filmCardComponent.setWatchlistClickHandler(this._onWatchlistClick);
    this._filmCardComponent.setWatchedClickHandler(this._onWatchedClick);

    this._popupComponent.setFavoriteClickHandler(this._onFavoriteClick);
    this._popupComponent.setWatchlistClickHandler(this._onWatchlistClick);
    this._popupComponent.setWatchedClickHandler(this._onWatchedClick);
    this._popupComponent.setCloseButtonHandler(this._onClosePopupClick);
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

  isPopupOpened() {
    return this._isPopupOpened;
  }

  closePopup() {
    if (!this._isPopupOpened) {
      return;
    }
    this._isPopupOpened = false;

    const bodyContainer = document.querySelector(`body`);
    bodyContainer.removeChild(this._popupComponent.getElement());
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    document.removeEventListener(`keydown`, this._onCtrlEnterKeyDown);
    document.querySelector(`body`).classList.remove(`hide-overflow`);
  }

  showPopup() {
    if (this._isPopupOpened) {
      return;
    }
    this._openPopup(this._film.id);

    const bodyContainer = document.querySelector(`body`);
    bodyContainer.appendChild(this._popupComponent.getElement());
    document.addEventListener(`keydown`, this._onEscKeyDown);
    document.addEventListener(`keydown`, this._onCtrlEnterKeyDown);
    document.querySelector(`body`).classList.add(`hide-overflow`);
    this._isPopupOpened = true;
    this._popupComponent.restoreScrollTop();
  }

  getScrollTop() {
    return this._popupComponent.getScrollTop();
  }

  setScrollTop(value) {
    this._popupComponent.setScrollTop(value);
  }

  _onDeleteClick({comment, film}) {
    this._changeData(
        UserAction.DELETE_COMMENT,
        UpdateType.MINOR,
        {comment, film}
    );
  }

  _onCtrlEnterKeyDown(evt) {
    if (evt.ctrlKey && evt.key === `Enter`) {
      const message = this._popupComponent.getElement().querySelector(`.film-details__comment-input`);
      const emoji = this._popupComponent.getElement().querySelector(`.film-details__emoji-item[checked]`);
      if (message.value !== `` && emoji) {
        this._changeData(
            UserAction.ADD_COMMENT,
            UpdateType.MINOR,
            Object.assign({
              comment: {
                id: Date.now(),
                message: message.value,
                author: `author`,
                date: dayjs(),
                emoji: emoji.value,
              },
              film: this._film
            })
        );
      }
    }
  }

  _onFilmCardClick() {
    this.showPopup();
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

  _onFavoriteClick() {
    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
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
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
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
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
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
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    document.removeEventListener(`keydown`, this._onCtrlEnterKeyDown);
    remove(this._filmCardComponent);
  }
}
