import type { Problem, ProblemId } from "./Problem"

export interface ProblemRepositoryOld {
    load(): Promise<Problem[]>
    save(problems: Problem[]): Promise<void>

    add(problem: Problem): Promise<void>
    addMany(problems: Problem[]): Promise<void>
    update(problem: Problem): Promise<void>

    remove(problemId: ProblemId): Promise<void>
    removeMany(problemIds: ProblemId[]): Promise<void>
}

export class ProblemRepository {
    constructor(
        private readonly store: ProblemPersistence
    ){}

    async load(){ return this.store.load()}
    private async save(problems: Problem[]){ this.store.save(problems)}

    async add(problem: Problem): Promise<void> {
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
}


/////////////////////////

export interface ProblemPersistence {
    load(): Promise<Problem[]>
    save(problems: Problem[]): Promise<void>    
}

export class FileProblemPersistence implements ProblemPersistence {
    async load(): Promise<Problem[]>{
        return []
    }
    async save(problems: Problem[]){

    }
}