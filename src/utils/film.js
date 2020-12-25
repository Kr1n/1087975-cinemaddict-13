import dayjs from "dayjs";

const getWeightForNullDate = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
};

export const sortFilmDate = (filmA, filmB) => {
  const weight = getWeightForNullDate(filmA.releaseDate, filmB.releaseDate);

  if (weight !== null) {
    return weight;
  }

  return dayjs(filmA.releaseDate).diff(dayjs(filmB.releaseDate));
};

export const sortFilmRating = (filmA, filmB) => {
  const weight = getWeightForNullDate(filmA.releaseDate, filmB.releaseDate);

  if (weight !== null) {
    return weight;
  }

  return dayjs(filmB.releaseDate).diff(dayjs(filmA.releaseDate));
};
