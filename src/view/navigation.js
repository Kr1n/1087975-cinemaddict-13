import Abstract from "./abstract";
import {MenuItem} from "../consts";

const createFiltersTemplate = () => {

  return `<nav class="main-navigation">
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};


export default class Filter extends Abstract {
  constructor() {
    super();
    this._callbacks = [];

    this._statisticsClickHandler = this._statisticsClickHandler.bind(this);
  }

  getTemplate() {
    return createFiltersTemplate();
  }

  _statisticsClickHandler(evt) {
    evt.preventDefault();
    if (this._callbacks.statisticClick) {
      this._callbacks.statisticClick(MenuItem.STATISTICS);
    }
  }

  setStatisticsClickHandler(callback) {
    this._callbacks.statisticClick = callback;
    this.getElement().querySelector(`.main-navigation__additional`).addEventListener(`click`, this._statisticsClickHandler);
  }
}
