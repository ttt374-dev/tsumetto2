import type { SessionCommand } from "@/application/session/resolveSessionCommand"

export type PlayerIntent = 
    | { type: "NEXT_REQUESTED" }
    | { type: "LIST_REQUESTED" }
    | { type: "PROBLEM_CONFIRMED"}


export function interpretPlayerIntent(intent: PlayerIntent): SessionCommand {
  
    switch (intent.type) {
      case "NEXT_REQUESTED":
        return { type: "ADVANCE_PROBLEM" }
        
      case "LIST_REQUESTED":
        return { type: "OPEN_SESSION_LIST" }
        
      case "PROBLEM_CONFIRMED":
        return { type: "ADVANCE_PROBLEM"}
  
  }
}