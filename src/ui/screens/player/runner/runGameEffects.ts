import type { SolvedResult } from "@/domain/review/solvedResult"
import type { useToast } from "@/ui/App/providers/ToastProvider"
import type { DialogControllers } from "@/ui/screens/player/runner/usePlayerRunner"

export type GameEffect =
    | { type: "OPEN_DIALOG", dialog: "solvedResult", solvedResult: SolvedResult }
    | { type: "CLOSE_DIALOG", dialog: "solvedResult" }
    | { type: "TOAST", message: string }

export function runGameEffects(effects: GameEffect[], deps: {
    dialogs: DialogControllers,
    toast: ReturnType<typeof useToast>,
    problemId: string
}) {
    for (const effect of effects) {
        switch (effect.type) {
            case "OPEN_DIALOG":
                if (effect.dialog === "solvedResult") {
                    deps.dialogs.solvedResult.openDialog(deps.problemId, effect.solvedResult)
                }
                break
            case "CLOSE_DIALOG":
                if (effect.dialog === "solvedResult") {
                    deps.dialogs.solvedResult.closeDialog()
                }
                break
            case "TOAST":
                deps.toast({ message: effect.message })
                break
        }
    }
}