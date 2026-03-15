import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import type { PendingPromotion } from "../hooks/useGameStore";
import type { PieceType } from "@/domain/kif/entity";


export function PromotionDialog({ open, pieceType, onClose, onConfirm}:{
    open: boolean
    onClose: () => void
    onConfirm: (promote: boolean) => void
    pieceType: PieceType
}){

    const promotionKanji: Record<PieceType, string[]> = {
        pawn: ["歩", "と"],
        lance: ["香", "杏"],
        knight: ["桂", "圭"],
        silver: ["銀", "全"],
        bishop: ["角", "馬"],
        rook: ["飛", "龍"],

        gold: ["", "", ], // いらないんだけど
        king: ["", "", ],

    }
    console.log("promotion", pieceType, promotionKanji)
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>成りますか</DialogTitle>

            <DialogActions>
                <Button variant="outlined" onClick={()=>onConfirm(false)}>
                    { promotionKanji[pieceType][0]}
                </Button>                
                <Button variant="contained" onClick={()=>onConfirm(true)}>
                    { promotionKanji[pieceType][1]}
                </Button>
                
            </DialogActions>
        </Dialog>
    )
}