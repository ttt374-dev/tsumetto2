// usecase/initializeAppUsecase.ts

import { createDefaultDeck } from "@/domain/mission/entity/createDefaultMission"
import type { MissionRepository } from "@/domain/mission/repository/MissionRepository"

export async function initializeAppUsecase(
  deckRepository: MissionRepository
): Promise<void> {
  const decks = await deckRepository.findAll()

  if (decks.length === 0) {
    await deckRepository.replaceAll([createDefaultDeck()])
  }
}