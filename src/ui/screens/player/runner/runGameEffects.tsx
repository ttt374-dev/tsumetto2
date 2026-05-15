import type { EffectDialogKind, GameEffect } from "@/application/game/GameEffect";
import type { ProblemId } from "@/domain/problem/entity/Problem";
import { useToast, type Toast } from "@/ui/App/providers/ToastProvider";
import type { DialogControllers } from "@/ui/screens/player/runner/usePlayerRunner";
import { useGameUIStore } from "@/ui/screens/player/store/useGameUIStore";
import { useReplayStore } from "@/ui/screens/player/store/useReplayStore";
import { useTimerStore } from "@/ui/screens/player/store/useTimerStore";
import { playBeep, playPingPong } from "@/ui/shared/effect/soundEffect";

export type EffectRunnerDeps = {
    toast: (toast: Toast) => void
    dialogs: DialogControllers
    problemId: ProblemId

}
type EffectContext = {
    advancePly: () => void
    retreatPly: () => void
    moveTo: (i: number) => void
    startAnimation: () => void
    endAnimation: () => void
    stopTimer: () => void
    flashBoard: () => void
    playSound: (kind: SoundKind) => void
}
type SoundKind = "solved" | "mistake"

export async function runGameEffects(effects: GameEffect[], deps: EffectRunnerDeps, control: RunControl) {
    const ctx = createEffectContext()
    const id = control.next()
    for (const effect of effects) {
        // 👉 キャンセルチェック
        if (!control.isActive(id)) return
        await runGameEffect(effect, deps, ctx)
    }
}
function createEffectContext(): EffectContext{
    const { advancePly, retreatPly, moveTo, startAnimation, endAnimation } = useReplayStore.getState()
    const playSound = (kind: SoundKind) => {
        switch (kind) {
            case "solved":
                playPingPong()
                break;
            case "mistake":
                playBeep()
                break
        }
    }
    const openSolvedResultDialog = () => {

    }
    return {
        advancePly, retreatPly, moveTo, startAnimation, endAnimation,
        stopTimer: useTimerStore.getState().stop,
        flashBoard: useGameUIStore.getState().flashBoard,
        playSound,
    }
}
export async function runGameEffect(effect: GameEffect, deps: EffectRunnerDeps, ctx: EffectContext) {    
    switch (effect.type) {
        case "ADVANCE_PLY":
            ctx.advancePly()
            break;
        case "RETREAT_PLY":
            ctx.retreatPly()
            break
        case "MOVE_TO":
            ctx.moveTo(effect.to)
            break
        case "START_ANIMATION":
            ctx.startAnimation()
            break
        case "END_ANIMATION":
            ctx.endAnimation()
            break
        case "STOP_TIMER":
            ctx.stopTimer()
            break
        case "WAIT":
            await delay(effect.ms)
            break
        case "OPEN_SOLVED_RESULT_DIALOG":
            deps.dialogs.solvedResult.openDialog(deps.problemId, effect.payload)
            break
        case "CLOSE_SOLVED_RESULT_DIALOG":
            deps.dialogs.solvedResult.closeDialog()
            break  
        case "TOAST":
            deps.toast({ message: effect.message, severity: effect.severity ?? "info" })
            break;
        case "FLASH_BOARD":
            ctx.flashBoard()
            break;
        case "PLAY_SOUND":
            ctx.playSound(effect.kind)
            break;
    }

}
async function delay(ms: number){
    await new Promise(res => setTimeout(res, ms))
}
/////////////////////////////////////
export type RunControl = {
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
