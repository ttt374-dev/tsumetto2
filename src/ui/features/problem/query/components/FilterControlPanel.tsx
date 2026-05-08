import { Button, Grid, TextField } from "@mui/material";

import { MateLengthFilterControl } from "./MateLengthFilterControl";
import { TagCheckboxFilterControl } from "./TagCheckboxFilterControl";
import { BooleanFilterControl } from "./BooleanFilterControl";
import { ProblemTypeFilterControl } from "./ProblemTypeFilterControl";
import { SourceFilterControl } from "./SourceFilterControl";
import type { ProblemsQuery, useProblemsQuery } from "@/ui/features/problem/hooks/useProblemsQuery";
import { useProblemsQueryStore } from "@/ui/features/problem/hooks/useProblemsQueryStore";

//export const UNSPECIFIED = "__UNSPECIFIED__";

type Props = {
  query: ProblemsQuery
  allSources: string[]
}
export function FilterControlPanel({query, allSources}: Props){
    const reset = useProblemsQueryStore(s=>s.reset)

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
                    onChange={type => query.setProblemType(type)}
                    allowUnspecified={true}
                    />
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
            <Grid size={12}>
                <Button onClick={reset}>
                    リセット
                </Button>
            </Grid>
        </Grid>
    )
}