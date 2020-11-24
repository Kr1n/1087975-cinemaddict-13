import {createShowMoreTemplate} from "./showMore.js";
import {createFilmCardTemplate} from "./filmCard.js";

const CARD_COUNT = 5;
const EXTRA_CARD_COUNT = 2;

export const createFilmsList = () => {
  return `
    <section class="films">` +
    createContentFilmsList() +
    createTopRatedFilmsList() +
    createMostCommentedFilmsList() + `
    </section>`;
};

const createContentFilmsList = () => {

  let cardList = ``;
  for (let i = 0; i < CARD_COUNT; i++) {
    cardList += createFilmCardTemplate();
  }

  return `
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
      <div class="films-list__container">` + cardList + `
      </div>
    </section>` + createShowMoreTemplate();
};

const createTopRatedFilmsList = () => {

  let cardList = ``;
  for (let i = 0; i < EXTRA_CARD_COUNT; i++) {
    cardList += createFilmCardTemplate();
  }

  return `
    <section class="films-list films-list--extra">
      <h2 class="films-list__title">Top rated</h2>
      <div class="films-list__container">` + cardList + `
      </div>
    </section>`;
};

const createMostCommentedFilmsList = () => {

  let cardList = ``;
  for (let i = 0; i < EXTRA_CARD_COUNT; i++) {
    cardList += createFilmCardTemplate();
  }

  return `
    <section class="films-list films-list--extra">
      <h2 class="films-list__title">Most commented</h2>
      <div class="films-list__container">` + cardList + `
      </div>
    </section>`;
};
