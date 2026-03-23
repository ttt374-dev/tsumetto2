import { create } from "zustand";

import { useReviewEventStore } from "./useReviewEventStore";
import { projectLearning } from "@/domain/learning/service/projectionLearning";
import type { LearningRecord } from "@/domain/learning/entity/Learning";
import type { ReviewEventLog } from "@/domain/learning/entity/ReviewEvent";


type LearningRecordStoreState = {
  records: LearningRecord;
  updateFromEventLog: (eventLog: ReviewEventLog) => void;
};

export const useLearningRecordStore = create<LearningRecordStoreState>((set) => ({
  records: {},

  updateFromEventLog: (eventLog) => {
    set({ records: projectLearning(eventLog) });
  },
}));

// --- 自動同期用のサブスクライバ ---
useReviewEventStore.subscribe((state) => {
  // state は store 全体
  useLearningRecordStore.getState().updateFromEventLog(state.eventLog);
});
