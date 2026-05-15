import type { GameEffect, EffectSoundKind } from "@/application/game/GameEffect";
import type { ProblemId } from "@/domain/problem/entity/Problem";
import type { SolvedResult } from "@/domain/review/solvedResult";
import { type Toast } from "@/ui/App/providers/ToastProvider";
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
export type EffectContext = {
    advancePly: () => void
    retreatPly: () => void
    moveTo: (i: number) => void
    startAnimation: () => void
    endAnimation: () => void
    stopTimer: () => void
    flashBoard: () => void
    playSound: (kind: EffectSoundKind) => void
    openSolvedResultDialog: (res: SolvedResult) => void
    closeSolvedResultDialog: () => void
    toast: (t: Toast) => void
}


export async function runGameEffects(effects: GameEffect[], ctx: EffectContext, control: RunControl) {
    //const ctx = createEffectContext(deps)
    const id = control.next()
    for (const effect of effects) {
        // 👉 キャンセルチェック
        if (!control.isActive(id)) return
        await runGameEffect(effect, ctx)
    }
}
export function createEffectContext(deps: EffectRunnerDeps): EffectContext{
    const { advancePly, retreatPly, moveTo, startAnimation, endAnimation } = useReplayStore.getState()
    const playSound = (kind: EffectSoundKind) => {
        switch (kind) {
            case "solved":
                playPingPong()
                break;
            case "mistake":
                playBeep()
                break
        }
    }
    const openSolvedResultDialog = (solvedResult: SolvedResult) => {
        deps.dialogs.solvedResult.openDialog(deps.problemId, solvedResult)
    }
    const closeSolvedResultDialog = () => deps.dialogs.solvedResult.closeDialog()
    return {
        advancePly, retreatPly, moveTo, startAnimation, endAnimation,
        stopTimer: useTimerStore.getState().stop,
        flashBoard: useGameUIStore.getState().flashBoard,
        playSound,
        openSolvedResultDialog,
        closeSolvedResultDialog,
        toast: deps.toast,
        
    }
}
export async function runGameEffect(effect: GameEffect,  ctx: EffectContext) {    
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
            //deps.dialogs.solvedResult.openDialog(deps.problemId, effect.payload)
            ctx.openSolvedResultDialog(effect.solvedResult)
            break
        case "CLOSE_SOLVED_RESULT_DIALOG":
            //deps.dialogs.solvedResult.closeDialog()
            ctx.closeSolvedResultDialog()
            break  
        case "TOAST":
            ctx.toast({ message: effect.message, severity: effect.severity ?? "info" })
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
