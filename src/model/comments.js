import Observer from "../utils/observer.js";

export default class Comments extends Observer {
  constructor() {
    super();
    this._comments = [];
  }

  setComments(updateType, data) {
    this._comments = data.comments.slice();
    this._notify(updateType, data);
  }

  getComments() {
    return this._comments;
  }

  addComment(updateType, update) {
    this._comments = [
      update,
      ...this._comments
    ];
    this._notify(updateType, update);
  }

  deleteComment(updateType, update) {
    const index = this._comments.findIndex((comment) => comment.id === update.id);
    if (index === -1) {
      throw new Error(`Can't delete unexisting comment`);
    }

    this._comments.splice(index, 1);

    this._notify(updateType, update);
  }

}
