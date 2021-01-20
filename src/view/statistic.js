import Smart from "./smart";
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {getAllGenres, getTotalDuration, getWatchedFilms} from "../utils/films";
import {getRankLabel} from "./profile";
import {Period} from "../consts";
import dayjs from "dayjs";

export const periodFilter = {
  [Period.ALL]: (films) => (films),
  [Period.TODAY]: (films) => films.filter((item) => dayjs(item.watchingDate).isAfter(dayjs().add(-1, `day`))),
  [Period.WEEK]: (films) => films.filter((item) => dayjs(item.watchingDate).isAfter(dayjs().add(-1, `week`))),
  [Period.MONTH]: (films) => films.filter((item) => dayjs(item.watchingDate).isAfter(dayjs().add(-1, `month`))),
  [Period.YEAR]: (films) => films.filter((item) => dayjs(item.watchingDate).isAfter(dayjs().add(-1, `year`)))
};

const renderGenreChart = (statisticCtx, data) => {
  const BAR_HEIGHT = 75;
  // Обязательно рассчитайте высоту canvas, она зависит от количества элементов диаграммы
  statisticCtx.height = BAR_HEIGHT * 5;


  const sortedGenreCount = data.map((item) => item.count);
  const sortedGenres = data.map((item) => item.genre);


  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: sortedGenres,
      datasets: [{
        data: sortedGenreCount,
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 20
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 24
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  });
};

const creatStatisticTemplate = (films, data) => {
  const period = data.period;
  const watchedFilms = getWatchedFilms(films);
  const filteredFilms = periodFilter[period](watchedFilms);
  const rank = getRankLabel(filteredFilms.length);
  const genres = getAllGenres(filteredFilms);

  const duration = getTotalDuration(filteredFilms);
  const filmCount = filteredFilms.length;

  for (const genre of genres) {
    const count = (filteredFilms.reduce(
        (accumulator, currentValue) => accumulator + (currentValue.genres.has(genre) ? 1 : 0),
        0));
    data.chart.push({genre, count});
  }
  data.chart.sort((a, b) => b.count - a.count);

  const topGenre = data.chart.length ? data.chart[0].genre : ``;

  return `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${rank}</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
<p class="statistic__filters-description">Show stats:</p>
<input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" ${period === Period.ALL ? `checked` : ``} >
  <label for="statistic-all-time" class="statistic__filters-label" data-period="${Period.ALL}">${Period.ALL}</label>

  <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today" ${period === Period.TODAY ? `checked` : ``}>
    <label for="statistic-today" class="statistic__filters-label" data-period="${Period.TODAY}">${Period.TODAY}</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week" ${period === Period.WEEK ? `checked` : ``}>
      <label for="statistic-week" class="statistic__filters-label" data-period="${Period.WEEK}">${Period.WEEK}</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month" ${period === Period.MONTH ? `checked` : ``}>
        <label for="statistic-month" class="statistic__filters-label" data-period="${Period.MONTH}">${Period.MONTH}</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year" ${period === Period.YEAR ? `checked` : ``}>
          <label for="statistic-year" class="statistic__filters-label" data-period="${Period.YEAR}">${Period.YEAR}</label>
</form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${filmCount} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${duration.hours} <span class="statistic__item-description">h</span> ${duration.minutes} <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${topGenre}</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`;
};

export default class Statistic extends Smart {
  constructor(films) {
    super();

    this._films = films;
    this._genreChart = null;
    this._data.chart = [];
    this._data.period = Period.ALL;

    this._periodChangeHandler = this._periodChangeHandler.bind(this);

    this._setInnerHandlers();
    this._setCharts();
  }
  getTemplate() {
    return creatStatisticTemplate(this._films, this._data);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setCharts();
  }

  removeElement() {
    super.removeElement();

    this._data.chart = [];
    if (this._genreChart !== null) {
      this._genreChart = null;
    }
  }

  _setCharts() {
    if (this._genreChart !== null) {
      this._genreChart = null;
    }
    const genreCtx = this.getElement().querySelector(`.statistic__chart`);
    if (this._data.chart.length) {
      this._genreChart = renderGenreChart(genreCtx, this._data.chart);
    }
  }

  _periodChangeHandler(evt) {
    if (evt.target.tagName !== `LABEL`) {
      return;
    }
    evt.preventDefault();
    this.updateData({period: evt.target.dataset.period});
  }

  _setInnerHandlers() {
    this.getElement().querySelector(`.statistic__filters`).addEventListener(`click`, this._periodChangeHandler);
  }
}
