import { useFsmContext } from "../App/providers/fsmProvider"
import { Box, Button, List, ListItem, Stack } from "@mui/material"
import { useMissionItem } from "../../application/useMissionItem"
import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AppLayout } from "../common/AppLayout"
import BoardView from "./components/BoardView"
import { useReplayFsm } from "../../application/ReplayFsm/useReplayFsm"
import MovesView from "./components/MovesView"
import { BoardState, KifData } from "@/domain/kif/types"

export function PlayerScreen() {
    const [ showMoves, setShowMoves ] = useState(false)
    const { state: fsmState, next, prev, solve, fail,
        advancePhase, retreatPhase,
    } = useFsmContext()

    const { missionItems, markAnswer, toggleStar } = useMissionItem()

    const problemId = fsmState.queue[fsmState.currentIndex]?.problemId
    const missionItem = missionItems.find((m) => m.problem.id === problemId)

    const navigate = useNavigate()

    // 最後のインデックスだったらサマリーに遷移
    useEffect(() => {
        if (fsmState.isFinished) {
            navigate("/summary", { state: { fsmState } })
        }
    }, [fsmState.isFinished, navigate]);

    // answer から次へ自動遷移
    /*
    useEffect(() => {
        if (fsmState.phase === "answered")
            next()
    }, [fsmState.phase])
*/
    // 問題が変わったら手筋をリセット
    useEffect(() => {
        if (!fsmState) return

        //timer.reset()
        //timer.start()
        resetPly()
        setShowMoves(false)
    }, [fsmState.currentIndex])

    const kifdata = missionItem?.problem.kifData ?? KifData.create()
    const { board, hands, moves, currentPlyIndex,
        advancePly, retreatPly,
        moveToPly, resetPly,
    } = useReplayFsm(kifdata)

    


    if (!missionItem) {
        return (
            <>
                NO MISSION
                <Button onClick={() => { navigate("/dashboard") }}>
                    Back
                </Button>
            </>)
    }

    return (
        <AppLayout
            header={missionItem.problem.title}
            footer={
                <Stack direction="row" spacing={1}>
                    <Button fullWidth variant="contained" onClick={() => { markAnswer(missionItem, "failed"); fail() }}>
                        Failed
                    </Button>

                    <Button fullWidth variant="contained" onClick={() => { markAnswer(missionItem, "solved"); solve() }}>
                        Solved
                    </Button>
                    <Button fullWidth variant="contained" onClick={() => { markAnswer(missionItem, "solved", 3); solve() }}>
                        easy
                    </Button>


                </Stack>
            }
        >
            <Stack justifyContent="center">
                <Box>
                    <BoardView board={board} hands={hands} />
                </Box>
            </Stack>

            <Stack direction="row" justifyContent="center">
                <Button onClick={prev}>
                    Prev
                </Button>
                <Button onClick={retreatPly}>
                    Ret Ply
                </Button>

                <Button onClick={advancePly}>
                    Adv Ply
                </Button>
                <Button onClick={next}>
                    Next
                </Button>
            </Stack>
            

            <Box>
            { showMoves && 
            
                <MovesView moves={moves} currentPlyIndex={currentPlyIndex} onMoveClick={moveToPly}/>
            
            }
            { !showMoves &&
            <Button onClick={() => { setShowMoves(true)}}>
                Show MOves
            </Button>}

            
            {missionItem.learning &&
                <Stack direction="row" spacing={2}>
                    <Box>
                        {missionItem.learning.solvedCount} /
                        {missionItem.learning.totalCount}
                    </Box>
                    <Box>
                        ef{missionItem.learning.easeFactor.toFixed(2)},
                        reviewed at {new Date(missionItem.learning.nextReviewedAt).toLocaleString()}
                    </Box>


                </Stack>
            }
            </Box>
        </AppLayout>
    )
}