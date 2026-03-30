import { Button, Dialog, DialogActions, DialogTitle, Stack } from "@mui/material";
import { DialogContent } from "@mui/material"
import { useSessionPlayerViewModel, type SessionPlayerPlayingVM } from "@/ui/session/hooks/useSessionPlayerViewModel";
import SessionListView from "@/ui/session/SessionListView";

export function SessionProblemListDialog(props: {
    open: boolean
    onClose: () => void
}){
    const vm = useSessionPlayerViewModel()
    if (vm.status !== "playing") return
    return (<SessionProblemListDialogContent 
        open={props.open} onClose={props.onClose} vm={vm}/>)
}

function SessionProblemListDialogContent({open, onClose, vm}: {
    open: boolean
    onClose: () => void
    vm: SessionPlayerPlayingVM
}){
    const handleOnSelect = (index: number) => {        
        onClose()
        vm.moveTo(index)
    }
    return (
        <Dialog open={open} onClose={onClose} fullScreen
            sx={{ 
                pt: "calc(env(safe-area-inset-bottom) + 16px)",
                pb: "calc(env(safe-area-inset-top) + 16px)"
            }}
            >
            <DialogTitle>問題リスト</DialogTitle>
            <DialogContent sx={{p: 0}}>
                <SessionListView ids={vm.problemIds}
                    onSelect={handleOnSelect}
                    selectedId={vm.problem.id}
                    sessionId={vm.sessionId}
                />
            </DialogContent>
            <DialogActions sx={{ p: 0, width: "100%", display: "flex" }}>
                <Button onClick={onClose} fullWidth variant="contained">
                    戻る
                </Button>
                <Button onClick={vm.navigateToSummary} fullWidth variant="outlined">
                    サマリーへ
                </Button>
            </DialogActions>
        </Dialog>
    )

}