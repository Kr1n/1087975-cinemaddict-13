import {MOCK_COMMENTS_COUNT, AUTHORIZATION, END_POINT, UpdateType} from "./consts";
import {render, RenderPosition} from "./utils/common";
import {generateComment} from "./mock/comment";
import Navigation from "./view/navigation";
import FilmListsPresenter from "./presenter/film-lists";
import FilterPresentor from "./presenter/filter";
import FilmsModel from "./model/films";
import CommentsModel from "./model/comments";
import FilterModel from "./model/filter";
import Api from "./api";

const api = new Api(END_POINT, AUTHORIZATION);
const comments = new Array(MOCK_COMMENTS_COUNT).fill().map(generateComment);

const filterModel = new FilterModel();
const filmsModel = new FilmsModel();

const commentsModel = new CommentsModel();
commentsModel.setComments(comments);

const mainContainer = document.querySelector(`.main`);

const navigation = new Navigation();

const filmListsPresentor = new FilmListsPresenter(mainContainer, filmsModel, commentsModel, filterModel, api);
const filterPresenter = new FilterPresentor(navigation.getElement(), filterModel, filmsModel);

render(mainContainer, navigation, RenderPosition.BEFOREEND);

filterPresenter.init();
filmListsPresentor.init(navigation);


api.getFilms()
  .then((films) => {
    filmsModel.setFilms(UpdateType.INIT, films);

  });
// .catch(() => {    filmsModel.setFilms(UpdateType.INIT, []);  });


