import type { SolvedResult } from "@/domain/review/solvedResult";

export function toSolvedResultViewData(res: SolvedResult){
    
    const outcomeText = res.outcome === "solved" ? "成功" : res.outcome === "failed" ? "失敗" : "未回答"
    const mistakesText = res.mistakes > 0 ? `(${res.mistakes}miss)` : ""
    const revealedText = res.isRevealed ? `[解答参照]` : ""
    const summaryText = `${outcomeText} ${mistakesText}${revealedText} (${res.elapsedSec}s)`

    return { outcomeText, mistakesText, revealedText, summaryText,}    
}