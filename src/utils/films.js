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

export const getAllGenres = (data) => {
  const films = data;
  const genres = new Set();
  for (const film of films) {
    film.genres.forEach((item)=> genres.add(item));
  }
  return Array.from(genres);
};

export const getTotalDuration = (films) => {
  const initialDuration = {hours: 0, minutes: 0};
  const reducer = (acc, item, index, array) => {
    acc.hours += item.duration.hours;
    acc.minutes += item.duration.minutes;

    if (index === (array.length - 1)) {
      acc.hours += parseInt(acc.minutes / 60, 10);
      acc.minutes = acc.minutes - parseInt(acc.minutes / 60, 10) * 60;
    }
    return acc;
  };

  const duration = films.reduce(reducer, initialDuration);

  return duration;
};

export const getWatchedFilms = (films) => films.filter((item) => item.isWatched);

