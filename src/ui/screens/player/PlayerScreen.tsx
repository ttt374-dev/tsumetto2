import React from "react"
import { Box, Button, IconButton, Stack } from "@mui/material"
import SwapVertIcon from '@mui/icons-material/SwapVert';

import PlayerRightPanel from "./components/panels/PlayerRightPanel";
import TitlePanel from "./components/panels/TitlePanel";
import MovesPanel from "./components/panels/moves/MovesPanel";
import BoardPanel from "@/ui/screens/player/components/panels/board/BoardPanel"
import TimerControlPanel from "./components/panels/TImerControlPanel";
import PlyControlPanel from "@/ui/screens/player/components/panels/PlyControlPanel";
import { Problem } from "@/domain/problem/entity/Problem"
import { AppShell } from "@/ui/common/components/layout/AppShell";
import { useGameStore } from "./store/useGameStore";
import PromotionDialog from "@/ui/screens/player/dialogs/PromotionDialog";
import { SolvedDialog } from "@/ui/screens/player/dialogs/SolvedDialog";
import { PlayerFooterPanel } from "@/ui/screens/player/components/panels/PlayerFooterPanel";
import { usePlayerRunner, type MovesAction, type NavigationAction, type PlayerRunnerModel } from "@/ui/screens/player/hooks/usePlayerRunner";
import type { MovesViewModel } from "@/ui/screens/player/vm/buildPlayerViewModel";
import type { PlayerIntent } from "@/ui/screens/session/adaptor/buildPlayerIntentAdaptor";

//type PlayerViewModel = ReturnType<typeof usePlayerViewModel>

///////////////////////////////////////////
export default function PlayerScreen({ problem, title, onPlayerIntent, }: {
    problem: Problem
    title: React.ReactNode
    onPlayerIntent?: (e: PlayerIntent) => void
}) {

    // view model
    const model = usePlayerRunner(problem,
        { onPlayerIntent: (e) => onPlayerIntent?.(e) })

    // 消された場合
    if (problem.deletedAt) {
        return <AppShell footer={<FooterSection actions={model.actions.navigation}/>}>Deleted: {problem.title}</AppShell>
    }

    ////////////////////////////////////////////////////////////////////////
    return (
        <AppShell
            header={"Player"}
            footer={<FooterSection actions={model.actions.navigation}/>}
            rightActions={
                <PlayerRightPanel
                    problemId={problem.id}
                    onNavigateToDetail={model.actions.navigation.navigateToDetail}
                    onDelete={model.actions.domain.deleteProblem}
                />}
        >
            <Stack sx={{ minHeight: 0, height: "100%" }} spacing={1} >
                <TitlePanel title={title} />
                { /* --- 盤面 ---*/}
                <BoardPanel vm={model.state.board}/>
                <MovesControlSection 
                    problem={problem} vm={model.state.moves} actions={model.actions.moves}/>

            </Stack>

            <DialogSection model={model} />

        </AppShell>
    )
}
function MovesControlSection({ problem, vm, actions }: { 
    problem: Problem, vm: MovesViewModel, actions: MovesAction }) {

    return (
        <Stack direction="row" sx={{ minHeight: 0, flexGrow: 1, p: 1 }} spacing={1}>
            <MovesPanel
                problem={problem}
                ply={vm.ply}
                moves={vm.moves} isMovesVisible={vm.visible} />
            <Box sx={{ flex: 1, border: 1, borderColor: "divider" }}>
                <Stack direction="row" alignItems="center">
                    <TimerControlPanel />
                    <ReverseControl />
                    <UserSideControl />
                </Stack>

                {vm.visible ?
                    <PlyControlPanel
                        currentPly={vm.ply}
                        maxPly={vm.maxPly}
                        onPrev={actions.retreatPly}
                        onNext={actions.advancePly}
                    /> : (<Stack>
                        <Button onClick={actions.reveal} variant="outlined">
                            手筋を表示
                        </Button>
                    </Stack>)
                }
            </Box>

        </Stack>
    )

}
/////////////////////////////////////////////
function FooterSection({actions}: {actions: NavigationAction}){
    return (      
        <PlayerFooterPanel
            onNext={actions.nextProblem}
            onShowList={actions.showList}
        />
    )
}
function DialogSection({ model }: { model: PlayerRunnerModel }) {
    const confirmSolved = () => model.handlers.handleUIEvent({type: "solvedConfirmed"})
    
    return (
        <>
            {model.ui.dialogs.promotion.open &&
                <PromotionDialog
                    open={model.ui.dialogs.promotion.open}
                    onConfirm={model.ui.dialogs.promotion.onConfirm}
                    pieceType={model.ui.dialogs.promotion.pieceType}
                />}

            {model.ui.dialogs.solvedResult.open &&
                <SolvedDialog
                    open={model.ui.dialogs.solvedResult.open}
                    onClose={model.ui.dialogs.solvedResult.closeDialog}
                    onConfirm={confirmSolved}
                    solvedResult={model.ui.dialogs.solvedResult.solvedResult}
                    learningState={model.state.dialogs.learningState}
                />}
        </>)
}
function ReverseControl() {
    const toggleReversed = useGameStore(s => s.toggleReversed)
    return (
        <IconButton onClick={toggleReversed}>
            <SwapVertIcon />
        </IconButton>
    )
}
function UserSideControl() {
    const userSide = useGameStore(s => s.userSide)
    const toggleUserSide = useGameStore(s => s.toggleUserSide)
    return (
        <Box onClick={toggleUserSide}>
            {userSide === "black" ? "▲" : "△"}
        </Box>
    )
}