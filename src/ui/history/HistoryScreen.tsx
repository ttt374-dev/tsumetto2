
import { LearningHistory } from "@/ui/stats/components/LearningHistory";
import { AppShell } from "@/ui/common/components/layout/AppShell";

export default function HistoryScreen(){
    return (<AppShell        
        header={"履歴"}    >
        <LearningHistory/>
    </AppShell>)
}