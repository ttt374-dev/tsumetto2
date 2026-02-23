import { create } from "zustand";
import { debounce } from "lodash"

import type { LearningEventRepository } from "@/domain/learning/repository/LearningEventRepository";
import type { ProblemId } from "@/domain/problem/entity/Problem";
import type { LearningEvent, LearningEventLog, NewLearningEvent } from "@/domain/learning/entity/LearningEvent";
import type { SolvedResult } from "@/domain/learning/entity/Learning";

type LearningEventStoreState = {
    eventLog: LearningEventLog;
    repository?: LearningEventRepository;

    reload: () => Promise<void>;
    append: (learningEvent: NewLearningEvent) => Promise<void>;
    review: (problemId: ProblemId, quality: SolvedResult, sec?: number) => Promise<void>;
};

let repository: LearningEventRepository

export const useLearningEventStore = create<LearningEventStoreState>((set, get) => {
    return {
        eventLog: [],

        reload: async () => {
            try {
                const data = await repository.load();
                set({ eventLog: data });
            } catch {
                set({ eventLog: [] });
            }
        },
        append: async (event: NewLearningEvent) => {
            set(state => ({
                eventLog: [...state.eventLog, { ...event, at: Date.now() }]
            }))
        },
        review: async (problemId: ProblemId, quality: SolvedResult, sec?: number) => {
            const reviewEvent: LearningEvent = {
                type: "reviewed", problemId, quality, sec, at: Date.now()
            }
            await get().append(reviewEvent);
        },
    };
});
/////////////////////////////////////////////////////////
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
