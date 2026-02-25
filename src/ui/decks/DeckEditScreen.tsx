import { Box, Button, IconButton, Stack, TextField } from "@mui/material";
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

export function DeckEditScreen() {
    const {
        name, allTags, query, stats, ids: problemIds,
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
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: "100%" }}>
                <Box sx={{ flexGrow: 1 }}>
                    <EditableText initialText={name} onUpdateText={setName} />
                </Box>
                <IconButton onClick={handleDeleteDeck}>
                    <DeleteIcon />
                </IconButton>
            </Stack>

            <LibrarySortControl sort={query.sort.state} onSetSortKey={query.sort.setKey}
                onToggleOrder={query.sort.toggleOrder} />


                
                <TextField label="タイトル名" value={filterText} onChange={(e) => {
                    setFilterText(e.target.value)
                    query.filter.addFilter({ text: filterText })
                }}

                />

            <Stack direction="row" justifyContent="space-between" >
                <Box flex={1}>
                    <FilterControl
                        filter={query.filter.state}
                        onToggleFilter={query.filter.toggleFilter}

                    />
                </Box>
                <Box flex={1}>
                    <MateLengthFilterControl
                        mateBuckets={query.filter.state.mateBuckets}
                        onChange={(buckets) => {
                            query.filter.addFilter({ mateBuckets: buckets })
                        }}
                    />
                </Box>

            </Stack>
            
            <Stack direction="row" justifyContent="space-between" >
                <TagCheckboxFilterControl
                    allTags={allTags} selectedTags={query.filter.state.tags ?? []}
                    onChange={(tags => { query.filter.addFilter({ tags: tags }) })}
                /> 
            </Stack>
            
            <Button onClick={handleNavigateToList} variant="outlined" sx={{m:1}}>
                全{stats.problemCount}問、正答率 {(stats.accuracy * 100).toFixed(0)}%
            </Button>
            
            {ListDialog.dialogElement}
        </AppShell>
    );
}
