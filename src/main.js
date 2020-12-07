import {FILM_COUNT, COMMENTS_COUNT, FILM_SHOWMORE_COUNT, EXTRA_CARD_COUNT} from "./consts";
import {render, RenderPosition} from "./utils";
import {generateFilm} from "./mock/film";
import {generateComment} from "./mock/comment";
import Navigation from "./view/navigation";
import SortButtons from "./view/sort-buttons";
import Profile from "./view/profile";
import FilmsList from "./view/films-list";
import FooterStatistics from "./view/footer";
import Popup from "./view/popup";
import FilmCard from "./view/film-card";
import ShowMore from "./view/show-more";
import TopRatedFilms from "./view/top-rated-films";
import MostCommentedFilms from "./view/most-commented-films";
import ContentFilms from "./view/content-films";
import EmptyFilmList from "./view/empty-film-list";

const films = new Array(FILM_COUNT).fill().map(generateFilm);
const comments = new Array(COMMENTS_COUNT).fill().map(generateComment);

const headerContainer = document.querySelector(`.header`);
const mainContainer = document.querySelector(`.main`);
const footerStatisticsContainer = document.querySelector(`.footer`);

let renderedFilmCount = FILM_SHOWMORE_COUNT;

const filmsList = new FilmsList();
const contentFilms = new ContentFilms();
const showMoreBtn = new ShowMore();
const navigation = new Navigation(films);
const sortButtons = new SortButtons();
const popup = new Popup();
const profile = new Profile(films);
const emptyFilmList = new EmptyFilmList();
const footerStatistics = new FooterStatistics(films);

const onEscKeyDown = (evt) => {
  if (evt.key === `Escape` || evt.key === `Esc`) {
    evt.preventDefault();
    removePopup();
    document.removeEventListener(`keydown`, onEscKeyDown);
  }
};

const removePopup = () => {
  if (popup.film) {
    mainContainer.removeChild(popup.getElement());
    popup.removeElement();
    popup.film = null;
    popup.comments = null;
    document.querySelector(`body`).classList.remove(`hide-overflow`);
  }
};

const renderPopup = (film, popupComments) => {

  popup.film = film;
  popup.comments = popupComments;
  const popupCloseButton = popup.getElement().querySelector(`.film-details__close-btn`);

  mainContainer.appendChild(popup.getElement());
  popupCloseButton.addEventListener(`click`, removePopup);
  document.addEventListener(`keydown`, onEscKeyDown);
  document.querySelector(`body`).classList.add(`hide-overflow`);
};

const renderFilmCard = (film, place) => {
  const filmCard = new FilmCard(film);
  const onFilmCardClick = () => {
    const popupComments = comments.filter((item) => (film).comments.has(item.id));
    removePopup();
    renderPopup(film, popupComments);
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


render(mainContainer, navigation.getElement(), RenderPosition.BEFOREEND);
if (films.length) {
  render(headerContainer, profile.getElement(), RenderPosition.BEFOREEND);
  render(mainContainer, sortButtons.getElement(), RenderPosition.BEFOREEND);
  render(mainContainer, filmsList.getElement(), RenderPosition.BEFOREEND);
  renderContent();
  renderShowMoreButton();
  renderTopRated();
  renderMostCommented();
} else {
  render(mainContainer, emptyFilmList.getElement(), RenderPosition.BEFOREEND);
}
render(footerStatisticsContainer, footerStatistics.getElement(), RenderPosition.BEFOREEND);
