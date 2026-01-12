import type { Problem } from "../../domain/problem/Problem";
import type { ProblemRepository } from "../../domain/problem/ProblemRepository";
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";

const LIB_FILE = "problem.json";

/**
 * Capacitor Filesystem を使った ProblemRepository 実装
 */
export class FileProblemRepository implements ProblemRepository {

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
                    : await result.data.text();

            const parsed = JSON.parse(dataStr);
            if (Array.isArray(parsed)) {
                return parsed as Problem[];
            }
            return [];
        } catch (e) {
            // ファイル未存在などは空配列扱い
            return [];
        }
    }

    async save(collection: Problem[]): Promise<void> {
        await Filesystem.writeFile({
            path: LIB_FILE,
            data: JSON.stringify(collection),
            directory: Directory.Data,
            encoding: Encoding.UTF8,
        });
    }

    async add(problem: Problem): Promise<void> {
        const records = await this.load();
        const next = [...records, problem];
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
