import { create } from "zustand";

import type { LearningRecord } from "@/domain/learning/Learning";
import { useLearningEventStore } from "./store/useLearningEventStore";
import { projectLearning } from "@/domain/learning/projectionLearning";
import type { LearningEventLog } from "@/domain/LearningEvent";


type LearningRecordStoreState = {
  records: LearningRecord;
  //updateFromEventLog: (eventLog: ReturnType<typeof useLearningEventStore>['eventLog']) => void;
  updateFromEventLog: (eventLog: LearningEventLog) => void;
};

export const useLearningRecordStore = create<LearningRecordStoreState>((set) => ({
  records: {},

  updateFromEventLog: (eventLog) => {
    set({ records: projectLearning(eventLog) });
  },
}));

// --- 自動同期用のサブスクライバ ---
useLearningEventStore.subscribe((state) => {
  // state は store 全体
  useLearningRecordStore.getState().updateFromEventLog(state.eventLog);
});
