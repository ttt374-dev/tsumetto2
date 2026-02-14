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
import { useRightActionsDrawer } from "./components/RightActionsDrawer";
import { useMissionPlayerStore } from "./hooks/useMissionPlayerStore";
import { useMissionEventStoreContext } from "../App/providers/MissionEventStoreProvider";

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

const formatTitle = (rawTitle: string, index: number, length: number, missionName: string): string => {
    const titlePrefix = `${missionName} [${(index ?? 0) + 1}/${length}]: `
    const title = `${titlePrefix}${rawTitle}`
    return title
}


export function PlayerScreen() {    
    // store に依存注入
    const missionEventStore = useMissionEventStoreContext()
    useEffect(() => {
        const store = useMissionPlayerStore.getState()
        store.setMissionEventStore(missionEventStore)

        // missionEventStore から snapshot を取得して初期化
        if (missionEventStore.snapshot.problemIds.length > 0) {
            store.setSnapshot(missionEventStore.snapshot)
        }
    }, [missionEventStore])

    const currentProblemId = useMissionPlayerStore(s=>s.currentProblemId)
    const problem = useProblemStore(s=>
        currentProblemId ? s.byId[currentProblemId] : undefined)
    const learningEventStore = useStores().learningEvent

    const navigationHandlers = {
        next: useMissionPlayerStore(s => s.next),
        prev: useMissionPlayerStore(s => s.prev),
        moveTo: useMissionPlayerStore(s => s.moveTo),
    }
    const onAnswer = async (id: ProblemId, r: SolvedResult, sec?: number) => {
        useMissionPlayerStore(s => s.answer(id, r, sec))
        await learningEventStore.review(id, r, sec)
    }
    const title = formatTitle(problem?.title ?? "", useMissionPlayerStore(s=>s.index),
        useMissionPlayerStore(s=>s.snapshot.problemIds.length),
        ""
    )
    if (!problem) return (<>Loading...</>)
    return (
        <PlayerScreenContent 
            problem={problem} 
            navigationHandlers={navigationHandlers}
            title={title}
            onAnswer={onAnswer}
            
        />
    )
}

////////////////////////////////
// problem の実体を受け取り、スクリーンとして view に渡す。
//  (これをかまさないと防御コードばかりになっちゃう)
// mission には非依存
export function PlayerScreenContent({ problem, navigationHandlers, onAnswer, title }: {
    problem: Problem     
    navigationHandlers: {
        next: () => void, 
        prev: () => void,
        moveTo: (id: ProblemId) => void,
    },
    onAnswer: (id: ProblemId, r: SolvedResult, s?: number) => void
    title: string,
}) {
    const starController = useStarToggleButton(problem)
    
    // replay
    const { initialPosition, moves } = problem.kifData
    const replay = useReplayController(initialPosition, moves)
    const showMovesController = useShowMovesController(problem.id, replay.plyIndex)
    const handlers = {
        ply: {
            advance: replay.advancePly,
            retreat: replay.retreatPly,
            moveTo: replay.moveToPly
        },
        navigation: navigationHandlers,
        answer: onAnswer,
        setShowMoves: showMovesController.setShowMoves,
    }
    
    // presenter
    const presenter = usePlayerPresenter(problem, useProblemStore(s=>s.updateProblem), navigationHandlers)
    

    //////////////////////////////////////////
    return (
        <AppShell
            header={title}
            footer={<PlayerAnswerActions onAnswerClick={(r) => onAnswer(problem.id, r)} />}
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