import { Box } from "@mui/material"

import styles from "./BoardView.module.css";
import { useCurrentPosition, useGameStore } from "@/ui/screens/player/store/useGameStore";
import { useBoardInputStore } from "@/ui/screens/player/store/useBoardInputStore";
import { Board, Piece, Square } from "@/domain/kif/entity";
import { createDecideGameEventContext, decideGameEvent } from "@/domain/game/decideGameEvent";
import { resolveIntent } from "@/domain/game/intentResolver";
import { SquareView } from "@/ui/screens/player/components/panels/board/SquareView";

const fileLabels = ["９", "８", "７", "６", "５", "４", "３", "２", "１"];
const rankLabels = ["一", "二", "三", "四", "五", "六", "七", "八", "九"];



export default function BoardView({ reversed}: { reversed: boolean}) {
    const position = useCurrentPosition()        
    
    const { board } = position
    const selection = useBoardInputStore(s => s.selection)
    const ranks = reversed
        ? [...Array(9)].map((_, i) => 9 - i) // 9 → 1
        : [...Array(9)].map((_, i) => i + 1) // 1 → 9

    const files = reversed
        ? [...Array(9)].map((_, i) => i + 1) // 1 → 9
        : [...Array(9)].map((_, i) => 9 - i) // 9 → 1
    
       
    
    const dispatch = useGameStore(s=>s.dispatch)
    const promotionPending = useGameStore(s=>s.promotionPending)    
    const clickSquare = useBoardInputStore(s => s.clickSquare)
    const clear = useBoardInputStore(s=>s.clear)

    const handleSquareClick = (file: number, rank: number) => {        
        const intent = clickSquare(new Square(file, rank))
        if (!intent) return
        const intentResult = resolveIntent(position, intent)        
        const ctx = createDecideGameEventContext()
        const decision = decideGameEvent({intentResult, ...ctx})
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

    return (
        <Box className={styles.board}>
            <FileLabels location="top" reversed={reversed}/>    
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
                            onClick={() => handleSquareClick(file, rank)}
                        />
                    )
                })
                const empty = <div key={`empty-${rank}`}></div>
                const rankLabel = <div className={styles.rankLabel} key={`ranklabel-${rank}`}>
                    {rankLabels[rank - 1]}
                </div>
                return !reversed ? [empty, ...cells, rankLabel,] : [ rankLabel, ...cells, empty]
            })}
            <FileLabels location="bottom" reversed={reversed}/>
        </Box>
    )

}

    function FileLabels(props: {
        reversed: boolean
        location: "top" | "bottom"
    }) {
        const displayFileLabels = props.reversed ? [...fileLabels].reverse() : fileLabels
        const visible = (props.reversed && props.location === "bottom") ||
            ( !props.reversed && props.location === "top")
        return (<>
        <div></div>
            {
                displayFileLabels.map((f, i) => (
                    <div key={i} className={styles.fileLabel}>{ visible && f}</div>
                ))
            }
            <div></div>
            </>)
    }
