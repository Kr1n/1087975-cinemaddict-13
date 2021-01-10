import AbstractView from "./abstract.js";

const createNoTaskTemplate = () => {
  return `<p>Loading...</p>`;
};

export default class Loading extends AbstractView {
  getTemplate() {
    return createNoTaskTemplate();
  }
}
