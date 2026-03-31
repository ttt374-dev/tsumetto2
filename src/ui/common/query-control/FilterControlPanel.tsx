import { Grid, TextField } from "@mui/material";

import { MateLengthFilterControl } from "./MateLengthFilterControl";
import { TagCheckboxFilterControl } from "./TagCheckboxFilterControl";
import { BooleanFilterControl } from "./BooleanFilterControl";
import { ProblemTypeFilterControl } from "./ProblemTypeFilterControl";
import { SourceFilterControl } from "./SourceFilterControl";
import type { useProblemsQuery } from "@/ui/common/hooks/useProblemsQuery";

export const UNSPECIFIED = "__UNSPECIFIED__";

type Props = {
  query: ReturnType<typeof useProblemsQuery>
  allSources: string[]
}
export function FilterControlPanel({query, allSources}: Props){
    return (
        <Grid container spacing={2}>
            <Grid size={12}>
                <TextField label="タイトル名" value={query.state.text} onChange={(e) => {
                    const value = e.target.value
                    query.setText(value)
                }} fullWidth />
            </Grid>

            <Grid size={6}>
                <ProblemTypeFilterControl 
                    problemType={query.state.problemType} 
                    onChange={type => query.setProblemType(type)}/>
            </Grid>

            <Grid size={6}>
                <SourceFilterControl source={query.state.source} onChange={s=>query.setSource(s)} sources={allSources}/>
            </Grid>

            <Grid size={6}>
                <BooleanFilterControl
                    queryState={query.state}
                    onToggleFilter={k => query.toggleFlag(k)}
                />
            </Grid>

            <Grid size={6}>
                <MateLengthFilterControl
                    mateBuckets={query.state.mateBuckets}
                    onChange={(buckets) => {
                        query.setMateBuckets(buckets)
                        //addFilter({ mateBuckets: buckets })
                    }}
                />
            </Grid>
            <Grid size={12}>
                <TagCheckboxFilterControl
                    selectedTags={query.state.tags ?? []}
                    onChange={(tags => query.setTags(tags))}
                />
            </Grid>
        </Grid>
    )
}