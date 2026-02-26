import { create } from "zustand";

import type { LearningEventRepository } from "@/domain/learning/repository/LearningEventRepository";
import type { ProblemId } from "@/domain/problem/entity/Problem";
import type { LearningEvent, LearningEventId, LearningEventLog, NewLearningEvent } from "@/domain/learning/entity/LearningEvent";
import type { SolvedResult } from "@/domain/learning/entity/Learning";
import type { MissionId } from "@/domain/mission/entity/Mission";
import { v4 } from "uuid";

type LearningEventStoreState = {
    repo?: LearningEventRepository
    setRepository: (repo: LearningEventRepository) => void
    eventLog: LearningEventLog;
    repository?: LearningEventRepository;

    reload: () => Promise<void>;
    append: (learningEvent: NewLearningEvent) => void
    appendReview: (problemId: ProblemId, missionId: MissionId, quality: SolvedResult, sec?: number) => void
    appenCancel: (problemId: ProblemId, missionId: MissionId, targetEventId: LearningEventId) => void
};

//let repository: LearningEventRepository

function createLearningEventId(){ return v4()}

export const useLearningEventStore = create<LearningEventStoreState>((set, get) => ({
    repo: undefined,
    setRepository: (repo) => set({ repo }),
    eventLog: [],

    reload: async () => {
        try {
            const repo = get().repo
            if (!repo) throw new Error("Repository not initialized")

            const data = await repo.load();
            set({ eventLog: data });
        } catch {
            set({ eventLog: [] });
        }
    },
    append: (event: NewLearningEvent) => {
        set(state => ({
            eventLog: [...state.eventLog, { ...event, at: Date.now() }]
        }))
    },
    appendReview: (problemId: ProblemId, missionId: MissionId, quality: SolvedResult, sec?: number) => {
        const reviewEvent: LearningEvent = {
            type: "reviewed", problemId, missionId, quality, sec, id: createLearningEventId(), at: Date.now()
        }
        get().append(reviewEvent);
    },
    appenCancel: (problemId: ProblemId, missionId: MissionId, targetEventId: LearningEventId) => {
        const event: LearningEvent = {
            type: "cancel", problemId, missionId, targetEventId: targetEventId, id: createLearningEventId(), at: Date.now()
        }
        get().append(event)
    },}
));
/////////////////////////////////////////////////////////

/*
// 初期化 + subscribe で debounce 永続化
export const initLearningEventRepository = (repo: LearningEventRepository) => {
  repository = repo

  const saveRepo = debounce(async (events: LearningEventLog) => {
    try {
      await repository.replaceAll(events)
    } catch (e) {
          console.error("Failed to save learning events", e)
      }
  }, 1000) // 1秒ごとにまとめて書き出し

    let isInitializing = true
    useLearningEventStore.subscribe(state => {
        saveRepo(state.eventLog)
    })
    isInitializing = false
}
*/