
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useCallback, useEffect, useMemo, useState } from "react"
import { PlayerAnswerActions } from "./components/PlayerAnswerActions"
import PlayerView, { type PlayerViewNavigationHandlers } from "./components/PlayerView"
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
import { useMissionPlayer } from "./hooks/useMissionPlayerStore";
import { useMissionStore } from "@/application/store/useMissionStore";
import { useLearningRecordStore } from "@/application/useLearningRecordStore";
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
export function PlayerScreen() {    
    
    const currentProblemId = useMissionStore(s=>s.snapshot.currentProblemId)
    const index = useMissionStore(s=>s.index())
    const count = useMissionStore(s=>s.count())
    const missionAnswer = useMissionStore(s=>s.answer)
    const problem = useProblemStore(s=>
        currentProblemId !== undefined ? s.byId[currentProblemId] : undefined)
    const navigationHandlers = {
        next: useMissionStore(s=>s.next),
        prev: useMissionStore(s=>s.prev),
        moveTo: useMissionStore(s=>s.moveTo),
    }
    console.log("playscree", currentProblemId)
    
    if (!problem) return (<>Loading...</>)

    const title = formatTitle(problem.title, index, count)
    return (
        <PlayerScreenContent problem={problem}
            title={title}
            onAnswer={(id, res, sec) => {
                missionAnswer(res)
                navigationHandlers.next()
            }
            }
        />
    )
}
const formatTitle = (rawTitle: string, index: number, length: number): string => {
    const titlePrefix = `${(index ?? 0) + 1}/${length}: `
    const title = `${titlePrefix}${rawTitle}`
    return title
}


////////////////////////////////
// problem の実体を受け取り、スクリーンとして view に渡す。
//  (これをかまさないと防御コードばかりになっちゃう)
export function PlayerScreenContent({ problem, title, onAnswer}: {
    problem: Problem
    title: string
    onAnswer: (id: ProblemId, res: SolvedResult, sec?: number) => void
 }) {
    const starController = useStarToggleButton(problem)
    const mission = useMissionStore()
    //const controller = usePlayerController(mission.answer)
    const problemIds = mission.snapshot.problemIds
    
    
    const navigationHandlers: PlayerViewNavigationHandlers = useMemo(() => ({
        next: mission.next, prev: alert, moveTo: alert
    }), [mission])

    // replay
    const { initialPosition, moves } = problem.kifData
    const replay = useReplayController(initialPosition, moves)
    const showMovesController = useShowMovesController(problem.id, replay.plyIndex)

    // presenter
    const presenter = usePlayerPresenter(problem, useProblemStore(s=>s.updateProblem), navigationHandlers)    
    const review = useLearningEventStore(s=>s.review)

    // handlers
    const handlers = {
        ply: {
            advance: replay.advancePly,
            retreat: replay.retreatPly,
            moveTo: replay.moveToPly
        },
        navigation: navigationHandlers,
        //answer: controller.answer,
        setShowMoves: showMovesController.setShowMoves,
    }
    
    const answerCurrent = async (res: SolvedResult, sec?: number)  => {
        await review(problem.id, res, sec)
        onAnswer(problem.id, res, sec)
    } ///useCallback(
    //    (id: ProblemId, res: SolvedResult, sec?: number) =>
    //        controller.answer(problem.id, res, sec),
    //    [controller, problem.id]
    //)
    

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