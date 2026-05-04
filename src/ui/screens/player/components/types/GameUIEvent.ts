import type { SolvedResult } from "@/domain/review/solvedResult";

export type GameUIEvent = 
    | { type: "solved", solvedResult: SolvedResult}
    | { type: "mistake", count: number }
    | { type: "solvedConfirmed"}