import Abstract from "./abstract";

const createStatisticPeriodTemplate = () => {
  return `<form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
<p class="statistic__filters-description">Show stats:</p>
<input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" checked>
  <label for="statistic-all-time" class="statistic__filters-label">All time</label>

  <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
    <label for="statistic-today" class="statistic__filters-label">Today</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
      <label for="statistic-week" class="statistic__filters-label">Week</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
        <label for="statistic-month" class="statistic__filters-label">Month</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
          <label for="statistic-year" class="statistic__filters-label">Year</label>
</form>`;
};

export default class StatisticPeriod extends Abstract {
  constructor() {
    super();

    this._callbacks = [];
    this._clickHandler = this._clickHandler.bind(this);
  }
  getTemplate() {
    return createStatisticPeriodTemplate();
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
