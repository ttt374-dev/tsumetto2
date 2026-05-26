import type { SolvedResult } from "@/domain/review/types/solvedResult";

export function calculateScore(res: SolvedResult): number{
    let score: number = 100

    if(!res.isSolved) return 0
    if(res.isRevealed) score -= 50
    if(res.isHinted) score -= 20
    if (score > 55) score -= res.mistakes * 5
    if (res.elapsedSec > 10) score -= 10

    return Math.max(0, score)
}
