import {MOCK_FILMS_COUNT, MOCK_COMMENTS_COUNT} from "./consts";
import {render, RenderPosition} from "./utils/common";
import {generateFilm} from "./mock/film";
import {generateComment} from "./mock/comment";
import Profile from "./view/profile";
import FooterStatistics from "./view/footer";
import FilmListsPresenter from "./presenter/film-lists";
import FilterPresentor from "./presenter/filter";
import FilmsModel from "./model/films";
import CommentsModel from "./model/comments";
import FilterModel from "./model/filter";

const films = new Array(MOCK_FILMS_COUNT).fill().map(generateFilm);
const comments = new Array(MOCK_COMMENTS_COUNT).fill().map(generateComment);

const filterModel = new FilterModel();

const filmsModel = new FilmsModel();
filmsModel.setFilms(films);

const commentsModel = new CommentsModel();
commentsModel.setComments(comments);

const headerContainer = document.querySelector(`.header`);
const mainContainer = document.querySelector(`.main`);
const footerStatisticsContainer = document.querySelector(`.footer`);

const profile = new Profile(films);
const footerStatistics = new FooterStatistics(films);
const filmListsPresentor = new FilmListsPresenter(mainContainer, filmsModel, commentsModel, filterModel);
const filterPresenter = new FilterPresentor(mainContainer, filterModel, filmsModel);


if (films.length) {
  render(headerContainer, profile, RenderPosition.BEFOREEND);
}
filterPresenter.init();
filmListsPresentor.init();

render(footerStatisticsContainer, footerStatistics, RenderPosition.BEFOREEND);

