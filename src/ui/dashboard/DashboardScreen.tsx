import { buildQueue } from "@/application/missionFsm/useMissionFsm";
import { Box, Button, Checkbox, FormControl, FormControlLabel, List, ListItem } from "@mui/material";
import { useFsmContext } from "../App/providers/fsmProvider";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "../common/AppLayout";
import { Filter } from "@mui/icons-material";
import { DefaultFilterState, type FilterState } from "@/domain/Exercise/query/filter";
import { useEffect, useMemo, useState } from "react";
import { useExercise } from "@/application/useExercise";
import { applyQuery } from "@/domain/Exercise/query/applyQuery";
import { useQuery } from "@/application/useQuery";
import type { SortState } from "@/domain/Exercise/query/sort";
import type { Exercise } from "@/domain/Exercise/Exercise";

function DashboardFilterControl({ filter, onToggleFilter }: {
    filter: FilterState, onToggleFilter: (key: keyof FilterState) => void
}) {

    return (
        <>
            <FormControl>
                <FormControlLabel control={
                    <Checkbox checked={filter.starredOnly}
                        onChange={() => { onToggleFilter("starredOnly") }} />}
                    label="スターのみ" />
                <FormControlLabel control={
                    <Checkbox checked={filter.isMissionTarget}
                        onChange={() => { onToggleFilter("isMissionTarget") }} />}
                    label="ミッションのみ" />
            </FormControl>
        </>
    )
}

export function DashboardScreen(
    {queuedExerciseList, filterState, onStart, onToggleFilter}: {
    queuedExerciseList: Exercise[],
    filterState: FilterState,
    onStart: () => void,
    onToggleFilter: (key: keyof FilterState) => void,
}
) {
    /*
    const navigate = useNavigate()
    const fsm = useFsmContext()

    const { exerciseList } = useExercise()
    const { filterState, toggleFilter, setFilter} = useQuery()

    const queriedItems = useMemo(() => {
        const sortState: SortState = { key: "nextReviewedAt", order: "asc"}
        return applyQuery(exerciseList, sortState, filterState)
    }, [exerciseList, filterState])

    const handleStart = () => {
        fsm.start(buildQueue(queriedItems.map(r => r.problem)))
        navigate("/player")
    }

    useEffect(() => {

        setFilter("isMissionTarget", true)
        console.log("toggle filter", filterState)
    }, [])
    */
    return (
        <AppLayout
            footer={
                <Button onClick={onStart}
                    variant="contained" fullWidth disabled={queuedExerciseList.length === 0}>
                    Start
                </Button>
            }
        >
            <DashboardFilterControl filter={filterState} onToggleFilter={onToggleFilter} />


            <Box>
                {queuedExerciseList.length}
            </Box>

        </AppLayout>
    )
}