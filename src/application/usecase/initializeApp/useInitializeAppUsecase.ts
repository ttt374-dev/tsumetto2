// usecase/initializeAppUsecase.ts

import { createDefaultDeck } from "@/domain/deck/entity/createDefaultDeck"
import type { DeckRepository } from "@/domain/deck/repository/DeckRepository"

export function initializeAppUsecase(
  deckRepository: DeckRepository
) {
  return async () => {
    const decks = await deckRepository.findAll()

    const draft = createDefaultDeck()
    if (decks.length === 0 ) {
      await deckRepository.replaceAll([draft])
      console.log("default deck created")
    }
  }
}