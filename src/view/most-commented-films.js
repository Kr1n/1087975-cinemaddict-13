import Abstract from "./abstract";

const createMostCommentedFilmsList = () => {
  return `<section class="films-list films-list--extra">
      <h2 class="films-list__title">Most commented</h2>
      <div class="films-list__container">
      </div>
    </section>`;
};

export default class MostCommentedFilms extends Abstract {
  getTemplate() {
    return createMostCommentedFilmsList();
  }
}
