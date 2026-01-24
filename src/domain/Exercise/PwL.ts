import type { Learning } from "../learning/Learning"
import type { Problem } from "../problem/Problem"

export type ProblemWithLearning = {
    problem: Problem
    learning?: Learning
}

