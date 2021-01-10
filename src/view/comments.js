import Abstract from "./abstract";
import dayjs from "dayjs";
import he from "he";

const createCommentsTemplate = (comments) => {
  const commentReducer = (accumulator, {id, message, author, date, emoji}) => {
    const dayjsDate = dayjs(date);
    accumulator += `
      <li class="film-details__comment">
        <span class="film-details__comment-emoji">
          <img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">
        </span>
        <div>
          <p class="film-details__comment-text">${he.encode(message)}</p>
          <p class="film-details__comment-info">
            <span class="film-details__comment-author">${author}</span>
            <span class="film-details__comment-day">${dayjsDate.format(`DD/MM/YYYY HH:mm`)}</span>
            <button class="film-details__comment-delete" data-comment-id="${id}">Delete</button>
          </p>
        </div>
      </li>
    `;
    return accumulator;
  };

  const commentsElements = comments.reduce(commentReducer, ``);

  return commentsElements;
};

export default class Comments extends Abstract {
  constructor(comments) {
    super();
    this._comments = comments;
    this._callbacks = [];

    this._onDeleteHandler = this._onDeleteHandler.bind(this);
  }

  getTemplate() {
    return createCommentsTemplate(this._comments);
  }

  _onDeleteHandler(evt) {
    evt.preventDefault();
    this._callbacks.deleteClick();
  }

  setDeleteClickHandler(callback) {
    this._callbacks.deleteClick = callback;
    this.getElement().querySelector(`.film-details__comment-delete`).addEventListener(`click`, this._onDeleteHandler);
  }
}
