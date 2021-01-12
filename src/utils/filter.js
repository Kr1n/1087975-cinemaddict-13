import {FilterType} from "../consts";

export const filter = {
  [FilterType.ALL]: (tasks) => (tasks),
  [FilterType.FAVORITES]: (tasks) => tasks.filter((task) => task.isFavorite),
  [FilterType.HISTORY]: (tasks) => tasks.filter((task) => task.isWatched),
  [FilterType.WATCHLIST]: (tasks) => tasks.filter((task) => task.inWatchlist),
  [FilterType.NONE]: () => []
};
