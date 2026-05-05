import type { SolvedResult } from "@/domain/review/solvedResult";
import { useToast } from "@/ui/App/providers/ToastProvider";
import { useReplayStore } from "@/ui/screens/player/store/useReplayStore";
import { useTimerStore } from "@/ui/screens/player/store/useTimerStore";

export type GameEffect =
    | { type: "ADVANCE_PLY"; direction: "FORWARD" | "BACKWARD" }
    | { type: "MOVE_TO"; to: number }
    | { type: "START_ANIMATION" }
    | { type: "END_ANIMATION" }
    | { type: "WAIT"; ms: number }
    | { type: "STOP_TIMER" }
    | { type: "GAME_SOLVED"; solvedResult: SolvedResult }
    | { type: "GAME_MISTAKE"; count: number }

    | { type: "OPEN_DIALOG", dialog: "solvedResult", solvedResult: SolvedResult }
    | { type: "CLOSE_DIALOG", dialog: "solvedResult" }
    | { type: "TOAST", message: string }

export function createGameEffectRunner() {
    const toast = useToast()
    
    const deps = {
            toast, 
        }
    let currentId = 0

    const run = async (effects: GameEffect[]) => {
        const id = ++currentId
               
        for (const effect of effects) {
            // 👉 キャンセルチェック
            if (id !== currentId) return
            const replay = useReplayStore.getState()
            const timer = useTimerStore.getState()

            switch (effect.type) {
                case "ADVANCE_PLY":
                    if (effect.direction === "FORWARD")
                        replay.advancePly()
                    else
                        replay.retreatPly()
                    break

                case "MOVE_TO":
                    replay.moveTo(effect.to)
                    break

                case "START_ANIMATION":
                    replay.startAnimation()
                    break

                case "END_ANIMATION":
                    replay.endAnimation()
                    break

                case "STOP_TIMER":
                    timer.stop()
                    break

                case "GAME_SOLVED":
                    //useGameStore.getState().setSolved(effect.solvedResult)
                    break

                case "GAME_MISTAKE":
                    deps.toast({message: `mistake: ${effect.count}`})
                    break

                case "WAIT":
                    await new Promise(res => setTimeout(res, effect.ms))
                    break

                case "OPEN_DIALOG":
                    if (effect.dialog === "solvedResult") {
                        //deps.dialogs.solvedResult.openDialog(deps.problemId, effect.solvedResult)
                    }
                    break
                case "CLOSE_DIALOG":
                    if (effect.dialog === "solvedResult") {
                        //deps.dialogs.solvedResult.closeDialog()
                    }
                    break
                

            }
        }
    }

    return { run }
}