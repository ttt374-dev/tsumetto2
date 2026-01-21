import { useExercise } from "@/application/useExercise";
import { DashboardScreen } from "../dashboard/DashboardScreen";
import { PlayerScreen } from "../player/PlayerScreen";
import { SummaryScreen } from "../summary/SummaryScreen";
import { useMissionController } from "./hooks/useMissionController";

export function MissionScreen() {
    const { exerciseList, markAnswer } = useExercise()
    const mission = useMissionController(exerciseList, markAnswer)     
    
    const problemStats = { 
        totalCount: mission.missionProblems.length,
        solvedCount: mission.missionProblems.reduce((sum, exercise) => sum + (exercise.learning?.solvedCount ?? 0), 0),
        failedCount: mission.missionProblems.reduce((sum, exercise) => sum + (exercise.learning?.failedCount ?? 0), 0),
    }

    switch (mission.phase) {
        case "idle":
            return (<DashboardScreen
                filterState={mission.query.filterState}
                onStart={mission.start}
                onToggleFilter={mission.query.toggleFilter}
                onSetFilter={mission.query.setFilter}
                stats={problemStats}
            />
            )
        case "playing":
            
            if (!mission.currentExercise) return null
            const title = `${mission.index+1}/${mission.missionProblems.length}: ${mission.currentExercise.problem.title}`
            return (
                <PlayerScreen
                    title={title}
                    problem={mission.currentExercise.problem}
                    learning={mission.currentExercise.learning}
                    onNextProblem={mission.next}
                    onPrevProblem={mission.prev}
                    onAnswer={(answerResult, secToTaken) => 
                        mission.answer(mission.currentExercise.problem, answerResult, secToTaken)}  
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