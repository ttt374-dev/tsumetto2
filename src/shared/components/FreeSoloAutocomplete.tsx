import { useEffect, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";

type Props = {
    value: string | null;
    options: string[];
    label: string;
    onChange: (value: string | null) => void;
};

export function FreeSoloAutocomplete({
    value,
    options,
    label,
    onChange,
}: Props) {
    const [inputValue, setInputValue] = useState("");

    // 外部 value と同期
    useEffect(() => {
        setInputValue(value ?? "");
    }, [value]);

    const commit = (raw: string) => {
        const trimmed = raw.trim();
        onChange(trimmed === "" ? null : trimmed);
    };

    return (
        <Autocomplete
            freeSolo
            clearOnBlur={false}
            options={options}
            value={value ?? ""}              // 🔥 null を渡さない
            inputValue={inputValue}
            onInputChange={(_, newInputValue) => {
                setInputValue(newInputValue);
            }}
            onChange={(_, newValue) => {
                commit(newValue ?? "");
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    size="small"
                    onBlur={() => {
                        commit(inputValue);   // 🔥 value ではなく inputValue
                    }}
                />
            )}
            fullWidth
        />
    );
}