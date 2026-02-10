import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined"
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"

import { useNavigate, useParams } from "react-router-dom";
import { AppLayout } from "../common/AppLayout";
import { useMissionQueryContext } from "../App/providers/QueryProvider";
import { useEffect, useState } from "react";
import { useMissionEventStoreContext } from "../App/providers/MissionEventStoreProvider";
import { useRepositoryContext } from "../App/providers/RepositoryProvider";
import { useProblemStore } from "@/application/store/useProblemStore";
import { Box, Button, IconButton, Stack } from "@mui/material";
import { v4 } from "uuid";
import { useFilterProblems } from "../dashboard/hooks/useFilterProblems";
import { DashboardFilterControl } from "../dashboard/components/DashboardFilterControl";
import { SummaryView } from "../summary/SummaryView";
import { DeckSelectMenu } from "../dashboard/components/SelectDeckMenu";
import { CreateDeckDialog } from "../dashboard/components/CreateDeckDialog";
import { EditableText } from "../common/EditableText";
import { useDeckController } from "@/application/useDeckController";
import { DEFAULT_DECK_ID, type FilterSnapshot } from "@/domain/deck/Deck";

function deepEqual(a: any, b: any): boolean {
  if (a === b) return true
  if (typeof a !== "object" || typeof b !== "object" || !a || !b)
    return false

  const keysA = Object.keys(a)
  const keysB = Object.keys(b)
  if (keysA.length !== keysB.length) return false

  return keysA.every(key =>
    deepEqual(a[key], b[key])
  )
}
function createFilterSnapshot(query: ReturnType<typeof useMissionQueryContext>): FilterSnapshot {
  return {
    filterState: structuredClone(query.filterState)
  }
}

/////////////////////////////////////////////
export function DeckEditScreen() {
    const { id } = useParams<{ id: string }>()
    const { query, missionSummary, problemIds } = useFilterProblems()
    const { decks, saveDeck, deleteDeck } = useDeckController(query)
    
    const repos = useRepositoryContext()
    const { allTags } = useProblemStore(repos.problem)
    const navigate = useNavigate()    
    
    const deck = decks.find(d => d.id === id)
    const [name, setName] = useState<string>(deck?.name ?? "")
    useEffect(()=> {
        setName(deck?.name ?? "")
    }, [deck])
    //////////////
    if (!id) return null
    if (!deck) return null    

    const isDirty = !deepEqual(
        deck.snapshot.filterState,
        query.filterState
    )
    const handleSaveAndExit = async () => {
        if (!deck) return

        const newDeck = {
            ...deck,
            name: name,
            snapshot: createFilterSnapshot(query),
        }
        saveDeck(newDeck)
        console.log("save and exit", newDeck)
        navigate(-1)
    }
    const handleDeleteDeck = async () => {        
        if (!deck) return
        if (deck.id === DEFAULT_DECK_ID) {
            alert("デフォルトプリセットは削除できません")
            return
        }
        if (!confirm(`プリセット「${deck.name}」を削除しますか？`)) return
        await deleteDeck(deck)
        navigate(-1)
    }
    const handleUpdateName = (title: string) => {        
        console.log("updatename", title)
        setName(title)
    }
    return (
        <AppLayout
            header={"Dashboard"}
            footer={
                <Stack direction="row">
                    <Button onClick={handleDeleteDeck}
                    sx={{ height: 64 }}
                    variant="contained" color="error" fullWidth>
                        削除
                    </Button>
                <Button onClick={handleSaveAndExit}
                    sx={{ height: 64 }}
                    variant="contained" fullWidth
                    >
                    保存して戻る
                </Button>
                <Button onClick={() => navigate(-1)}
                    sx={{ height: 64 }}
                    variant="outlined" color="info" fullWidth>
                    キャンセル
                </Button>
                </Stack>
            }>

            <Box>
                <EditableText
                    initialText={name}
                    onUpdateText={handleUpdateName}
                />
            </Box>
            <DashboardFilterControl
                filter={query.filterState}
                allTags={allTags}
                onToggleFilter={query.toggleFilter}
                onSetFilter={query.setFilter} />
            
            
            <Box>
                問題数：{ missionSummary.problemCount}
            </Box>


        </AppLayout>
    )
}