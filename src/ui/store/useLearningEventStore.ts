import { create } from "zustand";

import type { LearningEventRepository } from "@/domain/learning/repository/LearningEventRepository";
import type { ProblemId } from "@/domain/problem/entity/Problem";
import type { LearningEvent, LearningEventLog, NewLearningEvent } from "@/domain/learning/entity/LearningEvent";
import type { SolvedResult } from "@/domain/learning/entity/Learning";

type LearningEventStoreState = {
    repo?: LearningEventRepository
    setRepository: (repo: LearningEventRepository) => void
    eventLog: LearningEventLog;
    repository?: LearningEventRepository;

    reload: () => Promise<void>;
    append: (learningEvent: NewLearningEvent) => void
    review: (problemId: ProblemId, quality: SolvedResult, sec?: number) => void
};

//let repository: LearningEventRepository

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
    review: (problemId: ProblemId, quality: SolvedResult, sec?: number) => {
        const reviewEvent: LearningEvent = {
            type: "reviewed", problemId, quality, sec, at: Date.now()
        }
        get().append(reviewEvent);
    },
}
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