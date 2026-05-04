import type { SessionCommand } from "@/ui/screens/session/vm/resolveSessionCommand"

export type PlayerIntent = 
    | { type: "NEXT_REQUESTED" }
    | { type: "LIST_REQUESTED" }
    | { type: "PROBLEM_SOLVED" }


export function interpretPlayerIntent(intent: PlayerIntent): SessionCommand {
  
    switch (intent.type) {
      case "NEXT_REQUESTED":
        return { type: "GO_NEXT" }
        
      case "LIST_REQUESTED":
        return { type: "GO_LIST" }
        
      case "PROBLEM_SOLVED":
        return { type: "SUBMIT_REVIEW" }        
  
  }
}