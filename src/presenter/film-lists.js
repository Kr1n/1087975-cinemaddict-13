import {remove, render, RenderPosition} from "../utils/common";
import SortButtons from "../view/sort-buttons";
import ShowMore from "../view/show-more";
import FilmsList from "../view/films-list";
import FilmCardPresenter, {State as FilmPresenterViewState} from "./film-card";
import TopRatedFilms from "../view/top-rated-films";
import {FILMS_IN_TOPRATED_LIST, FILMS_IN_MOSTCOMMENTED_LIST, FILMS_PER_PAGE, SortType, UpdateType, UserAction} from "../consts";
import MostCommentedFilms from "../view/most-commented-films";
import EmptyFilmList from "../view/empty-film-list";
import AllFilms from "../view/all-films";
import {sortFilmDate, sortFilmRating} from "../utils/films.js";
import {filter} from "../utils/filter.js";
import Profile from "../view/profile";
import FooterStatistics from "../view/footer";
import Loading from "../view/loading";

export default class FilmLists {
  constructor(filmListsContainer, filmsModel, commentsModel, filterModel, api) {
    this._filmsModel = filmsModel;
    this._commentsModel = commentsModel;
    this._filterModel = filterModel;
    this._filmListsContainer = filmListsContainer;
    this._api = api;
    this._renderedFilmCount = FILMS_PER_PAGE;
    this._openedPopupId = null;

    this._currentSortType = SortType.DEFAULT;
    this._sortComponent = null;
    this._showMoreButtonComponent = null;

    this._filmsList = new FilmsList();
    this._catalogFilms = new AllFilms();
    this._topRatedFilms = new TopRatedFilms();
    this._mostCommentedFilms = new MostCommentedFilms();
    this._emptyFilmList = new EmptyFilmList();
    this._loadingComponent = new Loading();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._onShowMoreBtnClick = this._onShowMoreBtnClick.bind(this);
    this._popupOpenHandler = this._popupOpenHandler.bind(this);
    this._popupCloseHandler = this._popupCloseHandler.bind(this);
    this._requestComments = this._requestComments.bind(this);
  }

  init() {
    this._filmCardPresenters = {};
    this._mostCommentedCardPresenters = {};
    this._topRatedCardPresenters = {};
    this._isLoading = true;

    this._filmsModel.addObserver(this._handleModelEvent);
    this._commentsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._renderFilmsLists();
  }

  _getFilms() {
    const filterType = this._filterModel.getFilter();
    const films = this._filmsModel.getFilms();
    const filtredFilms = filter[filterType](films);

    switch (this._currentSortType) {
      case SortType.DATE:
        return filtredFilms.slice().sort(sortFilmDate);
      case SortType.RATING:
        return filtredFilms.slice().sort(sortFilmRating);
    }

    return filtredFilms;
  }

  _getComments() {
    return this._commentsModel.getComments();
  }

  _renderFilmsLists() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    const films = this._getFilms();

    this._renderProfile();
    this._renderSort();
    render(this._filmListsContainer, this._filmsList, RenderPosition.BEFOREEND);

    if (films.length) {

      this._renderContentFilms();
      if (films.length > FILMS_PER_PAGE && (films.length > this._renderedFilmCount)) {
        this._renderShowMoreButton();
      }

      this._renderTopRated();
      this._renderMostCommented();

      const filmPresentersArray = this._getFilmPresentersArrayForPopup();
      if (filmPresentersArray) {
        filmPresentersArray[this._openedPopupId].showPopup();
      }

    } else {
      this._renderEmptyLists();
    }

