import { Box } from "@mui/material";
import styles from "./BoardView.module.css";
import type { Board } from "@/domain/kif/Board";


//import { PieceTypes } from '@/domain/kif/types/'
//import { formatHand } from "@/domain/kif-old/formatter/formatHand";


interface Props {
  board: Board;
  hands: Hands;
  
}

const fileLabels = ["９","８","７","６","５","４","３","２","１"];
const rankLabels = ["一","二","三","四","五","六","七","八","九"];

function displayPiece(type: PieceTypeKey): string {
  const piece = PieceTypes[type]

  if (!piece) {
    console.warn(`Unknown PieceTypeKey: ${type}`)
    return "？"
  }

  return piece.display
}
function BoardView({ board, hands}: Props) { 
  //console.log("board", board)
  //console.log("hands on BoardView", hands)
  return (
    <Box className={styles.container}>
      {/* 持駒表示 */}
      <div>
        { <div>△後手：{formatHand(hands.white)}</div>} 
      </div>

      {/* 上の筋表示 */}
      <div className={styles.fileLabels}>

        <div className={styles.corner}></div> {/* 左上の空白 */}
        {fileLabels.map((f, i) => (
          <div key={i} className={styles.fileLabel}>{f}</div>
        ))}
      </div>

      {/* 盤面 + 左側の段表示 */}
      {board.map((row, r) => (
        <div key={r} className={styles.rowWithRank}>

          {/* 左側の段表示（スペース） */}
          <div className={styles.rankLabel}></div>
          {/* 盤面の行 */}
          {row
            .slice()
            .reverse() // file（9→1）だけ反転
            .map((cell, c) => {
              if (!cell) {
                return <div key={c} className={styles.emptyCell} />;
              }
              return (
                <div
                  key={c}
                  className={`${styles.cell} ${cell.owner === 'white' && styles.white}  :`}
                >
                  
                  { displayPiece(cell.key)}

                </div>
              );
            })}

            {/* 右側の段表示 */}
          <div className={styles.rankLabel}>{rankLabels[r]}</div>

        </div>
      ))}

      {/* 持駒表示 */}
      <div>
        <div>▲先手：{ formatHand(hands.black) }</div>
      </div>

      
    </Box>
  );
}

export default BoardView;
