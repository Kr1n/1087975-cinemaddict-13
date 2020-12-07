import Abstract from "./abstract";

const createFilmsList = () => `<section class="films"></section>`;

export default class FilmsList extends Abstract {
  getTemplate() {
    return createFilmsList();
  }
}
