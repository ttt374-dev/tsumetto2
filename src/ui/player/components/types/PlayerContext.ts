import { useReplayStore } from "@/ui/player/store/useReplayStore"
import { useTimerStore } from "@/ui/player/store/useTimerStore"

export type PlayerContext = {
  ply: number
  elapsedSec: number
 
}
export function createPlayerContext(): PlayerContext {
  const ply = useReplayStore.getState().ply
  const elapsedSec = useTimerStore.getState().elapsedSec

  return { ply, elapsedSec }
}
