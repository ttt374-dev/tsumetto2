import { useNavigate, useParams } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import { AppLayout } from "../common/AppLayout";
import { useEffect, useState } from "react";
import { Box, Button, IconButton, Stack } from "@mui/material";
import { DashboardFilterControl } from "../dashboard/components/DashboardFilterControl";
import { EditableText } from "../common/EditableText";
import { createQuerySnapshot } from "@/domain/deck/Deck";
import LibrarySortControl from "../library/components/LibrarySortControl";
import { useQuery } from "@/application/useQuery";
import { applyFilter } from "@/domain/problem/query/applyFilter";
import { useStores } from "@/application/store/useStores";
import { ProblemStats } from "@/domain/problem/ProblemStats";

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
/////////////////////////////////////////////
export function DeckEditScreen() {
    const { id } = useParams<{ id: string }>()
    const query = useQuery()
    const stores = useStores()
    const { decks, loadDecks } = stores.deck    
    //const store = stores.problem
    //const learningEventStore = stores.learningEvent
    const { allTags } = stores.problem
    const navigate = useNavigate()    
    
    const deck = decks.find(d => d.id === id)
    const [name, setName] = useState<string>(deck?.name ?? "")
    useEffect(()=> {
        if (deck){
            setName(deck.name ?? "")
            query.setFilterState(deck.snapshot.filterState)
            query.setSortState(deck.snapshot.sortState)
            console.log("edit deck", deck)
        }
    }, [deck])
    //////////////
    if (!id || !deck) return null
    const filteredProblems = applyFilter(stores.problem.problems, stores.learningEvent.records, deck.snapshot.filterState)
    //const length = applyFilter(store.problems, learningEventStore.records, deck.snapshot.filterState).length
    const stats = ProblemStats.create(filteredProblems, stores.learningEvent.records)

    const handleSaveAndExit = async () => {
        if (!deck) return

        const newDeck = {
            ...deck,
            name: name,
            snapshot: createQuerySnapshot(query),
        }
        await stores.deck.saveDeck(newDeck)
        await loadDecks()
        console.log("save and exit", newDeck)
        navigate(-1)
    }
    const handleDeleteDeck = async () => {        
        if (!deck) return
        if (!confirm(`プリセット「${deck.name}」を削除しますか？`)) return
        await stores.deck.deleteDeck(deck.id)
        await loadDecks()
        navigate(-1)
    }
    const handleUpdateName = (title: string) => {        
        console.log("updatename", title)
        setName(title)
    }
    ///////////////////////////////////////////////////////////////////
    return (
        <AppLayout
            header={"Dashboard"}
            footer={
                <Stack direction="row">
                    <Button onClick={handleSaveAndExit}
                        sx={{ height: 64 }}
                        variant="contained" fullWidth
                    >
                        保存して戻る
                    </Button>
                    <Button onClick={() => navigate(-1)}
                        sx={{ height: 64 }}
                        variant="outlined" color="info" fullWidth>
                        キャンセル
                    </Button>
                </Stack>
            }>

            <Stack direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ width: "100%" }}>
                <Box sx={{ flexGrow: 1 }}>
                    <EditableText
                        initialText={name}
                        onUpdateText={handleUpdateName}
                    />
                </Box>
                <IconButton onClick={handleDeleteDeck}>
                    <DeleteIcon />
                </IconButton>
            </Stack>
            <LibrarySortControl sort={query.sortState} onSetSortKey={query.toggleSort}
                onSetSortOrder={order => query.setSortState(p => ({ ...p, order }))} />

            
            <DashboardFilterControl
                filter={query.filterState}
                allTags={allTags}
                onToggleFilter={query.toggleFilter}
                onSetFilter={query.setFilter} />            
            
            <Box>
                全{ stats.problemCount}問、正答率 {(stats.accuracy*100).toFixed(0)}%
            </Box>
        </AppLayout>
    )
}