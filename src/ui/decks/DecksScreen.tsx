import { Box, Button, Fab, IconButton, List, ListItem, ListItemButton, ListItemText, Stack } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from "@mui/icons-material/Add";
import BackupIcon from "@mui/icons-material/Backup";
import { AppLayout } from "../common/layout/AppLayout";
import { useMissionEventStoreContext } from "../App/providers/MissionEventStoreProvider";
import { useNavigate } from "react-router-dom";
import { applyFilter } from "@/domain/problem/query/applyFilter";
import { useRepositoryContext } from "../App/providers/RepositoryProvider";
import { useProblemStore } from "@/application/store/useProblemStore";
import { useLearningEventStore } from "@/application/store/useLearningEventStore";
import { v4 } from "uuid";
import { useMemo, useState } from "react";
import { createQuerySnapshot, type Deck } from "@/domain/deck/Deck";
import { applyQuery } from "@/domain/problem/query/applyQuery";
import { useDeckStore } from "@/application/store/useDeckStore";
import FabMenu from "./FabMenu";
import { useImportController } from "@/application/useImportControler";
import type { ImportFilesResult } from "@/usecase/importProblemsUsecase";
import { useToast } from "../App/providers/ToastProvider";
import { ProblemStats } from "@/domain/problem/ProblemStats";
import { useBackupRestoreDialog } from "../common/dialogs/BackupRestoreDialog";
import { useQuery } from "@/application/useQuery";
import { useStores } from "@/application/store/useStores";
import { useLearningRecord } from "@/application/useLearningRecord";
import { useProblemStats } from "@/application/useProblemStats";
import { useDeckStats } from "./useDeckStats";

export default function DecksScreen(){
    const query = useQuery() 
    
    const { start } = useMissionEventStoreContext()
    //const repos = useRepositoryContext()
    const stores = useStores()
    const learningRecords = useLearningRecord(stores.learningEvent.eventLog)
    const navigate = useNavigate()
    const toast = useToast()

    // import files
    const importer = useImportController(async (res: ImportFilesResult) => {
        await stores.problem.reload()
        toast({message: `imported: ${res.summary.imported}, skipped: ${res.summary.skipped}, failed: ${res.summary.failed}`})        
     })
    // backup, restore
    const backupRestoreDialog = useBackupRestoreDialog((res) => {
        if (res.ok) stores.problem.reload()
    })            
    //
    const deckStats = useDeckStats(stores, learningRecords)
    //  handlers
    const handleStartMission = (deck: Deck) => {
        const filterState = deck.snapshot.filterState
        const filtered = applyQuery(stores.problem.problems, learningRecords, deck.snapshot.sortState, filterState)

        //query.setFilter(filterState)
        start(filtered.map(p=>p.id))
        navigate("/mission/play")
    }
    const handleCreateDeck = async (name: string) => {
        const newDeck = {
            id: v4(),
            name,
            snapshot: createQuerySnapshot(query),
            createdAt: new Date(),
        }
        stores.deck.saveDeck(newDeck)
        //repos.deck.update(newDeck)
        //stores.deck.loadDecks()
        //setOpenCreateDialog(false)
        navigate(`/deck/${newDeck.id}`)
    }    

    return (
        <AppLayout
            header={ "Decks"}
            rightActions={
                <>
                    <IconButton onClick={backupRestoreDialog.openDialog}>
                        <BackupIcon sx={{ color: "#fff" }} />
                    </IconButton>
</>
            }
            fab={
                <FabMenu 
                    onCreateNewDeck={() => handleCreateDeck("untitled")} 
                    onImportFiles={importer.openFileDialog}
                />
            }
        >
            <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
                <List>
                    {
                        stores.deck.decks.map(deck => {
                            const stats = deckStats.get(deck.id) 
                            return (
                                <ListItem key={deck.id} disablePadding
                                    sx={{ borderBottom: 1, borderColor: "divider" }}
                                    secondaryAction={
                                        <IconButton
                                            edge="end"
                                            onClick={() => navigate(`/deck/${deck.id}`)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    }
                                >
                                    <ListItemButton onClick={() => handleStartMission(deck)}
                                        disabled={stats?.problemCount === 0}>
                                        <ListItemText
                                            primary={deck.name}
                                            secondary={`問題数：${stats?.problemCount}, 正答率：${((stats?.accuracy??0)*100).toFixed(0)}%`}
                                        >
                                        </ListItemText>
                                    </ListItemButton>
                                </ListItem>)
                        })
                    }
                </List>
            </Box>
            { /* ダイアログ */}
            {importer.pickerElement}
            {importer.dialogElement}
            {backupRestoreDialog.dialogElement}
        </AppLayout>
    )
}