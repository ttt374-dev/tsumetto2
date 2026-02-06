import { useState, useEffect, useMemo } from "react";
import type { ProblemRepository } from "../../domain/problem/ProblemRepository";
import type { Problem, ProblemId } from "../../domain/problem/Problem";

export function useProblemStore(repository: ProblemRepository) {
    const [problems, setProblems] = useState<Problem[]>([]);

    const reload = async () => {
        try {
            const data = await repository.load();
            setProblems(data);
        } catch {
            setProblems([]);
        }
    };
    // 初期ロード
    useEffect(() => {
        reload().catch(() => setProblems([]));
        
    }, [repository]);

    const findById = (pid: ProblemId): Problem | undefined => {
        return problems.find(p=>p.id===pid)
    }

    const allTags = useMemo(
        () => Array.from(new Set(problems.flatMap(p => p.tags))),
        [problems]
    )

    return {
        // query
        problems,
        reload,
        findById,
        allTags,
    }
}
