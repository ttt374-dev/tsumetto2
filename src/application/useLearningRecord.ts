

import { create } from "zustand"
import type { LearningEvent, LearningEventLog } from "@/domain/LearningEvent"
import { type LearningRecord } from "@/domain/learning/Learning"
import { projectLearning } from "@/domain/learning/projectionLearning"

type LearningRecordState = {
    records: LearningRecord
    setFromEventLog: (events: LearningEventLog) => void
}

export const useLearningRecordStore = create<LearningRecordState>((set) => ({
    records: {},
    setFromEventLog: (events) => set({ records: projectLearning(events) })
}))


/*
import { useMemo } from "react";
import { projectLearning } from "@/domain/learning/projectionLearning";
import type { LearningEventLog } from "@/domain/LearningEvent";
import type { LearningRecord } from "@/domain/learning/Learning";

export function useLearningRecord(eventLog: LearningEventLog): LearningRecord {
  return useMemo(() => projectLearning(eventLog), [eventLog]);
}
*/
