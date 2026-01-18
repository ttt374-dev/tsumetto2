import type { Learning } from "../learning/Learning"
import type { Problem } from "../problem/Problem"


export type MissionItem = {
    problem: Problem, 
    learning?: Learning
}


/*
export class MissionItem {
  constructor(
    readonly problem: Problem,
    private readonly learning: Learning | null
  ) {}

  get hasResult(): boolean {
    return this.learning !== null
  }

  get getLearning(): Learning {
    if (!this.learning) {
      throw new Error("Learning does not exist")
    }
    return this.learning
  }
}
*/