import {render, RenderPosition} from "./utils.js";
import {generateFilm} from "./mock/film.js";
import {generateComment} from "./mock/comment.js";
import Navigation from "./view/navigation.js";
import Sort from "./view/sort.js";
import Profile from "./view/profile.js";
import FilmsList from "./view/films-list.js";
import FooterStatistics from "./view/footer.js";
import Popup from "./view/popup.js";
import Comments from "./view/comments.js";
import FilmCard from "./view/film-card.js";
import ShowMore from "./view/show-more.js";
import TopRatedFilms from "./view/top-rated-films";
import MostCommentedFilms from "./view/most-commented-films";
import ContentFilms from "./view/content-films";

const FILM_COUNT = 55;
const FILM_SHOWMORE_COUNT = 5;
const EXTRA_CARD_COUNT = 2;
const COMMENTS_COUNT = 100;

const films = new Array(FILM_COUNT).fill().map(generateFilm);
const comments = new Array(COMMENTS_COUNT).fill().map(generateComment);

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
const footerStatisticsElement = document.querySelector(`.footer`);

let renderedFilmCount = FILM_SHOWMORE_COUNT;

const renderMenu = () => {
  const navigation = new Navigation(films);
  const sort = new Sort();

  render(mainElement, navigation.getElement(), RenderPosition.BEFOREEND);
  render(mainElement, sort.getElement(), RenderPosition.BEFOREEND);
};

const renderContent = () => {
  const filmList = new FilmsList();
  const showMoreBtn = new ShowMore();

  const sortForTopRated = (a, b) => b.rating - a.rating;
  const sortForMostCommented = (a, b) => b.comments.size - a.comments.size;

  const contentFilms = new ContentFilms(films.slice(0, FILM_SHOWMORE_COUNT));
  const mostCommentedFilms = new MostCommentedFilms(films.slice().sort(sortForMostCommented).slice(0, EXTRA_CARD_COUNT));
  const topRatedFilms = new TopRatedFilms(films.slice().sort(sortForTopRated).slice(0, EXTRA_CARD_COUNT));

  render(mainElement, filmList.getElement(), RenderPosition.BEFOREEND);
  render(filmList.getElement(), contentFilms.getElement(), RenderPosition.BEFOREEND);
  if (films.length > FILM_SHOWMORE_COUNT) {
    render(filmList.getElement(), showMoreBtn.getElement(), RenderPosition.BEFOREEND);
  }
  render(filmList.getElement(), mostCommentedFilms.getElement(), RenderPosition.BEFOREEND);
  render(filmList.getElement(), topRatedFilms.getElement(), RenderPosition.BEFOREEND);

  const onShowMoreBtnClicked = () => {
    const filmContainerElement = mainElement.querySelector(`.films-list:not(.films-list--extra) .films-list__container`);

    films
      .slice(renderedFilmCount, renderedFilmCount + FILM_SHOWMORE_COUNT)
      .forEach((film) => render(filmContainerElement, new FilmCard(film).getElement(), `beforeend`));

    renderedFilmCount += FILM_SHOWMORE_COUNT;

    if (renderedFilmCount >= films.length) {
      showMoreBtn.getElement().remove();
      showMoreBtn.removeElement();
    }
  };

  showMoreBtn.getElement().addEventListener(`click`, onShowMoreBtnClicked);
};

const renderPopup = () => {
  const filmForPopup = films[0];
  const commentsForPopup = comments.filter((item) => (filmForPopup).comments.has(item.id));
  const popup = new Popup(filmForPopup);

  document.querySelector(`body`).classList.add(`hide-overflow`);
  render(mainElement, popup.getElement(), RenderPosition.BEFOREEND);

  const commentsElement = popup.getElement().querySelector(`.film-details__bottom-container`);
  render(commentsElement, new Comments(commentsForPopup).getElement(), RenderPosition.BEFOREEND);

  const popupCloseButton = popup.getElement().querySelector(`.film-details__close-btn`);
  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      popup.getElement().remove();
      document.querySelector(`body`).classList.remove(`hide-overflow`);
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };
  const onPopupCloseButtonClick = () => {
    popup.getElement().remove();
    document.querySelector(`body`).classList.remove(`hide-overflow`);
  };

  popupCloseButton.addEventListener(`click`, onPopupCloseButtonClick);
  document.addEventListener(`keydown`, onEscKeyDown);
};

render(headerElement, new Profile(films).getElement(), RenderPosition.BEFOREEND);
renderMenu();
renderContent();
render(footerStatisticsElement, new FooterStatistics().getElement(), RenderPosition.BEFOREEND);

renderPopup();
