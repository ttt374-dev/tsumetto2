import type { ProblemId } from "@/domain/problem/entity/Problem";
import type { SolvedResult } from "@/domain/review/solvedResult";
import { useReviewEventStore } from "@/ui/store/useReviewEventStore";

export function evaluateScore(res: SolvedResult): number{
    let score: number = 1

    if(!res.isSolved) return 0
    if(res.isRevealed) score -= 0.5
    score -= res.mistakes * 0.05
    if (res.elapsedSec > 10) score -= 0.1

    return Math.max(0, score)
}

export function evaluateProblemScore(id: ProblemId): number {
    const events = useReviewEventStore(s=>s.eventLog).filter(e=>e.type ==="reviewed").filter(e=>e.id===id)

    const results = events.map(e=>e.solvedResult)
    return average(results.map(res=>evaluateScore(res)))   
    
}


function average(nums: number[]): number {
    if (nums.length === 0) return 0 // or throw Error
    const sum = nums.reduce((acc, n) => acc + n, 0)
    return sum / nums.length
}721