import Observer from "../utils/observer.js";

export default class Films extends Observer {
  constructor() {
    super();
    this._films = [];
  }

  setFilms(tasks) {
    this._films = tasks.slice();
  }

  getFilms() {
    return this._films;
  }

  updateFilm(updateType, update) {
    const index = this._films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting film`);
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  addFilm(updateType, update) {
    this._films = [
      update,
      ...this._films
    ];

    this._notify(updateType, update);
  }

  deleteFilm(updateType, update) {
    const index = this._films.findIndex((task) => task.id === update.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting film`);
    }

    this._films = [
      ...this._films.slice(0, index),
      ...this._films.slice(index + 1)
    ];

    this._notify(updateType);
  }
}
