import { create } from "zustand";

import { useLearningEventStore } from "./useLearningEventStore";
import { projectLearning } from "@/domain/learning/service/projectionLearning";
import type { LearningRecord } from "@/domain/learning/entity/Learning";
import type { LearningEventLog } from "@/domain/learning/entity/LearningEvent";


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
