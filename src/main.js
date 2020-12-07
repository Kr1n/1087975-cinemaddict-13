import {FILM_COUNT, COMMENTS_COUNT, FILM_SHOWMORE_COUNT, EXTRA_CARD_COUNT} from "./consts";
import {render, remove, RenderPosition} from "./utils";
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

const filmsList = new FilmsList();
const contentFilms = new ContentFilms();
const showMoreBtn = new ShowMore();
const navigation = new Navigation(films);
const sortButtons = new SortButtons();
const popup = new Popup();
const profile = new Profile(films);
const emptyFilmList = new EmptyFilmList();
const footerStatistics = new FooterStatistics(films);
let renderedFilmCount = FILM_SHOWMORE_COUNT;

const onEscKeyDown = (evt) => {
  if (evt.key === `Escape` || evt.key === `Esc`) {
    evt.preventDefault();
    removePopup();
    document.removeEventListener(`keydown`, onEscKeyDown);
  }
};

const removePopup = () => {
  if (popup.film) {
    remove(popup);
  }
  document.querySelector(`body`).classList.remove(`hide-overflow`);
};

const renderPopup = (film, popupComments) => {

  popup.film = film;
  popup.comments = popupComments;

  mainContainer.appendChild(popup.getElement());
  popup.setCloseButtonHandler(removePopup);
  // Здесь случайно нет утечки памяти? Надо отписываться от события или достаточно удаления объекта?

  document.addEventListener(`keydown`, onEscKeyDown);
  document.querySelector(`body`).classList.add(`hide-overflow`);
};

const renderFilmCard = (film, place) => {
  const onFilmCardClick = () => {
    const popupComments = comments.filter((item) => (film).comments.has(item.id));
    removePopup();
    renderPopup(film, popupComments);
  };
  const filmCard = new FilmCard(film);

  render(place, filmCard, RenderPosition.BEFOREEND);
  filmCard.setClickPosterHandler(onFilmCardClick);
};

const renderContent = () => {
  render(filmsList, contentFilms, RenderPosition.BEFOREEND);
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
      remove(showMoreBtn);
    }
  };

  if (films.length > FILM_SHOWMORE_COUNT) {
    render(filmsList, showMoreBtn, RenderPosition.BEFOREEND);
  }
  showMoreBtn.setClickHandler(onShowMoreBtnClicked);
};

const renderTopRated = () => {
  const topRatedFilms = new TopRatedFilms();
  const sortForTopRated = (a, b) => b.rating - a.rating;

  render(filmsList, topRatedFilms, RenderPosition.BEFOREEND);
  films.slice().sort(sortForTopRated).slice(0, EXTRA_CARD_COUNT).forEach((film) => {
    renderFilmCard(film, topRatedFilms.getElement().querySelector(`.films-list__container`));
  });
};

const renderMostCommented = () => {
  const mostCommentedFilms = new MostCommentedFilms();
  const sortForMostCommented = (a, b) => b.comments.size - a.comments.size;

  render(filmsList, mostCommentedFilms, RenderPosition.BEFOREEND);
  films.slice().sort(sortForMostCommented).slice(0, EXTRA_CARD_COUNT).forEach((film) => {
    renderFilmCard(film, mostCommentedFilms.getElement().querySelector(`.films-list__container`));
  });
};


render(mainContainer, navigation, RenderPosition.BEFOREEND);
if (films.length) {
  render(headerContainer, profile, RenderPosition.BEFOREEND);
  render(mainContainer, sortButtons, RenderPosition.BEFOREEND);
  render(mainContainer, filmsList, RenderPosition.BEFOREEND);
  renderContent();
  renderShowMoreButton();
  renderTopRated();
  renderMostCommented();
} else {
  render(mainContainer, emptyFilmList, RenderPosition.BEFOREEND);
}
render(footerStatisticsContainer, footerStatistics, RenderPosition.BEFOREEND);
