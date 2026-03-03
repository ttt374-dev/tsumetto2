import { Box, Button, FormControlLabel, Grid, IconButton, MenuItem, Select, Stack, TextField } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

import { EditableText } from "../common/components/EditableText";
import { FilterControl } from "./components/FilterControl";
import LibrarySortControl from "../library/components/LibrarySortControl";
import { useDeckEditViewModel } from "./hooks/useDeckEditScreenViewModel";
import { AppShell } from "../common/components/layout/AppShell";
import { MateLengthFilterControl } from "./components/MateLengthFilterControl";
import { TagCheckboxFilterControl } from "./components/TagCheckboxFilterControl";
import { useListDialog } from "../list/ListDialog";
import { useNavigate } from "react-router-dom";
import { routes } from "../App/useAppNavigation";
import { useState } from "react";
import type { ProblemType } from "@/domain/problem/entity/Problem";

const UNSPECIFIED = "__UNSPECIFIED__";
type ProblemTypeUi = ProblemType | typeof UNSPECIFIED

export function DeckEditScreen() {
    const {
        name, allTags, allSources, query, stats, ids: problemIds,
        setName, handleSaveAndExit, handleDeleteDeck,
    } = useDeckEditViewModel();

    const navigate = useNavigate()
    const ListDialog = useListDialog(problemIds, (id) => navigate(routes.problemView(id)))
    const handleNavigateToList = () => {
        //console.log("nav: ids", problemIds)
        navigate(routes.list, { state: { ids: problemIds, title: `デッキ ${name}：問題リスト`}})
    }
    const [ filterText, setFilterText] = useState("")
    return (
        <AppShell
            header={"Deck Edit"}
            rightActions={
                <IconButton onClick={handleDeleteDeck} sx={{color:"white"}}>
                    <DeleteIcon />
                </IconButton>
            }
            footer={
                <Stack direction="row" spacing={1}>
                    <Button onClick={() => window.history.back()} sx={{ height: 64 }} variant="outlined" color="info" fullWidth>
                        キャンセル
                    </Button>
                    <Button onClick={handleSaveAndExit} sx={{ height: 64 }} variant="contained" fullWidth>
                        保存して戻る
                    </Button>
                </Stack>
            }
        >

    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
  
            <Grid container spacing={2}>
                <Grid size={12}>
                    <TextField label="デッキ名" fullWidth value={name} onChange={e => setName(e.target.value)} />
                </Grid>
                <Grid size={12}>
                    <LibrarySortControl sort={query.sort.state} onSetSortKey={query.sort.setKey}
                        onToggleOrder={query.sort.toggleOrder} />
                </Grid>

                <Grid size={12}>
                    <TextField label="タイトル名" value={filterText} onChange={(e) => {
                        setFilterText(e.target.value)
                        query.filter.addFilter({ text: filterText })
                    }} fullWidth/>
                </Grid>

                <Grid size={6}>
                    <Select<ProblemTypeUi> value={query.filter.state.problemType ?? UNSPECIFIED} fullWidth
                        onChange={e=>query.filter.addFilter({
                            problemType: e.target.value === undefined ? undefined : (e.target.value as ProblemType)
                        })}
                    >
                        <MenuItem value={UNSPECIFIED}>（種類指定なし）</MenuItem>
                        <MenuItem key="standard" value="standard">標準</MenuItem>
                        <MenuItem key="realistic" value="realistic">実践</MenuItem>
                        <MenuItem key="hisshi" value="hisshi">必死</MenuItem>
                    </Select>
                </Grid>

                <Grid size={6}>
                    <Select value={query.filter.state.source ?? UNSPECIFIED} fullWidth
                        onChange={e=>query.filter.addFilter({
                            source: e.target.value === UNSPECIFIED ? undefined : (e.target.value as string),
                        })}
                    >
                        <MenuItem value={UNSPECIFIED}>（出典指定なし）</MenuItem>
                        { allSources.map(s=>(
                            <MenuItem value={s}>{s}</MenuItem>
                        ))}
                    </Select>
                </Grid>

                <Grid size={6}>
                    <FilterControl
                        filter={query.filter.state}
                        onToggleFilter={query.filter.toggleFilter}

                    />
                </Grid>

                <Grid size={6}>
                            <MateLengthFilterControl
                        mateBuckets={query.filter.state.mateBuckets}
                        onChange={(buckets) => {
                            query.filter.addFilter({ mateBuckets: buckets })
                        }}
                    />
                </Grid>
                <Grid size={12}>
                    <TagCheckboxFilterControl
                        allTags={allTags} selectedTags={query.filter.state.tags ?? []}
                        onChange={(tags => { query.filter.addFilter({ tags: tags }) })}
                    />
                </Grid>

            </Grid>
            </Box>


            <Button onClick={handleNavigateToList} variant="outlined" sx={{m:1}}>
                全{stats.problemCount}問、正答率 {(stats.accuracy * 100).toFixed(0)}%
            </Button>

            {ListDialog.dialogElement}
        </AppShell>
    );
}
