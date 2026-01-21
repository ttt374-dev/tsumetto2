import type { FilterState } from "./filter";
import type { Exercise } from "../Exercise";
import { matchMateBuckets } from "./mateFilter";

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

    // 手数
    //(e) =>
    //  !filter.mateLength ||
    //  matchMateLength(e.problem.kifData, filter.mateLength),
    // 手数バケット
    (e) => 
      !filter.mateBuckets ||
      matchMateBuckets(e.problem.kifData, filter.mateBuckets),
]

  return exerciseList.filter(e =>
    predicates.every(p => p(e))
  )
}
