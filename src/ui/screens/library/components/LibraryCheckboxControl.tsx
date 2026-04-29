import SelectAllIcon from "@mui/icons-material/SelectAll";
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { IconButton, Stack } from '@mui/material';
import type { ProblemId } from "@/domain/problem/entity/Problem";
import type { LibrarySelection } from "@/ui/screens/library/hooks/useLibrarySelection";

export function LibraryCheckboxControl(props: {
    selection: LibrarySelection
    onDelete: (ids: ProblemId[]) => void
    //actionMode: LibraryActionMode,
    //onChangeActionMode: (mode: LibraryActionMode) => void
    onOpenEditDialog: (ids: ProblemId[]) => void
}) {
    const confirmFn = () => window.confirm("Are you sure to delete selected?")
    const handleOpenEditDialog = () => props.onOpenEditDialog(props.selection.checkedIds)
    const handleDeleteChecked = () => {
        if (props.selection.checkedIds.length === 0) return
        if (!confirmFn()) return
        props.onDelete(props.selection.checkedIds)
    }

    return (
        <Stack direction="row">
            {//props.actionMode !== "selection" &&
             !props.selection.isSelecting &&
                <IconButton
                    value="selection"
                    //onClick={() => props.onChangeActionMode("selection")}                    >
                    onClick={props.selection.startSelection}>
                    <SelectAllIcon />
                </IconButton>
            }

            {//props.actionMode === "selection" &&
            props.selection.isSelecting &&
                <>
                    { /* --- 全選択 --- */}
                    <IconButton
                        onClick={props.selection.selectAll}
                        color="primary">
                        <CheckBoxIcon />
                    </IconButton>
                    <IconButton
                        onClick={props.selection.clearAll}
                        color="primary">
                        <CheckBoxOutlineBlankIcon />
                    </IconButton>
                    <IconButton
                        //onClick={() => props.onChangeActionMode("view")}
                        onClick={props.selection.endSelection}
                        color="primary">
                        <CloseIcon />
                    </IconButton>
                    
                    { /* 編集 */}
                    <IconButton
                        onClick={handleOpenEditDialog}
                        disabled={props.selection.checkedIds.length === 0}>
                        <EditIcon />
                    </IconButton>
                    { /* 削除ボタン */}
                    <IconButton
                        onClick={handleDeleteChecked}
                        disabled={props.selection.checkedIds.length === 0}
                    >
                        <DeleteIcon />
                    </IconButton>
                </>
            }

        </Stack>

    )
}