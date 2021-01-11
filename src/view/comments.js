import dayjs from "dayjs";
import he from "he";
import Abstract from "./abstract";

const createCommentsTemplate = (comments) => {
  const commentReducer = (accumulator, {id, comment, author, date, emotion}) => {
    const dayjsDate = dayjs(date);
    accumulator += `
      <li class="film-details__comment">
        <span class="film-details__comment-emoji">
          <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
        </span>
        <div>
          <p class="film-details__comment-text">${he.encode(comment)}</p>
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
  return `<div>${commentsElements}</div>`;
};

export default class Comments extends Abstract {
  constructor(comments) {
    super();
    this._comments = comments;
    this._callbacks = [];
    this._deleteClickHandler = this._deleteClickHandler.bind(this);
  }

  getTemplate() {
    return createCommentsTemplate(this._comments);
  }

  _deleteClickHandler(evt) {
    evt.preventDefault();

    const comment = this._comments.find((item) => item.id === evt.target.dataset.commentId);
    this._scrollTop = this.getElement().scrollTop;
    this._callbacks.deleteClick(comment);
  }

  setDeleteClickHandler(callback) {
    this._callbacks.deleteClick = callback;
    const deleteButtons = this.getElement().querySelectorAll(`.film-details__comment-delete`);

    for (const button of deleteButtons) {
      button.addEventListener(`click`, this._deleteClickHandler);
    }
  }
}

