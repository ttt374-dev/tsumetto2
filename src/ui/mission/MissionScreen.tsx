import { useExercise } from "@/application/useExercise";
import { applyQuery } from "@/domain/Exercise/query/applyQuery";
import { DashboardScreen } from "../dashboard/DashboardScreen";
import { PlayerScreen } from "../player/PlayerScreen";
import { SummaryScreen } from "../summary/SummaryScreen";
import { useMissionController } from "./hooks/useMissionController";
import { useMissionQueryContext } from "../App/providers/QueryProvider";
import { useEffect } from "react";



export function MissionScreen() {
    const { exerciseList, markAnswer } = useExercise()
    const mission = useMissionController(exerciseList, markAnswer)     
    
    const problemStats = { 
        totalCount: exerciseList.length,
        solvedCount: exerciseList.reduce((sum, exercise) => sum + (exercise.learning?.solvedCount ?? 0), 0),
        failedCount: exerciseList.reduce((sum, exercise) => sum + (exercise.learning?.failedCount ?? 0), 0),
    }

    switch (mission.phase) {
        case "idle":
            return (<DashboardScreen
                queuedExerciseList={mission.missionProblems}
                filterState={mission.query.filterState}
                onStart={mission.start}
                onToggleFilter={mission.query.toggleFilter}
                stats={problemStats}
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