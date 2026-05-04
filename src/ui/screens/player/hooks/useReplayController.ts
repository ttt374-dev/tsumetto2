import { useRef } from "react"

import { useReplayStore } from "@/ui/screens/player/store/useReplayStore"

export type ReplayController = {
    //advanceOpponentPly: () => void
    advanceTurn: () => void
}

export function useReplayController(): ReplayController {
    const replay = useReplayStore()
    const turnIdRef = useRef(0)
/*
    const advanceOpponentPly = () => {
        replay.startAnimation()
        const currentId = ++turnIdRef.current
        setTimeout(() => {
            if (currentId !== turnIdRef.current) return
            const replay = useReplayStore.getState()
            replay.advancePly()
            replay.endAnimation()
        }, 500)
    }
        */
    const advanceTurn = async () => {
        replay.advancePly()
        //advanceOpponentPly()

        replay.startAnimation()
        
        await new Promise(res => setTimeout(res, 500))
        const currentId = ++turnIdRef.current
        if (currentId !== turnIdRef.current) return
        //const replay = useReplayStore.getState()
        replay.advancePly()
        replay.endAnimation()
        /*
        setTimeout(() => {
            if (currentId !== turnIdRef.current) return
            const replay = useReplayStore.getState()
            replay.advancePly()
            replay.endAnimation()
        }, 500)
        */
    }

    return { advanceTurn }
}