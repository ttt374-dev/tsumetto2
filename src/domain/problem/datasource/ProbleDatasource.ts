import type { Problem, ProblemDTO } from "@/domain/problem/entity/Problem";

export interface ProblemDatasource {
    findAll(): Promise<ProblemDTO[]>
    findById(id: string): Promise<ProblemDTO | undefined>
    findByTitle(id: string): Promise<ProblemDTO | undefined>

    insert(dto: ProblemDTO): Promise<void>
    insertMany(dtos: ProblemDTO[]): Promise<void>

    update(dto: ProblemDTO): Promise<void>
    updateMany(dtos: ProblemDTO[]): Promise<void>

    delete(id: string): Promise<void>
    deleteMany(ids: string[]): Promise<void>

    replaceAll(dtos: ProblemDTO[]): Promise<void>
}
