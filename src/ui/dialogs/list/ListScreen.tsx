import type { ProblemId } from "@/domain/problem/entity/Problem";
import { AppShell } from "@/ui/common/components/layout/AppShell";
import { useLocation, useNavigate } from "react-router-dom";
import { routes } from "@/ui/App/useAppNavigation";
import { Button } from "@mui/material";
import { LibraryListView } from "@/ui/screens/library/components/LibraryListView";

type ViewerLocationState = {
    title: string
  ids: string[]
}

export function ListScreen(){
    const location = useLocation()
    const navigate = useNavigate()
    const state = (location.state as ViewerLocationState | null)
    const ids = state?.ids ?? []
    const title = state?.title ?? "List"
    const handleItemClick = (id: ProblemId) => {
        navigate(routes.detail(id))
        //navigate(routes.player(id))
    }

    return (
        <AppShell header={ title }
            footer={<Button variant="outlined" onClick={()=>navigate(routes.back)}>戻る</Button>}>            
            <LibraryListView ids={ids} onItemClick={handleItemClick}/>                        
        </AppShell>
    )
}