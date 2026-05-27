import type { Mission } from "@/domain/mission/entity/Mission"



export interface MissionDatasource {
    findAll(): Promise<Mission[]>
    findById(id: string): Promise<ProblemDTO | undefined>
    

    insert(dto: ProblemDTO): Promise<void>
    insertMany(dtos: ProblemDTO[]): Promise<void>

    update(dto: ProblemDTO): Promise<void>
    updateMany(dtos: ProblemDTO[]): Promise<void>

    delete(id: string): Promise<void>
    deleteMany(ids: string[]): Promise<void>

    replaceAll(missions: Mission[]): Promise<void>
}
