import type { Problem, ProblemId } from "@/domain/problem/entity/Problem";
import { useToast } from "@/ui/App/providers/ToastProvider";
import { useSolvedDialog } from "@/ui/screens/player/dialogs/SolvedDialog";
import { useGameEventHandler } from "@/ui/screens/player/hooks/useGameEventHandler";
import { useGameInitializer } from "@/ui/screens/player/hooks/useGameInitializer";
import { usePromotionDialog } from "@/ui/screens/player/hooks/usePromotionDialog";
import type { PlayerIntent } from "@/application/session/interpretor/interpretPlayerIntent";
import type { PlayerInput, PlayerViewModel } from "@/ui/screens/player/vm/PlayerViewModel";
import type { EffectRunnerDeps } from "@/ui/screens/player/runner/runGameEffects";
import type { GameEvent, PendingPromotion } from "@/domain/game/types/GameEvent";
import { usePlayerViewModel } from "@/ui/screens/player/hooks/usePlayerViewModel";
import { usePlayerActions, type PlayerActions } from "@/ui/screens/player/hooks/usePlayerActions";

export type DialogControllers = {
   solvedResult: ReturnType<typeof useSolvedDialog>
   promotion: ReturnType<typeof usePromotionDialog>
}

export type PlayerRunnerModel = {
    //state: PlayerViewModel
    //actions: PlayerAction
    handlers: {
        handlePlayerIntent: (intent: PlayerIntent) => void,
    //    handleUIEvent: (e: GameUIEvent) => void
    }
    //ui: {
    //    dialogs: DialogControllers
    //}
}

/////////////////////////////////////////
export function usePlayerRunner(problem: Problem, dialogs: DialogControllers,
    options?: { 
        //onDomainEvent?: (e: SessionEvent) => void,
        onGameEvent?: (e: GameEvent) => void,
        onPlayerIntent?: (e: PlayerIntent) => void }
): PlayerRunnerModel {    
    const toast = useToast()
    //const vm = buildPlayerViewModel(input)
    //const vm = usePlayerViewModel(problem)
    //const actions = usePlayerActions()
    // initialize
    const isIntialized = useGameInitializer(problem) 
    const deps: EffectRunnerDeps = {
        dialogs, toast, problemId: problem.id,        
    }
    
    useGameEventHandler(deps, isIntialized, options?.onGameEvent)    
    const handlePlayerIntent = (intent: PlayerIntent) => {
        options?.onPlayerIntent?.(intent)
    }
    
    return {
        //state: vm,
        //actions,
        handlers: {
            //handleUIEvent,
            handlePlayerIntent,
        },
        //ui: {
        //    dialogs,
        //}

    }
}

