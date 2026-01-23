import { useState, useEffect } from "react";
import type { LearningRepository } from "../../domain/learning/LearningRepository";
import { Learning, type LearningRecord } from "../../domain/learning/Learning";
import type { ProblemId } from "../../domain/problem/Problem";

export function createLearningStore(repository: LearningRepository) {
    const [records, setRecords] = useState<LearningRecord>({})

    // 初期ロード
    useEffect(() => {
        reload().catch(() => setRecords({}));
    }, []);

    const reload = async () => {
        try {
            const data = await repository.load();
            setRecords(data);
        } catch {
            setRecords({});
        }
    };
    
    const update = async (problemId: string, updater: (r: Learning) => Learning) => {
        setRecords(prev => {
            const current = prev[problemId] ?? Learning.create(problemId);
            const next = {
                ...prev,
                [problemId]: updater(current),
            };
            // 永続化は next を使う
            repository.save(next).then(() => {
                //console.log("record saved", next);
            });
            return next;
        });
    };

    return {
        records,
        learningRecords: records,

        update, 
        removeMany: repository.removeMany
    }

}