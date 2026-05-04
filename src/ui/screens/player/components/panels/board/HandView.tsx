import { PieceTypeToKanjiMapping, type Hand, type PieceType, type Player } from "@/domain/kif/entity"
import { useBoardInputStore, type Selection } from "@/ui/screens/player/store/useBoardInputStore"
import { formatPlayer } from "../moves/MovesView"
import styles from "./BoardView.module.css";
import { Box, Stack } from "@mui/material";

function HandPieceView({ pieceType, selected, count, onClick }: { 
    pieceType: PieceType
    selected: boolean
    count: number
    onClick?: () => void
}) {
    return (
        <span style={{ marginRight: 5 }} onClick={() => onClick?.()}            
            className={`${styles.handpiece}
            ${selected ? styles.selected : ""}`}>
            {PieceTypeToKanjiMapping['base'][pieceType]}<span style={{fontSize: 12}}>{count}</span>
        </span>)
}

/////////////////////////////
export default function HandView({ hand, owner, sideToMove, selection, onClickHandPiece }: {
    hand: Hand, owner: Player, sideToMove: Player, selection: Selection
    onClickHandPiece: (pieceType: PieceType, owner: Player) => void}
) {    
    const handleHandpieceClick = (pieceType: PieceType) => {
        onClickHandPiece(pieceType, sideToMove)
    }
    const isSelected = (pieceType: PieceType, owner: Player) => {
        return selection.type === "hand" &&
            selection.pieceType === pieceType &&
            owner === sideToMove

    }
    const pieceTypes: PieceType[] = ["rook", "bishop", "gold", "silver", "knight", "lance", "pawn"]
    
    return (
        <Stack direction="row" justifyContent={"center"} >
            {formatPlayer(owner)}
            { hand.isEmpty() && "なし"}
            {
            pieceTypes.map(pieceType => {
                const count = hand.count(pieceType)
                if (count === 0) return null                    
                return (
                    <HandPieceView 
                        key={`handpiece-${owner}-${pieceType}`}
                        pieceType={pieceType} selected={isSelected(pieceType, owner)} count={count}
                        onClick={() => handleHandpieceClick(pieceType)}/>)
            })
            }
            {sideToMove === owner &&

                <Box sx={{
        position: "absolute",
        right: 16,
      }}
                    justifyContent={"right"}
                >〇</Box>}
        </Stack>
    )
}