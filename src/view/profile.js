export const createProfileTemplate = (films) => {
  let watchedCount = 0;

  if (films) {
    films.forEach(({isWatched}) => (isWatched) ? watchedCount++ : watchedCount);
  }

  return `<section class="header__profile profile">
  <p class="profile__rating">${getRank(watchedCount)}</p>
  <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
</section>`;
};

const getRank = (watchedCount = 0) => {
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
