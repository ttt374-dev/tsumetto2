import type { Problem, ProblemId } from "./Problem"

export interface ProblemRepository {
    load(): Promise<Problem[]>
    save(problems: Problem[]): Promise<void>

    add(problem: Problem): Promise<void>
    addMany(problems: Problem[]): Promise<void>
    update(problem: Problem): Promise<void>

    remove(problemId: ProblemId): Promise<void>
    removeMany(problemIds: ProblemId[]): Promise<void>
}
