import { useRepositoryContext } from "@/ui/App/providers/RepositoryProvider"
import type { useQuery } from "./useQuery"
import { useEffect, useState } from "react"
import { createFilterSnapshot, DEFAULT_DECK_ID, DEFAULT_DECK_NAME, type Deck } from "@/domain/deck/Deck"

export function useDeckController(query: ReturnType<typeof useQuery>){
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
        console.log("load decks", list)
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
    const deleteDeck = async (deck: Deck) => {
        console.log("delete deck", deck)
        if (deck.id === DEFAULT_DECK_ID) return

        await deckRepository.delete(deck.id)

        const nextDeck =
            selectedDeck?.id === deck.id
                ? await deckRepository.get(DEFAULT_DECK_ID)
                : selectedDeck

        await loadDecks()

        if (nextDeck) {
            setSelectedDeck(nextDeck)
            query.setFilter(nextDeck.snapshot.filterState)
        }
    }


    return { decks, selectedDeck,
        selectDeck, saveDeck, deleteDeck }
}
