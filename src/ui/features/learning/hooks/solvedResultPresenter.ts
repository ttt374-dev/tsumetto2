import { deriveOutcome } from "@/domain/review/service/solvedResultDeriver";
import type { SolvedResult } from "@/domain/review/solvedResult";

export const solvedResultLabels = {
    outcome: "結果",
    mistakes: "間違い回数",
    isRevealed: "解答参照",
    elapsedSec: "経過秒数",
}

export function toSolvedResultViewData(res: SolvedResult){
    const derivedOutcome = deriveOutcome(res)
    
    const outcome = derivedOutcome === "solved" ? "成功" : derivedOutcome === "failed" ? "失敗" : "未回答"
    const mistakes = res.mistakes > 0 ? `(${res.mistakes}回)` : ""
    const isRevealed = res.isRevealed ? `参照あり` : "参照なし"
    const elapsedSec = `${res.elapsedSec}s`
    const summary = `${outcome} ${mistakes}${isRevealed} (${elapsedSec})`

    return { outcome, mistakes, isRevealed, elapsedSec, summary,}    
}