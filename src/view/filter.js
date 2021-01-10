import Abstract from "./abstract";

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;

  return (
    `<a
      href="#${type}"
      data-filter="${type}"
      class="main-navigation__item ${type === currentFilterType ? `main-navigation__item--active` : ``}">
      ${name}
      ${type === `all` ? `` : `<span class="main-navigation__item-count">${count}</span>`}
    </a>`
  );
};

const createFiltersTemplate = (filterItems, currentFilterType) => {

  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join(``);

  return `<div class="main-navigation__items">
      ${filterItemsTemplate}
    </div>`;
};


export default class Filter extends Abstract {
  constructor(filters, currentFilterType) {
    super();
    this._callbacks = [];

    this._filters = filters;
    this._currentFilter = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFiltersTemplate(this._filters, this._currentFilter);
  }

  _filterTypeChangeHandler(evt) {
    if (evt.target.tagName !== `A`) {
      return;
    }

    evt.preventDefault();
    this._callbacks.filterTypeChange(evt.target.dataset.filter);
  }

  setFilterTypeChangeHandler(callback) {
    this._callbacks.filterTypeChange = callback;
    this.getElement().addEventListener(`click`, this._filterTypeChangeHandler);
  }
}
