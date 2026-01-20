import type { FilterState } from "./filter";
import type { Exercise } from "../Exercise";

//////////////////////////////////
export const applyFilter = (
  exerciseList: Exercise[],
  filter: FilterState
): Exercise[] => {
  const now = Date.now()

  const predicates: Array<(e: Exercise) => boolean> = [
    // 未回答のみ
    (e) =>
      !filter.unansweredOnly ||
      !(e.learning && e.learning.solvedCount + e.learning.failedCount > 0),

    // ミッション対象
    (e) =>
      !filter.isMissionTarget ||
      e.learning?.nextReviewedAt === undefined ||
      e.learning.nextReviewedAt <= now,

    // スターつきのみ
    (e) =>
      !filter.starredOnly ||
      e.problem.starred,
  ]

  return exerciseList.filter(e =>
    predicates.every(p => p(e))
  )
}
