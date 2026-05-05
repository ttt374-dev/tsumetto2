import type { ProblemId } from "@/domain/problem/entity/Problem";
import type { SolvedResult } from "@/domain/review/solvedResult";
import { useToast } from "@/ui/App/providers/ToastProvider";
import type { DialogControllers } from "@/ui/screens/player/runner/usePlayerRunner";
import { useReplayStore } from "@/ui/screens/player/store/useReplayStore";
import { useTimerStore } from "@/ui/screens/player/store/useTimerStore";

export type GameEffect =
    | { type: "ADVANCE_PLY"; direction: "FORWARD" | "BACKWARD" }
    | { type: "MOVE_TO"; to: number }
    | { type: "START_ANIMATION" }
    | { type: "END_ANIMATION" }
    | { type: "WAIT"; ms: number }
    | { type: "STOP_TIMER" }

    | { type: "OPEN_DIALOG", dialog: "solvedResult", payload: SolvedResult }
    | { type: "CLOSE_DIALOG", dialog: "solvedResult" }
    | { type: "TOAST", message: string }

    | { type: "EMIT_EVENT", event: DomainEvent}

export type DomainEvent = 
    | { type: "PROBLEM_SOLVED"; solvedResult: SolvedResult }

export type EffectRunnerDeps = {
    toast: ReturnType<typeof useToast>
    dialogs: DialogControllers
    problemId: ProblemId
    event: {
        emit: (e: DomainEvent) => void
    }

}
export async function runGameEffects(effects: GameEffect[], deps: EffectRunnerDeps, control: RunControl) {
    const id = control.next()
    for (const effect of effects) {
        // 👉 キャンセルチェック
        if (!control.isActive(id)) return

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

            case "EMIT_EVENT":
                deps.event.emit(effect.event)
                //console.log("EMIT EVENT")
                break;

            case "TOAST":
                deps.toast({ message: effect.message })

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
///////////////////
/*
export function createGameEffectRunner(deps: EffectRunnerDeps ) {

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

                case "EMIT_EVENT":
                    deps.event.emit(effect.event)
                    //console.log("EMIT EVENT")
                    break;
                
                case "TOAST":
                    deps.toast({message: effect.message})

            }
        }
    }
    const cancel = () => {
        // 以降のループが止まる
        currentId++
    }


    return { run, cancel }
}*/