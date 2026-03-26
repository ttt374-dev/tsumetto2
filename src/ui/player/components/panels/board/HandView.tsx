import type { Hand, PieceType, Player } from "@/domain/kif/entity"
import { numberToKanjiTwoDigits } from "../../../../common/utils/numberToKanji"
import { useBoardInputStore } from "../../../hooks/useBoardInputStore"
import { formatPlayer } from "../../views/MovesView"
import styles from "./BoardView.module.css";
import { Box } from "@mui/material";

const PieceKeyKanjiMapping: Record<string, string> = {
    "pawn": "歩",
    "lance": "香",
    "knight": "桂",
    "silver": "銀",
    "gold": "金",
    "bishop": "角",
    "rook": "飛"
}
function HandPieceView({ pieceType, selected, count, owner, onClick }: { 
    pieceType: PieceType
    selected: boolean
    owner: Player
    count: number
    onClick?: () => void
}) {
    //const countString = count > 1 ? numberToKanjiTwoDigits(count) : ""
    return (
        <span style={{ marginRight: 5 }} onClick={() => onClick?.()}            
            className={`${styles.handpiece}
            ${ owner === "black" ? styles.handpieceBlack : ""}
            ${selected ? styles.selected : ""}`}>
            {PieceKeyKanjiMapping[pieceType]}<span style={{fontSize: 12}}>{count}</span>
        </span>)
}

/////////////////////////////
export default function HandView({ hand, owner }: { hand: Hand, owner: Player }) {
    const clickHandPiece = useBoardInputStore(s => s.clickHandPiece)
    const selection = useBoardInputStore(s=>s.selection)   
    
    const handleHandpieceClick = (pieceType: PieceType) => {
        clickHandPiece(pieceType, "black")
    }
    const isSelected = (pieceType: PieceType, owner: Player) => {
        return selection.type === "hand" &&
            selection.pieceType === pieceType &&
            owner === "black"

    }
    const pieceTypes: PieceType[] = ["rook", "bishop", "gold", "silver", "knight", "lance", "pawn"]
    
    return (
        <Box className={owner === "black" ? styles.handpieceBlack : ""}>
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