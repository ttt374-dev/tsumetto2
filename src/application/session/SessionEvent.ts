import type { SolvedResult } from "@/domain/review/types/solvedResult";

export type SessionEvent = 
    | { type: "PROBLEM_SOLVED"; solvedResult: SolvedResult }