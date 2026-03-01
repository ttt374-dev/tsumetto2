import { useEffect, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";

type BaseOption = {
  id: string | number;
  label: string;
};

type Props<T extends BaseOption> = {
  value: T | null;
  options: T[];
  label: string;
  onChange: (value: T | null) => void;
  onCreate: (label: string) => T;
};

export function FreeSoloAutocomplete<T extends BaseOption>({
  value,
  options,
  label,
  onChange,
  onCreate,
}: Props<T>) {
  const [inputValue, setInputValue] = useState("");

  // 外部valueと同期
  useEffect(() => {
    setInputValue(value?.label ?? "");
  }, [value]);

  return (
    <Autocomplete
      freeSolo
      options={options}
      value={value}
      inputValue={inputValue}
      onInputChange={(_, newInputValue) => {
        setInputValue(newInputValue);
      }}
      onChange={(_, newValue) => {
        if (typeof newValue === "string") {
          const trimmed = newValue.trim();

          if (!trimmed) {
            onChange(null);
            return;
          }

          // 既存一致チェック
          const existing = options.find(
            (o) => o.label === trimmed
          );

          if (existing) {
            onChange(existing);
          } else {
            const created = onCreate(trimmed);
            onChange(created);
          }
        } else {
          onChange(newValue);
        }
      }}
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.label
      }
      isOptionEqualToValue={(a, b) => a.id === b.id}
      renderInput={(params) => (
        <TextField {...params} label={label} size="small" />
      )}
      fullWidth
    />
  );
}