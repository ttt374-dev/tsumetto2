import { PieceTypeToKanjiMapping, type Hand, type PieceType, type Player } from "@/domain/kif/entity"
import { useBoardInputStore } from "@/ui/screens/player/store/useBoardInputStore"
import { formatPlayer } from "../../views/MovesView"
import styles from "./BoardView.module.css";
import { Box } from "@mui/material";
import { useCurrentPosition } from "@/ui/screens/player/store/useGameStore";

function HandPieceView({ pieceType, selected, count, owner, onClick }: { 
    pieceType: PieceType
    selected: boolean
    owner: Player
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
export default function HandView({ hand, owner }: { hand: Hand, owner: Player }) {
    const clickHandPiece = useBoardInputStore(s => s.clickHandPiece)
    const selection = useBoardInputStore(s=>s.selection)   
    const sideToMove = useCurrentPosition().sideToMove
    
    const handleHandpieceClick = (pieceType: PieceType) => {
        clickHandPiece(pieceType, sideToMove)
    }
    const isSelected = (pieceType: PieceType, owner: Player) => {
        return selection.type === "hand" &&
            selection.pieceType === pieceType &&
            owner === sideToMove

    }
    const pieceTypes: PieceType[] = ["rook", "bishop", "gold", "silver", "knight", "lance", "pawn"]
    
    return (
        <Box >
            { sideToMove === owner && "〇"}
            {formatPlayer(owner)}
            { hand.isEmpty() && "なし"}
            {
            pieceTypes.map(pieceType => {
                const count = hand.count(pieceType)
                if (count === 0) return null                    
                return (
                    <HandPieceView 
                        key={`handpiece-${owner}-${pieceType}`}
                        pieceType={pieceType} selected={isSelected(pieceType, owner)} count={count} owner={owner}
                        onClick={() => handleHandpieceClick(pieceType)}/>)
                })
            }
        </Box>
    )
}