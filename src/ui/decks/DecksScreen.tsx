import { Box, IconButton, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import BackupIcon from "@mui/icons-material/Backup";
import { AppLayout } from "../common/layout/AppLayout";
import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";
import { createQuerySnapshot, type Deck } from "@/domain/deck/Deck";
import { applyQuery } from "@/domain/problem/query/applyQuery";
import FabMenu from "./FabMenu";
import { useImportController } from "@/application/useImportControler";
import type { ImportFilesResult } from "@/usecase/importProblemsUsecase";
import { useToast } from "../App/providers/ToastProvider";
import { useBackupRestoreDialog } from "../common/dialogs/BackupRestoreDialog";
import { useQuery } from "@/application/useQuery";
import { useStores } from "@/application/store/useStores";
import { useLearningRecordStore } from "@/application/useLearningRecordStore";
import { useDeckStats } from "./hooks/useDeckStats";
import { DefaultFilterState } from "@/domain/problem/query/filter";
import { DefaultSortState } from "@/domain/problem/query/sort";
import { AppShell } from "../common/layout/AppShell";
import { useProblemStore } from "@/application/store/useProblemStore";
import { useEffect } from "react";
import { useDeckStore } from "@/application/store/useDeckStore";
import { useMissionStore } from "@/application/store/useMissionStore";


function createDeck(name: string): Deck {
    return {
        id: v4(),
        name,
        snapshot: { filterState: DefaultFilterState, sortState: DefaultSortState},
        createdAt: new Date(),
    }
}
/////////////////////////////////////////////////////////////
export default function DecksScreen(){    
    //const { startMission } = useMissionCoordinator()    
    const start = useMissionStore((s) => s.start);
    //const stores = useStores()
    //const learningRecords = useLearningRecordStore(stores.learningEvent.eventLog)
    const navigate = useNavigate()
    const toast = useToast()
    const problems = useProblemStore(s => s.all)
    //console.log("problems", problems)

    // import files
    const importer = useImportController(async (res: ImportFilesResult) => {
        useProblemStore(s=>s.reload())
        toast({message: `imported: ${res.summary.imported}, skipped: ${res.summary.skipped}, failed: ${res.summary.failed}`})        
     })
    // backup, restore
    const backupRestoreDialog = useBackupRestoreDialog((res) => {
        if (res.ok) useProblemStore(s=>s.reload())
    })            
    // stats
    const learningRecords = useLearningRecordStore(s=>s.records)
    const decks = useDeckStore(s=>s.decks)
    const deckStats = useDeckStats(problems, decks, learningRecords)
    //  handlers
    const handleStartMission = (deck: Deck) => {
        const filterState = deck.snapshot.filterState
        const filtered = applyQuery(problems, learningRecords, deck.snapshot.sortState, filterState)

        start(filtered.map(p=>p.id))
        navigate("/mission/play")
    }
    const handleCreateDeck = async (name: string) => {
        const newDeck = createDeck(name)
        useDeckStore(s=>s.saveDeck(newDeck))
        navigate(`/deck/${newDeck.id}`)
    }    

    return (
        <AppShell
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
                        decks.map(deck => {
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
                                            secondary={`問題数：${stats?.problemCount}, 正答率：${((stats?.accuracy ?? 0) * 100).toFixed(0)}%`}
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
        </AppShell>
    )
}