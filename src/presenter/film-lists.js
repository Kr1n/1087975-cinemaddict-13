import {remove, render, RenderPosition} from "../utils/common";
import SortButtons from "../view/sort-buttons";
import ShowMore from "../view/show-more";
import FilmsList from "../view/films-list";
import FilmCardPresenter from "./film-card";
import TopRatedFilms from "../view/top-rated-films";
import {FILMS_IN_TOPRATED_LIST, FILMS_IN_MOSTCOMMENTED_LIST, FILMS_PER_PAGE, SortType} from "../consts";
import MostCommentedFilms from "../view/most-commented-films";
import EmptyFilmList from "../view/empty-film-list";
import AllFilms from "../view/all-films";
import {sortFilmDate, sortFilmRating} from "../utils/film.js";

export default class FilmLists {
  constructor(filmListsContainer, filmsModel) {
    this._filmsModel = filmsModel;
    this._filmListsContainer = filmListsContainer;
    this._renderedFilmCount = FILMS_PER_PAGE;
    this._openedPopupId = null;

    this._currentSortType = null;

    this._sortButtons = new SortButtons();
    this._filmsList = new FilmsList();
    this._catalogFilms = new AllFilms();
    this._topRatedFilms = new TopRatedFilms();
    this._mostCommentedFilms = new MostCommentedFilms();
    this._emptyFilmList = new EmptyFilmList();
    this._showMoreBtn = new ShowMore();

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._onShowMoreBtnClick = this._onShowMoreBtnClick.bind(this);
    this._onFilmChange = this._onFilmChange.bind(this);
    this._onPopupOpen = this._onPopupOpen.bind(this);
  }

  init(allComments) {
    this._allComments = allComments;

    this._filmCardPresenters = {};
    this._mostCommentedCardPresenters = {};
    this._topRatedCardPresenters = {};

    this._renderSort();
    render(this._filmListsContainer, this._filmsList, RenderPosition.BEFOREEND);
    this._renderFilmsLists();
  }

  _renderSort() {
    render(this._filmListsContainer, this._sortButtons, RenderPosition.BEFOREEND);
    this._sortButtons.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _getFilms() {
    switch (this._currentSortType) {
      case SortType.DATE:
        return this._filmsModel.getFilms().slice().sort(sortFilmDate);
      case SortType.RATING:
        return this._filmsModel.getFilms().slice().sort(sortFilmRating);
    }

    return this._filmsModel.getFilms();
  }

  _renderFilmsLists() {

    if (this._getFilms().length) {

      this._renderContentFilms();
      this._renderShowMoreButton();
      // this._renderTopRated();
      // this._renderMostCommented();
    } else {
      this._renderEmptyLists();
    }
  }

  _renderContentFilms() {
    const filmCount = this._getFilms().length;
    const films = this._getFilms().slice(0, Math.min(filmCount, FILMS_PER_PAGE));
    const container = this._catalogFilms.getElement().querySelector(`.films-list__container`);
    render(this._filmsList, this._catalogFilms, RenderPosition.BEFOREEND);

    films.forEach((film) => this._renderFilmCard(film, container, this._filmCardPresenters));
  }

  _renderTopRated() {
    const sortForTopRated = (a, b) => b.rating - a.rating;
    const container = this._topRatedFilms.getElement().querySelector(`.films-list__container`);

    render(this._filmsList, this._topRatedFilms, RenderPosition.BEFOREEND);
    this._allFilms
      .slice()
      .sort(sortForTopRated)
      .slice(0, FILMS_IN_TOPRATED_LIST)
      .forEach((film) => {
        this._renderFilmCard(film, container, this._topRatedCardPresenters);
      });
  }

  _renderMostCommented() {
    const sortForMostCommented = (a, b) => b.comments.size - a.comments.size;
    const container = this._mostCommentedFilms.getElement().querySelector(`.films-list__container`);

    render(this._filmsList, this._mostCommentedFilms, RenderPosition.BEFOREEND);
    this._allFilms
      .slice()
      .sort(sortForMostCommented)
      .slice(0, FILMS_IN_MOSTCOMMENTED_LIST)
      .forEach((film) => {
        this._renderFilmCard(film, container, this._mostCommentedCardPresenters);
      });
  }

  _renderEmptyLists() {
    render(this._filmListsContainer, this._emptyFilmList, RenderPosition.BEFOREEND);
  }

  _renderShowMoreButton() {
    if (this._getFilms().length > FILMS_PER_PAGE) {
      render(this._filmsList, this._showMoreBtn, RenderPosition.BEFOREEND);
    }
    this._showMoreBtn.setClickHandler(this._onShowMoreBtnClick);
  }

  _onShowMoreBtnClick() {
    const filmsListContainer = this._filmsList.getElement().querySelector(`.films-list__container`);

    const filmCount = this._getFilms().length;
    const newRenderedTaskCount = Math.min(filmCount, this._renderedFilmCount + FILMS_PER_PAGE);
    const films = this._getFilms().slice(this._renderedFilmCount, newRenderedTaskCount);

    films.forEach((film) => this._renderFilmCard(film, filmsListContainer, this._filmCardPresenters));
    this._renderedFilmCount = newRenderedTaskCount;

    if (this._renderedFilmCount >= filmCount) {
      remove(this._showMoreBtn);
    }
  }

  _renderFilmCard(film, container, filmArray) {
    const filmCardPresenter = new FilmCardPresenter(container, this._onFilmChange, this._onPopupOpen);
    const popupComments = this._allComments.filter((item) => (film).comments.has(item.id));
    filmCardPresenter.init(film, popupComments);
    filmArray[film.id] = filmCardPresenter;
  }

  _onPopupOpen(filmId) {
    if (this._openedPopupId) {
      this._filmCardPresenters[this._openedPopupId].closePopup();
    }
    this._openedPopupId = filmId;
  }

  _onFilmChange(updatedFilm) {
    //    this._allFilms = updateFilm(this._allFilms, updatedFilm);

    if (this._filmCardPresenters[updatedFilm.id] !== undefined) {
      this._filmCardPresenters[updatedFilm.id].init(updatedFilm, this._allComments);
    }
    if (this._mostCommentedCardPresenters[updatedFilm.id] !== undefined) {
      this._mostCommentedCardPresenters[updatedFilm.id].init(updatedFilm, this._allComments);
    }

    if (this._topRatedCardPresenters[updatedFilm.id] !== undefined) {
      this._topRatedCardPresenters[updatedFilm.id].init(updatedFilm, this._allComments);
    }
  }

  _clearFilmList() {
    Object
      .values(this._filmCardPresenters)
      .forEach((presenter) => presenter.destroy());
    this._filmCardPresenters = {};
    this._renderedFilmCount = FILMS_PER_PAGE;
    remove(this._showMoreBtn);
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearFilmList();
    this._renderContentFilms(this._getFilms());
    this._renderShowMoreButton();
  }
}

