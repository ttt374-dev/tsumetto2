import type { LearningRecord } from "@/domain/learning/Learning";
import type { ProblemId } from "@/domain/problem/Problem";
import { ProblemStats } from "@/domain/problem/ProblemStats";
import { useMemo } from "react";

export function useProblemStats(ids: ProblemId[], learningRecords: LearningRecord) {    
    const stats = useMemo(()=>ProblemStats.create(ids, learningRecords), 
    [[ids, learningRecords]])
    return stats
    
}
