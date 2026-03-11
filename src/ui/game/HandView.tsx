import type { Hand, PieceType, Player } from "@/domain/kif/entity"
import { numberToKanjiTwoDigits } from "../common/utils/numberToKanji"
import { useBoardInputStore } from "./useBoardInputStore"
import { formatPlayer } from "../player/components/views/MovesView"
import styles from "./BoardView.module.css";

const PieceKeyKanjiMapping: Record<string, string> = {
    "pawn": "歩",
    "lance": "香",
    "knight": "桂",
    "silver": "銀",
    "gold": "金",
    "bishop": "角",
    "rook": "飛"
}
function HandPieceView({ pieceType, selected, count, onClick }: { 
    pieceType: PieceType
    selected: boolean
    count: number
    onClick?: () => void
}) {
    const countString = count > 1 ? numberToKanjiTwoDigits(count) : ""
    return (
        <span style={{ marginRight: 5 }} onClick={() => onClick?.()}            
            className={`${styles.handpiece}  ${selected ? styles.selected : ""}`}>
            {PieceKeyKanjiMapping[pieceType]}{countString}
        </span>)
}

/////////////////////////////
export function HandView({ hand, owner }: { hand: Hand, owner: Player }) {
    const clickHandPiece = useBoardInputStore(s => s.clickHandPiece)
    const selection = useBoardInputStore(s=>s.selection)   

    //console.log("handview", hand.toDTO())
    const handleHandpieceClick = (pieceType: PieceType) => {
        clickHandPiece(pieceType, "black")
    }
    const keys: PieceType[] = ["rook", "bishop", "gold", "silver", "knight", "lance", "pawn"]
    //console.log("is empty", hand.isEmpty())
    return (
        <div>
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
                        pieceType={key} selected={selected} count={count} 
                        onClick={() => handleHandpieceClick(key)}/>)
                })
            }
        </div>
    )
}