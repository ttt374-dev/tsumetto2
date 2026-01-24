import type { LearningEvent, LearningEventLog } from "@/domain/LearningEvent";
import type { LearningEventRepository } from "@/domain/LearningEvent/LearningEventRepository";
import type { LearningRecord } from "@/domain/learning/Learning";
import { useEffect, useState } from "react";
import { projectLearning } from "../projectionLearning";


export function useLearningEventStore(repository: LearningEventRepository){
    const [eventLog, setEventLog] = useState<LearningEventLog>([])
    const [snapshot, setSnapshot] = useState<LearningRecord>({})

    const reload = async () => {
        try {
            const data: LearningEventLog = await repository.load();
            setEventLog(data)
            setSnapshot(projectLearning(data))
        } catch {
            setEventLog([])
            setSnapshot({})
        }
    };
    useEffect(() => {
        reload()
    }, [repository])


    const append = (learningEvent: LearningEvent) => {
        setEventLog(prev => {
            const next = [...prev, learningEvent]
            setSnapshot(projectLearning(next))
            return next
        })
        repository.append(learningEvent)
    }

    return {
        eventLog, 
        records: snapshot,

        reload, append
    }
}