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

const FILM_COUNT = 14;
const FILM_SHOWMORE_COUNT = 5;
const EXTRA_CARD_COUNT = 2;
const COMMENTS_COUNT = 100;

const films = new Array(FILM_COUNT).fill().map(generateFilm);
const comments = new Array(COMMENTS_COUNT).fill().map(generateComment);

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
const footerStatisticsElement = document.querySelector(`.footer`);

let renderedFilmCount = FILM_SHOWMORE_COUNT;

const filmsList = new FilmsList();
const contentFilms = new ContentFilms();
const showMoreBtn = new ShowMore();
const popup = new Popup();

const removePopup = () => {
  if (popup.film) {
    mainElement.removeChild(popup.getElement());
    popup.removeElement();
    popup.film = null;
    document.querySelector(`body`).classList.remove(`hide-overflow`);
  }
};

const renderPopup = (film) => {
  const onPopupCloseButtonClick = () => {
    removePopup();
  };
  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      removePopup();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };
  removePopup();
  popup.film = film;

  const commentsForPopup = comments.filter((item) => (film).comments.has(item.id));
  const commentsElement = popup.getElement().querySelector(`.film-details__bottom-container`);
  document.querySelector(`body`).classList.add(`hide-overflow`);

  mainElement.appendChild(popup.getElement());
  commentsElement.appendChild(new Comments(commentsForPopup).getElement());

  const popupCloseButton = popup.getElement().querySelector(`.film-details__close-btn`);
  popupCloseButton.addEventListener(`click`, onPopupCloseButtonClick);
  document.addEventListener(`keydown`, onEscKeyDown);
};

const renderMenu = () => {
  const navigation = new Navigation(films);
  const sort = new Sort();

  render(mainElement, navigation.getElement(), RenderPosition.BEFOREEND);
  render(mainElement, sort.getElement(), RenderPosition.BEFOREEND);
};

const renderFilmCard = (film, place) => {
  const filmCard = new FilmCard(film);

  const onFilmCardClick = () => {
    renderPopup(film);
  };

  render(place, filmCard.getElement(), RenderPosition.BEFOREEND);

  filmCard.getElement().querySelector(`.film-card__poster`).addEventListener(`click`, onFilmCardClick);
  filmCard.getElement().querySelector(`.film-card__title`).addEventListener(`click`, onFilmCardClick);
  filmCard.getElement().querySelector(`.film-card__comments`).addEventListener(`click`, onFilmCardClick);
};

const renderContent = () => {
  render(filmsList.getElement(), contentFilms.getElement(), RenderPosition.BEFOREEND);
  films.slice(0, FILM_SHOWMORE_COUNT).forEach((film) => {
    renderFilmCard(film, contentFilms.getElement().querySelector(`.films-list__container`));
  });
};

const renderShowMoreButton = () => {
  const onShowMoreBtnClicked = () => {
    films
      .slice(renderedFilmCount, renderedFilmCount + FILM_SHOWMORE_COUNT)
      .forEach((film) => renderFilmCard(film, filmsList.getElement().querySelector(`.films-list__container`)));

    renderedFilmCount += FILM_SHOWMORE_COUNT;

    if (renderedFilmCount >= films.length) {
      showMoreBtn.getElement().remove();
      showMoreBtn.removeElement();
    }
  };

  if (films.length > FILM_SHOWMORE_COUNT) {
    render(filmsList.getElement(), showMoreBtn.getElement(), RenderPosition.BEFOREEND);
  }
  showMoreBtn.getElement().addEventListener(`click`, onShowMoreBtnClicked);
};

const renderTopRated = () => {
  const topRatedFilms = new TopRatedFilms();
  const sortForTopRated = (a, b) => b.rating - a.rating;

  render(filmsList.getElement(), topRatedFilms.getElement(), RenderPosition.BEFOREEND);
  films.slice().sort(sortForTopRated).slice(0, EXTRA_CARD_COUNT).forEach((film) => {
    renderFilmCard(film, topRatedFilms.getElement().querySelector(`.films-list__container`));
  });
};

const renderMostCommented = () => {
  const mostCommentedFilms = new MostCommentedFilms();
  const sortForMostCommented = (a, b) => b.comments.size - a.comments.size;

  render(filmsList.getElement(), mostCommentedFilms.getElement(), RenderPosition.BEFOREEND);
  films.slice().sort(sortForMostCommented).slice(0, EXTRA_CARD_COUNT).forEach((film) => {
    renderFilmCard(film, mostCommentedFilms.getElement().querySelector(`.films-list__container`));
  });

};


render(headerElement, new Profile(films).getElement(), RenderPosition.BEFOREEND);
renderMenu();
render(mainElement, filmsList.getElement(), RenderPosition.BEFOREEND);
renderContent();
renderShowMoreButton();
renderTopRated();
renderMostCommented();
render(footerStatisticsElement, new FooterStatistics().getElement(), RenderPosition.BEFOREEND);
