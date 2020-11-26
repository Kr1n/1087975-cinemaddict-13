import dayjs from "dayjs";
import {getRandomInteger} from "../utils.js";

let currentId = 1;

const generateText = () => {
  const text = [
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget.`,
    `Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra.`,
    `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
    `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
    `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis.`,
    `Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`
  ];
  return text.slice(0, getRandomInteger(1, text.length - 1)).join(` `);
};

const generateAuthor = () => {
  const author = [
    `Джеки Чан`,
    `Федор Бондарчук`,
    `Тимур Бекмамбетов`,
    `Квентин Тарантино`,
    `Мартин Скорсезе`,
    `Ридли Скот`,
  ];
  return author[getRandomInteger(0, author.length - 1)];
};

const generateEmoji = () => {
  const emoji = [`smile`, `sleeping`, `puke`, `angry`];
  return emoji[getRandomInteger(0, emoji.length - 1)];
};


export const generateComment = () => {
  return {
    id: currentId++,
    text: generateText(),
    author: generateAuthor(),
    date: dayjs().add(getRandomInteger(-1, -365 * 10), `day`),
    emoji: generateEmoji(),
  };
};
