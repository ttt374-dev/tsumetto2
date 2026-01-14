import { Box } from "@mui/material";
import styles from "./BoardView.module.css";
import type { Board } from "@/domain/kif/types/Board";
import { BoardState, type Hands, type Piece, type PieceType, type Player } from "@/domain/kif/types";


interface Props {
    board: Board;
    hands: Hands;

}

const fileLabels = ["９", "８", "７", "６", "５", "４", "３", "２", "１"];
const rankLabels = ["一", "二", "三", "四", "五", "六", "七", "八", "九"];
//const rankLabels = ["", "九", "八", "七", "六", "五", "四", "三", "二", "一"];


function displayPiece(type: PieceType): string {
    return "??" //TODO
}
function formatHand(player: Player) {
    return player  // TODO
}

function renderPiece(piece: Piece): string {
  return piece.owner === "black"
    ? piece.type
    : `v${piece.type}`   // 後手は仮で v
}

function BoardView({ board, hands }: Props ) {
    const ranks = [...Array(9)].map((_, i) => i +1)   //   1 → 9
    const files = [...Array(9)].map((_, i) => 9 - i)   // 9 → 1（将棋表記） ???

    return (
        <Box className={styles.container}>
            {/* 上の筋表示 */}
            <div className={styles.fileLabels}>
                <div className={styles.corner}></div> {/* 左上の空白 */}
                {fileLabels.map((f, i) => (
                    <div key={i} className={styles.fileLabel}>{f}</div>
                ))}
            </div>

            {/* 盤面 + 左側の段表示 */}
            {ranks.map(rank => (
                <div className={styles.rowWithRank}>
                    {/* 左側の段表示（スペース） */}
                    <div className={styles.rankLabel}></div>
                    {/* 盤面の行 */}
                    {files.map(file => {
                        const sq = { file, rank }
                        const piece = board.get(sq)
                        return (
                            <div className={styles.cell}>                                
                                {piece ? renderPiece(piece) : ""}
                            </div>
                        )
                    })}
                    <div className={styles.rankLabel}>{rankLabels[rank-1]}</div>
                </div>)
            )}
        </Box>
    )


}

export default BoardView;
