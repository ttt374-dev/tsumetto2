import { useNavigate, useParams } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import { AppLayout } from "../common/layout/AppLayout";
import { useEffect, useMemo, useState } from "react";
import { Box, Button, IconButton, Stack } from "@mui/material";
import { FilterControl } from "../common/components/FilterControl";
import { EditableText } from "../common/components/EditableText";
import { createQuerySnapshot } from "@/domain/deck/Deck";
import LibrarySortControl from "../library/components/LibrarySortControl";
import { useQuery } from "@/application/useQuery";
import { useStores } from "@/application/store/useStores";
import { ProblemStats } from "@/domain/problem/ProblemStats";
import { useLearningRecord } from "@/application/useLearningRecord";
import { useToast } from "../App/providers/ToastProvider";

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
    const { decks } = stores.deck        
    const { allTags } = stores.problem
    const navigate = useNavigate()    
    const toast = useToast()
    
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

    useEffect(()=> {
        if (deck) query.setFilter(deck.snapshot.filterState)
    }, [])
    
    //const learningRecords = useLearningRecord(stores.learningEvent.eventLog)
    const stats = useMemo(()=> {
        return ProblemStats.createWithFilter(stores.problem.problems, stores.learningRecords, query.filterState)
    }, 
        [stores.problem.problems, stores.learningRecords, query])
    if (!id || !deck) return null
    const handleSaveAndExit = async () => {
        if (!deck) return

        const newDeck = {
            ...deck,
            name: name,
            snapshot: createQuerySnapshot(query),
        }
        await stores.deck.saveDeck(newDeck)
        console.log("save and exit", newDeck)
        navigate(-1)
    }
    const handleDeleteDeck = async () => {        
        if (!deck) return
        if (!confirm(`デッキ「${deck.name}」を削除しますか？`)) return
        try {
            await stores.deck.deleteDeck(deck.id)
            toast({ message: "削除しました" })
            navigate(-1)
        } catch (e) {
            toast({ message: "削除に失敗しました" })
        }
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
                        onUpdateText={setName}
                    />
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
                onSetFilter={query.setFilter} />            
            
            <Box>
                全{stats.problemCount}問、正答率 {(stats.accuracy*100).toFixed(0)}%
            </Box>
        </AppLayout>
    )
}