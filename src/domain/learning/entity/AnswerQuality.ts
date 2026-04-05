import type { SolvedResult } from "@/domain/review/solvedResult"

type AnswerQuality = 0 | 1 | 2 | 3 | 4 | 5
// 正解評価
export function deriveAnswerQuality(solvedResult: SolvedResult): AnswerQuality {
    if (solvedResult.outcome === "failed") return 0
    if (solvedResult.mistakes > 1) return 2
    if (solvedResult.elapsedSec > 10) return 4
    return 5
}


