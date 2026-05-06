import type { SolvedResult } from "@/domain/review/solvedResult";

export type SessionEvent = 
    | { type: "PROBLEM_SOLVED"; solvedResult: SolvedResult }