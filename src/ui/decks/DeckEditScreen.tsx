import { Box, Button, FormControlLabel, Grid, IconButton, MenuItem, Select, Stack, TextField } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

import { EditableText } from "../common/components/EditableText";
import { FilterControl } from "../common/query-control/FilterControl";
import SortControl from "../common/query-control/SortControl";
import { useDeckEditViewModel } from "./hooks/useDeckEditViewModel";
import { AppShell } from "../common/components/layout/AppShell";
import { MateLengthFilterControl } from "../common/query-control/MateLengthFilterControl";
import { TagCheckboxFilterControl } from "../common/query-control/TagCheckboxFilterControl";
import { useListDialog } from "../list/ListDialog";
import { useNavigate } from "react-router-dom";
import { routes } from "../App/useAppNavigation";
import { useState } from "react";
import type { ProblemType } from "@/domain/problem/entity/Problem";
import { FilterControlPanel } from "../common/query-control/FilterControlPanel";

const UNSPECIFIED = "__UNSPECIFIED__";
//type ProblemTypeUi = ProblemType | typeof UNSPECIFIED
//type SourceUi = string | typeof UNSPECIFIED

export function DeckEditScreen() {
    const {
        name, allTags, allSources, query, stats, ids: problemIds,
        setName, handleSaveAndExit, handleDeleteDeck,
    } = useDeckEditViewModel();

    const navigate = useNavigate()
    const ListDialog = useListDialog(problemIds, (id) => navigate(routes.problemView(id)))
    const handleNavigateToList = () => {
        //console.log("nav: ids", problemIds)
        navigate(routes.list, { state: { ids: problemIds, title: `デッキ ${name}：問題リスト` } })
    }    

    //const [filterText, setFilterText] = useState("")
    return (
        <AppShell
            header={"Deck Edit"}
            rightActions={
                <IconButton onClick={handleDeleteDeck} sx={{ color: "white" }}>
                    <DeleteIcon />
                </IconButton>
            }
            footer={
                <Stack direction="row" spacing={1}>
                    <Button onClick={() => navigate(routes.back)} sx={{ height: 64 }} variant="outlined" color="info" fullWidth>
                        キャンセル
                    </Button>
                    <Button onClick={handleSaveAndExit} sx={{ height: 64 }} variant="contained" fullWidth>
                        保存して戻る
                    </Button>
                </Stack>
            }
        >
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
                <Grid container spacing={2} sx={{
                    flex: 1,
                    overflowY: "auto",
                    minHeight: 0,
                    p: 2
                }}>
                    <Grid size={12}>
                        <TextField label="デッキ名" fullWidth value={name} onChange={e => setName(e.target.value)} />
                    </Grid>
                    
                    <FilterControlPanel 
                        filter={query.filter.state} addFilter={query.filter.addFilter} toggleFilter={query.filter.toggleFilter}
                        allSources={allSources}/>
                    <Grid size={12}>
                        <SortControl sort={query.sort.state} onSetSortKey={query.sort.setKey}
                            onToggleOrder={query.sort.toggleOrder} />
                    </Grid>
                </Grid>
            </Box>

            <Button onClick={handleNavigateToList} variant="outlined" sx={{ m: 1 }}>
                全{stats.problemCount}問、正答率 {(stats.accuracy * 100).toFixed(0)}%
            </Button>

            {ListDialog.dialogElement}
        </AppShell>
    );
}
