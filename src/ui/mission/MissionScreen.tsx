import { useExercise } from "@/application/useExercise";
import { AppLayout } from "../common/AppLayout";
import { useQuery } from "@/application/useQuery";
import { applyQuery } from "@/domain/Exercise/query/applyQuery";
import { useEffect, useState } from "react";
import { DashboardScreen } from "../dashboard/DashboardScreen";
import { PlayerScreen } from "../player/PlayerScreen";
import { useNavigate } from "react-router-dom";
import type { AnswerEntry, AnswerResult } from "@/application/missionFsm/MissionFsm";
import { SummaryScreen } from "../summary/SummaryScreen";

type MissionPhase = "idle" | "playing" | "summary"

export function MissionScreen() {
    const { exerciseList, markAnswer } = useExercise()
    const query = useQuery()
    useEffect(() => {
        query.setFilter("isMissionTarget", true)
        console.log("toggle filter", query.filterState)
    }, [])

    const queuedExerciseList = applyQuery(exerciseList, query.sortState, query.filterState)
    // UI state
    const [index, setIndex] = useState(0)
    const [phase, setPhase] = useState<MissionPhase>("idle")
    const [answerEntries, setAnswerEntries] = useState<AnswerEntry[]>([])
    
    // tools
    const navigate = useNavigate()

    // handler
    const handleStart = () => {
        setPhase("playing")
    }
    
    switch (phase) {
        case "idle":
            return (<DashboardScreen
                queuedExerciseList={queuedExerciseList}
                filterState={query.filterState}
                onStart={handleStart}
                onToggleFilter={query.toggleFilter}
            />
            )
        case "playing":
            const exercise = queuedExerciseList[index]
            //console.log("playing", exercise, index, queuedExerciseList.length)
            const handleNext = () => {
                if (index === queuedExerciseList.length - 1) {
                    setPhase("summary")
                } else {
                    setIndex(index + 1)
                }
            }
            const handlePrev = () => {
                setIndex(Math.max(0, index - 1))
            }
            const handleAnswer = (answerResult: AnswerResult, secToTaken?: number) => {
                markAnswer(exercise, answerResult, secToTaken)
                const answerEntry: AnswerEntry = {
                    problemId: exercise.problem.id,
                    answerResult: answerResult,
                }
                setAnswerEntries(prev => [...prev, answerEntry])
                handleNext()
                console.log("answer entries", answerEntries)
            }
            if (!exercise){
                return (<>NO EXERCISE DATA</>)
            }
            return (
                <PlayerScreen
                    problem={exercise.problem}
                    learning={exercise.learning}
                    onNext={handleNext}
                    onPrev={handlePrev}
                    onAnswer={handleAnswer}
                />
            )
        case "summary":
            console.log("summary", answerEntries)
            return (
                <SummaryScreen
                    answerEntries={answerEntries}
                    onNavigateToDashboard={() => { navigate("/")}}
                />
            )
    }

}