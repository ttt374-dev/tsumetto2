import type { LearningEvent, LearningEventLog } from "@/domain/EventLog/EventLog";
import type { LearningEventRepository } from "@/domain/EventLog/LearningEventRepository";
import { useState } from "react";


export function createLearningEventStore(repository: LearningEventRepository){
    const [eventLog, setEventLog] = useState<LearningEventLog>([])

    const reload = async () => {
        try {
            const data = await repository.load();
            setEventLog(data)
        } catch {
            setEventLog([])
        }
    };
    const append = (learningEvent: LearningEvent) => {
        repository.append(learningEvent)
    }

    return {
        eventLog,
        
        reload, append
    }
}