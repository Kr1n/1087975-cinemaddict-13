import FilmsModel from "../model/films";
import {isOnline} from "../utils/common";

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
    this._isUpdatedOffline = false;
  }

  getComments(id) {
    if (isOnline()) {
      return this._api.getComments(id)
          .then((comments) => {
            return comments;
          });
    }
    return Promise.reject(new Error(`Request comments failed`));
  }

  getFilms() {
    if (isOnline()) {
      return this._api.getFilms()
        .then((films) => {
          const items = createStoreStructure(films.map(FilmsModel.adaptToServer));
          this._store.setItems(items);
          return films;
        });
    }

    const storeFilms = Object.values(this._store.getItems());

    return Promise.resolve(storeFilms.map(FilmsModel.adaptToClient));
  }

  updateFilm(film) {
    if (isOnline()) {
      return this._api.updateFilm(film)
        .then((updatedFilm) => {
          this._store.setItem(updatedFilm.id, FilmsModel.adaptToServer(updatedFilm));
          return updatedFilm;
        });
    }

    this._store.setItem(film.id, FilmsModel.adaptToServer(Object.assign({}, film)));

    return Promise.resolve(film);
  }

  addComment(film) {
    if (isOnline()) {
      return this._api.addComment(film)
        .then((newFilm) => {
          this._store.setItem(newFilm.id, FilmsModel.adaptToServer(newFilm));
          return newFilm;
        });
    }

    return Promise.reject(new Error(`Add comment failed`));
  }

  deleteComment(film) {
    if (isOnline()) {
      return this._api.deleteComment(film)
        .then(() => this._store.removeItem(film.id));
    }

    return Promise.reject(new Error(`Delete comment failed`));
  }

  sync() {
    if (isOnline()) {
      const storeFilms = Object.values(this._store.getItems());

      return this._api.sync(storeFilms)
        .then((response) => {

          // Добавляем синхронизированные задачи в хранилище.
          // Хранилище должно быть актуальным в любой момент.
          const items = createStoreStructure([...response.updated]);

          this._store.setItems(items);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }
}
