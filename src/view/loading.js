import AbstractView from "./abstract.js";

const createNoTaskTemplate = () => {
  return `<p class="films-list--loading">
    Loading...
  </p>`;
};

export default class Loading extends AbstractView {
  getTemplate() {
    return createNoTaskTemplate();
  }
}
