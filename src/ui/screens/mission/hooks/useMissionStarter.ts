import { useNavigate } from "react-router-dom";
import { routes } from "@/ui/App/useAppNavigation";

import { applyQuery } from "@/domain/problem/service/query/applyQuery";
import { selectActiveProblems, useProblemStore } from "@/ui/features/problem/hooks/useProblemStore";
import { useLearningRecordStore } from "@/ui/features/learning/hooks/useLearningRecordStore";
import type { Mission } from "@/domain/mission/entity/Mission";
import { createSessionId, useSessionStore } from "@/ui/screens/session/hooks/useSessionStore";
import { usePlannerStore } from "@/ui/screens/session/hooks/usePlannerStore";
import { v4 } from "uuid";


export function useMissionStarter(){
    const problems = useProblemStore(selectActiveProblems);
    const learningRecords = useLearningRecordStore(s => s.stateRecords);
    const navigate = useNavigate()
    const planner = usePlannerStore()    
    const start = useSessionStore(s => s.start);    
    //const sessionId = useSessionStore(s=>s.sessionId)
    const sessionId = createSessionId()

    const startMission = (mission: Mission) => {       
        const ids = applyQuery(
            problems,
            learningRecords,
            mission.queryState).map(p=>p.id)

        planner.create(mission.id, ids, 5)
        const chunk = planner.nextChunk()
        chunk && start(mission.id, chunk);  // TODO: chunk が空の時の処理
        console.log("start mission", routes.sessionPlay(sessionId))
        navigate(routes.sessionPlay(sessionId, 0));
    };

    return { startMission }
}
