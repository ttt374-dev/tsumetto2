import { create } from "zustand";
import type { LearningEvent, LearningEventLog } from "@/domain/LearningEvent";
import type { LearningEventRepository } from "@/domain/LearningEvent/LearningEventRepository";
import type { ProblemId } from "@/domain/problem/Problem";
import type { SolvedResult } from "@/domain/learning/Learning";

type LearningEventStoreState = {
  eventLog: LearningEventLog;
  repository?: LearningEventRepository;

  // repository 注入用
  initLearningEventRepository: (repo: LearningEventRepository) => void;

  reload: () => Promise<void>;
  append: (learningEvent: Omit<LearningEvent, "at">) => Promise<void>;
  review: (problemId: ProblemId, quality: SolvedResult, sec?: number) => Promise<void>;
  deleteAll: () => Promise<void>;
  deleteByProblemIds: (ids: ProblemId[]) => Promise<void>;
};

export const useLearningEventStore = create<LearningEventStoreState>((set, get) => {
  const appendQueue: LearningEvent[] = [];

  const processQueue = async (repository: LearningEventRepository) => {
    while (appendQueue.length > 0) {
      const e = appendQueue[0];
      set(state => ({ eventLog: [...state.eventLog, e] }));
      await repository.append(e);
      appendQueue.shift();
    }
  };

  return {
    eventLog: [],
    repository: undefined,

    initLearningEventRepository: (repo) => {
      set({ repository: repo });
    },

    reload: async () => {
      const repo = get().repository;
      if (!repo) return;
      try {
        const data = await repo.load();
        set({ eventLog: data });
      } catch {
        set({ eventLog: [] });
      }
    },

    append: async (learningEvent) => {
      const repo = get().repository;
      if (!repo) return;
      const event: LearningEvent = { ...learningEvent, at: Date.now() };
      appendQueue.push(event);
      if (appendQueue.length > 1) return;
      await processQueue(repo);
    },

    review: async (problemId, quality, sec) => {
      await get().append({ type: "reviewed", problemId, quality, sec });
    },

    deleteAll: async () => {
      const repo = get().repository;
      if (!repo) return;
      await repo.removeAll();
      await get().reload();
    },

    deleteByProblemIds: async (ids) => {
      const repo = get().repository;
      if (!repo) return;

      const idSet = new Set(ids);
      set(state => ({ eventLog: state.eventLog.filter(e => !idSet.has(e.problemId)) }));
      await repo.replaceAll(get().eventLog);
    },
  };
});
