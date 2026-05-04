import React, { act } from "react"
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
import PromotionDialog from "@/ui/screens/player/dialogs/PromotionDialog";
import { SolvedDialog } from "@/ui/screens/player/dialogs/SolvedDialog";
import { PlayerFooterPanel } from "@/ui/screens/player/components/panels/PlayerFooterPanel";
import { usePlayerRunner, type MovesAction, type NavigationAction, type PlayerRunnerAction, type PlayerRunnerModel } from "@/ui/screens/player/runner/usePlayerRunner";
import type { PlayerIntent } from "@/ui/screens/session/adaptor/buildPlayerIntentAdaptor";
import type { Player } from "@/domain/kif/entity";

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
            rightActions={<HeaderRightSection problem={problem} model={model}/>}
        >
            <Stack sx={{ minHeight: 0, height: "100%" }} spacing={1} >
                <TitlePanel title={title} />
                <BoardPanel boardModel={model.state.board}/>
                <MovesControlSection 
                    problem={problem} model={model}/>
            </Stack>

            <DialogSection model={model} />

        </AppShell>
    )
}
function MovesControlSection({ problem, model }: { 
    problem: Problem, model: PlayerRunnerModel }){

    const { ply, moves, visible, maxPly, userSide } = model.state.moves
    const { toggleReversed, toggleUserSide } = model.actions.game
    const { advancePly, retreatPly, reveal } = model.actions.moves

    return (
        <Stack direction="row" sx={{ minHeight: 0, flexGrow: 1, p: 1 }} spacing={1}>
            <MovesPanel
                problem={problem}
                ply={ply}
                moves={moves} isMovesVisible={visible} />
            <Box sx={{ flex: 1, border: 1, borderColor: "divider" }}>
                <Stack direction="row" alignItems="center">
                    <TimerControlPanel />
                    <ReverseControl toggleReversed={toggleReversed}/>
                    <UserSideControl userSide={userSide} toggleUserSide={toggleUserSide} />
                </Stack>

                {visible ?
                    <PlyControlPanel
                        currentPly={ply}
                        maxPly={maxPly}
                        onPrev={retreatPly}
                        onNext={advancePly}
                    /> : (<Stack>
                        <Button onClick={reveal} variant="outlined">
                            手筋を表示
                        </Button>
                    </Stack>)
                }
            </Box>

        </Stack>
    )

}
/////////////////////////////////////////////
function HeaderRightSection({problem, model}: { problem: Problem, model: PlayerRunnerModel}){
    return (
        <PlayerRightPanel
            problemId={problem.id}
            onNavigateToDetail={model.actions.navigation.navigateToDetail}
            onDelete={model.actions.domain.deleteProblem}
        />
    )
}
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
function ReverseControl( {toggleReversed} : { toggleReversed: () => void}) {
    return (
        <IconButton onClick={toggleReversed}>
            <SwapVertIcon />
        </IconButton>
    )
}
function UserSideControl({userSide, toggleUserSide}: { userSide: Player, toggleUserSide: ()=> void}) {
    return (
        <Box onClick={toggleUserSide}>
            {userSide === "black" ? "▲" : "△"}
        </Box>
    )
}