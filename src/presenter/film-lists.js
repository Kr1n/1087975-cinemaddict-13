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
import Statistic from "../view/statistic";
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
    this._popupScrollTop = 0;

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
    this._handlerStatisticClick = this._handlerStatisticClick.bind(this);
    this._onShowMoreBtnClick = this._onShowMoreBtnClick.bind(this);
    this._onPopupOpen = this._onPopupOpen.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._commentsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init(navigation) {
    this._navigation = navigation;
    this._filmCardPresenters = {};
    this._mostCommentedCardPresenters = {};
    this._topRatedCardPresenters = {};
    this._isLoading = true;

    this._navigation.setStatisticsClickHandler(this._handlerStatisticClick);

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

      if (films.length > FILMS_PER_PAGE) {
        this._renderShowMoreButton();
      }

    } else {
      this._renderEmptyLists();
    }

    this._renderFooterStatistic();
  }

  _clearFilmList({resetRenderedFilmCount = false, resetSortType = false} = {}) {

    if (this._isPopupOpened()) {
      this._popupScrollTop = this._filmCardPresenters[this._openedPopupId].getScrollTop();
    }

    Object
      .values(this._filmCardPresenters)
      .forEach((presenter) => presenter.destroy());
    this._filmCardPresenters = {};

    remove(this._showMoreButtonComponent);
    remove(this._sortComponent);
    remove(this._footerStatistics);
    remove(this._profile);
    remove(this._emptyFilmList);
    if (this._statistic) {
      remove(this._statistic);
    }

    if (resetRenderedFilmCount) {
      this._renderedFilmCount = FILMS_PER_PAGE;
      this._openedPopupId = null;
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _isPopupOpened() {
    for (const key in this._filmCardPresenters) {
      if (this._filmCardPresenters[key].isPopupOpened()) {
        return true;
      }
    }
    return false;
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

    if (this._openedPopupId !== null) {
      this._filmCardPresenters[this._openedPopupId].showPopup();
      this._filmCardPresenters[this._openedPopupId].setScrollTop(this._popupScrollTop);
    }
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
    if (this._showMoreButtonComponent !== null) {
      this._showMoreButtonComponent = null;
    }

    this._showMoreButtonComponent = new ShowMore();
    this._showMoreButtonComponent.setClickHandler(this._onShowMoreBtnClick);

    render(this._filmsList, this._showMoreButtonComponent, RenderPosition.BEFOREEND);
  }

  _renderFilmCard(film, container, filmArray) {
    const filmCardPresenter = new FilmCardPresenter(container, this._handleViewAction, this._onPopupOpen);

    filmCardPresenter.init(film);
    filmArray[film.id] = filmCardPresenter;
  }

  _renderStatistic() {
    const allFilms = this._filmsModel.getFilms();
    this._statistic = new Statistic(allFilms);
    render(this._filmListsContainer, this._statistic, RenderPosition.BEFOREEND);
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

  _onPopupOpen(filmId) {
    if (this._openedPopupId) {
      this._filmCardPresenters[this._openedPopupId].closePopup();
    }
    this._openedPopupId = filmId;

    this._api.getComments(filmId)
      .then((response) => this._commentsModel.setComments(UpdateType.PATCH, {comments: response, id: filmId}))
      .catch(() => this._filmCardPresenters[filmId].setViewState(FilmPresenterViewState.ABORTING));
  }

  _handlerStatisticClick() {
    this._clearFilmList();
    this._filterModel.setFilter(null);
    this._renderStatistic();
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
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this._api.updateFilm(update)
          .then((response) => this._filmsModel.updateFilm(updateType, response))
          .catch(() => this._filmCardPresenters[update.id].setViewState(FilmPresenterViewState.ABORTING));
        break;

      case UserAction.ADD_COMMENT:
        this._filmCardPresenters[update.id].setViewState(FilmPresenterViewState.ADDING);
        this._api.addComment(update.comment, update.id)
          .then((response) => this._filmsModel.updateFilm(updateType, response))
          .catch(() => this._filmCardPresenters[update.id].setViewState(FilmPresenterViewState.ABORTING));
        break;

      case UserAction.DELETE_COMMENT:
        this._filmCardPresenters[update.id].setViewState(FilmPresenterViewState.DELETING, update.id);
        this._api.deleteComment(update.comment.id)
          .then(() => this._api.getFilms())
          .then((response) => this._filmsModel.setFilms(UpdateType.MINOR, response))
          .catch(() => this._filmCardPresenters[update.id].setViewState(FilmPresenterViewState.ABORTING));
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    this._saveScrollTop();

    switch (updateType) {
      case UpdateType.PATCH:
        const film = this._getFilms()[data.id];
        this._filmCardPresenters[data.id].init(film, this._getComments());
        this._restoreScrollTop();
        break;
      case UpdateType.MINOR:
        this._clearFilmList();
        this._renderFilmsLists();
        this._restoreScrollTop();
        break;
      case UpdateType.MAJOR:
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

  _saveScrollTop() {
    if (this._openedPopupId) {
      this._popupScrollTop = this._filmCardPresenters[this._openedPopupId].getScrollTop();
    }
  }

  _restoreScrollTop() {
    this._filmCardPresenters[this._openedPopupId].setScrollTop(this._popupScrollTop);
  }
}

