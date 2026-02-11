import { useNavigate, useParams } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import { AppLayout } from "../common/AppLayout";
import { useEffect, useState } from "react";
import { useRepositoryContext } from "../App/providers/RepositoryProvider";
import { useProblemStore } from "@/application/store/useProblemStore";
import { Box, Button, IconButton, Stack } from "@mui/material";
import { DashboardFilterControl } from "../dashboard/components/DashboardFilterControl";
import { EditableText } from "../common/EditableText";
import { createQuerySnapshot } from "@/domain/deck/Deck";
import LibrarySortControl from "../library/components/LibrarySortControl";
import { useQuery } from "@/application/useQuery";
import { useDeckStore } from "@/application/store/useDeckStore";
import { applyFilter } from "@/domain/problem/query/applyFilter";
import { useLearningEventStore } from "@/application/store/useLearningEventStore";

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
    const { decks, loadDecks } = useDeckStore()
    
    const repos = useRepositoryContext()
    const store = useProblemStore(repos.problem)
    const learningEventStore = useLearningEventStore(repos.learningEvent)
    const { allTags } = useProblemStore(repos.problem)
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
    const length = applyFilter(store.problems, learningEventStore.records, deck.snapshot.filterState).length

    const handleSaveAndExit = async () => {
        if (!deck) return

        const newDeck = {
            ...deck,
            name: name,
            snapshot: createQuerySnapshot(query),
        }
        await repos.deck.update(newDeck)
        await loadDecks()
        console.log("save and exit", newDeck)
        navigate(-1)
    }
    const handleDeleteDeck = async () => {        
        if (!deck) return
        if (!confirm(`プリセット「${deck.name}」を削除しますか？`)) return
        await repos.deck.remove(deck.id)
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
                全{ length}問
            </Box>
        </AppLayout>
    )
}