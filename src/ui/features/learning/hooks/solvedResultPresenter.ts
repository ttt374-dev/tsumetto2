import { deriveOutcome } from "@/domain/review/service/solvedResultDeriver";
import type { SolvedResult } from "@/domain/review/solvedResult";

export function toSolvedResultViewData(res: SolvedResult){
    const outcome = deriveOutcome(res)
    
    const outcomeText = outcome === "solved" ? "成功" : outcome === "failed" ? "失敗" : "未回答"
    const mistakesText = res.mistakes > 0 ? `(${res.mistakes}miss)` : ""
    const revealedText = res.isRevealed ? `[解答参照]` : ""
    const summaryText = `${outcomeText} ${mistakesText}${revealedText} (${res.elapsedSec}s)`

    return { outcomeText, mistakesText, revealedText, summaryText,}    
}