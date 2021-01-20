import Observer from "../utils/observer.js";

export default class Comments extends Observer {
  constructor() {
    super();
    this._comments = [];
  }

  setComments(updateType, newComments) {
    this._comments = newComments.comments.slice();
    this._notify(updateType, newComments);
  }

  getComments() {
    return this._comments;
  }

  addComment(updateType, newComment) {
    this._comments = [
      newComment,
      ...this._comments
    ];
    this._notify(updateType, newComment);
  }

  deleteComment(updateType, commentForDeletion) {
    const index = this._comments.findIndex((comment) => comment.id === commentForDeletion.id);
    if (index === -1) {
      throw new Error(`Can't delete unexisting comment`);
    }

    this._comments.splice(index, 1);

    this._notify(updateType, commentForDeletion);
  }

}
