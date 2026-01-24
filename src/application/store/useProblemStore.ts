import { useState, useEffect } from "react";
import type { ProblemRepository } from "../../domain/problem/ProblemRepository";
import type { Problem } from "../../domain/problem/Problem";

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

/*
    const add = async (problem: Problem) => {
        await repository.add(problem)
        await reload()        
    }
    const addMany = async (problems: Problem[]) => {
        await repository.addMany(problems)
        await reload()
    }
    const update = async(problem: Problem) => {
        await repository.update(problem)
        await reload()
    }
    const remove = async (id: string) => {
        await repository.remove(id)
        await reload()  // Store 内 state を更新
    }
    const removeMany = async (ids: string[]) => {
        await repository.removeMany(ids)
        await reload()  // Store 内 state を更新
    }
    
    const removeAll = async () => {
        console.log("problem store: removeall")
        await repository.save([])
        await reload()
    }


    const toggleStar = async (problem: Problem) => {
        //console.log(problem)
        await repository.update(problem.toggleStar())
        await reload()
    }
    const setTitle = async (problem: Problem, title: string) => {
        await repository.update(problem.setTitle(title))
    }
        */
    return {
        // query
        problems,
        reload,
        // command
        /*
        add, addMany, update, remove, removeAll, removeMany,
        toggleStar, setTitle,
        */
        
    }
}
