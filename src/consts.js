export const FILMS_PER_PAGE = 5;
export const FILMS_IN_TOPRATED_LIST = 2;
export const FILMS_IN_MOSTCOMMENTED_LIST = 2;

export const AUTHORIZATION = `Basic adghj4gui6g`;
export const END_POINT = `https://13.ecmascript.pages.academy/cinemaddict`;

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
  MAJOR: `MAJOR`,
  INIT: `INIT`
};

export const FilterType = {
  ALL: `all`,
  WATCHLIST: `watchlist`,
  HISTORY: `history`,
  FAVORITES: `favorites`,
  NONE: `none`
};

export const MenuItem = {
  FILMS: `FILMS`,
  STATISTICS: `STATISTICS`
};

export const Period = {
  ALL: `All time`,
  TODAY: `Today`,
  WEEK: `Week`,
  MONTH: `Month`,
  YEAR: `Year`
};
