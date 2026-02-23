// usecase/initializeAppUsecase.ts

import { createDefaultDeck } from "@/domain/deck/entity/createDefaultDeck"
import type { DeckRepository } from "@/domain/deck/repository/DeckRepository"

export async function initializeAppUsecase(
  deckRepository: DeckRepository
): Promise<void> {
  const decks = await deckRepository.findAll()

  if (decks.length === 0) {
    await deckRepository.replaceAll([createDefaultDeck()])
  }
}