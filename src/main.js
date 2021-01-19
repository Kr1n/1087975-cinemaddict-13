import {AUTHORIZATION, END_POINT, UpdateType, MenuItem, FilterType} from "./consts";
import {render, RenderPosition, remove} from "./utils/common";
import Navigation from "./view/navigation";
import Statistic from "./view/statistic";
import FilmListsPresenter from "./presenter/film-lists";
import FilterPresentor from "./presenter/filter";
import FilmsModel from "./model/films";
import CommentsModel from "./model/comments";
import FilterModel from "./model/filter";
import Api from "./api/api";
import Store from "./api/store";
import Provider from "./api/provider";
import {toast} from "./utils/toast";

const STORE_PREFIX = `cinema-localstorage`;
const STORE_VER = `v1`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const api = new Api(END_POINT, AUTHORIZATION);

const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const filterModel = new FilterModel();
const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();

const mainContainer = document.querySelector(`.main`);

const navigation = new Navigation();
const filmListsPresentor = new FilmListsPresenter(mainContainer, filmsModel, commentsModel, filterModel, apiWithProvider);
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

apiWithProvider.getFilms()
  .then((films) => {
    filmsModel.setFilms(UpdateType.INIT, films);
  })
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, []);
    toast(`Something wrong in network`);
  });

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`);
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
