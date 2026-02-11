import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined"
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import { Box, Button, IconButton, List, ListItem, Stack, type SelectChangeEvent,  } from "@mui/material";
import { AppLayout } from "../common/AppLayout";
import { useFilterProblems } from "./hooks/useFilterProblems";
import { DashboardFilterControl } from "./components/DashboardFilterControl";
import { useMissionEventStoreContext } from "../App/providers/MissionEventStoreProvider";
import { useEffect, useMemo, useState } from "react";
import { useRepositoryContext } from "../App/providers/RepositoryProvider";
import { useProblemStore } from "@/application/store/useProblemStore";
import { v4 } from "uuid";
import { DeckSelectMenu } from "./components/SelectDeckMenu";
import { CreateDeckDialog } from "./components/CreateDeckDialog";
import { useDashboardController } from "@/application/useDashboardController";
import { createQuerySnapshot } from "@/domain/deck/Deck";
;
/////////////////////////////////////////////


function deepEqual(a: any, b: any): boolean {
  if (a === b) return true
  if (typeof a !== "object" || typeof b !== "object" || !a || !b)
    return false

  const keysA = Object.keys(a)
  const keysB = Object.keys(b)
  if (keysA.length !== keysB.length) return false

  return keysA.every(key =>
    deepEqual(a[key], b[key])
  )
}


////////////////////////////////
export function DashboardScreen() {
    const { query, stats, problemIds } = useFilterProblems()
    const { start } = useMissionEventStoreContext()
            const repos = useRepositoryContext()
    const { allTags }= useProblemStore(repos.problem)


    const [openCreateDialog, setOpenCreateDialog] = useState(false)

    const { decks, selectedDeck,
        selectDeck, saveDeck, deleteDeck} = useDashboardController()    
    const isDirty = !deepEqual(
        selectedDeck?.snapshot.filterState,
        query.filterState
    )
    const handleSaveDeck = async () => {
        if (!selectedDeck) return

        saveDeck({
            ...selectedDeck,
            snapshot: createQuerySnapshot(query),
        })
    }
    const handleCreateDeck = async (name: string) => {
        saveDeck({
            id: v4(),
            name,
            snapshot: createQuerySnapshot(query),
            createdAt: new Date(),
        })
        setOpenCreateDialog(false)
    }    
    const handleDeleteDeck = () => {
        const deck = selectedDeck
        if (!deck) return        
        if (!confirm(`プリセット「${deck.name}」を削除しますか？`)) return
        deleteDeck(deck)
    }
    return (
        <AppLayout
            header={"Dashboard"}
            footer={
                <Button onClick={() => start(problemIds)}
                    sx={{ height: 64 }}
                    variant="contained" fullWidth
                    disabled={stats.problemCount === 0}>
                    Start
                </Button>
            }>
            
            <DashboardFilterControl 
                filter={query.filterState}
                allTags={allTags}
                onToggleFilter={query.toggleFilter}
                onSetFilter={query.setFilter}/>
            { `${stats.problemCount}, ${stats.solvedCount}:${stats.failedCount}=${(stats.accuracy*100).toFixed(0)}%`}
            
            <Stack direction="row">
                <DeckSelectMenu
                    decks={decks}
                    selectedDeckId={selectedDeck?.id}
                    onSelect={selectDeck}
                />


                <IconButton onClick={handleSaveDeck} disabled={!isDirty}>
                    <SaveOutlinedIcon />
                </IconButton>
                <IconButton onClick={() => setOpenCreateDialog(true)}>
                    <AddCircleOutlineIcon />
                </IconButton>
                <IconButton onClick={handleDeleteDeck}>
                    <DeleteOutlineIcon />
                </IconButton>
            </Stack>

            <CreateDeckDialog
                open={openCreateDialog}
                onCreate={handleCreateDeck}
                onClose={() => setOpenCreateDialog(false)}
            />

        </AppLayout>
    )
}