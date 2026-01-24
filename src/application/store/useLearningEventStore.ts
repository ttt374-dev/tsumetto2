import type { LearningEvent, LearningEventLog } from "@/domain/LearningEvent";
import type { LearningEventRepository } from "@/domain/LearningEvent/LearningEventRepository";
import type { LearningRecord } from "@/domain/learning/Learning";
import { useEffect, useRef, useState } from "react";
import { projectLearning } from "../../domain/learning/projectionLearning";

export function useLearningEventStore(repository: LearningEventRepository){
    const [eventLog, setEventLog] = useState<LearningEventLog>([])
    const [snapshot, setSnapshot] = useState<LearningRecord>({})

    const reload = async () => {
        try {
            const data: LearningEventLog = await repository.load();
            //console.log("event store reload", data)
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

    useEffect(() => {
        //console.log("setsnapshot on effect", eventLog)
        setSnapshot(projectLearning(eventLog))
    }, [eventLog])

    const appendQueue = useRef<LearningEvent[]>([]);

    const append = async (learningEvent: Omit<LearningEvent, "at">) => {
        const event = {...learningEvent, at: Date.now()}
        appendQueue.current.push(event);
        if (appendQueue.current.length > 1) return; // 既に処理中

        while (appendQueue.current.length) {
            const e = appendQueue.current[0];
            setEventLog(prev => [...prev, event])
            await repository.append(e);
            appendQueue.current.shift();
        }
    }

    return {
        eventLog, 
        records: snapshot,

        reload, append
    }
}