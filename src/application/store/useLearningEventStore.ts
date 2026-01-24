import type { LearningEvent, LearningEventLog } from "@/domain/EventLog/EventLog";
import type { LearningEventRepository } from "@/domain/EventLog/LearningEventRepository";
import type { LearningRecord } from "@/domain/learning/Learning";
import { useState } from "react";
import { projectLearning } from "../projectionLearning";


export function createLearningEventStore(repository: LearningEventRepository){
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