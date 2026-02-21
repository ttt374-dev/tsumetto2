import { Box, IconButton, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { AppShell } from "../common/layout/AppShell";
import FabMenu from "./components/FabMenu";
import { useDecksViewModel } from "./hooks/useDecksViewModel";
import { useNavigate } from "react-router-dom";
import { routes } from "../App/useAppNavigation";

import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type UniqueIdentifier, TouchSensor } from "@dnd-kit/core";
import { SortableContext, useSortable, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";


import type { Deck } from "@/domain/deck/Deck";


export default function DecksScreen() {
    const { deckArray, onDragEnd, deckStats, onCreateDeck, onStartMission, presenter: { importer, backupRestoreDialog} } =
         useDecksViewModel();
    const navigate = useNavigate();

    // dnd-kit センサー
    const sensors = useSensors(
        useSensor(
            PointerSensor, { activationConstraint: { distance: 5 } }),);

    function SortableDeckItem({ deck }: { deck: Deck }) {
        const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: deck.id });
        const style = { transform: CSS.Transform.toString(transform), transition };

        const stats = deckStats.get(deck.id);

        return (
            <ListItem
                ref={setNodeRef}
                style={style}
                disablePadding
                sx={{ borderBottom: '1px solid', borderColor: 'divider', 
                    px: 2,
                    display: 'flex', alignItems: 'center' }}
            >
                {/* DragHandle */}
                <IconButton {...attributes} {...listeners} edge="start" sx={{ cursor: 'grab', mr: 1 }}>
                    <DragIndicatorIcon />
                </IconButton>

                {/* 通常クリック可能 */}
                <ListItemButton
                    onClick={() => onStartMission(deck)}
                    disabled={stats?.problemCount === 0}
                    sx={{ flex: 1 }}
                >
                    <ListItemText
                        primary={deck.name}
                        secondary={`問題数：${stats?.problemCount ?? 0}, 正答率：${((stats?.accuracy ?? 0) * 100).toFixed(0)}%`}
                    />
                </ListItemButton>

                {/* 編集ボタン */}
                <IconButton edge="end" onClick={() => navigate(routes.deckEdit(deck.id))}>
                    <EditIcon />
                </IconButton>
            </ListItem>
        );
    }

    return (
        <AppShell
            header="Decks"
            fab={<FabMenu onCreateNewDeck={onCreateDeck} onImportFiles={importer.openFileDialog} />}

        >
            <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto", touchAction: "pan-y" }}>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={e=>onDragEnd(e.active.id, e.over?.id ?? null)}>
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