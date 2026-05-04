import { pieceTypes, PieceTypeToKanjiMapping, type Hand, type PieceType, type Player } from "@/domain/kif/entity"
import { useBoardInputStore, type Selection } from "@/ui/screens/player/store/useBoardInputStore"
import { formatPlayer } from "../moves/MovesView"
import styles from "./BoardView.module.css";
import { Box, Stack } from "@mui/material";
import { useGameUIStore } from "@/ui/screens/player/store/useGameUIStore";

type HandPieceUIModel = {
    pieceType: PieceType
    count: number
    isSelected: boolean
}

function HandPieceView({ pieceType, selected, count, onClick }: {
    pieceType: PieceType
    selected: boolean
    count: number
    onClick?: () => void
}) {
    return (
        <span style={{ marginRight: 5 }} onClick={() => onClick?.()}
            className={`${styles.handpiece}
            ${selected && styles.selected}`}>
            {PieceTypeToKanjiMapping['base'][pieceType]}<span style={{ fontSize: 12 }}>{count}</span>
        </span>)
}

/////////////////////////////
export default function HandView({ hand, owner, sideToMove, selection, userSide, onClickHandPiece }: {
    hand: Hand, owner: Player, sideToMove: Player, selection: Selection,
    userSide: Player,
    onClickHandPiece: (pieceType: PieceType, owner: Player) => void
}
) {
    const handleHandpieceClick = (pieceType: PieceType) => {
        
        onClickHandPiece(pieceType, sideToMove)
    }
    const models = buildHandPieceUIModels(hand, owner, selection, sideToMove).filter(m => m.count > 0)
    
    //const userSide = useGameUIStore(s=>s.userSide)
    console.log("userside", userSide, owner, sideToMove)
    return (
        <Stack direction="row" justifyContent={"center"} >
            {formatPlayer(owner)}
            {hand.isEmpty() && "なし"}
            {
                models.map(m => (
                    <HandPieceView
                        pieceType={m.pieceType}
                        count={m.count}
                        selected={m.isSelected}
                        onClick={() => owner === sideToMove && sideToMove === userSide && handleHandpieceClick(m.pieceType)}
                    />
                ))
            }
            {sideToMove === owner && <SideToMoveMark/>}
        </Stack>
    )
}
function SideToMoveMark() {
    return (
        <Box sx={{
            position: "absolute",
            right: 16,
        }}
            justifyContent={"right"}
        >〇</Box>
    )
}

function buildHandPieceUIModels(
    hand: Hand,
    owner: Player,
    selection: Selection,
    sideToMove: Player
): HandPieceUIModel[] {
    return pieceTypes.map(pieceType => ({
        pieceType,
        count: hand.count(pieceType),
        isSelected:
            selection.type === "hand" &&
            selection.pieceType === pieceType &&
            owner === sideToMove
    }))
}