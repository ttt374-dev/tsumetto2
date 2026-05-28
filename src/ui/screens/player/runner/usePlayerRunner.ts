import type { Problem } from "@/domain/problem/entity/Problem";
import { useToast } from "@/ui/App/providers/ToastProvider";
import { useSolvedDialogController } from "@/ui/screens/player/dialogs/SolvedDialog";
import { useGameEventHandler } from "@/ui/screens/player/hooks/useGameEventHandler";
import { useEnsureProblemLoaded } from "@/ui/screens/player/hooks/useEnsureProblemLoaded";
import { usePromotionDialog } from "@/ui/screens/player/hooks/usePromotionDialog";
import type { GameEvent } from "@/domain/game/types/GameEvent";
import { createEffectContext } from "@/ui/screens/player/runner/createEffectContext";
import { createEffectRunner } from "@/ui/screens/player/runner/runGameEffects";
import { useEffect } from "react";

export type DialogControllers = {
   solvedResult: ReturnType<typeof useSolvedDialogController>
   promotion: ReturnType<typeof usePromotionDialog>
}

/////////////////////////////////////////
export function usePlayerRunner(props: {
    problem: Problem, dialogs: DialogControllers,
    onGameEvent?: (e: GameEvent) => void,
}) {
    const { problem, dialogs, onGameEvent} = props
    
    const initialize = useEnsureProblemLoaded(problem)

    useEffect(()=>{
        initialize()
    }, [initialize])
    

    const ctx = createEffectContext({
        problemId: problem.id, dialogs, 
        toast: useToast()
    })    
    useGameEventHandler(createEffectRunner(ctx), onGameEvent)
}

