import { useNavigate } from "react-router-dom";
import { routePaths } from "@/router/paths";

import { applyQuery } from "@/domain/problem/service/query/applyQuery";
import { selectActiveProblems, useProblemStore } from "@/ui/features/problem/hooks/useProblemStore";
import { useLearningRecordStore } from "@/ui/features/learning/hooks/useLearningRecordStore";
import type { Mission } from "@/domain/mission/entity/Mission";
import { createSessionId, useSessionStore } from "@/ui/screens/session/store/useSessionStore";
import { usePlannerStore } from "@/ui/screens/session/store/usePlannerStore";
import { useUiSettingsStore } from "@/ui/screens/settings/useUiSettingsStore";

export function useMissionStarter(){
    const problems = useProblemStore(selectActiveProblems);
    const learningRecords = useLearningRecordStore(s => s.stateRecords);
    const navigate = useNavigate()
    const planner = usePlannerStore()    
    const start = useSessionStore(s => s.start);    
    
    const chunkSize = useUiSettingsStore(s=>s.settings.chunkSize)

    const startMission = (mission: Mission) => {       
        const ids = applyQuery(
            problems,
            learningRecords,
            mission.queryState).map(p=>p.id)
        const sessionId = createSessionId()
        
        planner.create(mission.id, ids, chunkSize)
        const chunk = planner.nextChunk()
        if (!chunk) return
        start(sessionId, chunk, mission.id)
        navigate(routePaths.sessionPlay.build(sessionId))
    };

    return { startMission }
}
