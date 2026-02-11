import { useRepositoryContext } from "@/ui/App/providers/RepositoryProvider"
import { useQuery } from "./useQuery"
import { useEffect, useState } from "react"
import { type Deck } from "@/domain/deck/Deck"

export function useDeckController(){ // (query: ReturnType<typeof useQuery>){
    const deckRepository = useRepositoryContext().deck
    const [decks, setDecks] = useState<Deck[]>([])

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


    // 保存ボタン
    const saveDeck = async (deck: Deck) => {
        await deckRepository.save(deck)
        await loadDecks()
    }
    const deleteDeck = async (deck: Deck) => {
        console.log("delete deck", deck)
        await deckRepository.delete(deck.id)

        await loadDecks()
    }



    return { decks, loadDecks,
        saveDeck, deleteDeck }
}
