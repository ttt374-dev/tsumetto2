import { useRepositoryContext } from "@/ui/App/providers/RepositoryProvider"
import { useQuery } from "./useQuery"
import { useEffect, useState } from "react"
import { type Deck } from "@/domain/deck/Deck"

export function useDashboardController(){ // (query: ReturnType<typeof useQuery>){
    const query = useQuery()
    const deckRepository = useRepositoryContext().deck
    const [decks, setDecks] = useState<Deck[]>([])
    const [selectedDeck, setSelectedDeck] = useState<Deck|null>(null)

    // 起動時：default deck を読み込んで適用
    // run once on mount: initialize default deck
    useEffect(() => {
        (async () => {
            //const deck = await ensureDefaultDeck()
            await loadDecks()
        })()
    }, [])

    const loadDecks = async () => {
        const list = await deckRepository.list()
        console.log("load decks", list)
        setDecks(list)
    }

    /*
    const ensureDefaultDeck = async () => {
        let deck = await deckRepository.get(DEFAULT_DECK_ID)

        if (!deck) {
            deck = {
                id: DEFAULT_DECK_ID,
                name: DEFAULT_DECK_NAME,
                snapshot: createQuerySnapshot(query),
                createdAt: new Date(),
            }
            await deckRepository.save(deck)
        }

        setSelectedDeck(deck)
        query.setFilter(deck.snapshot.filterState)
        return deck
    }
        */
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
    const deleteDeck = async (deck: Deck) => {
        console.log("delete deck", deck)

        const wasSelected = selectedDeck?.id === deck.id

        await deckRepository.delete(deck.id)

        await loadDecks()

        if (wasSelected) {
            const remaining = await deckRepository.list()

            const nextDeck = remaining[0] ?? null

            setSelectedDeck(nextDeck)

            if (nextDeck) {
                query.setFilter(nextDeck.snapshot.filterState)
            } else {
                query.resetFilter() // ← 何もない場合
            }
        }
    }



    return { decks, selectedDeck,
        selectDeck, saveDeck, deleteDeck }
}
