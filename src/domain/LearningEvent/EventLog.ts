import type { SolvedResult } from "../mission/MissionSummary"
import type { ProblemId } from "../problem/Problem"

export type MissionId = string
//export type AppEvent = | LearningEvent | MissionEvent


type MissionEvent =
  | {
      type: "missionStarted"
      missionId: MissionId
      problemIds: ProblemId[]
      at: number
    }
  | {
      type: "missionAnswered"
      missionId: MissionId
      index: number
      problemId: ProblemId
      quality: SolvedResult
      sec?: number
      at: number
    }
  | {
      type: "missionFinished"
      missionId: MissionId
      at: number
    }

type LearningState = {
    sovledCount: number
    failedCount: number
  ef: number
  interval: number // days
  nextReviewAt?: number
}

/*
function projectLearning(
  events: LearningEvent[]
): LearningState {
  return events.reduce((state, event) => {
    if (event.type !== "reviewed") return state

        const isSolved = event.quality !== "fail"

    const { ef, interval } = calcSM2(
      state.ef,
      state.interval,
      event.quality
    )

    return {
              solvedCnt: state.solvedCnt + (isSolved ? 1 : 0),
      failedCnt: state.failedCnt + (isSolved ? 0 : 1),
      ef,
      interval,
      nextReviewAt:
        event.at + interval * 24 * 60 * 60 * 1000,
    }
  }, initialLearningState)
}
*/