import { Box, Button, FormControl, FormControlLabel, Grid, IconButton, InputAdornment, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';

import SortControl from "../../../features/problem/query/SortControl";
import { useMissionEditViewModel } from "./useMissionEditViewModel";
import { AppShell } from "../../../common/components/layout/AppShell";
import { useListDialog } from "../../../dialogs/list/ListDialog";
import { useNavigate } from "react-router-dom";
import { routes } from "../../../App/useAppNavigation";
import { FilterControlPanel } from "../../../features/problem/query/FilterControlPanel";
import { useToast } from "@/ui/App/providers/ToastProvider";

export default function MissionEditScreen() {
    const toast = useToast()
    const {
        name, allSources, query, ids: problemIds, summary,
        setName, save, remove,
    } = useMissionEditViewModel();

    const navigate = useNavigate()
    const listDialog = useListDialog(problemIds, (id) => navigate(routes.problemView(id)))
    const handleNavigateToList = () => {
        //console.log("nav: ids", problemIds)
        navigate(routes.list, { state: { ids: problemIds, title: `デッキ ${name}：問題リスト` } })
    }
    const handleMissionNameClear = () => {
        setName("")
    }
    const handleSaveAndExit = () => {
        save()
        toast({ message: "保存しました" })
        navigate(routes.back)
    }
    const handleDeleteMission = () => {
        if (!window.confirm("are you sure to delete")) return
        remove()
        toast({ message: "削除しました" })
        navigate(routes.back)
    }
    return (
        <AppShell
            header={"Mission Edit"}
            navigateBack={true}
            rightActions={
                <IconButton onClick={handleDeleteMission} sx={{ color: "white" }}>
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
                <Grid container spacing={1} sx={{
                    flex: 1,
                    overflowY: "auto",
                    minHeight: 0,
                    pt: 2
                }}>
                    <Grid size={12}>
                        <TextField label="ミッション名" fullWidth value={name}
                            InputProps={{
                                endAdornment: name && (
                                    <InputAdornment position="end">
                                        <IconButton onClick={handleMissionNameClear} edge="end">
                                            <ClearIcon />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                            onChange={e => setName(e.target.value)} />
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
                全{summary.problemCount}問、平均スコア {(summary.avgScore).toFixed(1)}
            </Button>

            {listDialog.dialogElement}
        </AppShell>
    );
}
