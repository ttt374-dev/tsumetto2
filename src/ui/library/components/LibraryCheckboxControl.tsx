import SelectAllIcon from "@mui/icons-material/SelectAll";
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { IconButton, Stack, TextField } from '@mui/material';
import type { ProblemId } from "@/domain/problem/entity/Problem";
import type { LibraryItemActions } from "./LibraryView";
import type { LibraryActionMode } from "../hooks/useLibraryViewModel";

export function LibraryCheckboxControl({ onCheckAll, onUncheckAll,
    onChangeActionMode, actionMode, itemActions, checkedIds,
}: {
    onCheckAll: () => void,
    onUncheckAll: () => void,
    checkedIds: ProblemId[],
    actionMode: LibraryActionMode,
    itemActions: LibraryItemActions,
    onChangeActionMode: (mode: LibraryActionMode) => void
}) {
    const confirmFn = () => window.confirm("Are you sure to delete selected?")
    const handleOpenTagEditDialog = () => itemActions.openTagEditDialog(checkedIds)
    const handleDeleteChecked = () => {
        if (!confirmFn()) return
        itemActions.deleteChecked()
    }

    return (
        <Stack direction="row">
            {actionMode !== "selection" &&
                <IconButton
                    value="selection"
                    onClick={() => onChangeActionMode("selection")}                    >
                    <SelectAllIcon />
                </IconButton>
            }

            {actionMode === "selection" &&
                <>
                    { /* --- 全選択 --- */}
                    <IconButton
                        onClick={onCheckAll}
                        color="primary">
                        <CheckBoxIcon />
                    </IconButton>
                    <IconButton
                        onClick={onUncheckAll}
                        color="primary">
                        <CheckBoxOutlineBlankIcon />
                    </IconButton>
                    <IconButton
                        onClick={() => onChangeActionMode("view")}
                        color="primary">
                        <CloseIcon />
                    </IconButton>

                    { /* 削除ボタン */}
                    <IconButton
                        onClick={handleDeleteChecked}
                        disabled={checkedIds.length === 0}
                    >
                        <DeleteIcon />
                    </IconButton>
                    { /* タグ編集 */}
                    <IconButton
                        onClick={handleOpenTagEditDialog}
                        disabled={checkedIds.length === 0}>

                        <EditIcon />
                    </IconButton>
                </>
            }

        </Stack>

    )
}