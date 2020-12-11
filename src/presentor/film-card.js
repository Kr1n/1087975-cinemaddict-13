import {remove, render, RenderPosition} from "../utils";
import FilmCard from "../view/film-card";
import {popup} from "../view/popup";

export default class filmCard {
  constructor(container) {
    this._container = container;
    this._popup = popup;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._onFilmCardClick = this._onFilmCardClick.bind(this);
    this._closePopup = this._closePopup.bind(this);
  }

  init(film, comments) {
    this._film = film;
    this._comments = comments;
    this._filmCard = new FilmCard(this._film);
    this._filmCard.setClickPosterHandler(this._onFilmCardClick);

    render(this._container, this._filmCard, RenderPosition.BEFOREEND);
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
    this._renderPopup(this._film, popupComments);
  }

  _closePopup() {
    if (this._popup.film) {
      remove(this._popup);
    }
    document.querySelector(`body`).classList.remove(`hide-overflow`);
  }

  _renderPopup(film, popupComments) {

    this._popup.film = film;
    this._popup.comments = popupComments;

    this._container.appendChild(this._popup.getElement());
    this._popup.setCloseButtonHandler(this._closePopup);

    document.addEventListener(`keydown`, this._onEscKeyDown);
    document.querySelector(`body`).classList.add(`hide-overflow`);
  }

}
