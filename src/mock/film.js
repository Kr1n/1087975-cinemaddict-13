import dayjs from "dayjs";
import {getRandomInteger} from "../utils";

let currentId = 1;

const generateTitle = () => {
  const title = [
    `Бегущий по лезвию`,
    `Мгла`,
    `Собачье сердце`,
    `Дракула`,
    `Парк юрского периода`,
    `Звонок`,
    `Танцующий с волками`,
  ];
  return title[getRandomInteger(0, title.length - 1)];
};

const generateDirector = () => {
  const director = [
    `Джеки Чан`,
    `Федор Бондарчук`,
    `Тимур Бекмамбетов`,
    `Квентин Тарантино`,
    `Мартин Скорсезе`,
    `Ридли Скот`,
  ];
  return director[getRandomInteger(0, director.length - 1)];
};

const generateWriters = () => {
  const writers = [
    `Люк Бессон`,
    `Квентин Тарантино`,
    `Кристофер Нолан`,
    `Питер Джексон`,
    `Вуди Аллен`,
    `Джордж Лукас`,
  ];
  return writers.filter(() => getRandomInteger(0, 1)).join(`, `);
};

const generateActors = () => {
  const actors = [
    `Джеки Чан`,
    `Одри Хепберн`,
    `Гари Олдмен`,
    `Кристин Бейл`,
    `Лео Дикаприон`,
    `Скарлет Йохансен`,
    `Харви Вайнштейн`,
    `Хит Леджер`,
    `Джон Депп`,
    `Бред Пит`,
    `Кира Найтли`
  ];
  return actors.filter(() => getRandomInteger(0, 1)).join(`, `);
};

const generateCountry = () => {
  const country = [
    `Россия`,
    `Германия`,
    `Монголия`,
    `Индия`,
    `Австралия`,
    `Румыния`,
    `Беларусь`,
  ];
  return country[getRandomInteger(0, country.length - 1)];
};

const generateGenres = () => {
  const genresCount = getRandomInteger(1, 4);
  const genres = [
    `Боевик`,
    `Мюзикл`,
    `Комедия`,
    `Треш`,
    `Вестерн`,
    `Мелодрама`,
    `Фантастика`,
  ];
  return new Set(new Array(genresCount).fill().map(() => genres[getRandomInteger(0, genres.length - 1)]));
};

const generateAgeLimit = () => {
  const ageRating = [
    `0+`,
    `6+`,
    `16+`,
    `18+`,
  ];
  return ageRating[getRandomInteger(0, ageRating.length - 1)];
};

const generateDescription = () => {
  const description = [
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget.`,
    `Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra.`,
    `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
    `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
    `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis.`,
    `Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`
  ];
  return description.slice(0, getRandomInteger(1, description.length - 1)).join(` `);
};

const generateComments = () => {
  const commentsCount = getRandomInteger(1, 10);

  return new Set(new Array(commentsCount).fill().map(() => getRandomInteger(1, 100)));
};

export const generateFilm = () => {
  return {
    id: currentId++,
    poster: `./images/posters/made-for-each-other.png`,
    title: generateTitle(),
    originalTitle: generateTitle(),
    rating: getRandomInteger(1, 10),
    director: generateDirector(),
    writers: generateWriters(),
    actors: generateActors(),
    country: generateCountry(),
    genres: generateGenres(),
    description: generateDescription(),
    ageLimit: generateAgeLimit(),
    duration: {
      hours: getRandomInteger(0, 2),
      minutes: getRandomInteger(0, 59)
    },
    releaseDate: dayjs().add(getRandomInteger(-1, -365 * 20), `day`),
    comments: generateComments(),
    inWatchlist: Boolean(getRandomInteger(0, 1)),
    isWatched: Boolean(getRandomInteger(0, 1)),
    isFavorite: Boolean(getRandomInteger(0, 1))
  };
};
