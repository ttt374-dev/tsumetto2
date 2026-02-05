import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { Box, Button, IconButton,  } from "@mui/material";
import { Fab } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"

import { AppLayout } from "../common/AppLayout";
import { useFilterProblems } from "./hooks/useFilterProblems";
import { DashboardFilterControl } from "./components/DashboardFilterControl";
import { SummaryView } from "../summary/SummaryView";
import { useMissionEventStoreContext } from "../App/providers/MissionEventStoreProvider";
import { useToast } from "../App/providers/ToastProvider";
import { useImporter } from "@/application/useImporter";
import { ListDialog } from "../mission/ListDialog";
import { useMemo, useState } from "react";
import { useRepositoryContext } from "../App/providers/RepositoryProvider";
import { useProblemDetailDialog } from "../common/useProblemDetailDialog";
import { useProblemStore } from "@/application/store/useProblemStore";

/////////////////////////////////////////////

export function DashboardScreen() {
    const { query, missionSummary, problemIds, reloadStores } = useFilterProblems()
    const { start } = useMissionEventStoreContext()
    const toast = useToast()
    const repos = useRepositoryContext()
    const store = useProblemStore(repos.problem)
    const problems = store.problems
    const allTags = useMemo(
        () => Array.from(new Set(problems.flatMap(p => p.tags))),
        [problems]
    )
    
    const { openFileDialog, inputElement } = useImporter((files: File[]) => {
        reloadStores()
        toast({message: `imported ${files.length} file`})
    })    
    const [open, setOpen] = useState(false)
    const deleteAll = () => {
        repos.problem.removeAll()
        reloadStores()
    }
    return (
        <AppLayout
            header={ "Dashboard"}
            footer={
            <Button onClick={()=> start(problemIds)}
                    sx={{height: 64}}
                    variant="contained" fullWidth 
                    disabled={missionSummary.problemCount === 0}>
                    Start
                </Button>
            }
            rightActions={
                <>
                    <Button onClick={() => setOpen(true)} sx={{color: "white"}}>
                        リスト
                    </Button>
                    <IconButton onClick={openFileDialog}>
                        <AddOutlinedIcon sx={{ color: "#fff" }} />
                    </IconButton>
                </>
            }>
            
            <DashboardFilterControl 
                filter={query.filterState}
                allTags={allTags}
                onToggleFilter={query.toggleFilter}
                onSetFilter={query.setFilter}/>
            <SummaryView summary={missionSummary}/>

            {inputElement}
            
            <ListDialog
                open={open}
                onClose={() => setOpen(false)}
                problemIds={problemIds}
                onSelectProblem={()=>{}}
            />

        </AppLayout>
    )
}