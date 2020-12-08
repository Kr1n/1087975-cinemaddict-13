import Abstract from "./abstract";

const createProfileTemplate = (films = []) => {
  const initialCount = 0;
  const watchedCount = films.reduce((watched, item) => watched + Number(item.isWatched), initialCount);

  return `<section class="header__profile profile">
  <p class="profile__rating">${getRankLabel(watchedCount)}</p>
  <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
</section>`;
};

const getRankLabel = (watchedCount = 0) => {
  if (watchedCount > 1 && watchedCount <= 10) {
    return `novice`;
  } else if (watchedCount > 10 && watchedCount <= 20) {
    return `fan`;
  } else if (watchedCount > 20) {
    return `movie buff`;
  } else {
    return ``;
  }
};

export default class Profile extends Abstract {
  constructor(films) {
    super();
    this._films = films;
  }

  getTemplate() {
    return createProfileTemplate(this._films);
  }
}
