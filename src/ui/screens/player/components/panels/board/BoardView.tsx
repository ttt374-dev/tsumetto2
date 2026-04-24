import { Box } from "@mui/material"

import styles from "./BoardView.module.css";
import { useGameStore } from "@/ui/screens/player/store/useGameStore";
import { useBoardInputStore } from "@/ui/screens/player/store/useBoardInputStore";
import { Board,  Position, Square } from "@/domain/kif/entity";
import { createDecideGameEventContext, decideGameEvent } from "@/domain/game/decideGameEvent";
import { resolveIntent } from "@/domain/game/intentResolver";
import { SquareView } from "@/ui/screens/player/components/panels/board/SquareView";
import { useReplayStore } from "@/ui/screens/player/store/useReplayStore";

const fileLabels = ["９", "８", "７", "６", "５", "４", "３", "２", "１"];
const rankLabels = ["一", "二", "三", "四", "五", "六", "七", "八", "九"];

export default function BoardView({ position, reversed = false }: { 
    position: Position, reversed?: boolean }) {

    const selection = useBoardInputStore(s => s.selection)
    const userSide = useGameStore(s => s.userSide)
    const dispatch = useGameStore(s => s.dispatch)
    const promotionPending = useGameStore(s => s.promotionPending)
    const clickSquare = useBoardInputStore(s => s.clickSquare)
    const clear = useBoardInputStore(s => s.clear)
    const { board, sideToMove } = position
    
    const ranks = [...Array(9)].map((_, i) => reversed ? 9 - i : i + 1)
    const files = [...Array(9)].map((_, i) => reversed ? i + 1 : 9 - i)


    const handleSquareClick = (file: number, rank: number) => {
        const intent = clickSquare(new Square(file, rank))
        if (!intent) return
        const intentResult = resolveIntent(position, intent)

        const isUserTurn = sideToMove === userSide
        const ctx = createDecideGameEventContext()

        const decision = decideGameEvent({ intentResult, isUserTurn, ...ctx })
        switch (decision.type) {
            case "invalidMove":
                return
            case "promotionPending":
                promotionPending(decision.pendingPromotion)
                return
            case "event":
                dispatch(decision.event)
                clear()
                return
        }
    }
    const isSelected = (sq: Square): boolean => {
        return selection.type === "board" &&
            selection.square.file === sq.file &&
            selection.square.rank === sq.rank
    }
    const moves = useGameStore(s => s.moves)
    const ply = useReplayStore(s=>s.ply)
    const lastMove = ply > 0 ? moves[ply - 1] : null
    const isLastMoveTo = (sq: Square) =>
        !lastMove ? false :
        lastMove.to &&
        lastMove.to.file === sq.file &&
        lastMove.to.rank === sq.rank
    
    const isLastMoveFrom = (sq: Square) =>
        !lastMove ? false :
        lastMove.from !== null &&
        lastMove.from.file === sq.file &&
        lastMove.from.rank === sq.rank
    return (
        <Box className={styles.board}>
            <FileLabels location="top" reversed={reversed} />
            {/* 盤面 + 左側の段表示 */}
            {ranks.flatMap(rank => {
                const cells = files.map(file => {
                    const sq = new Square(file, rank)
                    const piece = board.get(sq)
                    return (
                        <SquareView
                            key={Board.squareKey(new Square(file, rank))}
                            piece={piece}
                            selected={isSelected(sq)}
                            reversed={reversed}
                            lastTo={isLastMoveTo(sq)}
                            lastFrom={isLastMoveFrom(sq)}
                            onClick={() => handleSquareClick(file, rank)}
                        />
                    )
                })
                const empty = <div key={`empty-${rank}`}></div>
                const rankLabel = <div className={styles.rankLabel} key={`ranklabel-${rank}`}>
                    {rankLabels[rank - 1]}
                </div>
                return !reversed ? [empty, ...cells, rankLabel,] : [rankLabel, ...cells, empty]
            })}
            <FileLabels location="bottom" reversed={reversed} />
        </Box>
    )

}

type FileLabelLocation = "top" | "bottom"
function FileLabels(props: {
    reversed: boolean
    location: FileLabelLocation
}) {
    const displayFileLabels = props.reversed ? [...fileLabels].reverse() : fileLabels
    const visible = (props.reversed && props.location === "bottom") ||
        (!props.reversed && props.location === "top")
    return (<>
        <div></div>
        {
            displayFileLabels.map((f, i) => (
                <div key={i} className={styles.fileLabel}>{visible && f}</div>
            ))
        }
        <div></div>
    </>)
}
