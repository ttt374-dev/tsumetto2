import MoreVertIcon from "@mui/icons-material/MoreVert";
import StarIcon from "@mui/icons-material/Star"
import StarBorderIcon from "@mui/icons-material/StarBorder"
import { useEffect, useMemo, useState } from "react"
import { PlayerFooterActions } from "./components/PlayerFooterActions"
import PlayerView, { type PlayerViewNavigationHandlers } from "./components/PlayerView"
import { useMissionPlayer } from "./useMissionPlayer"
import { useReplayController } from "./useReplayController"
import { useLearningEventStore } from "@/application/store/useLearningEventStore"
import { useRepositoryContext } from "../App/providers/RepositoryProvider"
import { Problem, type ProblemId } from "@/domain/problem/Problem"
import { ListDialog } from "../mission/ListDialog"
import { AppLayout } from "../common/layout/AppLayout"
import { Button, IconButton } from "@mui/material"
import { useProblemStore } from "@/application/store/useProblemStore"
import { RightActionsDrawer } from "./components/RightActionsDrawer";
import type { SolvedResult } from "@/domain/learning/Learning";
import { useProblemDetailDialog } from "../common/problemDetail/useProblemDetailDialog";

export function useShowMovesController(problemId: ProblemId | undefined, plyIndex: number) {
    const [showMoves, setShowMoves] = useState(false)
    useEffect(() => {
        if (plyIndex > 0) {
            setShowMoves(true)
        } else if (plyIndex === 0) {
            setShowMoves(false)
        }
    }, [plyIndex])

    useEffect(() => {
        setShowMoves(false)
    }, [problemId])

    return { showMoves, setShowMoves }

}

export function PlayerScreen() {
    const { index, currentProblemId, snapshot,
        next, prev, answer, moveTo,
    } = useMissionPlayer()

    const repos = useRepositoryContext()
    const store = useProblemStore(repos.problem)
    const problem = currentProblemId !== undefined ?
        store.findById(currentProblemId) : undefined
    if (!problem) return (<>Loading...</>)
    const navigationHandlers = {
        next: next, prev: prev, moveTo: moveTo
    }
    
    return (
        <PlayerScreenContent problem={problem} problemIds={snapshot.problemIds}
            index={index} onAnswer={answer} 
            navigationHandlers={navigationHandlers} />
    )
}

////////////////////////////////
// problem の実体を受け取り、スクリーンとして view に渡す。
//  (これをかまさないと防御コードばかりになっちゃう)
export function PlayerScreenContent({ problem, problemIds,
    index, navigationHandlers, onAnswer }: {
        problem: Problem
        problemIds: ProblemId[]
        index: number
        navigationHandlers: PlayerViewNavigationHandlers
        onAnswer: (r: SolvedResult, sec?: number) => void,
    }) {
    const [starred, setStarred] = useState(problem.starred)
    const repos = useRepositoryContext()
    const problemStore = useProblemStore(repos.problem)
    const learningEventStore = useLearningEventStore(repos.learningEvent)
    // replay
    const { initialPosition, moves } = problem.kifData
    const replay = useReplayController(initialPosition, moves)
    const showMovesController = useShowMovesController(problem.id, replay.plyIndex)

    // dialog
    const handleUpdateProblem = async (p: Problem) => {
        await repos.problem.update(p)
        await problemStore.reload()

    }
    const handleToggleStar = async () => {
        setStarred(prev=>!prev)
        await repos.problem.update(problem.toggleStar())
        await problemStore.reload()
    }
    const detailDialog = useProblemDetailDialog(() => {}, handleUpdateProblem, 
    () => {navigationHandlers.next()})
    //console.log("playscre", problem, index, snapshot)
    //if (!index || !snapshot) return null

    //console.log("play screen: learning", learning)
    const titlePrefix = `${(index ?? 0) + 1}/${problemIds.length}: `
    //console.log("titleprefx", titlePrefix)

    const [openListDialog, setOpenListDialog] = useState(false)
    const [openActionDrawer, setOpenActionDrawer] = useState(false)
    const title = `${titlePrefix}${problem.title}`

    const handleAnswer = async (solvedResult: SolvedResult, secToTaken?: number) => {
        // learning    
        onAnswer(solvedResult, secToTaken) // mission アクション                
        await learningEventStore.append({
            type: "reviewed",
            problemId: problem.id,
            quality: solvedResult,
            sec: secToTaken,
        })
    }
    
    const handlers = {
        ply: {
            advance: replay.advancePly,
            retreat: replay.retreatPly,
            moveTo: replay.moveToPly
        },
        navigation: navigationHandlers,        
        setShowMoves: showMovesController.setShowMoves,
    }
    return (
        <AppLayout
            header={title}
            footer={<PlayerFooterActions onAnswer={handleAnswer} />}
            rightActions={
                <>
                    <IconButton onClick={handleToggleStar}
                    disableRipple
                    sx={{ color: "white" }}>
                        { starred ? <StarIcon/> : <StarBorderIcon/>}
                    </IconButton>
                    <IconButton onClick={() => setOpenActionDrawer(true)}>
                        <MoreVertIcon sx={{color: "white"}}/>
                    </IconButton>
                </>
            }
        >
            <PlayerView
                showMoves={showMovesController.showMoves}
                moves={moves}
                position={replay.position}
                tags={problem.tags}

                handlers={handlers}
                currentPlyIndex={replay.plyIndex}

            />
            {detailDialog.dialogElement}
            <ListDialog
                open={openListDialog}
                onClose={() => setOpenListDialog(false)}
                onSelectProblem={(pid) => {
                    handlers.navigation.moveTo(pid)
                    setOpenListDialog(false)
                }}
                problemIds={problemIds}
                currentProblemId={problem.id}
            />
            <RightActionsDrawer 
                isOpen={openActionDrawer}
                onClose={()=>setOpenActionDrawer(false)}
                onOpenDetailDialog={() => detailDialog.openDialog(problem.id)}
                onOpenListDialog={() => setOpenListDialog(true)}
            />
        </AppLayout>
    )
}