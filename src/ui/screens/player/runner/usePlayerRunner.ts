import type { Problem } from "@/domain/problem/entity/Problem";
import { useToast } from "@/ui/App/providers/ToastProvider";
import { useSolvedDialogController } from "@/ui/screens/player/dialogs/SolvedDialog";
import { useGameEventHandler } from "@/ui/screens/player/hooks/useGameEventHandler";
import { useGameInitializer } from "@/ui/screens/player/hooks/useGameInitializer";
import { usePromotionDialog } from "@/ui/screens/player/hooks/usePromotionDialog";
import type { PlayerIntent } from "@/application/session/interpretor/interpretPlayerIntent";
import { createEffectContext, type EffectRunnerDeps } from "@/ui/screens/player/runner/runGameEffects";
import type { GameEvent } from "@/domain/game/types/GameEvent";

export type DialogControllers = {
   solvedResult: ReturnType<typeof useSolvedDialogController>
   promotion: ReturnType<typeof usePromotionDialog>
}

export type PlayerRunnerModel = {
    handlers: {
        handlePlayerIntent: (intent: PlayerIntent) => void,    
    }    
}

/////////////////////////////////////////
export function usePlayerRunner(problem: Problem, dialogs: DialogControllers,
    options?: {         
        onGameEvent?: (e: GameEvent) => void,
        onPlayerIntent?: (e: PlayerIntent) => void }
): PlayerRunnerModel {    
    const toast = useToast()
    const isIntialized = useGameInitializer(problem) 
    const deps: EffectRunnerDeps = {
        dialogs, toast, problemId: problem.id,        
    }
    
    useGameEventHandler(createEffectContext(deps), isIntialized, options?.onGameEvent)    
    const handlePlayerIntent = (intent: PlayerIntent) => {
        options?.onPlayerIntent?.(intent)
    }
    
    return {
        handlers: {
            handlePlayerIntent,
        },
    }
}

