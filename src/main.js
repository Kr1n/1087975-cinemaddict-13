import {createSiteMenuTemplate, createSortTemplate} from "./view/menu.js";
import {createProfileTemplate} from "./view/profile.js";
import {createFilmsList, createTopRatedFilmsList, createMostCommentedFilmsList} from "./view/filmsList.js";
import {createFooterStatisticsTemplate} from "./view/footer.js";

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterStatisticsElement = document.querySelector(`.footer`);

render(siteHeaderElement, createProfileTemplate(), `beforeend`);
render(siteMainElement, createSiteMenuTemplate(), `beforeend`);
render(siteMainElement, createSortTemplate(), `beforeend`);
render(siteMainElement, createFilmsList(), `beforeend`);
render(siteFooterStatisticsElement, createFooterStatisticsTemplate(), `beforeend`);


