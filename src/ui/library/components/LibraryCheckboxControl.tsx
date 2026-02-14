import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CloseIcon from "@mui/icons-material/Close";
import { IconButton, Stack } from '@mui/material';

export function LibraryCheckboxControl({ onCheckAll, onUncheckAll,
    onToggleCheckboxMode,
}: {
    onCheckAll: () => void,
    onUncheckAll: () => void,
    
    onToggleCheckboxMode: () => void,
}) {
    return (
        <Stack direction="row">

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
                onClick={onToggleCheckboxMode}
                color="primary">
                <CloseIcon />
            </IconButton>


        </Stack>)
}