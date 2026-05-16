import type { Problem } from "@/domain/problem/entity/Problem";
import { useToast } from "@/ui/App/providers/ToastProvider";
import { useSolvedDialogController } from "@/ui/screens/player/dialogs/SolvedDialog";
import { useGameEventHandler } from "@/ui/screens/player/hooks/useGameEventHandler";
import { useGameInitializer } from "@/ui/screens/player/hooks/useGameInitializer";
import { usePromotionDialog } from "@/ui/screens/player/hooks/usePromotionDialog";
import type { GameEvent } from "@/domain/game/types/GameEvent";
import { createEffectContext } from "@/ui/screens/player/runner/createEffectContext";

export type DialogControllers = {
   solvedResult: ReturnType<typeof useSolvedDialogController>
   promotion: ReturnType<typeof usePromotionDialog>
}

/////////////////////////////////////////
export function usePlayerRunner(problem: Problem, dialogs: DialogControllers,
    options?: {         
        onGameEvent?: (e: GameEvent) => void,
        //onPlayerIntent?: (e: PlayerIntent) => void 
        }
) {    
    const toast = useToast()
    const isIntialized = useGameInitializer(problem) 
    //const deps: EffectRunnerDeps = {
    //    dialogs, toast, problemId: problem.id,        
    //}
    const ctx = createEffectContext({
        problemId: problem.id, dialogs, toast
    })
    
    useGameEventHandler(ctx, isIntialized, options?.onGameEvent)    
    //const handlePlayerIntent = (intent: PlayerIntent) => {
    //    options?.onPlayerIntent?.(intent)
    //}
    
    
}

