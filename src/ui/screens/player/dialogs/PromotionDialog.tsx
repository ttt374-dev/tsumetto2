import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import type { PromotablePieceType } from "@/domain/kif/entity";

export default function PromotionDialog({ open, pieceType, onConfirm}:{
    open: boolean
    onConfirm: (promote: boolean) => void
    pieceType: PromotablePieceType
}){

    const promotionKanji: Record<PromotablePieceType, string[]> = {
        pawn: ["歩", "と"],
        lance: ["香", "杏"],
        knight: ["桂", "圭"],
        silver: ["銀", "全"],
        bishop: ["角", "馬"],
        rook: ["飛", "龍"],

    }

    return (
        <Dialog open={open}>
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