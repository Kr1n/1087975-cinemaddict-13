import {MOCK_FILMS_COUNT, MOCK_COMMENTS_COUNT} from "./consts";
import {render, RenderPosition} from "./utils/common";
import {generateFilm} from "./mock/film";
import {generateComment} from "./mock/comment";
import Navigation from "./view/navigation";
import Profile from "./view/profile";
import FooterStatistics from "./view/footer";
import FilmsModel from "./model/films";
import FilmListsPesenter from "./presenter/film-lists";

const films = new Array(MOCK_FILMS_COUNT).fill().map(generateFilm);
const comments = new Array(MOCK_COMMENTS_COUNT).fill().map(generateComment);

const filmsModel = new FilmsModel();
filmsModel.setFilms(films);

const headerContainer = document.querySelector(`.header`);
const mainContainer = document.querySelector(`.main`);
const footerStatisticsContainer = document.querySelector(`.footer`);

const navigation = new Navigation(films);
const profile = new Profile(films);
const footerStatistics = new FooterStatistics(films);
const filmListsPresentor = new FilmListsPesenter(mainContainer, filmsModel);

render(mainContainer, navigation, RenderPosition.BEFOREEND);
if (films.length) {
  render(headerContainer, profile, RenderPosition.BEFOREEND);
}
filmListsPresentor.init(comments);

render(footerStatisticsContainer, footerStatistics, RenderPosition.BEFOREEND);

