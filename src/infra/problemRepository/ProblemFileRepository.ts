import { Problem, type ProblemDTO } from "../../domain/problem/Problem";
import type { ProblemRepository } from "../../domain/problem/ProblemRepository";
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";

const LIB_FILE = "problem.json";

/**
 * Capacitor Filesystem を使った ProblemRepository 実装
 */
export class ProblemFileRepository implements ProblemRepository {
    async load(): Promise<Problem[]> {
        try {            
            const result = await Filesystem.readFile({
                path: LIB_FILE,
                directory: Directory.Data,
                encoding: Encoding.UTF8,
            });
            const dataStr =
                typeof result.data === "string"
                    ? result.data
                    : await result.data.text()
            const dtos: ProblemDTO[] = JSON.parse(dataStr)
            console.log("load", dtos)
            dtos.map(dto => {
                const p = Problem.fromDTO(dto)

            })
            return dtos.map(dto =>
                Problem.fromDTO(dto)
            )
        } catch (e) {
            return [];
        }
    }

    async save(problems: Problem[]): Promise<void> {
        const dtos: ProblemDTO[] = problems.map(p => (p.toDTO()))

        console.log("save repo", dtos)
        await Filesystem.writeFile({
            path: LIB_FILE,
            data: JSON.stringify(dtos),
            directory: Directory.Data,
            encoding: Encoding.UTF8,
        });
    }

    async add(problem: Problem): Promise<void> {
        const records = await this.load();
        const next = [...records, problem];
        await this.save(next);
    }
    async addMany(problems: Problem[]): Promise<void> {
        const records = await this.load();
        const next = [...records, ...problems];
        await this.save(next);
    }

    async update(problem: Problem): Promise<void> {
        const problems = await this.load();
        const index = problems.findIndex(p => p.id === problem.id);
        if (index === -1) return

        const next = [...problems];
        next[index] = problem;

        await this.save(next);
    }
    async remove(problemId: string): Promise<void> {
        const problems = await this.load();
        const next = problems.filter(p => p.id !== problemId);
        await this.save(next);
    }

    async removeMany(ids: string[]): Promise<void> {
        if (!ids || ids.length === 0) return;

        const problems = await this.load();
        const next = problems.filter(p => !ids.includes(p.id));
        await this.save(next);
    }
}
