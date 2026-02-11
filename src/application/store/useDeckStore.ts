import { useEffect, useState } from "react"
import { type Deck, type DeckId } from "@/domain/deck/Deck"
import type { DeckRepository } from "@/domain/deck/DeckRepository"

export function useDeckStore(repository: DeckRepository){ // (query: ReturnType<typeof useQuery>){
    const [decks, setDecks] = useState<Deck[]>([])

    useEffect(() => {
        (async () => {
            //const deck = await ensureDefaultDeck()
            await loadDecks()
        })()
    }, [])

    const loadDecks = async () => {
        const list = await repository.load()
        console.log("load decks", list)
        setDecks(list)
    }

    // 保存ボタン
    const saveDeck = async (deck: Deck) => {
        await repository.update(deck)
        await loadDecks()
    }
    const deleteDeck = async (id: DeckId) => {
        await repository.remove(id)
        await loadDecks()
    }

    return { decks, loadDecks,
        saveDeck, deleteDeck }
}
