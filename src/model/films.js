import Observer from "../utils/observer.js";


export default class Films extends Observer {
  constructor() {
    super();
    this._films = [];
  }

  setFilms(updateType, films) {
    this._films = films.slice();
    this._notify(updateType);
  }

  getFilms() {
    return this._films;
  }

  updateFilm(updateType, update) {
    const index = this._films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting film`);
    }

    this._films.splice(index, 1, update);

    this._notify(updateType, update);
  }

  static adaptToClient(film) {
    const adaptedTask = Object.assign(
        {},
        film,
        {
          id: parseInt(film.id, 10),
          ageLimit: film.film_info.age_rating,
          originalTitle: film.film_info.alternative_title,
          genres: new Set(film.film_info.genre),
          releaseDate: film.film_info.release.date !== null ? new Date(film.film_info.release.date) : film.film_info.release.date,
          country: film.film_info.release.release_country,
          rating: film.film_info.total_rating,
          inWatchlist: film.user_details.watchlist,
          isWatched: film.user_details.already_watched,
          isFavorite: film.user_details.favorite,
          watchingDate: film.user_details.watching_date,
          description: film.film_info.description,
          actors: film.film_info.actors,
          director: film.film_info.director,
          poster: film.film_info.poster,
          title: film.film_info.title,
          writers: film.film_info.writers,
          comments: new Set(film.comments),

          duration: {
            hours: parseInt(film.film_info.runtime / 60, 10),
            minutes: film.film_info.runtime - parseInt(film.film_info.runtime / 60, 10) * 60,
          }
        }
    );

    // Ненужные ключи мы удаляем
    delete adaptedTask.film_info;
    delete adaptedTask.user_details;

    return adaptedTask;
  }

  static adaptToServer(film) {
    const adaptedTask = Object.assign(
        {},
        film,
        {
          "id": film.id.toString(),
          "film_info": {
            "description": film.description,
            "director": film.director,
            "actors": film.actors,
            "poster": film.poster,
            "title": film.title,
            "writers": film.writers,
            "age_rating": film.ageLimit,
            "alternative_title": film.originalTitle,
            "genre": Array.from(film.genres),
            "runtime": film.duration.hours * 60 + film.duration.minutes,
            "release": {
              "date": film.releaseDate instanceof Date ? film.releaseDate.toISOString() : null,
              "release_country": film.country
            },
            "total_rating": film.rating,
          },
          "user_details": {
            "watchlist": film.inWatchlist,
            "already_watched": film.isWatched,
            "favorite": film.isFavorite,
            "watching_date": film.watchingDate
          },
          "comments": Array.from(film.comments),
        }
    );

    // Ненужные ключи мы удаляем
    delete adaptedTask.actors;
    delete adaptedTask.ageLimit;
    delete adaptedTask.country;
    delete adaptedTask.description;
    delete adaptedTask.duration;
    delete adaptedTask.genres;
    delete adaptedTask.inWatchlist;
    delete adaptedTask.isFavorite;
    delete adaptedTask.isWatched;
    delete adaptedTask.originalTitle;
    delete adaptedTask.title;
    delete adaptedTask.poster;
    delete adaptedTask.rating;
    delete adaptedTask.releaseDate;
    delete adaptedTask.watchingDate;
    delete adaptedTask.writers;
    return adaptedTask;
  }
}
