import { Grid, TextField } from "@mui/material";

import { MateLengthFilterControl } from "./MateLengthFilterControl";
import { TagCheckboxFilterControl } from "./TagCheckboxFilterControl";
import { FilterControl } from "./FilterControl";
import type { FilterState } from "@/domain/problem/service/query/filter";
import { ProblemTypeFilterControl } from "./ProblemTypeControl";
import { SourceFilterControl } from "./SourceControl";

export const UNSPECIFIED = "__UNSPECIFIED__";


type Props = {
  filter: FilterState
  addFilter: (partial: Partial<FilterState>) => void
  toggleFilter: (key: keyof FilterState) => void
  allSources: string[]
}
export function FilterControlPanel({filter, addFilter, toggleFilter, allSources}: Props){
    return (
        <Grid container>
            <Grid size={12}>
                <TextField label="タイトル名" value={filter.text} onChange={(e) => {
                    const value = e.target.value
                    addFilter({ text: value })
                }} fullWidth />
            </Grid>

            <Grid size={6}>
                <ProblemTypeFilterControl filter={filter} addFilter={addFilter}/>
            </Grid>

            <Grid size={6}>
                <SourceFilterControl filter={filter} addFilter={addFilter} sources={allSources}/>
            </Grid>

            <Grid size={6}>
                <FilterControl
                    filter={filter}
                    onToggleFilter={toggleFilter}
                />
            </Grid>

            <Grid size={6}>
                <MateLengthFilterControl
                    mateBuckets={filter.mateBuckets}
                    onChange={(buckets) => {
                        addFilter({ mateBuckets: buckets })
                    }}
                />
            </Grid>
            <Grid size={12}>
                <TagCheckboxFilterControl
                    selectedTags={filter.tags ?? []}
                    onChange={(tags => { addFilter({ tags: tags }) })}
                />
            </Grid>
        </Grid>
    )
}