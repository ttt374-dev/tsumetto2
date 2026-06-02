import DeleteIcon from '@mui/icons-material/Delete';
import FooterNavigation from "@/ui/common/components/FooterNavigation";
import { AppShell } from "@/ui/common/components/layout/AppShell";
import { ReviewEventHistory } from "@/ui/screens/history/ReviewEventHistory";
import { IconButton } from "@mui/material";

export default function HistoryScreen(){
   
    const handleClearAllReviewEvents = () => {
        if (!window.confirm("すべての学習データをリセットしますか？")) return
        //actions.clear()
        alert("TODO")
    }

    return (<AppShell        
        header={"履歴"}    
        rightActions={
            <RightActions onClearAllReviewEvents={handleClearAllReviewEvents}/>
        }
        showBottomNav={true}>
        <ReviewEventHistory/>
    </AppShell>)
}

function RightActions({onClearAllReviewEvents}: { 
    onClearAllReviewEvents: () => void
}){
    return (
        <IconButton onClick={onClearAllReviewEvents} sx={{color: "white"}}>
            <DeleteIcon/>
        </IconButton>
    )
}