import {AUTHORIZATION, END_POINT, UpdateType, MenuItem, FilterType} from "./consts";
import {render, RenderPosition, remove} from "./utils/common";
import Navigation from "./view/navigation";
import Statistic from "./view/statistic";
import FilmListsPresenter from "./presenter/film-lists";
import FilterPresentor from "./presenter/filter";
import FilmsModel from "./model/films";
import CommentsModel from "./model/comments";
import FilterModel from "./model/filter";
import Api from "./api";

const api = new Api(END_POINT, AUTHORIZATION);

const filterModel = new FilterModel();
const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();

const mainContainer = document.querySelector(`.main`);

const navigation = new Navigation();
const filmListsPresentor = new FilmListsPresenter(mainContainer, filmsModel, commentsModel, filterModel, api);
const filterPresenter = new FilterPresentor(navigation.getElement(), filterModel, filmsModel);
let statistic = null;

const renderStatistic = () => {
  statistic = new Statistic(filmsModel.getFilms());
  render(mainContainer, statistic, RenderPosition.BEFOREEND);
};

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.FILMS:
      if (!statistic) {
        return;
      }
      remove(statistic);
      navigation.setStatisticsClickHandler(handleSiteMenuClick);
      filmListsPresentor.show();
      break;
    case MenuItem.STATISTICS:
      filmListsPresentor.hide();
      filterModel.setFilter(UpdateType.MAJOR, FilterType.NONE);
      renderStatistic();
      navigation.setStatisticsClickHandler(null);
      break;
  }
};

render(mainContainer, navigation, RenderPosition.BEFOREEND);

navigation.setStatisticsClickHandler(handleSiteMenuClick);
filterPresenter.setFilterTypeChangeHandler(handleSiteMenuClick);

filterPresenter.init();
filmListsPresentor.init();

api.getFilms()
  .then((films) => {
    filmsModel.setFilms(UpdateType.INIT, films);
  });
// .catch(() => {    filmsModel.setFilms(UpdateType.INIT, []);  });
