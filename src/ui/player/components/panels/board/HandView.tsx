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
    const countString = count > 1 ? numberToKanjiTwoDigits(count) : ""
    return (
        <span style={{ marginRight: 5 }} onClick={() => onClick?.()}            
            className={`${styles.handpiece}
            ${ owner === "black" ? styles.handpieceBlack : ""}
            ${selected ? styles.selected : ""}`}>
            {PieceKeyKanjiMapping[pieceType]}{countString}
        </span>)
}

/////////////////////////////
export default function HandView({ hand, owner }: { hand: Hand, owner: Player }) {
    const clickHandPiece = useBoardInputStore(s => s.clickHandPiece)
    const selection = useBoardInputStore(s=>s.selection)   
    
    const handleHandpieceClick = (pieceType: PieceType) => {
        clickHandPiece(pieceType, "black")
    }
    const keys: PieceType[] = ["rook", "bishop", "gold", "silver", "knight", "lance", "pawn"]
    
    return (
        <Box className={owner === "black" ? styles.handpieceBlack : ""}>
            {formatPlayer(owner)}
            { hand.isEmpty() && "なし"}
            {
            keys.map(key => {
                const count = hand.count(key)
                if (count === 0) return null
                const selected = 
                    selection.type === "hand" &&
                    selection.pieceType === key &&
                    owner === "black"
                    
                return (
                    <HandPieceView 
                        pieceType={key} selected={selected} count={count} owner={owner}
                        onClick={() => handleHandpieceClick(key)}/>)
                })
            }
        </Box>
    )
}