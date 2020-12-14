import {remove, render, updateFilm, RenderPosition} from "../utils";
import SortButtons from "../view/sort-buttons";
import ShowMore from "../view/show-more";
import FilmsList from "../view/films-list";
import FilmCardPresenter from "./film-card";
import TopRatedFilms from "../view/top-rated-films";
import {EXTRA_CARD_COUNT} from "../consts";
import MostCommentedFilms from "../view/most-commented-films";
import EmptyFilmList from "../view/empty-film-list";
import AllFilms from "../view/all-films";

export const FILM_SHOWMORE_COUNT = 5;

export default class FilmLists {
  constructor(filmListsContainer) {
    this._filmListsContainer = filmListsContainer;
    this._renderedFilmCount = FILM_SHOWMORE_COUNT;

    this._sortButtons = new SortButtons();
    this._filmsList = new FilmsList();
    this._allFilmsContainer = new AllFilms();
    this._topRatedFilmsContainer = new TopRatedFilms();
    this._mostCommentedFilmsContainer = new MostCommentedFilms();
    this._emptyFilmList = new EmptyFilmList();
    this._showMoreBtn = new ShowMore();

    this._onShowMoreBtnClicked = this._onShowMoreBtnClicked.bind(this);
    this._onFilmChanged = this._onFilmChanged.bind(this);
  }

  init(allFilms, allComments) {
    this._allFilms = allFilms.slice();
    this._allComments = allComments;
    this._contentFilmCardPresenters = {};
    this._mostCommentedCardPresenters = {};
    this._topRatedCardPresenters = {};

    render(this._filmListsContainer, this._sortButtons, RenderPosition.BEFOREEND);
    render(this._filmListsContainer, this._filmsList, RenderPosition.BEFOREEND);

    this._renderFilmsLists();
  }

  _renderFilmsLists() {
    if (this._allFilms.length) {
      this._renderContentFilms();
      this._renderShowMoreButton();
      this._renderTopRated();
      this._renderMostCommented();
    } else {
      this._renderEmptyLists();
    }
  }

  _renderContentFilms() {
    render(this._filmsList, this._allFilmsContainer, RenderPosition.BEFOREEND);
    this._allFilms.slice(0, this._renderedFilmCount).forEach((film) => {
      this._renderFilmCard(
          film,
          this._allFilmsContainer.getElement().querySelector(`.films-list__container`),
          this._contentFilmCardPresenters);
    });
  }

  _renderTopRated() {
    const sortForTopRated = (a, b) => b.rating - a.rating;

    render(this._filmsList, this._topRatedFilmsContainer, RenderPosition.BEFOREEND);
    this._allFilms.slice().sort(sortForTopRated).slice(0, EXTRA_CARD_COUNT).forEach((film) => {
      this._renderFilmCard(
          film,
          this._topRatedFilmsContainer.getElement().querySelector(`.films-list__container`),
          this._topRatedCardPresenters);
    });
  }

  _renderMostCommented() {

    const sortForMostCommented = (a, b) => b.comments.size - a.comments.size;

    render(this._filmsList, this._mostCommentedFilmsContainer, RenderPosition.BEFOREEND);
    this._allFilms.slice().sort(sortForMostCommented).slice(0, EXTRA_CARD_COUNT).forEach((film) => {
      this._renderFilmCard(
          film,
          this._mostCommentedFilmsContainer.getElement().querySelector(`.films-list__container`),
          this._mostCommentedCardPresenters);
    });
  }

  _renderEmptyLists() {
    render(this._filmListsContainer, this._emptyFilmList, RenderPosition.BEFOREEND);
  }

  _renderShowMoreButton() {
    if (this._allFilms.length > FILM_SHOWMORE_COUNT) {
      render(this._filmsList, this._showMoreBtn, RenderPosition.BEFOREEND);
    }
    this._showMoreBtn.setClickHandler(this._onShowMoreBtnClicked);
  }

  _onShowMoreBtnClicked() {
    this._allFilms
      .slice(this._renderedFilmCount, this._renderedFilmCount + FILM_SHOWMORE_COUNT)
      .forEach((film) => this._renderFilmCard(
          film,
          this._filmsList.getElement().querySelector(`.films-list__container`),
          this._contentFilmCardPresenters));

    this._renderedFilmCount += FILM_SHOWMORE_COUNT;

    if (this._renderedFilmCount >= this._allFilms.length) {
      remove(this._showMoreBtn);
    }
  }

  _renderFilmCard(film, container, filmArray) {
    const filmCardPresenter = new FilmCardPresenter(container, this._onFilmChanged);
    filmCardPresenter.init(film, this._allComments);
    filmArray[film.id] = filmCardPresenter;
  }

  _onFilmChanged(updatedFilm) {
    this._allFilms = updateFilm(this._allFilms, updatedFilm);

    if (this._contentFilmCardPresenters[updatedFilm.id] !== undefined) {
      this._contentFilmCardPresenters[updatedFilm.id].init(updatedFilm, this._allComments);
    }
    if (this._mostCommentedCardPresenters[updatedFilm.id] !== undefined) {
      this._mostCommentedCardPresenters[updatedFilm.id].init(updatedFilm, this._allComments);
    }

    if (this._topRatedCardPresenters[updatedFilm.id] !== undefined) {
      this._topRatedCardPresenters[updatedFilm.id].init(updatedFilm, this._allComments);
    }
  }
}

