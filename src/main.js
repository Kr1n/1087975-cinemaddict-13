import {render} from "./utils.js";
import {generateFilm} from "./mock/film.js";
import {generateComment} from "./mock/comment.js";
import {createNavigationTemplate, createSortTemplate} from "./view/menu.js";
import {createProfileTemplate} from "./view/profile.js";
import {createFilmsList} from "./view/filmsList.js";
import {createFooterStatisticsTemplate} from "./view/footer.js";
import {createFilmDetailsTemplate} from "./view/filmDetails.js";
import {createCommentsTemplate} from "./view/comments.js";
import {createFilmCardTemplate} from "./view/filmCard.js";
import {createShowMoreTemplate} from "./view/showMore.js";

const FILM_COUNT = 6;
const FILM_SHOWMORE_COUNT = 5;
const COMMENTS_COUNT = 100;

const films = new Array(FILM_COUNT).fill().map(generateFilm);
const comments = new Array(COMMENTS_COUNT).fill().map(generateComment);

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
const footerStatisticsElement = document.querySelector(`.footer`);

let renderedFilmCount = FILM_SHOWMORE_COUNT;

render(headerElement, createProfileTemplate(films), `beforeend`);
render(mainElement, createNavigationTemplate(films), `beforeend`);
render(mainElement, createSortTemplate(), `beforeend`);
render(mainElement, createFilmsList(films, renderedFilmCount), `beforeend`);
render(footerStatisticsElement, createFooterStatisticsTemplate(), `beforeend`);


const filmForDetails = films[0];
render(mainElement, createFilmDetailsTemplate(filmForDetails), `beforeend`);
const commentsElement = document.querySelector(`.film-details__bottom-container`);
const commentsForDetails = comments.filter((item) => (filmForDetails).comments.has(item.id));

if (commentsElement) {
  render(commentsElement, createCommentsTemplate(commentsForDetails), `beforeend`);
}

const details = document.querySelector(`.film-details`);
const detailsCloseButton = details.querySelector(`.film-details__close-btn`);
detailsCloseButton.addEventListener(`click`, () => details.remove());

const filmListElement = mainElement.querySelector(`.films-list:not(.films-list--extra)`);
if (films.length > FILM_SHOWMORE_COUNT) {
  render(filmListElement, createShowMoreTemplate(), `beforeend`);
}
const buttonShowMore = document.querySelector(`.films-list__show-more`);

if (buttonShowMore) {
  buttonShowMore.addEventListener(`click`, () => {
    const filmContainerElement = mainElement.querySelector(`.films-list:not(.films-list--extra) .films-list__container`);

    films
      .slice(renderedFilmCount, renderedFilmCount + FILM_SHOWMORE_COUNT)
      .forEach((film) => render(filmContainerElement, createFilmCardTemplate(film), `beforeend`));

    renderedFilmCount += FILM_SHOWMORE_COUNT;

    if (renderedFilmCount >= films.length) {
      buttonShowMore.remove();
    }
  });
}


