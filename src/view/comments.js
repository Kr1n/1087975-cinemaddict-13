import Abstract from "./abstract";

const createCommentsTemplate = (comments = {}) => {
  const commentReducer = (accumulator, {message, author, date, emoji}) => {
    accumulator += `
      <li class="film-details__comment">
        <span class="film-details__comment-emoji">
          <img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">
        </span>
        <div>
          <p class="film-details__comment-text">${message}</p>
          <p class="film-details__comment-info">
            <span class="film-details__comment-author">${author}</span>
            <span class="film-details__comment-day">${date.format(`DD/MM/YYYY HH:mm`)}</span>
            <button class="film-details__comment-delete">Delete</button>
          </p>
        </div>
      </li>
    `;
    return accumulator;
  };

  const commentsElements = comments.reduce(commentReducer, ``);

  return `<section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

        <ul class="film-details__comments-list">
          ${commentsElements}
        </ul>

        <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label"></div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
          </label>

          <div class="film-details__emoji-list">
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
              <label class="film-details__emoji-label" for="emoji-smile">
                <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
                <label class="film-details__emoji-label" for="emoji-sleeping">
                  <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
                  <label class="film-details__emoji-label" for="emoji-puke">
                    <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                  </label>

                  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
                    <label class="film-details__emoji-label" for="emoji-angry">
                      <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
                    </label>
          </div>
        </div>
      </section>`;
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
