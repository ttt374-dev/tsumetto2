import { Button, IconButton, List, ListItem, ListItemButton, ListItemText, Stack } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import { AppLayout } from "../common/AppLayout";
import { useFilterProblems } from "../dashboard/hooks/useFilterProblems";
import { useMissionEventStoreContext } from "../App/providers/MissionEventStoreProvider";
import { useNavigate } from "react-router-dom";
import { applyFilter } from "@/domain/problem/query/applyFilter";
import { useRepositoryContext } from "../App/providers/RepositoryProvider";
import { useProblemDetailDialog } from "../common/useProblemDetailDialog";
import { useProblemStore } from "@/application/store/useProblemStore";
import { useLearningEventStore } from "@/application/store/useLearningEventStore";
import { applyQuery } from "@/domain/problem/query/applyQuery";
import { v4 } from "uuid";
import { CreateDeckDialog } from "../dashboard/components/CreateDeckDialog";
import { useState } from "react";
import { createFilterSnapshot, type Deck } from "@/domain/deck/Deck";
import { useDeckController } from "@/application/useDeckController";



export default function DecksScreen(){
    const [openCreateDialog, setOpenCreateDialog] = useState(false)
    const { query } = useFilterProblems()
    const { decks, saveDeck } = useDeckController(query)
    const { start } = useMissionEventStoreContext()
    const repos = useRepositoryContext()
    const store = useProblemStore(repos.problem)
    const learningEventStore = useLearningEventStore(repos.learningEvent)
    const navigate = useNavigate()
    const handleStartMission = (deck: Deck) => {
        const filterState = deck.snapshot.filterState
        const filtered = applyFilter(store.problems, learningEventStore.records, filterState)
        //query.setFilter(filterState)
        start(filtered.map(p=>p.id))
        navigate("/mission/play")
    }
    const handleCreateDeck = async (name: string) => {
        const newDeck = {
            id: v4(),
            name,
            snapshot: createFilterSnapshot(query),
            createdAt: new Date(),
        }
        saveDeck(newDeck)
        setOpenCreateDialog(false)
        navigate(`/deck/${newDeck.id}`)
    }    
    return (
        <AppLayout
            footer={
                <Stack direction="row">
                    <Button onClick={() => setOpenCreateDialog(true)}>
                        新規デッキ
                    </Button>
                </Stack>
            }
        >
            <List>
                {
                    decks.map(deck=>{
                        const length = applyFilter(store.problems, learningEventStore.records, deck.snapshot.filterState).length
                        return (
                        <ListItemButton  onClick={()=>handleStartMission(deck)}>
                            <ListItemText>
                            { deck.name }
                            { length }
                            
                            </ListItemText>
                            <IconButton onClick={(e)=> 
                            {
                                e.stopPropagation()
                                navigate(`/deck/${deck.id}`)}}>
                                <EditIcon/>
                            </IconButton>
                        </ListItemButton>)
                    })
                }
            </List>

            <CreateDeckDialog
                open={openCreateDialog}
                onCreate={handleCreateDeck}
                onClose={() => setOpenCreateDialog(false)}
            />
        </AppLayout>
    )
}