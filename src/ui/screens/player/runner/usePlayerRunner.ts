import type { Problem } from "@/domain/problem/entity/Problem";
import { useToast } from "@/ui/App/providers/ToastProvider";
import { useSolvedDialogController } from "@/ui/screens/player/dialogs/SolvedDialog";
import { useGameEventHandler } from "@/ui/screens/player/hooks/useGameEventHandler";
import { useGameInitializer } from "@/ui/screens/player/hooks/useGameInitializer";
import { usePromotionDialog } from "@/ui/screens/player/hooks/usePromotionDialog";
import type { GameEvent } from "@/domain/game/types/GameEvent";
import { createEffectContext } from "@/ui/screens/player/runner/createEffectContext";
import { createEffectRunner } from "@/ui/screens/player/runner/runGameEffects";

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
    
    const isIntialized = useGameInitializer(problem)
    
    const ctx = createEffectContext({
        problemId: problem.id, dialogs, 
        toast: useToast()
    })    
    useGameEventHandler(createEffectRunner(ctx), isIntialized, onGameEvent)
}

