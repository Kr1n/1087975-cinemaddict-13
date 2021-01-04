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

export const getAllGenres = (films) => {
  const genres = new Set();
  for (const film of films) {
    film.genres.forEach((item)=> genres.add(item));
  }
  return Array.from(genres);
};

export const getTotalDuration = (films) => {
  const initialDuration = {hours: 0, minutes: 0};
  const reducer = (acc, item) => {
    acc.hours += item.duration.hours;
    acc.minutes += item.duration.minutes;
    return acc;
  };

  const duration = films.reduce(reducer, initialDuration);

  duration.hours += parseInt(duration.minutes / 60, 10);
  duration.minutes = duration.minutes - parseInt(duration.minutes / 60, 10) * 60;

  return duration;
};

export const getWatchedFilms = (films) => films.filter((item) => item.isWatched);

