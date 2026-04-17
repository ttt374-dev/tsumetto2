import { deriveOutcome } from "@/domain/review/service/solvedResultDeriver"
import type { SolvedResult } from "@/domain/review/solvedResult"

type AnswerQuality = 0 | 1 | 2 | 3 | 4 | 5
// 正解評価
export function deriveAnswerQuality(solvedResult: SolvedResult): AnswerQuality {
    const outcome = deriveOutcome(solvedResult)

    if (outcome === "failed" || outcome === "abandoned") return 0
    if (solvedResult.mistakes > 4) return 2
    if (solvedResult.elapsedSec > 10) return 4
    return 5
}


