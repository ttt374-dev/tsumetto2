import type { LearningEvent, LearningEventLog } from "@/domain/LearningEvent";
import type { LearningEventRepository } from "@/domain/LearningEvent/LearningEventRepository";
import { useEffect, useRef, useState } from "react";
import type { ProblemId } from "@/domain/problem/Problem";

export function useLearningEventStore(repository: LearningEventRepository){
    const [eventLog, setEventLog] = useState<LearningEventLog>([])

    const reload = async () => {
        try {
            const data: LearningEventLog = await repository.load();
            //console.log("event store reload", data)
            setEventLog(data)
            //setSnapshot(projectLearning(data))
        } catch {
            setEventLog([])
            //setSnapshot({})
        }
    };
    useEffect(() => {
        reload()
    }, [repository])

    useEffect(() => {
        //console.log("setsnapshot on effect", eventLog)
        //setSnapshot(projectLearning(eventLog))
    }, [eventLog])

    const appendQueue = useRef<LearningEvent[]>([]);

    const append = async (learningEvent: Omit<LearningEvent, "at">) => {
        const event = {...learningEvent, at: Date.now()}
        appendQueue.current.push(event);
        if (appendQueue.current.length > 1) return; // 既に処理中

        while (appendQueue.current.length) {
            const e = appendQueue.current[0];
            setEventLog(prev => [...prev, e])
            await repository.append(e);
            appendQueue.current.shift();
        }
    }
    // commnad
    const deleteAll = async () => {
        await repository.removeAll()
        await reload()
    }
    const deleteByProblemIds = async (ids: ProblemId[]) => {
        const idSet = new Set(ids)
        const newLog = eventLog.filter(e => !idSet.has(e.problemId))

        setEventLog(newLog)
        await repository.replaceAll(newLog)
    }

    return {
        eventLog, 
        //records: snapshot,
        reload, 
        
        append, deleteAll, deleteByProblemIds,
    }
}