import { DashboardScreen } from "../dashboard/DashboardScreen";
import { PlayerScreen } from "../player/PlayerScreen";
import { SummaryScreen } from "../summary/SummaryScreen";
import { useMissionController } from "./hooks/useMissionController";
import { useRepositoryContext } from "../App/providers/RepositoryProvider";
import { useMissionPreview } from "./hooks/useMissionPreview";

export function MissionScreen() {   
    const mission = useMissionController()      
    const missionPreview = useMissionPreview()
    
    switch (mission.phase) {
        case "idle":
            const problemStats = {
                problemCount: missionPreview.problemCount,
                solvedCount: missionPreview.solvedCount,
                failedCount: missionPreview.failedCount, 
            }

            return (<DashboardScreen
                filterState={missionPreview.query.filterState}
                onStart={mission.start}
                onToggleFilter={missionPreview.query.toggleFilter}
                onSetFilter={missionPreview.query.setFilter}                
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
                    //learning={learning}
                    onNextProblem={mission.next}
                    onPrevProblem={mission.prev}
                    onAnswer={(answerResult, secToTaken) => {
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