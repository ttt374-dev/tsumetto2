import MoreVertIcon from "@mui/icons-material/MoreVert";
import StarIcon from "@mui/icons-material/Star"
import StarBorderIcon from "@mui/icons-material/StarBorder"
import { useCallback, useEffect, useMemo, useState } from "react"
import { PlayerFooterActions } from "./components/PlayerFooterActions"
import PlayerView, { type PlayerViewNavigationHandlers } from "./components/PlayerView"
import { useMissionPlayer } from "./useMissionPlayer"
import { useReplayController } from "./useReplayController"
import { useLearningEventStore } from "@/application/store/useLearningEventStore"
import { useRepositoryContext } from "../App/providers/RepositoryProvider"
import { Problem, type ProblemId } from "@/domain/problem/Problem"
import { ListDialog, useListDialog } from "../mission/ListDialog"
import { AppLayout } from "../common/layout/AppLayout"
import { Button, IconButton } from "@mui/material"
import { useProblemStore } from "@/application/store/useProblemStore"
import { RightActionsDrawer } from "./components/RightActionsDrawer";
import type { SolvedResult } from "@/domain/learning/Learning";
import { useProblemDetailDialog } from "../common/problemDetail/useProblemDetailDialog";
import { useStores } from "@/application/store/useStores";
import { useStarController } from "../../application/useStarController";
import { usePlayerPresenter } from "./usePlayerPresenter";
import { usePlayerController } from "./usePlayerController";
import { AppShell } from "../common/layout/AppShell";

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

    //const repos = useRepositoryContext()
    const stores = useStores()
    const problem = currentProblemId !== undefined ?
        stores.problem.findById(currentProblemId) : undefined    
    const navigationHandlers = useMemo(() => ({
        next, prev, moveTo
    }), [next, prev, moveTo])
    if (!problem) return (<>Loading...</>)
    return (
        <PlayerScreenContent problem={problem} problemIds={snapshot?.problemIds ?? []}
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
        onAnswer: (r: SolvedResult, sec?: number) => Promise<void>,
    }) {
    const { starred, toggleStar } = useStarController(problem)
    const controller = usePlayerController(onAnswer)

    // replay
    const { initialPosition, moves } = problem.kifData
    const replay = useReplayController(initialPosition, moves)
    const showMovesController = useShowMovesController(problem.id, replay.plyIndex)

    // presenter
    const presenter = usePlayerPresenter(problem.id, problemIds, controller, navigationHandlers)

    // handlers
    const handlers = {
        ply: {
            advance: replay.advancePly,
            retreat: replay.retreatPly,
            moveTo: replay.moveToPly
        },
        navigation: navigationHandlers,
        answer: controller.answer,
        setShowMoves: showMovesController.setShowMoves,
    }
    const titlePrefix = `${(index ?? 0) + 1}/${problemIds.length}: `
    const title = `${titlePrefix}${problem.title}`
    const answerCurrent = useCallback(
        (res: SolvedResult, sec?: number) =>
            controller.answer(problem.id, res, sec),
        [controller, problem.id]
    )

    //////////////////////////////////////////
    return (
        <AppShell
            header={title}
            footer={<PlayerFooterActions onAnswer={answerCurrent} />}
            rightActions={
                <>
                    <IconButton onClick={toggleStar}
                        disableRipple
                        sx={{ color: "white" }}>
                        {starred ? <StarIcon /> : <StarBorderIcon />}
                    </IconButton>
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