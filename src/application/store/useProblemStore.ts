import { useState, useEffect } from "react";
import type { ProblemRepository } from "../../domain/problem/ProblemRepository";
import type { Problem } from "../../domain/problem/Problem";

export function createProblemStore(repository: ProblemRepository) {
    const [problems, setProblems] = useState<Problem[]>([]);

    // 初期ロード
    useEffect(() => {
        reload().catch(() => setProblems([]));
    }, []);

    const reload = async () => {
        try {
            const data = await repository.load();
            setProblems(data);
        } catch {
            setProblems([]);
        }
    };

    return {
        problems,
    }
}
