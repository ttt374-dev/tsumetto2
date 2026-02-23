import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import type { LearningEvent, LearningEventLog } from "../entity/LearningEvent";

export class LearningEventRepository {
    constructor(
        //private readonly loadLog: () => Promise<LearningEventLog>,
        //private readonly saveLog: (log: LearningEventLog) => Promise<void>,
        private readonly store: LearningEventPersistence
    ) { }
    static create(store: LearningEventPersistence){
        return new LearningEventRepository(store)
    }
    async load(){ return this.store.load()}
    //async save(data: LearningEventLog){ this.store.save(data)}

    async append(event: LearningEvent) {
        const log = await this.store.load()
        const nextLog = [...log, event]

        //console.log("learning event repo append", newEvent)
        await this.store.save(nextLog)
    }
    async removeAll(){
        await this.store.save([])
    }
    async replaceAll(events: LearningEventLog) {
        await this.store.save(events)
    }    

}
////////////////////////////////////
const LEARNING_EVENT_LOG_FILE = "learning_event_log.json";

export interface LearningEventPersistence {
    load(): Promise<LearningEvent[]>
    save(events: LearningEvent[]): Promise<void>
}

export class LocalStorageLearningEventPersistence implements LearningEventPersistence {
    async load(): Promise<LearningEvent[]> {
        try {
            const result = await Filesystem.readFile({
                path: LEARNING_EVENT_LOG_FILE,
                directory: Directory.Data,
                encoding: Encoding.UTF8,
            });
            const dataStr =
                typeof result.data === "string"
                    ? result.data
                    : await result.data.text()
            const data: LearningEvent[] = JSON.parse(dataStr)
            
            return data

        } catch (e) {
            console.error("learning event store load error", e)
            return [];
            //throw e
        }
    }

    async save(events: LearningEvent[]): Promise<void> {
        try {
            await Filesystem.writeFile({
                path: LEARNING_EVENT_LOG_FILE,
                data: JSON.stringify(events),
                directory: Directory.Data,
                encoding: Encoding.UTF8,
            });
            //console.log("learning events store saved", events)
        } catch (e){
            console.error("learning event store write error", e)
            throw e
        }
    }
}
