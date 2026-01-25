import { buildUntilPly } from "@/domain/kif/buildUntilPly"
import type { Move, Position } from "@/domain/kif/types"
import { useMemo, useState, useEffect } from "react"

/*
    盤上での駒の動きを制御する

*/
export function useReplayController (initialPosition: Position, moves: Move[]){
    const [plyIndex, setPlyIndex] = useState(0)

    useEffect(()=>{
        setPlyIndex(0)
    }, [initialPosition, moves])

    const history = useMemo(() => ({
        initial: initialPosition,
        moves: moves,
    }), [initialPosition, moves])

    const position = useMemo(()=> {
        return buildUntilPly(history, plyIndex)
    }, [history, plyIndex])    

    const advancePly = () => {
        setPlyIndex(Math.min(plyIndex + 1, moves.length))
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