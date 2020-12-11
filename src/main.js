import {FILM_COUNT, COMMENTS_COUNT} from "./consts";
import {render, RenderPosition} from "./utils";
import {generateFilm} from "./mock/film";
import {generateComment} from "./mock/comment";
import Navigation from "./view/navigation";

import Profile from "./view/profile";
import FooterStatistics from "./view/footer";
import FilmListsPesenter from "./presentor/film-lists";

const films = new Array(FILM_COUNT).fill().map(generateFilm);
const comments = new Array(COMMENTS_COUNT).fill().map(generateComment);

const headerContainer = document.querySelector(`.header`);
const mainContainer = document.querySelector(`.main`);
const footerStatisticsContainer = document.querySelector(`.footer`);

const navigation = new Navigation(films);
const profile = new Profile(films);
const footerStatistics = new FooterStatistics(films);
const filmListsPresentor = new FilmListsPesenter(mainContainer);

render(mainContainer, navigation, RenderPosition.BEFOREEND);
if (films.length) {
  render(headerContainer, profile, RenderPosition.BEFOREEND);
}
filmListsPresentor.init(films, comments);

render(footerStatisticsContainer, footerStatistics, RenderPosition.BEFOREEND);

