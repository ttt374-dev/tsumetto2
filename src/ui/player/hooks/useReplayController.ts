import type { Move, Player, Position } from "@/domain/kif/entity"
import { buildUntilPly } from "@/domain/kif/service/buildUntilPly"
import { useMemo, useState, useEffect } from "react"

/*
    盤上での駒の動きを制御する

*/
export function useReplayController (initialPosition: Position, moves: Move[]){
    const [plyIndex, setPlyIndex] = useState(0)
    const [player, setPlayer] = useState<Player>("black")
    const [finished, setFinished] = useState(false)
  

    useEffect(()=>{
        setPlyIndex(0)
    }, [initialPosition, moves])

    useEffect(()=>{
        setPlayer(plyIndex % 2 ? "white" : "black")
        setFinished(plyIndex+1 >= moves.length ? true: false)
    }, [plyIndex])

    const history = useMemo(() => ({
        initial: initialPosition,
        moves: moves,
    }), [initialPosition, moves])

    const position = useMemo(()=> {
        return buildUntilPly(history, plyIndex)
    }, [history, plyIndex])    

    const advancePly = () => {
        setPlyIndex(prev=>Math.min(prev + 1, moves.length))
    }
    const retreatPly = () => {
        setPlyIndex(prev=>Math.max(prev - 1, 0))
    }

    return {
        position, plyIndex, finished,
        player,
        advancePly, retreatPly,
        moveToPly: setPlyIndex,    
    }
}