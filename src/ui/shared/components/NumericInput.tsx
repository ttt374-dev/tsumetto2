import { useState, useEffect } from "react"
import { TextField, type TextFieldProps } from "@mui/material"

type NumericInputProps = {
    value: number
    onChange: (value: number) => void
    min?: number
    max?: number
} & Omit<TextFieldProps, "value" | "onChange">

export function NumericInput(props: NumericInputProps) {
    const { value, onChange, min = -Infinity, max = Infinity, ...rest } = props

    const [text, setText] = useState(String(value))

    useEffect(() => {
        setText(String(value))
    }, [value])

    const commit = () => {
        let num = Number(text)

        if (isNaN(num)) num = value
        num = Math.max(min, Math.min(max, num))

        onChange(num)
        setText(String(num))
    }

    const cancel = () => {
        setText(String(value))
    }

    return (
        <TextField
            {...rest}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    e.preventDefault()
                    commit()
                        ; (e.target as HTMLInputElement).blur()
                }
                if (e.key === "Escape") {
                    e.preventDefault()
                    cancel()
                        ; (e.target as HTMLInputElement).blur()
                }
            }}
            inputProps={{ min, max, ...rest.inputProps }}
        />
    )
}