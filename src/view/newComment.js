import Smart from "./smart";

const createNewCommentTemplate = (data) => {
  const {selectedEmoji, newCommentText} = data;

  return `<div class="film-details__new-comment">
          <div class="film-details__add-emoji-label">
          ${selectedEmoji ? `<img src="images/emoji/${selectedEmoji}.png" width="55" height="55" alt="emoji-${selectedEmoji}">` : ``}
        </div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${newCommentText}</textarea>
          </label>

          <div class="film-details__emoji-list">
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" ${selectedEmoji === `smile` ? `checked` : ``}/>
              <label class="film-details__emoji-label" for="emoji-smile">
                <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping" ${selectedEmoji === `sleeping` ? `checked` : ``}/>
                <label class="film-details__emoji-label" for="emoji-sleeping">
                  <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke" ${selectedEmoji === `puke` ? `checked` : ``}/>
                  <label class="film-details__emoji-label" for="emoji-puke">
                    <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                  </label>

                  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry" ${selectedEmoji === `angry` ? `checked` : ``}/>
                    <label class="film-details__emoji-label" for="emoji-angry">
                      <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
                    </label>
          </div>
        </div>`;
};

export default class NewComment extends Smart {
  constructor() {
    super();

    this._data = {selectedEmoji: null, newCommentText: ``};

    this._commentTextInputHandler = this._commentTextInputHandler.bind(this);
    this._emojiChangeHandler = this._emojiChangeHandler.bind(this);

    this._setInnerHandlers();
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector(`.film-details__emoji-list`)
      .addEventListener(`change`, this._emojiChangeHandler);

    this.getElement()
      .querySelector(`.film-details__comment-input`)
      .addEventListener(`input`, this._commentTextInputHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();
  }

  _commentTextInputHandler(evt) {
    evt.preventDefault();
    this.updateData({newCommentText: evt.target.value}, true);
  }

  _emojiChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({selectedEmoji: evt.target.value});
  }

  getTemplate() {
    return createNewCommentTemplate(this._data);
  }
}
