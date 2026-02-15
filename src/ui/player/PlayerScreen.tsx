
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useCallback, useEffect, useMemo, useState } from "react"
import { PlayerAnswerActions } from "./components/PlayerAnswerActions"
import PlayerView, { type PlayerViewNavigationHandlers } from "./components/PlayerView"
import { useReplayController } from "./hooks/useReplayController"
import { Problem, type ProblemId } from "@/domain/problem/Problem"
import { Button, IconButton, type SxProps } from "@mui/material"
import type { SolvedResult } from "@/domain/learning/Learning";
import { usePlayerPresenter } from "./hooks/usePlayerPresenter";
import { AppShell } from "../common/layout/AppShell";
import { StarToggleButton } from "../common/components/StarToggleButton";
import { useStarToggleButton } from "@/application/useStarToggleButton";
import { useProblemStore } from "@/application/store/useProblemStore";
import { useLearningEventStore } from "@/application/store/useLearningEventStore";

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
//////////////////////////////////////////////////////////////

export function PlayerScreen({ problem, title, onAnswer, navigationHandlers}: {
    problem: Problem
    title: string
    onAnswer: (id: ProblemId, res: SolvedResult, sec?: number) => void
    navigationHandlers: PlayerViewNavigationHandlers
 }) {
    // star
    const starController = useStarToggleButton(problem)    
    // replay
    const { initialPosition, moves } = problem.kifData
    const replay = useReplayController(initialPosition, moves)
    const showMovesController = useShowMovesController(problem.id, replay.plyIndex)

    // presenter
    const presenter = usePlayerPresenter(problem, useProblemStore(s=>s.updateProblem), navigationHandlers)    

    // learning
    const review = useLearningEventStore(s=>s.review)

    // handlers
    const handlers = {
        ply: {
            advance: replay.advancePly,
            retreat: replay.retreatPly,
            moveTo: replay.moveToPly
        },
        navigation: navigationHandlers,
        setShowMoves: showMovesController.setShowMoves,
    }
    
    const answerCurrent = async (res: SolvedResult, sec?: number)  => {
        await review(problem.id, res, sec)
        onAnswer(problem.id, res, sec)
    }    

    //////////////////////////////////////////
    return (
        <AppShell
            header={title}
            footer={<PlayerAnswerActions onAnswerClick={answerCurrent}/>}
            rightActions={
                <>
                    <StarToggleButton 
                        sx={{color: "white"}}
                        starred={starController.starred} onToggle={starController.toggleStar} />
                    
                    <IconButton onClick={presenter.rightActionsDrawer.openDialog}>
                        <MoreVertIcon sx={{ color: "white" }} />
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
            {presenter.dialogs.detail.dialogElement}
            {presenter.dialogs.list.dialogElement}
            {presenter.rightActionsDrawer.drawerElement}
        </AppShell>
    )
}