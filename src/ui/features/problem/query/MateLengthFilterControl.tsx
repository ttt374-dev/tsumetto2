import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Paper, } from "@mui/material"

import type { MateBucket } from "@/domain/problem/service/query/QueryState"

type Props = {
    mateBuckets: MateBucket[] | undefined
    onChange: (next: MateBucket[]) => void
}

const BUCKET_LABELS: Record<MateBucket, string> = {
    lte3: "～3手",
    eq5: "5手",
    eq7: "7手",
    gte9: "9手～",
}

export function MateLengthFilterControl({ mateBuckets = [], onChange }: Props) {
    const toggle = (bucket: MateBucket) => {
        if (mateBuckets.includes(bucket)) {
            onChange(mateBuckets.filter(b => b !== bucket))
        } else {
            onChange([...mateBuckets, bucket])
        }
    }
    return (
        <FormControl fullWidth>
            <FormLabel>詰み手数</FormLabel>
            <Paper variant="outlined" sx={{ p: 1.5 }}>
                <FormGroup row>
                    {(Object.keys(BUCKET_LABELS) as MateBucket[]).map(bucket => (
                        <FormControlLabel
                            key={bucket}
                            control={
                                <Checkbox
                                    checked={mateBuckets.includes(bucket)}
                                    onChange={() => toggle(bucket)}
                                />
                            }
                            label={BUCKET_LABELS[bucket]}
                        />
                    ))}
                </FormGroup>
                
            </Paper>
        </FormControl>
    )   
}