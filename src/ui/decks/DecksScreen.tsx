import { Button, Fab, IconButton, List, ListItem, ListItemButton, ListItemText, Stack } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from "@mui/icons-material/Add";
import { AppLayout } from "../common/AppLayout";
import { useMissionEventStoreContext } from "../App/providers/MissionEventStoreProvider";
import { useNavigate } from "react-router-dom";
import { applyFilter } from "@/domain/problem/query/applyFilter";
import { useRepositoryContext } from "../App/providers/RepositoryProvider";
import { useProblemStore } from "@/application/store/useProblemStore";
import { useLearningEventStore } from "@/application/store/useLearningEventStore";
import { v4 } from "uuid";
import { CreateDeckDialog } from "../dashboard/components/CreateDeckDialog";
import { useMemo, useState } from "react";
import { createQuerySnapshot, type Deck } from "@/domain/deck/Deck";
import { useMissionQueryContext } from "../App/providers/QueryProvider";
import { applyQuery } from "@/domain/problem/query/applyQuery";
import { useDeckController } from "@/application/useDeckController";
import FabMenu from "./FabMenu";
import { useImportController } from "@/application/useImportControler";
import type { ImportFilesResult } from "@/usecase/importProblemsUsecase";
import { useToast } from "../App/providers/ToastProvider";

export default function DecksScreen(){
    const [openCreateDialog, setOpenCreateDialog] = useState(false)
    const query = useMissionQueryContext()
    const { decks, loadDecks } = useDeckController()
    const { start } = useMissionEventStoreContext()
    const repos = useRepositoryContext()
    const store = useProblemStore(repos.problem)
    const learningEventStore = useLearningEventStore(repos.learningEvent)
    const navigate = useNavigate()
    const toast = useToast()

    // import files
    const importer = useImportController(async (res: ImportFilesResult) => {
        await store.reload()
        toast({message: `imported: ${res.summary.imported}, skipped: ${res.summary.skipped}, failed: ${res.summary.failed}`})        
     })
    //  handlers

    const handleStartMission = (deck: Deck) => {
        const filterState = deck.snapshot.filterState
        //const filtered = applyFilter(store.problems, learningEventStore.records, filterState)
        const filtered = applyQuery(store.problems, learningEventStore.records, deck.snapshot.sortState, filterState)

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
        repos.deck.save(newDeck)
        loadDecks()
        setOpenCreateDialog(false)
        navigate(`/deck/${newDeck.id}`)
    }    

    const problemCounts = useMemo(() => {
        return new Map(
            decks.map(deck => [
                deck.id,
                applyFilter(store.problems, learningEventStore.records, deck.snapshot.filterState).length
            ])
        )
    }, [decks, store.problems, learningEventStore.records])

    return (
        <AppLayout
            header={ "Decks"}
            fab={
                <FabMenu 
                    onCreateNewDeck={() => handleCreateDeck("untitled")} 
                    onImportFiles={importer.openFileDialog}
                />
            }
        >
            <List>
                {
                    decks.map(deck=>{
                        const length = problemCounts.get(deck.id) ?? 0
                        return (
                            <ListItem key={deck.id} disablePadding                                       
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
                                    disabled={length===0}>
                                    <ListItemText
                                        primary={deck.name}
                                        secondary={`問題数：${length}`}
                                    >                                       
                                        

                                    </ListItemText>
                                </ListItemButton>
                            </ListItem>)
                    })
                }
            </List>

            {importer.pickerElement}
            {importer.dialogElement}
        </AppLayout>
    )
}