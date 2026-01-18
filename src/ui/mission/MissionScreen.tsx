import { useExercise } from "@/application/useExercise";
import { useQuery } from "@/application/useQuery";
import { applyQuery } from "@/domain/Exercise/query/applyQuery";
import { DashboardScreen } from "../dashboard/DashboardScreen";
import { PlayerScreen } from "../player/PlayerScreen";
import { useNavigate } from "react-router-dom";
import { SummaryScreen } from "../summary/SummaryScreen";
import { useMissionController } from "./hooks/useMissionController";

export function MissionScreen() {
    const { exerciseList, markAnswer } = useExercise()
    const query = useQuery({ filter: { isMissionTarget: false } })
    const queuedExerciseList = applyQuery(exerciseList, query.sortState, query.filterState)
    const mission = useMissionController(queuedExerciseList, markAnswer)      
    const navigate = useNavigate()

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
                    answerEntries={mission.answerEntries}
                    onNavigateToDashboard={() => navigate("/")}
                />
            )
    }

}