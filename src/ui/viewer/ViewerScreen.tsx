import { useProblemStore } from "@/application/store/useProblemStore";
import { useParams } from "react-router-dom"
import PlayerView from "../player/components/PlayerView";
import { AppShell } from "../common/layout/AppShell";

export function ViewerScreen(){
    const { id } = useParams<{ id: string }>()
      const problem = useProblemStore(s =>id ? s.byId[id] : undefined)
     if (!problem) return <div>Not found</div>
    return (
        <AppShell header={problem.title}>

        <PlayerView
            problem={problem}            
        />
    </AppShell>)
}