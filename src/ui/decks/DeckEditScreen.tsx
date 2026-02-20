import { Box, Button, IconButton, Stack } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { EditableText } from "../common/components/EditableText";
import { FilterControl } from "./components/FilterControl";
import LibrarySortControl from "../library/components/LibrarySortControl";
import { useDeckEditViewModel } from "./hooks/useDeckEditScreenViewModel";
import { AppShell } from "../common/layout/AppShell";
import { MateLengthFilterControl } from "./components/MateLengthFilterControl";
import { TagCheckboxFilterControl } from "./components/TagCheckboxFilterControl";
import { useListDialog } from "../list/ListDialog";
import { useNavigate } from "react-router-dom";
import { routes } from "../App/useAppNavigation";

export function DeckEditScreen() {
    const {
        name, allTags, query, stats, ids: problemIds,
        setName, handleSaveAndExit, handleDeleteDeck,
    } = useDeckEditViewModel();

    const navigate = useNavigate()
    const ListDialog = useListDialog(problemIds, (id) => navigate(routes.problemView(id)))
    
    return (
        <AppShell
            header={"Deck Edit"}
            footer={
                <Stack direction="row">
                    <Button onClick={handleSaveAndExit} sx={{ height: 64 }} variant="contained" fullWidth>
                        保存して戻る
                    </Button>
                    <Button onClick={() => window.history.back()} sx={{ height: 64 }} variant="outlined" color="info" fullWidth>
                        キャンセル
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

            <LibrarySortControl sort={query.sortState} onSetSortKey={query.toggleSort}
                onSetSortOrder={order => query.setSortState(p => ({ ...p, order }))} />

            <Stack direction="row" justifyContent="space-between" >
                <Box flex={1}>
                    <FilterControl
                        filter={query.filterState}
                        allTags={allTags}
                        onToggleFilter={query.toggleFilter}
                        onSetFilter={query.setFilter}
                    />
                </Box>
                <Box flex={1}>
                    <MateLengthFilterControl
                        mateBuckets={query.filterState.mateBuckets}
                        onChange={(buckets) => {
                            query.setFilter({ mateBuckets: buckets })
                        }}
                    />
                </Box>

            </Stack>
            
            <Stack direction="row" justifyContent="space-between" >
                <TagCheckboxFilterControl
                    allTags={allTags} selectedTags={query.filterState.tags ?? []}
                    onChange={(tags => { query.setFilter({ tags: tags }) })}
                /> 
            </Stack>
            
            <Button onClick={ListDialog.openDialog} variant="outlined">
                全{stats.problemCount}問、正答率 {(stats.accuracy * 100).toFixed(0)}%
            </Button>
            
            {ListDialog.dialogElement}
        </AppShell>
    );
}
