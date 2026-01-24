import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
//import type { LearningRepository } from "../../domain/learning/LearningRepository";
import { Learning, type LearningDTO, type LearningRecord } from "../../domain/learning/Learning";


const LIB_FILE = "Learning.json";

/**
 * Capacitor Filesystem を使った LearningRepository 実装
 */
/*
export class LearningFileRepository implements LearningRepository {
    async load(): Promise<LearningRecord> {
        try {            
            const result = await Filesystem.readFile({
                path: LIB_FILE,
                directory: Directory.Data,
                encoding: Encoding.UTF8,
            });
            const dataStr =
                typeof result.data === "string"
                    ? result.data
                    : await result.data.text()
            const dtos: LearningDTO[] = JSON.parse(dataStr)
            // DTO[] → Record<string, LearningEntry>
            const record: LearningRecord = {};

            for (const dto of dtos) {
                record[dto.problemId] = Learning.fromDTO(dto);
            }

            return record;
        } catch (e) {
            return {};
        }
    }

    async save(learnings: LearningRecord): Promise<void> {
        const dtos: LearningDTO[] = Object.values(learnings)
            .map(entry => entry.toDTO());

        await Filesystem.writeFile({
            path: LIB_FILE,
            data: JSON.stringify(dtos),
            directory: Directory.Data,
            encoding: Encoding.UTF8,
        });
    }
  
  async removeMany(problemIds: string[]): Promise<void> {
    const learnings = await this.load();

    for (const id of problemIds) {
      delete learnings[id];
    }

    await this.save(learnings);
  }

}
*/