
import { AppShell } from "@/ui/common/components/layout/AppShell";
import { ReviewEventHistory } from "@/ui/history/ReviewEventHistory";

export default function HistoryScreen(){
    return (<AppShell        
        header={"履歴"}    >
        <ReviewEventHistory/>
    </AppShell>)
}