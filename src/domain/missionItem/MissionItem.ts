import type { Learning } from "../learning/Learning"
import type { Problem } from "../problem/Problem"

export type MissionItem = {
    problem: Problem, learning?: Learning
}