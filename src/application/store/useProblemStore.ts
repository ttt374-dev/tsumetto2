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

    const addProblem = async (problem: Problem) => {
        await repository.add(problem)
        await reload()        
    }
    const addProblems = async (problems: Problem[]) => {
        await repository.addMany(problems)
        await reload()
    }
    const update = async(problem: Problem) => {
        await repository.update(problem)
        await reload()
    }
    const deleteProblem = async (id: string) => {
        await repository.remove(id)
        await reload()  // Store 内 state を更新


    }
    const toggleStar = async (problem: Problem) => {
        //console.log(problem)
        await repository.update(problem.toggleStar())
        await reload()
    }
    const setTitle = async (problem: Problem, title: string) => {
        await repository.update(problem.setTitle(title))
    }
    const clearAll = async () => {
        await repository.save([])
        await reload()
    }

    return {
        // query
        problems,

        // command
        reload,
        addProblem, addProblems, deleteProblem,
        update,
        toggleStar,
        setTitle,
        clearAll
    }
}
