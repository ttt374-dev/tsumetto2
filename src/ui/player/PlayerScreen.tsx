import { useEffect, useState } from "react"
import ProblemDetailDialog from "../common/ProblemDetailDialog"
import { PlayerFooterActions } from "./components/PlayerFooterActions"
import PlayerView from "./components/PlayerView"
import { useMissionPlayer } from "./useMissionPlayer"
import { useReplayController } from "./useReplayController"
import { useLearningEventStore } from "@/application/store/useLearningEventStore"
import { useRepositoryContext } from "../App/providers/RepositoryProvider"
import { useProblemStore } from "@/application/store/useProblemStore"
import { Problem, type ProblemId } from "@/domain/problem/Problem"
import { Board, Hand, Hands, KifData, Position } from "@/domain/kif/types"

function useShowMovesController(problemId: ProblemId, plyIndex: number){
    const [ showMoves, setShowMoves ] = useState(false)     
    useEffect(()=>{        
        if (plyIndex > 0){
            setShowMoves(true)
        } else if (plyIndex === 0){
            setShowMoves(false)
        }
    }, [plyIndex])

    useEffect(()=> { 
        setShowMoves(false)        
    }, [problemId])

    return { showMoves, setShowMoves }

}
function useProblemDetailDialog(problem: Problem){
    const [ open, setOpen] = useState(false)

    const repos = useRepositoryContext()
    const problemStore = useProblemStore(repos.problem)

    const openDialog = () => { setOpen(true); console.log("detaildialog", open); }
    const closeDialog = () => { setOpen(false)}
    // delete
    const deleteProblem = async () => {
        await repos.problem.remove(problem.id)
        await problemStore.reload()
        //next()
    }

    const dialogElement = (
        <ProblemDetailDialog
            open={open}
            problem={problem}
            onConfirm={alert}
            onClose={closeDialog}
            onDelete={deleteProblem}
            onResetLearning={alert}  // TODO
        />
    )

    return { openDialog, dialogElement }
}
//type DialogState = "none" | "problemDetail"


////////////////////////////////
export function PlayerScreen() {   
    const missionPlayer = useMissionPlayer()
    const { index, problem: nullableProblem, snapshot, 
        next, prev, answer,
    } = missionPlayer
    //const problem = nullableProblem ?? Problem.create()
    const problem = nullableProblem ?? Problem.create({
        kifData: new KifData({}, new Position(Board.empty(), Hands.empty()), []).toDTO()})
    // replay
    const { initialPosition, moves } = problem.kifData
    const replay = useReplayController(initialPosition, moves)
    const showMovesController = useShowMovesController(problem.id, replay.plyIndex)
    
    // learning
    const repos = useRepositoryContext()    
    const learning = useLearningEventStore(repos.learningEvent).records[problem.id]

    // dialog
    const detailDialog = useProblemDetailDialog(problem)
    console.log("playscre", problem, index, snapshot)
    //if (!index || !snapshot) return null

    //console.log("play screen: learning", learning)
    const titlePrefix =  `${(index ?? 0)+1}/${snapshot.problemIds.length}: `
    //console.log("titleprefx", titlePrefix)
    return (
        <>
        <PlayerView
            title={`${titlePrefix}${problem.title}`}
            learning={learning}
            showMoves={showMovesController.showMoves}
            moves={problem.kifData.moves}
            position={replay.position}
            retreatPly={replay.retreatPly}
            advancePly={replay.advancePly}
            onMoveToPly={replay.moveToPly}
            currentPlyIndex={replay.plyIndex}
            onNextProblem={next}
            onPrevProblem={prev}
            onOpenDetailDialog={detailDialog.openDialog}
            setShowMoves={showMovesController.setShowMoves}
            footerActions={
                <PlayerFooterActions onAnswer={answer} />
            }
        />

            { detailDialog.dialogElement}
        </>
    )
}