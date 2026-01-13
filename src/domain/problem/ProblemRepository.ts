import type { Problem } from "./Problem"

export interface ProblemRepository {
    load(): Promise<Problem[]>
    save(problems: Problem[]): Promise<void>

    add(problem: Problem): Promise<void>
    addMany(problems: Problem[]): Promise<void>
    update(problem: Problem): Promise<void>
}
