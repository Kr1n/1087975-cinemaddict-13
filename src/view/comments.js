import dayjs from "dayjs";
import he from "he";
import Smart from "./smart";

const createCommentsTemplate = ({comments, isDisabled, deletingId}) => {
  const commentReducer = (accumulator, {id, comment, author, date, emotion}) => {
    const dayjsDate = dayjs(date);
    const buttonText = (id === deletingId) ? `Deleting` : `Delete`;
    const disabledStyle = `style="text-decoration: none; cursor: default;" disabled`;
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
            <button class="film-details__comment-delete" data-comment-id="${id}" ${isDisabled ? disabledStyle : ``}>${buttonText}</button>
          </p>
        </div>
      </li>
    `;
    return accumulator;
  };

  const commentsElements = comments.reduce(commentReducer, ``);
  return `<div>${commentsElements}</div>`;
};

export default class Comments extends Smart {
  constructor(comments) {
    super();
    this._data = {comments, isDisabled: false, deletingId: null};
    this._callbacks = [];

    this._deleteClickHandler = this._deleteClickHandler.bind(this);
  }

  getTemplate() {
    return createCommentsTemplate(this._data);
  }

  _deleteClickHandler(evt) {
    evt.preventDefault();

    const comment = this._data.comments.find((item) => item.id === evt.target.dataset.commentId);
    this._callbacks.deleteClick(comment);
  }

  restoreHandlers() {
    const deleteButtons = this.getElement().querySelectorAll(`.film-details__comment-delete`);
    for (const button of deleteButtons) {
      button.addEventListener(`click`, this._deleteClickHandler);
    }
  }

  setButtonsDisabled(state, deletingId) {
    this.updateData({isDisabled: state, deletingId});
  }

  setDeleteClickHandler(callback) {
    this._callbacks.deleteClick = callback;
    const deleteButtons = this.getElement().querySelectorAll(`.film-details__comment-delete`);

    for (const button of deleteButtons) {
      button.addEventListener(`click`, this._deleteClickHandler);
    }
  }
}

