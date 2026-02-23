import { useState } from "react";
import { Box, ToggleButton, List, ListItem, ListItemButton, ListItemText, Stack, ToggleButtonGroup, IconButton } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type UniqueIdentifier, TouchSensor } from "@dnd-kit/core";
import { SortableContext, useSortable, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { AppShell } from "../common/components/layout/AppShell";
import FabMenu from "./components/FabMenu";
import { useDecksViewModel } from "./hooks/useDecksViewModel";
import { useNavigate } from "react-router-dom";
import { routes } from "../App/useAppNavigation";
import type { Deck, DeckId } from "@/domain/deck/entity/Deck";
import { useDecksModeStore } from "./hooks/useDecksModeStore";

export default function DecksScreen() {
    const { deckArray, onDragEnd, deckStats, onCreateDeck, onStartMission, presenter: { importer, backupRestoreDialog } } =
        useDecksViewModel();
    const navigate = useNavigate();
    //const [mode, setMode] = useState<DeckActionMode>("mission")
    //const [reorderable, setReordable] = useState(false)
    //const [editable, setEditable] = useState(false)
    const { editable, toggleEditable, reorderable, toggleReorderable} = useDecksModeStore()

    const handleDeckEdit = (id: DeckId) => {
        navigate(routes.deckEdit(id));
    }
    // dnd-kit センサー
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 150,
                tolerance: 5,
            },
        })
    );

    function SortableDeckItem({ deck }: { deck: Deck }) {
        const sortable = useSortable({ id: deck.id });

        const style = {
            transform: CSS.Transform.toString(sortable.transform),
            transition: sortable.transition,
        };

        const stats = deckStats.get(deck.id);

        //const isReorder = mode === "reorder";
        const isReorder = reorderable

        return (
            <ListItem
                ref={sortable.setNodeRef}
                style={ reorderable ? style: undefined}
                disablePadding
                sx={{
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    //px: 2,
                    display: 'flex',
                    alignItems: 'center',
                    //backgroundColor: isReorder ? "action.hover" : "inherit",
                }}
                secondaryAction={
                    <>
                        { editable &&
                        <IconButton edge="end" aria-label="edit" onClick={() => handleDeckEdit(deck.id)}>
                            <EditIcon />
                        </IconButton> }
                        {isReorder && (
                        <IconButton
                            {...sortable.attributes}
                            {...sortable.listeners}
                        >
                            <DragIndicatorIcon />
                        </IconButton>
                        )}
                    </>
                }
            >


                {/* 通常動作はモード依存 */}
                <ListItemButton
                    onClick={() => {
                        onStartMission(deck)
                        //if (mode === "mission") onStartMission(deck);
                        //if (mode === "edit") navigate(routes.deckEdit(deck.id));
                    }}
                    disabled={stats?.problemCount === 0}
                    
                >
                    <ListItemText
                        primary={deck.name}
                        secondary={`問題数：${stats?.problemCount ?? 0}, 正答率：${((stats?.accuracy ?? 0) * 100).toFixed(0)}%`}
                    />
                </ListItemButton>

            </ListItem>
        );
    }
    function ActionMode(){
        return (
               <Stack direction="row" justifyContent="flex-end">
                <IconButton color={ editable ? "primary" : "default"}
                    onClick={toggleEditable}>
                    <EditIcon />
                </IconButton>

                <IconButton color={ reorderable ? "primary" : "default"}
                    onClick={toggleReorderable}>
                    <DragIndicatorIcon />
                </IconButton>

                { /* 
                <ToggleButtonGroup
                    value={mode}
                    exclusive
                    onChange={(_, newMode) => {
                        if (newMode !== null) setMode(newMode);
                    }}
                    size="small"
                >
                    

                    <ToggleButton value="edit">
                        <EditIcon fontSize="small" />
                    </ToggleButton>

                    <ToggleButton value="reorder">
                        <DragIndicatorIcon fontSize="small" />
                    </ToggleButton>
                </ToggleButtonGroup>
                */}
            </Stack>
        )

    }
    return (
        <AppShell
            header="Decks"
            fab={<FabMenu onCreateNewDeck={onCreateDeck} onImportFiles={importer.openFileDialog} />}

        >
            <ActionMode/>
            <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto", touchAction: "pan-y" }}>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={e => onDragEnd(e.active.id, e.over?.id ?? null)}>
                    <SortableContext items={deckArray.map(d => d.id)} strategy={verticalListSortingStrategy}>
                        <List>
                            {deckArray.map(deck => (
                                <SortableDeckItem key={deck.id} deck={deck} />
                            ))}
                        </List>
                    </SortableContext>
                </DndContext>
            </Box>

            {/* ダイアログ */}
            {importer.pickerElement}
            {importer.dialogElement}
            {backupRestoreDialog.dialogElement}
        </AppShell>
    );
}