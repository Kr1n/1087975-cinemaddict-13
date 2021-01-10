import Smart from "./smart";
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {getAllGenres, getTotalDuration, getWatchedFilms} from "../utils/films";

const renderGenreChart = (statisticCtx, data) => {
  const BAR_HEIGHT = 50;
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
  const watchedFilms = getWatchedFilms(films);
  const genres = getAllGenres(watchedFilms);
  for (const genre of genres) {
    const count = (watchedFilms.reduce(
        (accumulator, currentValue) => accumulator + (currentValue.genres.has(genre) ? 1 : 0),
        0));
    data.push({genre, count});
  }

  data.sort((a, b) => b.count - a.count);

  const duration = getTotalDuration(watchedFilms);
  const filmCount = watchedFilms.length;

  return `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">Sci-Fighter</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
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
        <p class="statistic__item-text">${data[0].genre}</p>
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
    this._data = [];

    this._setCharts();
  }
  getTemplate() {
    return creatStatisticTemplate(this._films, this._data);
  }

  restoreHandlers() {
    this._setCharts();
  }

  removeElement() {
    super.removeElement();

    if (this._genreChart !== null) {
      this._genreChart = null;
    }
  }

  _setCharts() {
    if (this._genreChart !== null) {
      this._genreChart = null;
    }
    const genreCtx = this.getElement().querySelector(`.statistic__chart`);
    this._genreChart = renderGenreChart(genreCtx, this._data);
  }

  _periodChangeHandler() {

  }
}
