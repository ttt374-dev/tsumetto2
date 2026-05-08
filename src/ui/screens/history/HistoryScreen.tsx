import DeleteIcon from '@mui/icons-material/Delete';
import FooterNavigation from "@/ui/common/components/FooterNavigation";
import { AppShell } from "@/ui/common/components/layout/AppShell";
import { ReviewEventHistory } from "@/ui/screens/history/ReviewEventHistory";
import { IconButton } from "@mui/material";
import { useReviewEventStore } from '@/ui/features/learning/hooks/useReviewEventStore';


function useHistoryActions(){
    const clearAllEvents = useReviewEventStore(s => s.clearAll)
    return {
        clear: clearAllEvents
    }
}

export default function HistoryScreen(){
    const actions = useHistoryActions()
    
    const handleClearAllReviewEvents = () => {
        if (!window.confirm("すべての学習データを消去してよろしいですか？")) return
        actions.clear()
    }

    return (<AppShell        
        header={"履歴"}    
        rightActions={
            <RightActions onClearAllReviewEvents={handleClearAllReviewEvents}/>
        }
        footer={<FooterNavigation/>}>
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