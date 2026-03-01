import { Box, Button, IconButton, Stack, TextField } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react"


type Props = {
    value: string;
    onCommit: (value: string) => void;
    label?: string;
};

export function CancelableTextField({
    value,
    onCommit,
    label,
}: Props) {
    const [draft, setDraft] = useState(value ?? "");
    const [editing, setEditing] = useState(false);

    // 親のvalueが変わったら同期
    useEffect(() => {
        if (!editing) {
            setDraft(value ?? "");
        }
    }, [value, editing]);

    const handleCommit = () => {
        if (draft !== value) {
            onCommit(draft);
        }
        setEditing(false);
    };

    const handleCancel = () => {
        setDraft(value ?? "");
        setEditing(false);
    };

    return (
        <Box display="flex" alignItems="center" gap={1}>
            <TextField
                label={label}
                value={draft ?? ""}
                onFocus={() => setEditing(true)}
                onChange={(e) => setDraft(e.target.value)}
                onBlur={handleCommit}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleCommit();
                    }
                    if (e.key === "Escape") {
                        handleCancel();
                    }
                }}
                fullWidth
            />

            {editing && (
                <IconButton
                    size="small"
                    onMouseDown={(e) => e.preventDefault()} // blur暴発防止
                    onClick={handleCancel}
                >
                    <CloseIcon />
                </IconButton>
            )}
        </Box>
    );
}