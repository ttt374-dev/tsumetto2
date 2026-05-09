import React from "react"
import { Box, Button, IconButton, Stack } from "@mui/material"
import SwapVertIcon from '@mui/icons-material/SwapVert';
import VisibilityIcon from "@mui/icons-material/Visibility";

import PlayerRightPanel from "./components/panels/PlayerRightPanel";
import TitlePanel from "./components/panels/TitlePanel";
import MovesPanel from "./components/panels/moves/MovesPanel";
import BoardPanel from "@/ui/screens/player/components/panels/board/BoardPanel"
import TimerControlPanel from "./components/panels/TImerControlPanel";
import PlyControlPanel from "@/ui/screens/player/components/panels/PlyControlPanel";
import { Problem } from "@/domain/problem/entity/Problem"
import { AppShell } from "@/ui/common/components/layout/AppShell";
import PromotionDialog from "@/ui/screens/player/dialogs/PromotionDialog";
import { SolvedDialog, useSolvedDialogController } from "@/ui/screens/player/dialogs/SolvedDialog";
import type { PlayerIntent } from "@/application/session/interpretor/interpretPlayerIntent";
import type { Player } from "@/domain/kif/entity";
import _ from "lodash";
import type { GameEvent } from "@/domain/game/types/GameEvent";
import { useGameStore } from "@/ui/screens/player/store/useGameStore";
import { usePlayerPresentation, type PlayerPresentation } from "@/ui/screens/player/hooks/usePlayerPresentation";
import { usePlayerRunner, type PlayerRunnerModel } from "@/ui/screens/player/runner/usePlayerRunner";

///////////////////////////////////////////
export default function PlayerScreen({ problem, title, footer, onPlayerIntent, onGameEvent, }: {
    problem: Problem
    title: React.ReactNode
    footer?: React.ReactNode
    onGameEvent?: (e: GameEvent) => void
    onPlayerIntent?: (e: PlayerIntent) => void
}) {

    // view model
    const model = usePlayerPresentation(problem)
    const runner = usePlayerRunner(problem, model.ui.dialogs, {
        onPlayerIntent: onPlayerIntent,
        onGameEvent: onGameEvent
    })    

    // 消された場合
    if (problem.deletedAt) {
        return <AppShell>Deleted: {problem.title}</AppShell>
    }

    ////////////////////////////////////////////////////////////////////////
    return (
        <AppShell
            header={"Player"}
            footer={footer}
            rightActions={<HeaderRightSection problem={problem} model={model} />}
        >
            <Stack sx={{ minHeight: 0, height: "100%" }} spacing={1} >
                <TitlePanel title={title} />
                <BoardPanel boardModel={model.state.board} actions={model.actions.board} />
                <MovesControlSection
                    problem={problem} model={model} />
            </Stack>

            <DialogSection model={model} runner={runner} />

        </AppShell>
    )
}
function MovesControlSection({ problem, model }: {
    problem: Problem, model: PlayerPresentation
}) {

    const { moves: { ply, visible, maxPly, userSide, isRevealed, isSolved } } = model.state
    const {
        game: { toggleReversed, toggleUserSide },
        moves: { advancePly, retreatPly, reveal, toggleMovesVisible } } = model.actions


    const events = useGameStore(s => s.events)
    //const solvedResult = deriveSolvedResultFromEvents(events)
    return (
        <Stack direction="row" sx={{ minHeight: 0, flexGrow: 1, p: 1 }} spacing={1}>
            <MovesPanel
                problem={problem} movesModel={model.state.moves}
                actions={model.actions.moves}
            />
            <Box sx={{ flex: 1, border: 1, borderColor: "divider" }}>
                <Stack direction="row" alignItems="center">
                    <TimerControlPanel />
                    <ReverseControl toggleReversed={toggleReversed} />
                    <UserSideControl userSide={userSide} toggleUserSide={toggleUserSide} />
                    <ToggleMovesVisible onToggleMovesVisible={toggleMovesVisible} disabled={!isRevealed} />
                </Stack>
                {visible &&
                    <PlyControlPanel
                        currentPly={ply}
                        maxPly={maxPly}
                        onPrev={retreatPly}
                        onNext={advancePly}
                    />}
                {!isRevealed &&
                    <Button onClick={reveal} variant="outlined">
                        手筋を表示
                    </Button>
                }
            </Box>
        </Stack>
    )

}
/////////////////////////////////////////////
function HeaderRightSection({ problem, model }: { problem: Problem, model: PlayerPresentation }) {
    return (
        <PlayerRightPanel
            problemId={problem.id}
            onNavigateToDetail={model.actions.navigation.navigateToDetail}
            onDelete={model.actions.domain.deleteProblem}
        />
    )
}

function DialogSection({ model, runner }: { model: PlayerPresentation, runner: PlayerRunnerModel  }) {
    const confirmSolved = () => { 
        runner.handlers.handlePlayerIntent({ type: "PROBLEM_CONFIRMED" }) 
    }

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
                    onConfirm={() => {
                        confirmSolved()
                        model.ui.dialogs.solvedResult.closeDialog()
                    }
                    }
                    solvedResult={model.ui.dialogs.solvedResult.solvedResult}
                    learningState={model.state.dialogs.learningState}
                />}
        </>)
}
function ReverseControl({ toggleReversed }: { toggleReversed: () => void }) {
    return (
        <IconButton onClick={toggleReversed}>
            <SwapVertIcon />
        </IconButton>
    )
}
function UserSideControl({ userSide, toggleUserSide }: { userSide: Player, toggleUserSide: () => void }) {
    //console.log("userside", userSide)
    return (
        <Box onClick={toggleUserSide}>
            {userSide === "black" ? "▲" : "△"}
        </Box>
    )
}
function ToggleMovesVisible({onToggleMovesVisible, disabled = false}: {
    onToggleMovesVisible: () => void
    disabled?: boolean
}){
    return <IconButton onClick={onToggleMovesVisible} disabled={disabled}>
        <VisibilityIcon/>
    </IconButton>

}