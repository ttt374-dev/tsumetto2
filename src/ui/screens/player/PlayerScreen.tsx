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
import { useReplayStore } from "@/ui/screens/player/store/useReplayStore";
import PromotionDialog from "@/ui/screens/player/dialogs/PromotionDialog";
import { SolvedDialog } from "@/ui/screens/player/dialogs/SolvedDialog";
import { useLearningRecordStore } from "@/ui/features/learning/hooks/useLearningRecordStore";
import { usePlayerViewModel, type PlayerIntent } from "@/ui/screens/player/hooks/usePlayerViewModel";
import { PlayerFooterPanel } from "@/ui/screens/player/components/panels/PlayerFooterPanel";

type PlayerViewModel = ReturnType<typeof usePlayerViewModel>

///////////////////////////////////////////
export default function PlayerScreen({ problem, title, onPlayerIntent, }: {
    problem: Problem
    title: React.ReactNode
    onPlayerIntent?: (e: PlayerIntent) => void
}) {

    // view model
    const vm = usePlayerViewModel(problem,
        { onPlayerIntent: (e) => onPlayerIntent?.(e) })


    // 消された場合
    if (problem.deletedAt) {
        return <AppShell footer={<FooterSection vm={vm}/>}>Deleted: {problem.title}</AppShell>
    }

    ////////////////////////////////////////////////////////////////////////
    return (
        <AppShell
            header={"Player"}
            footer={<FooterSection vm={vm}/>}
            rightActions={
                <PlayerRightPanel
                    problemId={problem.id}
                    onNavigateToDetail={vm.navigateToDetail}
                    onDelete={vm.deleteProblem}
                />}
        >
            <Stack sx={{ minHeight: 0, height: "100%" }} spacing={1} >
                <TitlePanel title={title} />
                { /* --- 盤面 ---*/}
                <BoardPanel />
                <ControlSection problem={problem} vm={vm} />

            </Stack>

            <DialogSecion problem={problem} vm={vm} />

        </AppShell>
    )
}
function ControlSection({ problem, vm }: { problem: Problem, vm: PlayerViewModel }) {
    const isRevealed = useGameStore(s => s.state.isRevealed)
    const replay = useReplayStore()

    return (
        <Stack direction="row" sx={{ minHeight: 0, flexGrow: 1, p: 1 }} spacing={1}>
            <MovesPanel
                problem={problem}
                moves={problem.kifData.moves} isMovesVisible={isRevealed} />
            <Box sx={{ flex: 1, border: 1, borderColor: "divider" }}>
                <Stack direction="row" alignItems="center">
                    <TimerControlPanel />
                    <ReverseControl />
                    <UserSideControl />
                </Stack>

                {isRevealed ?
                    <PlyControlPanel
                        currentPly={replay.ply}
                        maxPly={problem.kifData.moves.length}
                        onPrev={replay.retreatPly}
                        onNext={replay.advancePly}
                    /> : (<Stack>
                        <Button onClick={vm.dispatchReveal} variant="outlined">
                            手筋を表示
                        </Button>
                    </Stack>)
                }
            </Box>

        </Stack>
    )

}
function FooterSection({vm}: {vm: PlayerViewModel}){
    return (      
        <PlayerFooterPanel
            onNext={vm.nextProblem}
            onShowList={vm.showList}
        />
    )
}
function DialogSecion({ problem, vm }: { problem: Problem, vm: PlayerViewModel }) {
    // store    
    const records = useLearningRecordStore(s => s.stateRecords)
    const learningState = records[problem.id]

    return (
        <>
            {vm.dialogs.promotion.open &&
                <PromotionDialog
                    open={vm.dialogs.promotion.open}
                    onConfirm={vm.dialogs.promotion.onConfirm}
                    pieceType={vm.dialogs.promotion.pieceType}
                />}

            {vm.dialogs.solvedResult.open &&
                <SolvedDialog
                    open={vm.dialogs.solvedResult.open}
                    onClose={vm.dialogs.solvedResult.closeDialog}
                    onConfirm={vm.confirmSolved}
                    solvedResult={vm.dialogs.solvedResult.solvedResult}
                    learningState={learningState}

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