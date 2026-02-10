import { Box, Button, IconButton, List, ListItem, type SelectChangeEvent,  } from "@mui/material";
import { AppLayout } from "../common/AppLayout";
import { useFilterProblems } from "./hooks/useFilterProblems";
import { DashboardFilterControl } from "./components/DashboardFilterControl";
import { SummaryView } from "../summary/SummaryView";
import { useMissionEventStoreContext } from "../App/providers/MissionEventStoreProvider";
import { useToast } from "../App/providers/ToastProvider";
import { useEffect, useMemo, useState } from "react";
import { useRepositoryContext } from "../App/providers/RepositoryProvider";
import { useProblemStore } from "@/application/store/useProblemStore";
import type { FilterState } from "@/domain/problem/query/filter";
import type { useMissionQueryContext } from "../App/providers/QueryProvider";
import { v4 } from "uuid";
import { DeckSelectMenu } from "./components/SelectDeckMenu";
import { CreateDeckDialog } from "./components/CreateDeckDialog";
import type { useQuery } from "@/application/useQuery";
/////////////////////////////////////////////

type FilterSnapshot = {
  filterState: FilterState
  // 将来用
  // order?: ProblemOrder
  // limit?: number
}
function createFilterSnapshot(query: ReturnType<typeof useMissionQueryContext>): FilterSnapshot {
  return {
    filterState: structuredClone(query.filterState)
  }
}

const DEFAULT_DECK_ID = "default-id"
const DEFAULT_DECK_NAME = "default"

export type Deck = {
  id: string
  name: string
  snapshot: FilterSnapshot
  createdAt: Date
}
function useDashboard(query: ReturnType<typeof useQuery>){
    const deckRepository = useRepositoryContext().deck
    const [decks, setDecks] = useState<Deck[]>([])
    const [selectedDeck, setSelectedDeck] = useState<Deck|null>(null)

    // 起動時：default deck を読み込んで適用
    // run once on mount: initialize default deck
    useEffect(() => {
        (async () => {
            const deck = await ensureDefaultDeck()
            await loadDecks()
        })()
    }, [])

    const loadDecks = async () => {
        const list = await deckRepository.list()
        setDecks(list)
    }


    const ensureDefaultDeck = async () => {
        let deck = await deckRepository.get(DEFAULT_DECK_ID)

        if (!deck) {
            deck = {
                id: DEFAULT_DECK_ID,
                name: DEFAULT_DECK_NAME,
                snapshot: createFilterSnapshot(query),
                createdAt: new Date(),
            }
            await deckRepository.save(deck)
        }

        setSelectedDeck(deck)
        query.setFilter(deck.snapshot.filterState)
        return deck
    }
    const selectDeck = (deck: Deck) => {
        setSelectedDeck(deck)
        query.setFilter(deck.snapshot.filterState)
    }

    // 保存ボタン
    const saveDeck = async (deck: Deck) => {
        await deckRepository.save(deck)
        await loadDecks()
        setSelectedDeck(deck)
    }

    return { decks, selectedDeck, 
        selectDeck, saveDeck,}
}

////////////////////////////////
export function DashboardScreen() {
    const { query, missionSummary, problemIds } = useFilterProblems()
    const { start } = useMissionEventStoreContext()
    const repos = useRepositoryContext()
    const { allTags }= useProblemStore(repos.problem)
    const [openCreateDialog, setOpenCreateDialog] = useState(false)

    const { decks, selectedDeck, 
        selectDeck, saveDeck} = useDashboard(query)
    

    const handleSaveDeck = async () => {
        if (!selectedDeck) return

        saveDeck({
            ...selectedDeck,
            snapshot: createFilterSnapshot(query),
        })
    }
    const handleCreateDeck = async (name: string) => {
        saveDeck({
            id: v4(),
            name,
            snapshot: createFilterSnapshot(query),
            createdAt: new Date(),
        })
        setOpenCreateDialog(false)
    }    
    return (
        <AppLayout
            header={"Dashboard"}
            footer={
                <Button onClick={() => start(problemIds)}
                    sx={{ height: 64 }}
                    variant="contained" fullWidth
                    disabled={missionSummary.problemCount === 0}>
                    Start
                </Button>
            }>
            
            <DashboardFilterControl 
                filter={query.filterState}
                allTags={allTags}
                onToggleFilter={query.toggleFilter}
                onSetFilter={query.setFilter}/>
            <SummaryView summary={missionSummary}/>
            
            <DeckSelectMenu
                decks={decks}
                selectedDeckId={selectedDeck?.id}
                onSelect={selectDeck}
            />
            
            <Button onClick={handleSaveDeck}>
                プリセットを保存
            </Button>
            <Button onClick={() => setOpenCreateDialog(true)}>
                新規プリセットを作る
            </Button>

            <CreateDeckDialog
                open={openCreateDialog}
                onCreate={handleCreateDeck}
                onClose={() => setOpenCreateDialog(false)}
            />

        </AppLayout>
    )
}