import { useExercise } from "@/application/useExercise";
import { applyQuery } from "@/domain/Exercise/query/applyQuery";
import { DashboardScreen } from "../dashboard/DashboardScreen";
import { PlayerScreen } from "../player/PlayerScreen";
import { SummaryScreen } from "../summary/SummaryScreen";
import { useMissionController } from "./hooks/useMissionController";
import { useMissionQueryContext } from "../App/providers/QueryProvider";


export function MissionScreen() {
    const { exerciseList, markAnswer } = useExercise()
    const query = useMissionQueryContext()    
    const queuedExerciseList = applyQuery(exerciseList, query.sortState, query.filterState)
    const mission = useMissionController(queuedExerciseList, markAnswer)      

    switch (mission.phase) {
        case "idle":
            return (<DashboardScreen
                queuedExerciseList={queuedExerciseList}
                filterState={query.filterState}
                onStart={mission.start}
                onToggleFilter={query.toggleFilter}
            />
            )
        case "playing":
            if (!mission.currentExercise) return null
            return (
                <PlayerScreen
                    problem={mission.currentExercise.problem}
                    learning={mission.currentExercise.learning}
                    onNext={mission.next}
                    onPrev={mission.prev}
                    onAnswer={mission.answer}
                />
            )
        case "summary":
            return (
                <SummaryScreen
                    missionResultEntryList={mission.missionResultList}
                    onBackToDashboard={() => { mission.resetPhase()}}
                />
            )
    }

}