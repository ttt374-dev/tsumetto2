import { Box, Button, IconButton, Stack } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { AppLayout } from "../common/layout/AppLayout";
import { EditableText } from "../common/components/EditableText";
import { FilterControl } from "../common/components/FilterControl";
import LibrarySortControl from "../library/components/LibrarySortControl";
import { useDeckEditViewModel } from "./hooks/useDeckEditScreenViewModel";
import { useEffect } from "react";

export function DeckEditScreen() {
    const {
        id, deck, name, allTags, query, stats,
        setName, handleSaveAndExit, handleDeleteDeck,
    } = useDeckEditViewModel();
    
    useEffect(()=>{
        console.log("query", query)
    }, [query])
    if (!deck) return <>Loading...</>;    
    

    return (
        <AppLayout
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

            <FilterControl
                filter={query.filterState}
                allTags={allTags}
                onToggleFilter={query.toggleFilter}
                onSetFilter={query.setFilter}
            />

            <Box>
                全{stats.problemCount}問、正答率 {(stats.accuracy * 100).toFixed(0)}%
            </Box>
        </AppLayout>
    );
}
