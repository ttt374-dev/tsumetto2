import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from '@mui/material';

export function LibraryCheckboxControl({ isCheckboxMode, onCheckAll, onUncheckAll,
    onToggleCheckboxMode,
}: {
    onCheckAll: () => void,
    onUncheckAll: () => void,    

    isCheckboxMode: boolean,
    onToggleCheckboxMode: () => void,
}) {
    return (
        <>
            {isCheckboxMode &&
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
                        onClick={onToggleCheckboxMode}
                        color="primary">
                        <CloseIcon />
                    </IconButton>
                    
                </>
            }
            {
                !isCheckboxMode &&
                <>
                    <IconButton
                        onClick={onToggleCheckboxMode}
                        color="primary">
                        <CheckBoxOutlineBlankIcon />
                    </IconButton>
                </>
            }
        </>)
}