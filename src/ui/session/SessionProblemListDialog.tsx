import type { ProblemId } from "@/domain/problem/entity/Problem";
import { useSessionPlayerViewModel, type SessionPlayerPlayingVM } from "@/ui/session/hooks/useSessionPlayerViewModel";
import { SessionListView } from "@/ui/session/SessionListView";
import { Button, Dialog, DialogActions, DialogTitle, Stack } from "@mui/material";
import { DialogContent } from "@mui/material"

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
    const handleOnSelect = (id: ProblemId) => {        
        onClose()
        vm.moveToProblemId(id)
    }
    return (
        <Dialog open={open} onClose={onClose} fullScreen>
            <DialogTitle>問題リスト</DialogTitle>
            <DialogContent sx={{p: 0}}>
                <SessionListView ids={vm.problemIds}
                    onSelect={handleOnSelect}
                    selectedId={vm.problem.id}
                    sessionId={vm.sessionId}
                    results={vm.results}
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