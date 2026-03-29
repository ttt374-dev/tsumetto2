import { useReplayStore } from "@/ui/player/hooks/useReplayStore"
import { useTimerStore } from "@/ui/player/hooks/useTimerStore"

export type PlayerContext = {
  ply: number
  elapsedSec: number
 
}
export function createPlayerContext(): PlayerContext {
  const ply = useReplayStore.getState().ply
  const elapsedSec = useTimerStore.getState().elapsedSec

  return { ply, elapsedSec }
}
