
export type SortState = {
  key: SortKey
  order: SortOrder
}
/*
export const DefaultSortState: SortState = {
  key: 'createdAt',
  order: 'desc'
}
  */

export type SortKey =
  'createdAt' | 'title' | 'moveCount' |
  'accuracy' | 'easeFactor' | 'nextReviewedAt' | 'lastAnsweredAt' |
  'random'
export type SortOrder = 'asc' | 'desc';

