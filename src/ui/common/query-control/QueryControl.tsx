import { Grid, MenuItem, Select, TextField } from "@mui/material";
import { MateLengthFilterControl } from "./MateLengthFilterControl";
import { TagCheckboxFilterControl } from "./TagCheckboxFilterControl";
import { FilterControl } from "./FilterControl";
import { useState } from "react";
import type { QueryController } from "../hooks/useQuery";
import type { ProblemType } from "@/domain/problem/entity/Problem";
import { useProblemStore } from "@/ui/store/useProblemStore";


const UNSPECIFIED = "__UNSPECIFIED__";
type ProblemTypeUi = ProblemType | typeof UNSPECIFIED
type SourceUi = string | typeof UNSPECIFIED

export function QueryControl({ query}: {
    query: QueryController
}) {
    const allTags = useProblemStore(s=>s.allTags)
    const allSources = useProblemStore(s=>s.allSources)

    return (
        <Grid container>
            <Grid size={12}>
                <TextField label="タイトル名" value={query.filter.state.text} onChange={(e) => {
                    const value = e.target.value
                    query.filter.addFilter({ text: value })
                }} fullWidth />
            </Grid>

            <Grid size={6}>
                <Select<ProblemTypeUi> value={query.filter.state.problemType ?? UNSPECIFIED} fullWidth
                    onChange={(e) => {
                        const value = e.target.value as ProblemTypeUi
                        query.filter.addFilter({
                            problemType: value === UNSPECIFIED ? undefined : value
                        })
                    }}
                >
                    <MenuItem value={UNSPECIFIED}>（種類指定なし）</MenuItem>
                    <MenuItem key="standard" value="standard">標準</MenuItem>
                    <MenuItem key="realistic" value="realistic">実践</MenuItem>
                    <MenuItem key="hisshi" value="hisshi">必死</MenuItem>
                </Select>
            </Grid>

            <Grid size={6}>
                <Select<SourceUi> value={query.filter.state.source ?? UNSPECIFIED} fullWidth
                    onChange={e => query.filter.addFilter({
                        source: e.target.value === UNSPECIFIED ? undefined : (e.target.value as string),
                    })}
                >
                    <MenuItem value={UNSPECIFIED}>（出典指定なし）</MenuItem>
                    {allSources.map(s => (
                        <MenuItem key={s} value={s}>{s}</MenuItem>
                    ))}
                </Select>
            </Grid>

            <Grid size={6}>
                <FilterControl
                    filter={query.filter.state}
                    onToggleFilter={query.filter.toggleFilter}

                />
            </Grid>

            <Grid size={6}>
                <MateLengthFilterControl
                    mateBuckets={query.filter.state.mateBuckets}
                    onChange={(buckets) => {
                        query.filter.addFilter({ mateBuckets: buckets })
                    }}
                />
            </Grid>
            <Grid size={12}>
                <TagCheckboxFilterControl
                    allTags={allTags} selectedTags={query.filter.state.tags ?? []}
                    onChange={(tags => { query.filter.addFilter({ tags: tags }) })}
                />
            </Grid>

        </Grid>
    )
}