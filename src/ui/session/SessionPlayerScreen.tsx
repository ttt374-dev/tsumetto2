import React, { useEffect, useState } from "react"

import PlayerScreen from "@/ui/player/PlayerScreen"
import { useSessionPlayerViewModel, type SessionPlayerPlayingVM } from "./hooks/useSessionPlayerViewModel"
import { PlayerFooterPanel } from "@/ui/player/components/panels/PlayerFooterPanel"
import { useGameStore, type GameEvent } from "@/ui/player/hooks/useGameStore"
import { SessionProblemListDialog } from "@/ui/session/SessionProblemListDialog"

////////////////////////////////////////////////
export default function SessionPlayerScreen() {
    const vm = useSessionPlayerViewModel()

    if (vm.status !== "playing") return <>{vm.status}</>
    if (!vm.sessionId) return <>NO SESSION ID</>

    return (<SessionPlayerContent vm={vm}/>)
}

function SessionPlayerContent({vm}: { vm: SessionPlayerPlayingVM}) {
    const [isListOpen, setIsListOpen] = useState(false)        

    useEffect(() => {        
        return () => {
            // 離脱直前に未サブミットなら強制 ABANDON + submit
            vm.flush()
        }
    }, [vm.problem.id]) // 問題が切り替わるたびに発火
    // ハンドラー
    const handleShowList = () => {
        setIsListOpen(true)
    }      
    const handleNext = () => {    
        vm.flush()
        vm.nextProblem()        
    }

    const footerPanel: React.ReactNode = (
        <PlayerFooterPanel
            onNext={handleNext}
            onShowList={handleShowList} />)
            
    return (
        <>
            <PlayerScreen
                problem={vm.problem}
                title={vm.title}
                onSolve={vm.submitSolvedResult}
                onSolvedConfirm={handleNext}
                onAfterDelete={vm.nextProblem}
                footerPanel={footerPanel}
            />

            <SessionProblemListDialog
                open={isListOpen}
                onClose={()=>setIsListOpen(false)}
            />

        </>
    )
}
