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
import { useToast } from "../App/providers/ToastProvider";
import { useProblemStore } from "@/application/store/useProblemStore";
import { useLearningRecordStore } from "@/application/useLearningRecordStore";
import { useDeckStore } from "@/application/store/useDeckStore";

/////////////////////////////////////////////
export function DeckEditScreen() {
    const { id } = useParams<{ id: string }>()
    const query = useQuery()
    const stores = useStores()
    //const { allTags } = stores.problem
    const allTags: string[] = [] // TODO
    const navigate = useNavigate()
    const toast = useToast()

    const deck = useDeckStore(s=>s.decks).find(d => d.id == id)

    //const deck = decks.find(d => d.id === id)
    const [name, setName] = useState<string>(deck?.name ?? "")
    useEffect(() => {
        if (deck) {
            setName(deck.name ?? "")
            query.setFilterState(deck.snapshot.filterState)
            query.setSortState(deck.snapshot.sortState)
            console.log("edit deck", deck)
        }
    }, [deck])
    //////////////

    useEffect(() => {
        if (deck) query.setFilter(deck.snapshot.filterState)
    }, [])

    //const problems = useProblemStore(s => s.ids.map(id => s.byId[id]))
    const problems = useProblemStore(s => s.all)

    //const learningRecords = useLearningRecord(stores.learningEvent.eventLog)
    
    const learningRecords = useLearningRecordStore(s=>s.records)
    const stats = useMemo(() => {
        return ProblemStats.createWithFilter(problems, learningRecords, query.filterState)
    },
        [problems, learningRecords, query])
    if (!id || !deck) return null
    const handleSaveAndExit = async () => {
        if (!deck) return

        const newDeck = {
            ...deck,
            name: name,
            snapshot: createQuerySnapshot(query),
        }
        await useDeckStore(s=>s.saveDeck(newDeck))
        console.log("save and exit", newDeck)
        navigate(-1)
    }
    const handleDeleteDeck = async () => {
        if (!deck) return
        if (!confirm(`デッキ「${deck.name}」を削除しますか？`)) return
        try {
            await useDeckStore(s=>s.deleteDeck(deck.id))
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
                全{stats.problemCount}問、正答率 {(stats.accuracy * 100).toFixed(0)}%
            </Box>
        </AppLayout>
    )
}