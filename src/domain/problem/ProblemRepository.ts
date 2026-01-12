import type { Problem } from "./Problem"

export interface ProblemRepository {
    load(): Promise<Problem[]>
    save(problems: Problem[]): Promise<void>
}
