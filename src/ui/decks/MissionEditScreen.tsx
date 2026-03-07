import { Box, Button, FormControl, FormControlLabel, Grid, IconButton, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

import SortControl from "../common/query-control/SortControl";
import { useMissionEditViewModel } from "./hooks/useMissionEditViewModel";
import { AppShell } from "../common/components/layout/AppShell";
import { useListDialog } from "../list/ListDialog";
import { useNavigate } from "react-router-dom";
import { routes } from "../App/useAppNavigation";
import { FilterControlPanel } from "../common/query-control/FilterControlPanel";

const UNSPECIFIED = "__UNSPECIFIED__";
//type ProblemTypeUi = ProblemType | typeof UNSPECIFIED
//type SourceUi = string | typeof UNSPECIFIED

export function MissionEditScreen() {
    const {
        name, allSources, query, stats, ids: problemIds,
        setName, handleSaveAndExit, handleDeleteDeck,
    } = useMissionEditViewModel();

    const navigate = useNavigate()
    const ListDialog = useListDialog(problemIds, (id) => navigate(routes.problemView(id)))
    const handleNavigateToList = () => {
        //console.log("nav: ids", problemIds)
        navigate(routes.list, { state: { ids: problemIds, title: `デッキ ${name}：問題リスト` } })
    }    

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
                        query={query} allSources={allSources}
                    />
                    
                        <Grid size={3}>
                        <Typography>ラベル：</Typography>
                        </Grid>
                        <Grid size={9}>
                         <FormControl fullWidth>
                              

                            <InputLabel>並び順</InputLabel>
                        <SortControl queryState={query.state} onSetSortKey={query.setSortKey}
                            onToggleOrder={query.toggleSortOrder} />
                            </FormControl>
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
