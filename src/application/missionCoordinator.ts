/*
import { v4 } from "uuid"
import type { useMissionEventStore } from "./store/useMissionEventStore"
import type { MissionId } from "@/domain/MissionEvent/MissionEvent"

export type DeckId = string
class DeckRepository{

}

type FilterCondition =
  | { type: "dueForReview" }
  | { type: "unanswered" }
  | { type: "minStar"; value: number }
//  | { type: "tag"; tagId: TagId }

type DeckFilter = {
  conditions: FilterCondition[]
}

type FilterSnapshot = {
      createdAt: Date
  conditions: FilterConditionSnapshot[]
}

type FilterConditionSnapshot =
  | { type: "dueForReview" }
  | { type: "unanswered" }
  | { type: "minStar"; value: number }
//  | { type: "tag"; tagId: TagId }


type MissionStarted = {
  type: "MissionStarted"
  missionId: MissionId
  deckId: DeckId
  filterSnapshot: FilterSnapshot
  startedAt: Date
}
export function createFilterSnapshot(
  filter: DeckFilter
): FilterSnapshot {
  return {
    createdAt: new Date(),
    conditions: filter.conditions.map(cloneCondition),
  }
}

function cloneCondition(
  condition: FilterCondition
): FilterConditionSnapshot {
  return { ...condition }
}

export class MissionCoordinator {
  constructor(
    private readonly deckRepository: DeckRepository,
    private readonly missionEventStore: ReturnType<typeof useMissionEventStore>,
    //private readonly clock: Clock = systemClock,
  ) {}

  startMission(deckId: DeckId): MissionId {
    // 1. Deck を取得
    const deck = this.deckRepository.get(deckId)
    if (!deck) {
      throw new Error(`Deck not found: ${deckId}`)
    }

    // 2. フィルタースナップショットを作成
    const filterSnapshot = createFilterSnapshot(deck.filter)

    // 3. MissionId を生成
    const missionId = v4()

    // 4. MissionStarted イベントを append
    this.missionEventStore.append({
      type: "MissionStarted",
      missionId,
      deckId,
      filterSnapshot,
      startedAt: new Date(),
    })

    return missionId
  }

  abortMission(reason?: string) {
    this.missionEventStore.append({
      type: "MissionAborted",
      abortedAt: this.clock.now(),
      reason,
    })
  }
}
*/