    this._renderFooterStatistic();
  }

  _clearFilmList({resetRenderedFilmCount = false, resetSortType = false} = {}) {

    Object
      .values(this._filmCardPresenters)
      .forEach((presenter) => presenter.destroy());
    this._filmCardPresenters = {};

    Object
      .values(this._mostCommentedCardPresenters)
      .forEach((presenter) => presenter.destroy());
    this._mostCommentedCardPresenters = {};

    Object
      .values(this._topRatedCardPresenters)
      .forEach((presenter) => presenter.destroy());
    this._topRatedCardPresenters = {};

    remove(this._showMoreButtonComponent);
    remove(this._sortComponent);
    remove(this._footerStatistics);
    remove(this._profile);
    remove(this._emptyFilmList);

    if (resetRenderedFilmCount) {
      this._renderedFilmCount = FILMS_PER_PAGE;
      this._openedPopupId = null;
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderLoading() {
    render(this._filmListsContainer, this._loadingComponent, RenderPosition.BEFOREEND);
  }

  _renderProfile() {
    const films = this._filmsModel.getFilms();
    this._profile = new Profile(films);

    const headerContainer = document.querySelector(`.header`);

    if (films.length) {
      render(headerContainer, this._profile, RenderPosition.BEFOREEND);
    }
  }

  _renderFooterStatistic() {
    const films = this._filmsModel.getFilms();
    this._footerStatistics = new FooterStatistics(films);

    const footerStatisticsContainer = document.querySelector(`.footer`);
    render(footerStatisticsContainer, this._footerStatistics, RenderPosition.BEFOREEND);
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }
    this._sortComponent = new SortButtons(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._filmListsContainer, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _renderContentFilms() {
    const filmCount = this._getFilms().length;
    const filmsToRender = this._getFilms().slice(0, Math.min(filmCount, this._renderedFilmCount));
    const container = this._catalogFilms.getElement().querySelector(`.films-list__container`);

    render(this._filmsList, this._catalogFilms, RenderPosition.BEFOREEND);
    filmsToRender.forEach((film) => this._renderFilmCard(film, container, this._filmCardPresenters));
  }

  _renderTopRated() {
    const sortForTopRated = (a, b) => b.rating - a.rating;
    const container = this._topRatedFilms.getElement().querySelector(`.films-list__container`);
    const allFilms = this._filmsModel.getFilms();

    render(this._filmsList, this._topRatedFilms, RenderPosition.BEFOREEND);
    allFilms
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
    const allFilms = this._filmsModel.getFilms();

    render(this._filmsList, this._mostCommentedFilms, RenderPosition.BEFOREEND);
    allFilms
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
    if (this._showMoreButtonComponent !== null) {
      this._showMoreButtonComponent = null;
    }

    this._showMoreButtonComponent = new ShowMore();
    this._showMoreButtonComponent.setClickHandler(this._onShowMoreBtnClick);

    render(this._filmsList, this._showMoreButtonComponent, RenderPosition.BEFOREEND);
  }

  _renderFilmCard(film, container, filmArray) {
    const filmCardPresenter = new FilmCardPresenter(container, this._handleViewAction, this._requestComments, this._popupOpenHandler, this._popupCloseHandler);

    filmCardPresenter.init(film);
    filmArray[film.id] = filmCardPresenter;
  }

  _onShowMoreBtnClick() {
    const filmsListContainer = this._filmsList.getElement().querySelector(`.films-list__container`);

    const filmCount = this._getFilms().length;
    const newRenderedTaskCount = Math.min(filmCount, this._renderedFilmCount + FILMS_PER_PAGE);
    const films = this._getFilms().slice(this._renderedFilmCount, newRenderedTaskCount);

    films.forEach((film) => this._renderFilmCard(film, filmsListContainer, this._filmCardPresenters));
    this._renderedFilmCount = newRenderedTaskCount;

    if (this._renderedFilmCount >= filmCount) {
      remove(this._showMoreButtonComponent);
    }
  }

  _popupCloseHandler(filmId) {
    if (this._filmCardPresenters[filmId]) {
      this._filmCardPresenters[filmId].closePopup();
    } else
    if (this._mostCommentedCardPresenters[filmId]) {
      this._mostCommentedCardPresenters[filmId].closePopup();
    } else
    if (this._topRatedCardPresenters[filmId]) {
      this._topRatedCardPresenters[filmId].closePopup();
    }

    this._openedPopupId = null;
  }

  _popupOpenHandler(filmId) {
    this._popupCloseHandler(this._openedPopupId);

    this._openedPopupId = filmId;

    if (this._filmCardPresenters[filmId]) {
      this._filmCardPresenters[filmId].showPopup();
    } else
    if (this._mostCommentedCardPresenters[filmId]) {
      this._mostCommentedCardPresenters[filmId].showPopup();
    } else
    if (this._topRatedCardPresenters[filmId]) {
      this._topRatedCardPresenters[filmId].showPopup();
    }
  }

  _requestComments(filmId) {
    const filmPresentersArray = this._getFilmPresentersArrayForPopup();
    this._api.getComments(filmId)
      .then((response) => this._commentsModel.setComments(UpdateType.PATCH, {comments: response, id: filmId}))
      .catch(() => filmPresentersArray[filmId].setViewState(FilmPresenterViewState.ABORTING));
  }

  show() {
    this._sortComponent.getElement().classList.remove(`visually-hidden`);
    this._filmsList.getElement().classList.remove(`visually-hidden`);
  }

  hide() {
    this._sortComponent.getElement().classList.add(`visually-hidden`);
    this._filmsList.getElement().classList.add(`visually-hidden`);
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearFilmList();
    this._renderFilmsLists();
  }

  _handleViewAction(actionType, updateType, update) {
    const filmPresentersArray = this._getFilmPresentersArrayForPopup();
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this._api.updateFilm(update)
          .then((response) => this._filmsModel.updateFilm(updateType, response))
          .catch(() => filmPresentersArray[update.id].setViewState(FilmPresenterViewState.ABORTING));
        break;

      case UserAction.ADD_COMMENT:
        filmPresentersArray[update.id].setViewState(FilmPresenterViewState.ADDING);
        this._api.addComment(update.comment, update.id)
          .then((response) => this._filmsModel.updateFilm(updateType, response))
          .catch(() => filmPresentersArray[update.id].setViewState(FilmPresenterViewState.ABORTING));
        break;

      case UserAction.DELETE_COMMENT:
        filmPresentersArray[update.id].setViewState(FilmPresenterViewState.DELETING, update.id);
        this._api.deleteComment(update.comment.id)
          .then(() => this._api.getFilms())
          .then((response) => this._filmsModel.setFilms(UpdateType.MINOR, response))
          .catch(() => filmPresentersArray[update.id].setViewState(FilmPresenterViewState.ABORTING));
        break;
    }
  }

  _getFilmPresentersArrayForPopup() {
    if (this._filmCardPresenters[this._openedPopupId]) {
      return this._filmCardPresenters;
    }

    if (this._mostCommentedCardPresenters[this._openedPopupId]) {
      return this._mostCommentedCardPresenters;
    }

    if (this._topRatedCardPresenters[this._openedPopupId]) {
      return this._topRatedCardPresenters;
    }
    return null;
  }

  _handleModelEvent(updateType, data) {
    let filmPresentersArray = null;
    switch (updateType) {
      case UpdateType.PATCH:
        filmPresentersArray = this._getFilmPresentersArrayForPopup();
        if (filmPresentersArray && filmPresentersArray[this._openedPopupId].isPopupOpened()) {
          this._popupScrollTop = filmPresentersArray[this._openedPopupId].getScrollTop();
          const film = filmPresentersArray[data.id].getFilm();
          filmPresentersArray[data.id].init(film, this._getComments());
        }

        this._restoreScrollTop();

        break;
      case UpdateType.MINOR:
        filmPresentersArray = this._getFilmPresentersArrayForPopup();
        if (filmPresentersArray && filmPresentersArray[this._openedPopupId].isPopupOpened()) {
          this._popupScrollTop = filmPresentersArray[this._openedPopupId].getScrollTop();
          filmPresentersArray[this._openedPopupId].closePopup();
        }
        this._clearFilmList();
        this._renderFilmsLists();
        this._restoreScrollTop();
        break;
      case UpdateType.MAJOR:
        filmPresentersArray = this._getFilmPresentersArrayForPopup();
        if (filmPresentersArray && filmPresentersArray[this._openedPopupId].isPopupOpened()) {
          filmPresentersArray[this._openedPopupId].closePopup();
        }
        this._clearFilmList({resetRenderedFilmCount: true, resetSortType: true});
        this._renderFilmsLists();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderFilmsLists();
        break;
    }
  }

  _restoreScrollTop() {
    const filmPresentersArray = this._getFilmPresentersArrayForPopup();
    if (filmPresentersArray) {
      filmPresentersArray[this._openedPopupId].setScrollTop(this._popupScrollTop);
    }
  }
}

