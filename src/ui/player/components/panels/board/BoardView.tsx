import { Box } from "@mui/material"
import styles from "./BoardView.module.css";
import { useCurrentPosition, useGameStore } from "../../../hooks/useGameStore";
import { useBoardInputStore } from "../../../hooks/useBoardInputStore";
import { Board, Piece, Square } from "@/domain/kif/entity";
import { useTimerStore } from "@/ui/player/hooks/useTimerStore";
import { createGameController } from "@/ui/player/hooks/createGameController";

const fileLabels = ["９", "８", "７", "６", "５", "４", "３", "２", "１"];
const rankLabels = ["一", "二", "三", "四", "五", "六", "七", "八", "九"];

function SquareView({ piece, selected, onClick }: {
    piece: Piece | null
    selected: boolean
    onClick?: () => void
}) {
    return (
        <div
            className={`${styles.cell}  
            ${selected && styles.selected}
            ${piece?.owner === 'white' ? styles.white : ''}`}
            onClick={onClick}
        >
            {piece ? piece.format() : null}
        </div>
    )
}

export default function BoardView() {
    const { board } = useCurrentPosition()
    //const selection = useBoardInputStore(s => s.selection)
    const selection = useBoardInputStore(s=>s.selection)
    const ranks = [...Array(9)].map((_, i) => i + 1)   //   1 → 9
    const files = [...Array(9)].map((_, i) => 9 - i)   // 9 → 1（将棋表記o9i） ???

    //const position = useCurrentPosition()
    const timer = useTimerStore()
    const { handleIntent } = createGameController()

    //const handleIntent = useGameStore(s=>s.handleIntent)
    const clickSquare = useBoardInputStore(s => s.clickSquare)
    const clear = useBoardInputStore(s=>s.clear)

    const handleSquareClick = (file: number, rank: number) => {        
        const intent = clickSquare(new Square(file, rank), board)
        if (!intent) return
        //const result = resolveIntent(position, intent)
        const res = handleIntent(intent, timer.elapsedSec)
        if (res) clear()
        //if (move == "promotionRequired") 
        //move && tryMove(move)
        //tryMove(intent)
    }
    const isSelected = (sq: Square): boolean => {
        return selection.type === "board" &&
            selection.square.file === sq.file &&
            selection.square.rank === sq.rank
    }

    return (
        <Box className={styles.board}>
            {/* 上の筋表示 */}
            <div></div>
            {fileLabels.map((f, i) => (
                <div key={i} className={styles.fileLabel}>{f}</div>
            ))}
            <div></div>
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
                            onClick={() => handleSquareClick(file, rank)}
                        />
                    )
                })
                const empty = <div key={`empty-${rank}`}></div>
                const rankLabel = <div className={styles.rankLabel} key={`ranklabel-${rank}`}>
                    {rankLabels[rank - 1]}
                </div>
                return [empty, ...cells, rankLabel,]
            })}
        </Box>
    )
}