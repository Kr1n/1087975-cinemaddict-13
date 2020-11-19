import {render} from "./utils.js";
import {createMenuTemplate, createSortTemplate} from "./view/menu.js";
import {createProfileTemplate} from "./view/profile.js";
import {createFilmsList} from "./view/filmsList.js";
import {createFooterStatisticsTemplate} from "./view/footer.js";

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
const footerStatisticsElement = document.querySelector(`.footer`);

render(headerElement, createProfileTemplate(), `beforeend`);
render(mainElement, createMenuTemplate(), `beforeend`);
render(mainElement, createSortTemplate(), `beforeend`);
render(mainElement, createFilmsList(), `beforeend`);
render(footerStatisticsElement, createFooterStatisticsTemplate(), `beforeend`);


