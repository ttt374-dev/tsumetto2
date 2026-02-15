import { useProblemStore } from "@/application/store/useProblemStore";
import { PlayerScreen } from "../player/PlayerScreen";
import { useParams } from "react-router-dom"

export function ViewerScreen(){
    const { id } = useParams<{ id: string }>()
      const problem = useProblemStore(s =>id ? s.byId[id] : undefined)
     if (!problem) return <div>Not found</div>
    return (<>
        <PlayerScreen 
            problem={problem}
            title={problem.title}            
            navigationHandlers={{prev: alert, next: alert, moveTo: alert}}
        />
    </>)
}