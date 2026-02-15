
import { useCallback, useEffect, useMemo, useState } from "react"
import { useReplayController } from "./useReplayController"
import { useStarToggleButton } from "@/application/useStarToggleButton"
import { useProblemStore } from "@/application/store/useProblemStore"
import { useLearningEventStore } from "@/application/store/useLearningEventStore"
import { usePlayerPresenter } from "./usePlayerPresenter"
import type { Problem, ProblemId } from "@/domain/problem/Problem"
import type { PlayerViewNavigationHandlers } from "../components/PlayerView"
import type { SolvedResult } from "@/domain/learning/Learning"

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
///////////////////////////////////////////
export function usePlayerViewModel(problem: Problem, navigationHandlers: PlayerViewNavigationHandlers) {
    // star
    const starController = useStarToggleButton(problem)

    // replay / moves
    const { initialPosition, moves } = problem.kifData
    const replay = useReplayController(initialPosition, moves)

    // show moves
    const showMovesController = useShowMovesController(problem.id, replay.plyIndex)

    // presenter
    const presenter = usePlayerPresenter(problem, useProblemStore(s=>s.updateProblem), navigationHandlers)

    // learning / answer
    const review = useLearningEventStore(s=>s.review)
    const answerCurrent = async (res: SolvedResult, sec?: number) => {
        await review(problem.id, res, sec)
    }

    // handlers 集約
    const handlers = useMemo(() => ({
        ply: {
            advance: replay.advancePly,
            retreat: replay.retreatPly,
            moveTo: replay.moveToPly,
        },
        navigation: navigationHandlers,
        setShowMoves: showMovesController.setShowMoves,
    }), [replay, navigationHandlers, showMovesController])

    return {
        moves,
        replayPosition: replay.position,
        currentPlyIndex: replay.plyIndex,
        tags: problem.tags,
        showMoves: showMovesController.showMoves,
        starController,
        presenter,
        handlers,
        answerCurrent,
    }
}
