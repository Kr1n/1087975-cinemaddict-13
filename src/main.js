import {render} from "./utils.js";
import {generateFilm} from "./mock/film.js";
import {generateComment} from "./mock/comment.js";
import Navigation from "./view/navigation.js";
import Sort from "./view/sort.js";
import Profile from "./view/profile.js";
import FilmsList from "./view/filmsList.js";
import FooterStatistics from "./view/footer.js";
import FilmDetails from "./view/filmDetails.js";
import Comments from "./view/comments.js";
import FilmCard from "./view/filmCard.js";
import ShowMore from "./view/showMore.js";

const FILM_COUNT = 55;
const FILM_SHOWMORE_COUNT = 5;
const COMMENTS_COUNT = 100;

const films = new Array(FILM_COUNT).fill().map(generateFilm);
const comments = new Array(COMMENTS_COUNT).fill().map(generateComment);

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
const footerStatisticsElement = document.querySelector(`.footer`);

let renderedFilmCount = FILM_SHOWMORE_COUNT;

render(headerElement, new Profile(films).getElement(), `beforeend`);

const navigation = new Navigation(films).getElement();
render(mainElement, navigation, `beforeend`);
render(mainElement, new Sort().getElement(), `beforeend`);

const filmList = new FilmsList(films, renderedFilmCount).getElement();

render(mainElement, filmList, `beforeend`);
render(footerStatisticsElement, new FooterStatistics().getElement(), `beforeend`);


const filmForDetails = films[0];
const details = new FilmDetails(filmForDetails);
render(mainElement, details.getElement(), `beforeend`);

const commentsElement = document.querySelector(`.film-details__bottom-container`);
const commentsForDetails = comments.filter((item) => (filmForDetails).comments.has(item.id));
if (commentsElement) {
  render(commentsElement, new Comments(commentsForDetails).getElement(), `beforeend`);
}

const onEscKeyDown = (evt) => {
  if (evt.key === `Escape` || evt.key === `Esc`) {
    evt.preventDefault();
    details.getElement().remove();
    document.removeEventListener(`keydown`, onEscKeyDown);
  }
};

const detailsCloseButton = details.getElement().querySelector(`.film-details__close-btn`);
detailsCloseButton.addEventListener(`click`, () => details.getElement().remove());
document.addEventListener(`keydown`, onEscKeyDown);

const filmListElement = mainElement.querySelector(`.films-list:not(.films-list--extra)`);
const showMoreBtn = new ShowMore();

if (films.length > FILM_SHOWMORE_COUNT) {
  render(filmListElement, showMoreBtn.getElement(), `beforeend`);
}

showMoreBtn.getElement().addEventListener(`click`, () => {
  const filmContainerElement = mainElement.querySelector(`.films-list:not(.films-list--extra) .films-list__container`);

  films
      .slice(renderedFilmCount, renderedFilmCount + FILM_SHOWMORE_COUNT)
      .forEach((film) => render(filmContainerElement, new FilmCard(film).getElement(), `beforeend`));

  renderedFilmCount += FILM_SHOWMORE_COUNT;

  if (renderedFilmCount >= films.length) {
    showMoreBtn.getElement().remove();
    showMoreBtn.removeElement();
  }
});


