import { Box } from "@mui/material"

import styles from "./BoardView.module.css";
import { Square } from "@/domain/kif/entity";
import { buildSquareModel, SquareView } from "@/ui/screens/player/components/panels/board/SquareView";
import type { BoardOKViewModel} from "@/ui/screens/player/vm/PlayerViewModel";
import { BoardInteractor } from "@/application/board/BoardInteractor";
import { useMemo } from "react";
import type { BoardActions } from "@/ui/screens/player/hooks/usePlayerActions";

const fileLabels = ["９", "８", "７", "６", "５", "４", "３", "２", "１"];
const rankLabels = ["一", "二", "三", "四", "五", "六", "七", "八", "九"];

export default function BoardView({ boardModel, actions }: { 
    boardModel: BoardOKViewModel, actions: BoardActions}) {
    
    const { reversed } = boardModel    
    
    const ranks = [...Array(9)].map((_, i) => reversed ? 9 - i : i + 1)
    const files = [...Array(9)].map((_, i) => reversed ? i + 1 : 9 - i)

    const interactor = useMemo(
        () => new BoardInteractor({ boardModel, actions }),
        [boardModel, actions]
    )
    return (
        <Box className={styles.board}>
            <FileLabels location="top" reversed={reversed} />
            {/* 盤面 + 左側の段表示 */}
            {ranks.flatMap(rank => {
                const cells = files.map(file => {                    
                    const sq = new Square(file, rank)
                    const squareModel = buildSquareModel(sq, boardModel)
                    //const piece = board.get(sq)
                    return (
                        <SquareView                            
                            squareModel={squareModel}
                            onClick={() => interactor.handleSquareClick(sq)}
                        />
                    )
                })
                const empty = <EmptyRow rank={rank}/>
                const rankLabel = <RankLabel rank={rank}/>
                return !reversed ? [empty, ...cells, rankLabel,] : [rankLabel, ...cells, empty]
            })}
            <FileLabels location="bottom" reversed={reversed} />
        </Box>
    )

}
function EmptyRow({rank}: {rank: number}){
    return <div key={`empty-${rank}`}/>
}
function RankLabel({ rank }: { rank: number }) {
    return <div className={styles.rankLabel} key={`ranklabel-${rank}`}>
        {rankLabels[rank - 1]}
    </div>
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
