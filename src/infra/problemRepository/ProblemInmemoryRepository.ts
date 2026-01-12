
import type { Problem } from "../../domain/problem/Problem";
import type { ProblemRepository } from "../../domain/problem/ProblemRepository";
export class InMemoryProblemRepository implements ProblemRepository {
    private problems: Problem[];

    constructor(initial?: Problem[]) {
        // 防御的コピー
        this.problems = initial ? [...initial] : [];
    }

    async load(): Promise<Problem[]> {
        // 外部から直接 mutate されないようコピーを返す
        return [...this.problems];
    }

    async save(collection: Problem[]): Promise<void> {
        // 完全置き換え
        this.problems = [...collection];
    }
    async add(problem: Problem): Promise<void> {
        this.problems = [...this.problems, problem];
    }

    async remove(problemId: string): Promise<void> {
        const next = this.problems.filter(p => p.id !== problemId);
        this.problems = next;
    }

    async removeMany(ids: string[]): Promise<void> {
        if (!ids || ids.length === 0) return;

        const idSet = new Set(ids);
        this.problems = this.problems.filter(p => !idSet.has(p.id));
    }
}
