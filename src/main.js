import {render} from "./utils.js";
import {createMenuTemplate, createSortTemplate} from "./view/menu.js";
import {createProfileTemplate} from "./view/profile.js";
import {createFilmsList} from "./view/filmsList.js";
import {createFooterStatisticsTemplate} from "./view/footer.js";
import {generateFilm} from "./mock/film.js";

const FILM_COUNT = 5;
const films = new Array(FILM_COUNT).fill().map(generateFilm);


const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
const footerStatisticsElement = document.querySelector(`.footer`);


render(headerElement, createProfileTemplate(), `beforeend`);
render(mainElement, createMenuTemplate(), `beforeend`);
render(mainElement, createSortTemplate(), `beforeend`);
render(mainElement, createFilmsList(films), `beforeend`);
render(footerStatisticsElement, createFooterStatisticsTemplate(), `beforeend`);


