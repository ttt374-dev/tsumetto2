import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";


export function PromotionDialog({ open, onClose, onConfirm}:{
    open: boolean
    onClose: () => void
    onConfirm: (promote: boolean) => void
}){
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>成りますか</DialogTitle>

            <DialogActions>
                <Button variant="contained" onClick={()=>onConfirm(true)}>
                    成る
                </Button>
                <Button variant="outlined" onClick={()=>onConfirm(false)}>
                    不成
                </Button>                
            </DialogActions>
        </Dialog>
    )
}