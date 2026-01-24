import { useEffect } from "react";
import { DashboardScreen } from "../dashboard/DashboardScreen";
import { PlayerScreen } from "../player/PlayerScreen";
import { SummaryScreen } from "../summary/SummaryScreen";
import { useMissionController } from "./hooks/useMissionController";

export function MissionScreen() {   

    //const { exerciseList, markAnswer, importFiles } = useExerciseControl()
    const mission = useMissionController()     
    
    useEffect(() => {
    if (
        mission.snapshot?.phase === "playing" &&
        mission.snapshot.problemIds.length === Object.keys(mission.snapshot.answered).length
    ) {
        mission.finish(mission.snapshot.missionId)
        mission.appendEvent({
            type: "MissionFinished",
            missionId: mission.snapshot.missionId,
        })
    }
}, [mission.snapshot])



    const problemStats = { 
        totalCount: mission.snapshot?.problemIds.length,
        solvedCount: 0,
        failedCount: 0,
        //solvedCount: mission..reduce((sum, exercise) => sum + (exercise.learning?.solvedCount ?? 0), 0),
        //failedCount: mission.missionProblems.reduce((sum, exercise) => sum + (exercise.learning?.failedCount ?? 0), 0),
    }

    switch (mission.phase) {
        case "idle":
            return (<DashboardScreen
                filterState={mission.query.filterState}
                onStart={mission.start}
                onToggleFilter={mission.query.toggleFilter}
                onSetFilter={mission.query.setFilter}
                onImportFiles={files => mission.importFiles(files)}
                stats={problemStats}
            />
            )
        case "playing":
            
            if (!mission.currentProblem) return null
            const title = `${mission.index+1}/${mission.snapshot?.problemIds.length}: ${mission.currentProblem.title}`
            return (
                <PlayerScreen
                    title={title}
                    problem={mission.currentProblem}
                    learning={mission.currentLearning}
                    onNextProblem={mission.next}
                    onPrevProblem={mission.prev}
                    onAnswer={(answerResult, secToTaken) => 
                        mission.currentProblem && mission.answer(mission.currentProblem, answerResult, secToTaken)}  
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