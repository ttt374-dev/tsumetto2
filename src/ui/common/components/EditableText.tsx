import { useEffect, useRef, useState } from "react"
import { IconButton, Stack, TextField, Typography } from "@mui/material"
import DoneIcon from '@mui/icons-material/Done'
import CloseIcon from '@mui/icons-material/Close'
import EditIcon from '@mui/icons-material/Edit';

type Props = {
    label?: string,
    initialText: string,
    onUpdateText: (title: string) => void
}

export function EditableText({ label = "Text", initialText, onUpdateText }: Props) {
    const [text, setText] = useState(initialText)
    const [editing, setEditing] = useState(false);

    const handleSetText = () => {
        onUpdateText(text.trim())
        setEditing(false)
    }
    const handleEditFinish = () => {
        setText(initialText)
        setEditing(false)
    }
    const inputRef = useRef<HTMLInputElement | null>(null)


    useEffect(() => {
        if (editing) {
            inputRef.current?.focus()
            //inputRef.current?.select() // ついでに全選択（おすすめ）
        }
    }, [editing])
    const handleEdit = () => {
        //setDraft(title); // 現在のタイトルで初期化
        setEditing(true);
    };

    return (
        editing ?
            <Stack direction="row">
                <TextField
                    label={label}
                    placeholder={label}
                    fullWidth
                    value={text}
                    inputRef={inputRef}
                    onChange={(e: any) => setText(e.target.value)}
                />
                <IconButton onClick={handleSetText}>
                    <DoneIcon />
                </IconButton>
                <IconButton onClick={handleEditFinish}>
                    <CloseIcon />
                </IconButton>

            </Stack>
            : (<Stack direction="row" onClick={handleEdit}>
                <Typography flexGrow={1}>{text}</Typography>

                <IconButton onClick={handleEdit}>
                    <EditIcon />
                </IconButton>
            </Stack>
            )
    )
}