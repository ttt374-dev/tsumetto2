import { Box } from "@mui/material"
import styles from "./BoardView.module.css";
import { useCurrentPosition, useGameStore } from "./hooks/useGameStore";
import { useBoardInputStore } from "./hooks/useBoardInputStore";
import { Board, Piece } from "@/domain/kif/entity";
import { resolveIntent } from "./hooks/intentResolver";

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
    const selection = useBoardInputStore(s => s.selection)
    const ranks = [...Array(9)].map((_, i) => i + 1)   //   1 → 9
    const files = [...Array(9)].map((_, i) => 9 - i)   // 9 → 1（将棋表記） ???

    const position = useCurrentPosition()

    const tryMove = useGameStore(s => s.tryMove)
    const clickSquare = useBoardInputStore(s => s.clickSquare)

    const handleSquareClick = (file: number, rank: number) => {
        const intent = clickSquare({ file, rank }, board)
        if (!intent) return
        const move = resolveIntent(position, intent)
        move && tryMove(move)
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
                    const piece = board.get(file, rank)
                    const selected =
                        selection.type === "board" &&
                        selection.square.file === file &&
                        selection.square.rank === rank
                    return (
                        <SquareView
                            key={Board.squareKey(file, rank)}
                            piece={piece}
                            selected={selected}
                            onClick={() => handleSquareClick(file, rank)}
                        />
                    )
                })
                const empty = <div></div>
                const rankLabel = <div className={styles.rankLabel}>
                    {rankLabels[rank - 1]}
                </div>
                return [empty, ...cells, rankLabel,]
            })}
        </Box>
    )
}