
export type SortState = {
  key: SortKey
  order: SortOrder
}

export const DefaultSortState: SortState = {
  key: 'title',
  order: 'asc'
}

export type SortKey =
  'createdAt' | 'title' | 'moveCount' |
  'accuracy' | 'easeFactor' | 'nextReviewedAt' |
  'random'
export type SortOrder = 'asc' | 'desc';

