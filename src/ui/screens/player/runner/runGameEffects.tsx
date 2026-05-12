import type { GameEffect } from "@/application/game/GameEffect";
import type { ProblemId } from "@/domain/problem/entity/Problem";
import { useToast, type Toast } from "@/ui/App/providers/ToastProvider";
import type { DialogControllers } from "@/ui/screens/player/runner/usePlayerRunner";
import { useGameUIStore } from "@/ui/screens/player/store/useGameUIStore";
import { useReplayStore } from "@/ui/screens/player/store/useReplayStore";
import { useTimerStore } from "@/ui/screens/player/store/useTimerStore";
import { playBeep, playPingPong } from "@/ui/shared/effect/soundEffect";

export type EffectRunnerDeps = {
    //toast: ReturnType<typeof useToast>
    toast: (toast: Toast) => void
    dialogs: DialogControllers
    problemId: ProblemId   

}
export async function runGameEffects(effects: GameEffect[], deps: EffectRunnerDeps, control: RunControl) {
    const id = control.next()
    for (const effect of effects) {
        // 👉 キャンセルチェック
        if (!control.isActive(id)) return

        const replay = useReplayStore.getState()
        const timer = useTimerStore.getState()
        const flashBoard = useGameUIStore.getState().flashBoard

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
            case "WAIT":
                await new Promise(res => setTimeout(res, effect.ms))
                break
            case "OPEN_DIALOG":
                if (effect.dialog === "solvedResult") {
                    deps.dialogs.solvedResult.openDialog(deps.problemId, effect.payload)
                }
                break
            case "CLOSE_DIALOG":
                if (effect.dialog === "solvedResult") {
                    deps.dialogs.solvedResult.closeDialog()
                }
                break
            /*case "EMIT_EVENT":
                deps.event.emit(effect.event)
                //console.log("EMIT EVENT")
                break;
*/
            case "TOAST":
                deps.toast({ message: effect.message, severity: effect.severity ?? "info" })
                break;
            case "FLASH_BOARD":
                flashBoard(true)
                break;
            case "PLAY_SOUND":
                switch (effect.kind){
                    case "solved":
                        playPingPong()
                        break;
                    case "mistake":
                        //playPingPong()
                        playBeep()                   
                        break
                }                
        }
    }
}
type RunControl = {
    next: () => number
    isActive: (id: number) => boolean
    cancel: () => void
}
export function createRunControl(): RunControl {
  let currentId = 0

  return {
    next() {
      return ++currentId
    },
    isActive(id: number) {
      return id === currentId
    },
    cancel() {
      currentId++
    }
  }
}
