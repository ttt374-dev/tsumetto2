import { Box, Button, Grid, Stack, Typography } from "@mui/material"

import MovesView from "./views/MovesView"
import { PlyControlPanel } from "./panels/PlyControlPanel"
import BoardPanel from "./panels/BoardPanel"
import { formatLearningPerformance } from "@/ui/library/components/LibraryListItem"
import type { Problem, ProblemId } from "@/domain/problem/entity/Problem"
import { useReplayController } from "../hooks/useReplayController"
import React, { createContext, useEffect, useState } from "react"
import type { ProblemNavigation } from "../PlayerScreen"
import { useLearningRecordStore } from "@/ui/store/useLearningRecordStore"
import { useTimer } from "../hooks/useTimer"
import MovesPanel from "./panels/MovesPanel"
import type { Learning } from "@/domain/learning/entity/Learning"
import { Move, Piece, type Player, type Square } from "@/domain/kif/entity"
import { useReplayStore } from "../hooks/useReplayStore"

export function useShowMovesController(plyIndex: number) {
    const [showMoves, setShowMoves] = useState(false)
    useEffect(() => {
        if (plyIndex > 0) {
            setShowMoves(true)
        } else if (plyIndex === 0) {
            setShowMoves(false)
        }
    }, [plyIndex])
    
    return { showMoves, setShowMoves }
}

function formatTime(sec: number) {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m}:${s.toString().padStart(2, "0")}`
}

export const TimerControl = ({isTimerRunning, elaspedSec, onToggleTimer}: {
    onToggleTimer: () => void
    isTimerRunning: boolean
    elaspedSec: number
}) => {
    return (
        <Button
            variant="contained"
            sx={{
                borderRadius: 2,
                background: "linear-gradient(145deg, #ffffff, #e6e6e6)",

                color: "#333",
                textTransform: "none",
                "&:hover": {
                    background: "linear-gradient(145deg, #f0f0f0, #dcdcdc)",
                },
            }}
        >
            <Typography variant="body2" fontWeight="bold" sx={{ cursor: "pointer" }}
                onClick={onToggleTimer}
            >
                {isTimerRunning ? "II" : "▶"} {formatTime(elaspedSec)}
            </Typography>
        </Button>)
}
export type BoardContextType = {
    onSquareClick: (file: number, rank: number, piece?: Piece) => void
    selected: Square | null
    setSelected: (s: Square | null) => void
}
    
export const BoardContext = createContext<BoardContextType | null>(null)

///////////////////////////////////////////////////////////////
function PlayerView({problem, title, problemNavigation, timer}: {
    problem: Problem
    title: React.ReactNode,
    problemNavigation?: ProblemNavigation,
    timer?: ReturnType<typeof useTimer>
}){
    const moves = problem.kifData.moves
    //const replay = useReplayController(problem.kifData.initialPosition, moves)
    
    const replay = useReplayStore()
    const showMovesController = useShowMovesController(replay.plyIndex)
    const learning: Learning | undefined = useLearningRecordStore(s=>s.records)[problem.id]
    const [selected, setSelected] = useState<Square | null> (null)
    //const { playUserMove } = usePuzzleController(problem.kifData.initialPosition, moves)

    function sameMove(a: Move, b: Move) {
        return (
            a.from?.file === b.from?.file &&
            a.from?.rank === b.from?.rank &&
            a.to.file === b.to.file &&
            a.to.rank === b.to.rank &&
            a.promote === b.promote
        )
    }
    function canPromoteMove(to: Square, piece: Piece): boolean {
        if (piece.promoted || !Piece.isPromotablePiece(piece.type)) return false
        
        return piece.owner === "black" ? (to.rank <= 3) : (to.rank >=7)
    }
    function onSquareClick(file: number, rank: number) {
        if (replay.currentPlayer !== "black") return
        console.log("onsqurecliek:", file, rank, selected)
        if (!selected) {
            setSelected({ file, rank })
            console.log("selected: ", file, rank)
            return
        }
        
        
        const piece = replay.position.board.get(selected.file, selected.rank)  
        console.log("piece:", piece, selected)
        
        if (!piece) throw new Error("no piece")
        const promote = canPromoteMove({file, rank}, piece) && window.confirm("promote?") 

        const move = new Move(selected, { file, rank}, piece.type, piece.promoted || promote, "")            
       

        const expected = moves[replay.plyIndex]
        const isSameMove = sameMove(expected, move)
        //const result = playUserMove(move)
        console.log("same?", isSameMove, expected, move, replay)
        if (isSameMove){
            replay.advancePly()
            console.log("replay", replay)
            replay.advancePly()            
            console.log("replay+", replay)
            if(replay.isFinished){
                alert("CORRECT")
            }
        } else {
            alert("INCORRECT")
        }
        setSelected(null)
    }

    return (
        <Stack sx={{ minHeight: 0, height: "100%" }} spacing={1} >            
            <Box sx={{
                whiteSpace: "nowrap",
                overflowX: "auto",
                overflowY: "hidden",
                WebkitOverflowScrolling: "touch",
            }}>
                <Typography variant="h6">{title} </Typography>
            </Box>
            { /* --- 盤面 ---*/}
            <BoardContext.Provider value={{
                onSquareClick: (file, rank) => onSquareClick(file, rank),
                selected: selected,
                setSelected: setSelected,
            }}>


                <BoardPanel
                    position={replay.position}
                    onAdvancePly={replay.advancePly}
                    onRetreatPly={replay.retreatPly}
                    onNextProblem={problemNavigation?.next}
                    onPrevProblem={problemNavigation?.prev} />
            </BoardContext.Provider>
            <Stack direction="row" sx={{ minHeight: 0, flexGrow: 1, p: 1 }} spacing={1}>
                { /* --- 手筋 ---*/}

                <MovesPanel>
                    {showMovesController.showMoves ?
                        <MovesView moves={moves} currentPlyIndex={replay.plyIndex} onMoveToPly={replay.moveToPly} />
                        : (<Stack>
                            <Button onClick={() => showMovesController.setShowMoves(true)} >
                                手数：{moves.length}手
                            </Button>                            
                            <Box>{problem.tags.join(",")}</Box>
                            <Box>出典：{problem.source}</Box>
                        </Stack>)
                    }
                </MovesPanel>

                { /* --- コントロールパネル ---*/}
                <Box flex={0.75} sx={{ border: 1, borderColor: "divider" }}>
                    <PlyControlPanel
                        currentPlyIndex={replay.plyIndex}
                        maxPlyIndex={moves.length}
                        onPrevPly={replay.retreatPly}
                        onNextPly={replay.advancePly}
                    />
                    {learning && formatLearningPerformance(learning)}

                    {timer &&
                        <Box sx={{ p: 1 }}>
                            <TimerControl
                                isTimerRunning={timer.isRunning}
                                onToggleTimer={timer.toggle}
                                elaspedSec={timer.seconds}
                            />
                        </Box>
                    }
                </Box>
            </Stack>
        </Stack>
    )
}

export default PlayerView