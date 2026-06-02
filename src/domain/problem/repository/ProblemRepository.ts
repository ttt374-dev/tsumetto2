import { ProblemStatsTable } from "@/ui/screens/stats/components/ProblemStatsTable";
import { Problem, type ProblemId } from "../entity/Problem";
import type { ProblemDatasource } from "@/domain/problem/datasource/ProbleDatasource";

export class ProblemRepository {
    constructor(
        private readonly ds: ProblemDatasource
    ){}
    async findAll(){ 
        const dtos = await this.ds.findAll()
        return dtos.map(Problem.fromDTO)
    }
    async findById(id: ProblemId){ 
        const dto = await this.ds.findById(id)
        return dto ? Problem.fromDTO(dto) : undefined
    }
    async findByTitle(title: string){
        const dto = await this.ds.findByTitle(title)
        return dto ? Problem.fromDTO(dto) : undefined
    }
    async add(problem: Problem){ 
        await this.ds.insert(problem.toDTO())
    }
    async addMany(problems: Problem[]){
        await this.ds.insertMany(problems.map(p=>p.toDTO()))
        
    }
    async update(problem: Problem) {
        await this.ds.update(problem.toDTO())
    }
    async updateMany(problems: Problem[]) {
        //problems.map(this.update)
        await this.ds.updateMany(problems.map(p=>p.toDTO()))
    }
    async remove(pid: ProblemId) {
        await this.ds.delete(pid)
    }
    async removeMany(ids: ProblemId[]) {
        //ids.map(this.remove)
        console.log("remove many", ids)
        await this.ds.deleteMany(ids)
    }
    async replaceAll(problems: Problem[]) { // TODO: transaction
        await this.ds.replaceAll(problems.map(p=>p.toDTO()))
        //const all = await this.findAll()
        //await this.removeMany(all.map(p => p.id))
        //await this.addMany(problems)
    }
}
/*
///////////////////////////////////////////////////////
export class ProblemRepositoryOrig {
    constructor(
        private readonly persist: ProblemPersistence
    ){}

    async load(){ return await this.persist.load()}
    private async save(problems: Problem[]){ await this.persist.save(problems)}

    async findByTitle(title: string): Promise<Problem | undefined>{
        const data = await this.load()
        return data.find(p=>p.title === title)
    }    

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
}*/