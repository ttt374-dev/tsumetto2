import { useMemo } from "react";
import { projectLearning } from "@/domain/learning/projectionLearning";
import type { LearningEventLog } from "@/domain/LearningEvent";
import type { LearningRecord } from "@/domain/learning/Learning";

export function useLearningRecord(eventLog: LearningEventLog): LearningRecord {
  return useMemo(() => projectLearning(eventLog), [eventLog]);
}
