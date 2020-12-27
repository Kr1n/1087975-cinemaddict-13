export const MOCK_FILMS_COUNT = 11;
export const MOCK_COMMENTS_COUNT = 100;
export const FILMS_PER_PAGE = 5;
export const FILMS_IN_TOPRATED_LIST = 2;
export const FILMS_IN_MOSTCOMMENTED_LIST = 2;

export const SortType = {
  DEFAULT: `default`,
  DATE: `date`,
  RATING: `rating`
};

export const UserAction = {
  UPDATE_FILM: `UPDATE_FILM`,
  ADD_COMMENT: `ADD_COMMENT`,
  DELETE_COMMENT: `DELETE_COMMENT`
};

export const UpdateType = {
  NONE: `NONE`,
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`
};
