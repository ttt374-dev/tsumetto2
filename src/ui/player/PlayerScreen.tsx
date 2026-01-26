import { useEffect, useState } from "react"
import { Problem, type ProblemId } from "@/domain/problem/Problem"
import { useReplayController } from "./useReplayController"
import type { SolvedResult } from "@/domain/MissionEvent/MissionSummary"
import { PlayerFooterActions } from "./components/PlayerFooterActions"
import PlayerView from "./components/PlayerView"
import { useLearningEventStore } from "@/application/store/useLearningEventStore"
import { useRepositoryContext } from "../App/providers/RepositoryProvider"
import { useProblemStore } from "@/application/store/useProblemStore"
import { KifData } from "@/domain/kif/types"
import { useMissionEventStoreContext } from "../App/providers/MissionEventStoreProvider"
import type { LearningEvent } from "@/domain/LearningEvent"

function usePlayer(){
    const [ index, setIndex] = useState(0)
    const [ showMoves, setShowMoves ] = useState(false)     
      
    const missionStore = useMissionEventStoreContext()
    const snapshot = missionStore.snapshot
    const currentProblemId = snapshot && snapshot.problemIds[index]
    const repos = useRepositoryContext()  
    const problem = currentProblemId ? useProblemStore(repos.problem).findById(currentProblemId)  : undefined
    const learningEventStore = useLearningEventStore(repos.learningEvent)
    const learning = currentProblemId ? 
        useLearningEventStore(repos.learningEvent).records[currentProblemId] : undefined

    // replay
    const { initialPosition, moves } = problem?.kifData ?? KifData.create()
    const replay = useReplayController(initialPosition, moves)
    
    
    console.log("playerscreen", snapshot, currentProblemId)
        useEffect(()=>{        
        if (replay.plyIndex > 0){
            setShowMoves(true)
        } else if (replay.plyIndex === 0){
            setShowMoves(false)
        }
    }, [replay.plyIndex])

    useEffect(()=> { 
        setShowMoves(false)        
    }, [currentProblemId])

    if (!snapshot || !currentProblemId || !problem) return null
    
    // --- navigation ---
    function next() {
        if (snapshot) {
            if (index < snapshot.problemIds.length - 1) {
                setIndex(i => i + 1)
            } else {
                missionStore.finish()
            }
        }
    }
    function prev() {
        setIndex(i => Math.max(i - 1, 0))
    }
    // --- answer handling ---
    const answer = async (
        //problemId: ProblemId,
        solvedResult: SolvedResult,
        secToTaken?: number
    ) => {

        if (!snapshot) return
        missionStore.answer(currentProblemId, solvedResult, secToTaken)

        // Learning への反映は「副作用」としてここで
        const learningEvent: Omit<LearningEvent, "at"> = {
            type: "reviewed",
            problemId: currentProblemId,
            quality: solvedResult,
            sec: secToTaken,
        }
        await learningEventStore.append(learningEvent)
        next()
    }

    return {
        index, problem, learning, showMoves,
        replay, snapshot,

        answer, next, prev,
        setShowMoves,
    }
}
////////////////////////////////
export function PlayerScreen() {
    const player = usePlayer()
    if (!player) return null
    const { index, problem, learning, snapshot, replay, 
        next, prev, answer, setShowMoves, showMoves,
     } = player
     
    console.log("play screen: learning", learning)
    const titlePrefix = `${index+1}/${snapshot.problemIds.length}: `
    return (
        <PlayerView
            title={`${titlePrefix}${problem.title}`}
            learning={learning}
            showMoves={showMoves}
            moves={problem.kifData.moves}
            position={replay.position}
            retreatPly={replay.retreatPly}
            advancePly={replay.advancePly}
            onMoveToPly={replay.moveToPly}
            currentPlyIndex={replay.plyIndex}
            onNextProblem={next}
            onPrevProblem={prev}
            setShowMoves={setShowMoves}
            footerActions={
                <PlayerFooterActions onAnswer={answer} />
            }
        />
    )
}