import { buildUntilPly } from "@/domain/kif/buildUntilPly"
import type { KifData } from "@/domain/kif/types"
import { useMemo, useState } from "react"

export function useReplayController (kifData: KifData){
    const [plyIndex, setPlyIndex] = useState(0)
    const history = {
        initial: kifData.initialPosition,
        moves: kifData.moves
    }
    const position = useMemo(()=> {
        return buildUntilPly(history, plyIndex)
    }, [history, plyIndex])
    const maxIndex = kifData.moves.length

    const advancePly = () => {
        setPlyIndex(Math.min(plyIndex + 1, maxIndex))
    }
    const retreatPly = () => {
        setPlyIndex(Math.max(plyIndex - 1, 0))
    }
    
    return {
        position, plyIndex,
        advancePly, retreatPly,
        moveToPly: setPlyIndex,    
    }
}