import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useCallback, useEffect, useMemo, useState } from "react"
import { PlayerAnswerActions } from "./components/PlayerAnswerActions"
import PlayerView, { type PlayerViewNavigationHandlers } from "./components/PlayerView"
import { useMissionPlayer } from "./hooks/useMissionPlayer"
import { useReplayController } from "./hooks/useReplayController"
import { Problem, type ProblemId } from "@/domain/problem/Problem"
import { Button, IconButton, type SxProps } from "@mui/material"
import type { SolvedResult } from "@/domain/learning/Learning";
import { useStores } from "@/application/store/useStores";
import { usePlayerPresenter } from "./hooks/usePlayerPresenter";
import { usePlayerController } from "./hooks/usePlayerController";
import { AppShell } from "../common/layout/AppShell";
import type { Theme } from "@emotion/react";
import { StarToggleButton } from "../common/components/StarToggleButton";
import { useStarToggleButton } from "@/application/useStarToggleButton";
import { useProblemStore } from "@/application/store/useProblemStore";
import { useRightActionsDrawer } from "./components/RightActionsDrawer";

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
export function PlayerScreen() {
    const { currentProblemId } = useMissionPlayer()    
    const problem = useProblemStore(s=>
        currentProblemId ? s.byId[currentProblemId] : undefined)
    
    if (!problem) return (<>Loading...</>)
    return (
        <PlayerScreenContent problem={problem}  />
    )
}

type PlayerCommand = {
    updateProblem: (p: Problem) => void
    answer: (id: ProblemId, SolvedResult: SolvedResult, secToTaken?: number) => void
}

////////////////////////////////
// problem の実体を受け取り、スクリーンとして view に渡す。
//  (これをかまさないと防御コードばかりになっちゃう)
export function PlayerScreenContent({ problem}: {problem: Problem }) {
    const starController = useStarToggleButton(problem)
    const mission = useMissionPlayer()
    //const controller = usePlayerController(mission.answer)
    const problemIds = mission.snapshot.problemIds
    
    const navigationHandlers = useMemo(() => ({
        next: mission.next, prev: mission.prev, moveTo: mission.moveTo
    }), [mission])

    // replay
    const { initialPosition, moves } = problem.kifData
    const replay = useReplayController(initialPosition, moves)
    const showMovesController = useShowMovesController(problem.id, replay.plyIndex)

    // presenter
    const stores = useStores() // TODO
    const playerCommands = {
        updateProblem: async (p: Problem) => { await useProblemStore.getState().updateProblem(p) },
        answer: async (id: ProblemId, solvedResult: SolvedResult, secToTaken?: number) => {
            await mission.answer(solvedResult, secToTaken) // mission アクション 
            await stores.learningEvent.review(id, solvedResult, secToTaken)
        }
    }
    const presenter = usePlayerPresenter(problem, problemIds, playerCommands, navigationHandlers)

    // handlers
    const handlers = {
        ply: {
            advance: replay.advancePly,
            retreat: replay.retreatPly,
            moveTo: replay.moveToPly
        },
        navigation: navigationHandlers,
        answer: playerCommands.answer,
        setShowMoves: showMovesController.setShowMoves,
    }
    const formatTitle = (rawTitle: string, index: number, length: number): string => {
        const titlePrefix = `${(index ?? 0) + 1}/${length}: `
        const title = `${titlePrefix}${rawTitle}`
        return title
    }

    const title = formatTitle(problem.title, mission.index, problemIds.length)
    const answerCurrent = useCallback(
        (res: SolvedResult, sec?: number) =>
            playerCommands.answer(problem.id, res, sec),
        [playerCommands, problem.id]
    )

    //////////////////////////////////////////
    return (
        <AppShell
            header={title}
            footer={<PlayerAnswerActions onAnswer={answerCurrent} />}
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