// domain/problemRecord/sortProblemRecords.ts

import type { Problem } from "@/domain/problem/Problem"
import type { SortState } from "./sort"
import type { LearningRecord } from "@/domain/learning/Learning"
import type { Exercise } from "../Exercise"

export function applySort(exerciseList: Exercise[],    
  sort: SortState,
  //learningRecords?: LearningRecord
): Exercise[] {    
    const sorted = [...exerciseList]
    sorted.sort((a, b) => {
      let vA: any
      let vB: any

      const pA = a.problem
      const pB = b.problem
      const lA = a.learning
      const lB = b.learning
      
      
      switch (sort.key) {
        case "title":
          vA = pA.title ?? ""
          vB = pB.title ?? ""
          break

        case "createdAt":
          vA = pA.createdAt
          vB = pB.createdAt
          break

        case "random":
          vA = Math.random();
          vB = Math.random();
          break;
/*
        case "accuracy":
          if (!learningRecords) return 0                    
          const aAcc = calcAccuracy(rA) 
          const bAcc = calcAccuracy(rB) 
          return sort.order === "asc" ? aAcc - bAcc : bAcc - aAcc
          break
        case "easeFactor":
          if (!learningRecords) return 0
          vA = rA?.easeFactor
          vB = rB?.easeFactor
          break

        case "nextReviewedAt":
          if (!learningRecords) return 0
          vA = rA?.nextReviewedAt
          vB = rB?.nextReviewedAt
          break;


          //console.log("random", vA, vB)
          break;
*/
        default:
          return 0
      }
      //console.log("compare", sort.key, vA, vB)

      if (vA < vB) return sort.order === "asc" ? -1 : 1
      if (vA > vB) return sort.order === "asc" ? 1 : -1
      return 0
    })
    //alert("sorted")

    //console.log("sorted:", sorted)

    return sorted
}
