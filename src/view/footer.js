import Abstract from "./abstract";

const createFooterStatisticsTemplate = (films = {}) => {
  return `<p>${films.length ? films.length : 0 } movies inside</p>`;
};

export default class FooterStatistics extends Abstract {
  constructor(films) {
    super();
    this.films = films;
  }

  getTemplate() {
    return createFooterStatisticsTemplate(this.films);
  }
}
