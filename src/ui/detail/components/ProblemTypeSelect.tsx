import { Divider, FormControl, IconButton, InputLabel, MenuItem, Paper, Select, Stack, TextField } from '@mui/material';
import { type ProblemId, type ProblemType } from "@/domain/problem/entity/Problem";

export const problemTypeOptions = [
    { value: "standard", label: "正規（駒あまりなし）" },
    { value: "realistic", label: "実戦型（駒あまり許容）" },
    { value: "hisshi", label: "必死（受けなし）" },
] as const;

export function ProblemTypeSelect({ value, onChange }: {
    value: ProblemType;
    onChange: (value: ProblemType) => void;
}) {
    return (
        <FormControl fullWidth size="small">
            <InputLabel>タイプ</InputLabel>
            <Select
                value={value}
                label="タイプ"
                onChange={(e) =>
                    onChange(e.target.value as ProblemType)
                }
            >
                <MenuItem value="standard">
                    標準（駒あまりなし）
                </MenuItem>
                <MenuItem value="realistic">
                    実戦型（駒あまり許容）
                </MenuItem>
                <MenuItem value="hisshi">
                    必死（受けなし）
                </MenuItem>
                <MenuItem value="tesuji">
                    手筋（王手に限定せず）
                </MenuItem>
            </Select>
        </FormControl>
    );
}