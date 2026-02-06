// backupRestoreUsecase.ts

import type { LearningRecord } from "@/domain/learning/Learning"
import type { LearningEventLog } from "@/domain/LearningEvent"
import type { LearningEventRepository } from "@/domain/LearningEvent/LearningEventRepository"
import { Problem, type ProblemDTO } from "@/domain/problem/Problem"
import type { ProblemRepository } from "@/domain/problem/ProblemRepository"

export interface BackupRestoreUsecase {
    backup(): Promise<BackupRestoreResult> // TODO
    restore(data: BackupData): Promise<BackupRestoreResult>
}

export type BackupData = {
    problem: ProblemDTO[]
    learning: LearningEventLog
}

export type BackupRestoreResult = {
    count: { problem: number, learning: number },
    filename?: string,
}

export function createBackupRestoreUsecase(
    problemRepo: ProblemRepository,
    learningRepo: LearningEventRepository,
    writer: BackupWriter,
): BackupRestoreUsecase {
    // TODO: error check
    return {
        async backup(): Promise<BackupRestoreResult> {
            const problems = await problemRepo.load()
            const backupData: BackupData = {
                problem: problems.map(p => p.toDTO()),
                learning: await learningRepo.load(),
            }
            const json = JSON.stringify(backupData, null, 2)
            console.log("backup", json)
            const filename = `kif-backup-${Date.now()}.json`
            try {
                await writer.write(json, filename)
            } catch (e) {
                const message = e instanceof Error ? e.message : `Backup failed to save: ${filename}`
                console.error(message)
                throw new Error(message)
            }

            return {
                count: {
                    problem: Object.keys(backupData.problem).length,
                    learning: Object.keys(backupData.learning).length
                },
                filename: filename
            }
        },

        async restore(backupData: BackupData): Promise<BackupRestoreResult> {
            if (!backupData.problem) {
                throw new Error("Invalid Backup Data")
            }

            console.log("restore", backupData.problem)
            const problems = backupData.problem.map(dto => Problem.fromDTO(dto))
            console.log("restore", problems)
            await problemRepo.replaceAll(problems)
            await learningRepo.replaceAll(backupData.learning)

            return {
                count: {
                    problem: Object.keys(backupData.problem).length,
                    learning: Object.keys(backupData.learning).length
                },
            }
        }
    }
}

export interface BackupWriter {
    write(data: string, fileName: string): Promise<void>
    //revoke?(fileUrl: string): void
}