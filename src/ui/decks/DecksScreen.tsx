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
import type { Deck } from "@/domain/deck/entity/Deck";

type DeckActionMode = "reorder" | "mission" | "edit"

export default function DecksScreen() {
    const { deckArray, onDragEnd, deckStats, onCreateDeck, onStartMission, presenter: { importer, backupRestoreDialog } } =
        useDecksViewModel();
    const navigate = useNavigate();
    const [mode, setMode] = useState<DeckActionMode>("mission")

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

        const isReorder = mode === "reorder";

        return (
            <ListItem
                ref={isReorder ? sortable.setNodeRef : undefined}
                style={isReorder ? style : undefined}
                disablePadding
                sx={{
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    //px: 2,
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: isReorder ? "action.hover" : "inherit",
                }}
            >

                {isReorder && (
                    <IconButton
                        {...sortable.attributes}
                        {...sortable.listeners}
                    >
                        <DragIndicatorIcon />
                    </IconButton>
                )}

                {/* 通常動作はモード依存 */}
                <ListItemButton

                    onClick={() => {
                        if (mode === "mission") onStartMission(deck);
                        if (mode === "edit") navigate(routes.deckEdit(deck.id));
                    }}
                    disabled={stats?.problemCount === 0 && mode === "mission"}
                    
                >
                    <ListItemText
                        primary={deck.name}
                        secondary={`問題数：${stats?.problemCount ?? 0}, 正答率：${((stats?.accuracy ?? 0) * 100).toFixed(0)}%`}
                    />
                </ListItemButton>

            </ListItem>
        );
    }
    return (
        <AppShell
            header="Decks"
            fab={<FabMenu onCreateNewDeck={onCreateDeck} onImportFiles={importer.openFileDialog} />}

        >
            <Stack direction="row" justifyContent="flex-end">
                <ToggleButtonGroup
                    value={mode}
                    exclusive
                    onChange={(_, newMode) => {
                        if (newMode !== null) setMode(newMode);
                    }}
                    size="small"
                >
                    <ToggleButton value="mission">
                        <PlayArrowIcon fontSize="small" />
                    </ToggleButton>

                    <ToggleButton value="edit">
                        <EditIcon fontSize="small" />
                    </ToggleButton>

                    <ToggleButton value="reorder">
                        <DragIndicatorIcon fontSize="small" />
                    </ToggleButton>
                </ToggleButtonGroup>
            </Stack>
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