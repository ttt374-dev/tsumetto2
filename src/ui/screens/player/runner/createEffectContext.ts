import type { EffectSoundKind } from "@/application/game/GameEffect";
import type { ProblemId } from "@/domain/problem/entity/Problem";
import type { SolvedResult } from "@/domain/review/solvedResult";
import type { Toast } from "@/ui/App/providers/ToastProvider";
import type { EffectContext } from "@/ui/screens/player/runner/runGameEffects";
import type { DialogControllers } from "@/ui/screens/player/runner/usePlayerRunner";
import { useGameUIStore } from "@/ui/screens/player/store/useGameUIStore";
import { useReplayStore } from "@/ui/screens/player/store/useReplayStore";
import { useTimerStore } from "@/ui/screens/player/store/useTimerStore";
import { playBeep, playPingPong } from "@/shared/effect/soundEffect";

export function createEffectContext(props: {
    problemId: ProblemId, dialogs: DialogControllers, toast: (t: Toast) => void
}): EffectContext {
    const { problemId, dialogs, toast} = props
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
        dialogs.solvedResult.openDialog(problemId, solvedResult)
    }
    const closeSolvedResultDialog = () => dialogs.solvedResult.closeDialog()
    
    return {
        advancePly, retreatPly, moveTo, startAnimation, endAnimation,
        stopTimer: useTimerStore.getState().stop,
        flashBoard: useGameUIStore.getState().flashBoard,
        playSound,
        openSolvedResultDialog,
        closeSolvedResultDialog,
        toast,
        
    }
}