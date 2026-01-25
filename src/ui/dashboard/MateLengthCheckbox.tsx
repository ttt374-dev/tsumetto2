import type { MateBucket } from "@/domain/problem/query/filter"
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox,} from "@mui/material"

type Props = {
  mateBuckets: MateBucket[] | undefined
  onChange: (next: MateBucket[]) => void
}

const BUCKET_LABELS: Record<MateBucket, string> = {
  lte3: "3手以下",
  eq5: "5手",
  eq7: "7手",
  gte9: "9手以上",
}

export function MateLengthCheckboxes({ mateBuckets = [], onChange }: Props) {
  const toggle = (bucket: MateBucket) => {
    if (mateBuckets.includes(bucket)) {
      onChange(mateBuckets.filter(b => b !== bucket))
    } else {
      onChange([...mateBuckets, bucket])
    }
  }

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">詰み手数</FormLabel>
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
    </FormControl>
  )
}