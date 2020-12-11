import {remove, render, RenderPosition} from "../utils";
import SortButtons from "../view/sort-buttons";
import ShowMore from "../view/show-more";
import FilmsList from "../view/films-list";
import FilmCardPresenter from "./film-card";
import TopRatedFilms from "../view/top-rated-films";
import {EXTRA_CARD_COUNT} from "../consts";
import MostCommentedFilms from "../view/most-commented-films";
import EmptyFilmList from "../view/empty-film-list";

export const FILM_SHOWMORE_COUNT = 5;

export default class filmLists {
  constructor(filmListsContainer) {
    this._filmListsContainer = filmListsContainer;
    this._renderedFilmCount = FILM_SHOWMORE_COUNT;
    this._filmCardPresenter = {};

    this._filmsList = new FilmsList();
    this._sortButtons = new SortButtons();
    this._showMoreBtn = new ShowMore();
    this._topRatedFilms = new TopRatedFilms();
    this._mostCommentedFilms = new MostCommentedFilms();
    this._emptyFilmList = new EmptyFilmList();

    this._onShowMoreBtnClicked = this._onShowMoreBtnClicked.bind(this);
  }

  init(allFilms, allComments) {
    this._allFilms = allFilms.slice();
    this._allComments = allComments;

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
    render(this._filmsList, this._allFilms, RenderPosition.BEFOREEND);
    this._allFilms.slice(0, FILM_SHOWMORE_COUNT).forEach((film) => {
      this._renderFilmCard(film, this._allFilms.getElement().querySelector(`.films-list__container`));
    });
  }

  _renderTopRated() {
    const sortForTopRated = (a, b) => b.rating - a.rating;

    render(this._filmsList, this._topRatedFilms, RenderPosition.BEFOREEND);
    this._allFilms.slice().sort(sortForTopRated).slice(0, EXTRA_CARD_COUNT).forEach((film) => {
      this._renderFilmCard(film, this._topRatedFilms.getElement().querySelector(`.films-list__container`));
    });
  }

  _renderMostCommented() {

    const sortForMostCommented = (a, b) => b.comments.size - a.comments.size;

    render(this._filmsList, this._mostCommentedFilms, RenderPosition.BEFOREEND);
    this._allFilms.slice().sort(sortForMostCommented).slice(0, EXTRA_CARD_COUNT).forEach((film) => {
      this._renderFilmCard(film, this._mostCommentedFilms.getElement().querySelector(`.films-list__container`));
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
      .forEach((film) => this._renderFilmCard(film, this._filmsList.getElement().querySelector(`.films-list__container`)));

    this.renderedFilmCount += FILM_SHOWMORE_COUNT;

    if (this.renderedFilmCount >= this._allFilms.length) {
      remove(this._showMoreBtn);
    }
  }

  _renderFilmCard(film, container) {
    const filmCardPresenter = new FilmCardPresenter(container);
    filmCardPresenter.init(film, this._allComments);
    this._filmCardPresenter[film.id] = filmCardPresenter;
  }
}

