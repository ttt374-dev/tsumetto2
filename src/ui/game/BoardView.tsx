import { Box, Stack } from "@mui/material";

import { Position, Piece, Board, Move } from "@/domain/kif/entity";
import styles from "./BoardView.module.css";
import { useBoardInputStore } from "./useBoardInputStore";
import { useGameStore } from "./useGameStore";
import { resolveIntent } from "./intentResolver";
import { HandView } from "./HandView";
import { useToast } from "../App/providers/ToastProvider";

const fileLabels = ["９", "８", "７", "６", "５", "４", "３", "２", "１"];
const rankLabels = ["一", "二", "三", "四", "五", "六", "七", "八", "九"];

function SquareView({ piece, selected, onClick }: {
    piece: Piece | null
    selected: boolean
    onClick?: () => void
}
) {
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
///////////////////////////////
function sameMove(a: Move, b: Move): boolean {
    console.log("samemove" ,a, b )
    return a.from?.file === b.from?.file &&
        a.from?.rank === b.from?.rank &&
        a.to.file === b.to.file &&
        a.to.rank === b.to.rank &&
        a.promote === b.promote &&
        a.pieceType === b.pieceType
}
export default function BoardView({ position }: { position: Position }) {
    const { board, hands } = position
    const ranks = [...Array(9)].map((_, i) => i + 1)   //   1 → 9
    const files = [...Array(9)].map((_, i) => 9 - i)   // 9 → 1（将棋表記） ???
    
    const selection = useBoardInputStore(s => s.selection)
    const clickSquare = useBoardInputStore(s => s.clickSquare)
    const { moves: correctMoves, ply, advancePly, makeMistake, makeResolve} = useGameStore()
    const toast = useToast()

    const handleSquareClick = (file: number, rank: number) => {
        const intent = clickSquare({file, rank}, position.board)

        if (!intent) return

        const move = resolveIntent(position, intent)
        if (move) {
            if (sameMove(correctMoves[ply], move)) {
                advancePly()   // player
                console.log("make resovl", ply, correctMoves.length - 1)
                if (ply >= correctMoves.length - 1) {
                    makeResolve()
                } else {
                    setTimeout(() => {
                        advancePly()
                    }, 500)
                    
                }            
            } else {
                makeMistake()
                toast({message: "incorrect"})
            }
        }
    }

    return (
        <Stack justifyContent="center" alignContent={"center"}  direction="row" >
            <Box className={styles.container}>
                {/* 持駒表示 */}
                <HandView hand={hands.get("white")} owner="white" />

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
                {/* 持駒表示 */}
                <HandView hand={hands.get("black")} owner="black" />
            </Box>
        </Stack >
    )
}


