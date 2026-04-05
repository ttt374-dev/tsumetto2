
import { AppShell } from "@/ui/layout/AppShell";
import { ReviewEventHistory } from "@/ui/history/ReviewEventHistory";

export default function HistoryScreen(){
    return (<AppShell        
        header={"履歴"}    >
        <ReviewEventHistory/>
    </AppShell>)
}