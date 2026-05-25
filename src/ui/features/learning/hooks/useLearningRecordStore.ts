import { create } from "zustand";

import type { ReviewEventLog } from "@/domain/review/ReviewEvent";
import type { ProblemId } from "@/domain/problem/entity/Problem";
import { projectLearningState } from "@/domain/learning/service/projectLearningState";
import type { LearningState } from "@/domain/learning/entity/LearningState";
import { useReviewEventStore } from "@/ui/features/learning/hooks/useReviewEventStore";


type LearningRecordStoreState = {
    //records: LearningRecord;
    stateRecords: Record<ProblemId, LearningState>
    //getState: (id: ProblemId) => LearningState
    updateFromEventLog: (eventLog: ReviewEventLog) => void;
};

export const useLearningRecordStore = create<LearningRecordStoreState>((set, get) => ({
    //records: {},
    stateRecords: {},
    //getState: (id: ProblemId) => get().stateRecords[id],

    updateFromEventLog: (eventLog) => {
        set({
            //records: projectLearning(eventLog),
            stateRecords: projectLearningState(eventLog),
        });
    },
}));

// --- 自動同期用のサブスクライバ ---
useReviewEventStore.subscribe((state) => {
    // state は store 全体
    useLearningRecordStore.getState().updateFromEventLog(state.eventLog);
});
