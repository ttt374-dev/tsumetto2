import { useEffect } from "react";
import { DashboardScreen } from "../dashboard/DashboardScreen";
import { PlayerScreen } from "../player/PlayerScreen";
import { SummaryScreen } from "../summary/SummaryScreen";
import { useMissionController } from "./hooks/useMissionController";
import { useRepositoryContext } from "../App/providers/RepositoryProvider";
import { createImportProblemsUsecase } from "@/usecase/importProblemsUseCase";

export function MissionScreen() {   

    const mission = useMissionController()      
    const repos = useRepositoryContext()
    const handleImportFiles = (files: File[]) => {        
        const importer = createImportProblemsUsecase(repos.problem)
        importer.importFiles(files)
    }
    
    switch (mission.phase) {
        case "idle":
            const problemStats = {
                problemCount: mission.problemCount,
                solvedCount: mission.solvedCount,
                failedCount: mission.failedCount, 
            }

            return (<DashboardScreen
                filterState={mission.query.filterState}
                onStart={mission.start}
                onToggleFilter={mission.query.toggleFilter}
                onSetFilter={mission.query.setFilter}
                onImportFiles={files => handleImportFiles(files)}
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
                    onAnswer={(answerResult, secToTaken) => {
                        console.log("onanswer")
                        mission.currentProblem && mission.answer(mission.currentProblem, answerResult, secToTaken)}  
                    }
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