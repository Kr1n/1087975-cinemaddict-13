import {createElement} from "../utils";

const createFooterStatisticsTemplate = (films = {}) => {
  return `<p>${films.length ? films.length : 0 } movies inside</p>`;
};

export default class FooterStatistics {
  constructor(films) {
    this.films = films;
    this._element = null;
  }

  getTemplate() {
    return createFooterStatisticsTemplate(this.films);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
