import type { Learning } from "../learning/Learning"
import type { Problem } from "../problem/Problem"


export type Exercise = {
    problem: Problem, 
    learning?: Learning
}


