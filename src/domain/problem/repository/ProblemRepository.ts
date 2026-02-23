import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import { Problem, type ProblemDTO } from "../entity/Problem";

export class ProblemRepository {
    constructor(
        private readonly persist: ProblemPersistence
    ){}

    async load(){ return await this.persist.load()}
    private async save(problems: Problem[]){ await this.persist.save(problems)}

    

    async add(problem: Problem): Promise<void> {
        console.log("add problem", problem)
        const prev = await this.load();
        if (prev.some(p => p.id === problem.id)) {
            throw new Error("duplicate problem id")
        }
        const next = [...prev, problem];
        await this.save(next);
    }
    async addMany(problems: Problem[]): Promise<void> {
        const prev = await this.load();
        const next = [...prev, ...problems];
        await this.save(next);
    }

    async update(problem: Problem): Promise<void> {
        const prev = await this.load();
        const index = prev.findIndex(p => p.id === problem.id);
        if (index === -1){
            throw new Error("problem not found")
        }
        const next = [...prev];
        next[index] = problem;

        await this.save(next);
    }
    async updateMany(problems: Problem[]): Promise<void> {
        const prev = await this.load();

        // id → index のマップを作る
        const indexMap = new Map<string, number>();
        prev.forEach((p, i) => {
            indexMap.set(p.id, i);
        });

        const next = [...prev];

        for (const problem of problems) {
            const index = indexMap.get(problem.id);

            if (index === undefined) {
                throw new Error(`problem not found: ${problem.id}`);
            }
            next[index] = problem;
        }

        await this.save(next);
    }

    async remove(problemId: string): Promise<void> {
        const prev = await this.load();
        const next = prev.filter(p => p.id !== problemId);
        await this.save(next);
    }

    async removeMany(ids: string[]): Promise<void> {
        if (!ids || ids.length === 0) return;

        const prev = await this.load();
        const next = prev.filter(p => !ids.includes(p.id));
        await this.save(next);
    }
    async removeAll(): Promise<void>{
        await this.save([])
    }
        
    async replaceAll(problems: Problem[]){
        await this.save(problems)
    }
}
/////////////////////////
const PROBLEM_FILE = "problems.json"

export interface ProblemPersistence {
    load(): Promise<Problem[]>
    save(problems: Problem[]): Promise<void>    
}

export class LocalStrorageProblemPersistence implements ProblemPersistence {
    async load(): Promise<Problem[]> {
        try {
            const result = await Filesystem.readFile({
                path: PROBLEM_FILE,
                directory: Directory.Data,
                encoding: Encoding.UTF8,
            });
            const dataStr =
                typeof result.data === "string"
                    ? result.data
                    : await result.data.text()
            const dtos: ProblemDTO[] = JSON.parse(dataStr)
            //dtos.map(dto => {
            //    const p = Problem.fromDTO(dto)
            //
            //})
            return dtos.map(dto =>
                Problem.fromDTO(dto)
            )
        } catch (e) {
            console.error("problem store load error", e)
            return [];
            //throw e
        }
    }
    async save(problems: Problem[]){
        const dtos: ProblemDTO[] = problems.map(p => (p.toDTO()))
        console.log("save problem persis", problems)
        try {
            await Filesystem.writeFile({
                path: PROBLEM_FILE,
                data: JSON.stringify(dtos),
                directory: Directory.Data,
                encoding: Encoding.UTF8,
            });
            //console.log("learning events store saved", events)
        } catch (e){
            console.error("problem store write error", e)
            throw e
        }
    }
}