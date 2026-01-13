import { buildQueue } from "@/application/useFsm";
import { Box, Button, Checkbox, FormControl, FormControlLabel, List, ListItem } from "@mui/material";
import { useStoreContext } from "../App/providers/StoreProvider";
import { useFsmContext } from "../App/providers/fsmPRovider";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "../common/AppLayout";
import { Filter } from "@mui/icons-material";
import { DefaultFilterState, type FilterState } from "@/domain/missionItem/query/filter";
import { useEffect, useMemo, useState } from "react";
import { useMissionItem } from "@/application/useMissionItem";
import { applyQuery } from "@/domain/missionItem/query/applyQuery";
import { useQuery } from "@/application/useQuery";

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

export function DashboardScreen() {
    const navigate = useNavigate()
    const fsm = useFsmContext()

    const { missionItems } = useMissionItem()
    const { sortState, filterState, toggleFilter, setFilter} = useQuery()

    const queriedItems = useMemo(() => {
        return applyQuery(missionItems, sortState, filterState)
    }, [missionItems, sortState, filterState])

    const handleStart = () => {
        fsm.start(buildQueue(queriedItems.map(r => r.problem)))
        navigate("/player")
    }

    useEffect(() => {

        setFilter("isMissionTarget", true)
        console.log("toggle filter", filterState)
    }, [])
    return (
        <AppLayout
            footer={
                <Button onClick={handleStart}
                    variant="contained" fullWidth disabled={queriedItems.length === 0}>
                    Start
                </Button>
            }
        >
            <DashboardFilterControl filter={filterState} onToggleFilter={toggleFilter} />


            <Box>
                {queriedItems.length}
            </Box>

        </AppLayout>
    )
}