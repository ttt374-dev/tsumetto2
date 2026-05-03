import type { PlayerIntent } from "@/ui/screens/player/hooks/usePlayerViewModel"
import type { SessionCommand } from "@/ui/screens/session/vm/resolveSessionCommand"

export function buildPlayerIntentAdapter(dispatch: (cmd: SessionCommand) => void) {
  const handlePlayerIntent = (intent: PlayerIntent) => {
    switch (intent.type) {
      case "NEXT_REQUESTED":
        dispatch({ type: "GO_NEXT" })
        break

      case "LIST_REQUESTED":
        dispatch({ type: "GO_LIST" })
        break

      case "PROBLEM_SOLVED":
        dispatch({ type: "SUBMIT_REVIEW" })
        break
    }
  }

  return handlePlayerIntent
}