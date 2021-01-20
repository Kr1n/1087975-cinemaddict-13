import Abstract from "./abstract";

const createShowMoreTemplate = () => {
  return `<button class="films-list__show-more">Show more</button>`;
};

export default class ShowMore extends Abstract {
  constructor() {
    super();

    this._callbacks = [];
    this._clickHandler = this._clickHandler.bind(this);
  }
  getTemplate() {
    return createShowMoreTemplate();
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callbacks.click();
  }

  setClickHandler(callback) {
    this._callbacks.click = callback;
    this.getElement().addEventListener(`click`, this._clickHandler);
  }
}
