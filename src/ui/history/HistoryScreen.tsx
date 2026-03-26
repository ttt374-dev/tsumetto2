
import { AppShell } from "@/ui/common/components/layout/AppShell";
import { LearningHistory } from "@/ui/history/LearningHistory";

export default function HistoryScreen(){
    return (<AppShell        
        header={"履歴"}    >
        <LearningHistory/>
    </AppShell>)
}