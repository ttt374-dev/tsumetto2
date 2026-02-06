// backupRestoreUsecase.ts

import type { LearningRecord } from "@/domain/learning/Learning"
import type { LearningEventLog } from "@/domain/LearningEvent"
import type { LearningEventRepository } from "@/domain/LearningEvent/LearningEventRepository"
import { Problem, type ProblemDTO } from "@/domain/problem/Problem"
import type { ProblemRepository } from "@/domain/problem/ProblemRepository"

export type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E}

export type BackupResult = Result<BackupResultOk, BackupRestoreError>
export type BackupResultOk = {
  filename: string
  problemCount: number
  learningCount: number
}

export type RestoreResultOk = {
    problemCount: number
  learningCount: number
}
export type BackupRestoreError =
| { code: "file-io-error", message?: string}
  | { code: "invalid-format" }
  | { code: "parse-failed"; cause?: unknown }
  | { code: "persist-failed"; cause?: unknown }

export type RestoreResult = Result<RestoreResultOk, BackupRestoreError>
///////////////////////////
export interface BackupRestoreUsecase {
    backup(): Promise<BackupResult> // TODO
    restore(data: BackupData): Promise<RestoreResult>
}

export type BackupData = {
    problem: ProblemDTO[]
    learning: LearningEventLog
}

export function createBackupRestoreUsecase(
    problemRepo: ProblemRepository,
    learningRepo: LearningEventRepository,
    writer: BackupWriter,
): BackupRestoreUsecase {
    // TODO: error check
    return {
        async backup(): Promise<BackupResult> {
            const filename = `kif-backup-${Date.now()}.json`

            let problems: Problem[]
            let learnings: LearningEventLog
            let backupData: BackupData
            let json: string
            
            try {
                problems = await problemRepo.load()
                learnings = await learningRepo.load()
            } catch (e){
                return { ok: false, error: { code: "persist-failed"}}
            }

            try {
                backupData = {
                    problem: problems.map(p => p.toDTO()),
                    learning: learnings,
                }
                json = JSON.stringify(backupData, null, 2)
            } catch (e) {
                return { ok: false, error: { code: "parse-failed"}}
            }            
            try {
                
                await writer.write(json, filename)
            } catch (e) {
                return { ok: false, error: { code: "file-io-error"} }
            }
            return {
                ok: true,
                value: { 
                    filename: filename, 
                    problemCount: problems.length,
                    learningCount: learnings.length,
                }
            }
        },

        async restore(backupData: BackupData): Promise<RestoreResult> {            
            if (!backupData.problem || !backupData.learning) {
                    return { ok: false, error: { code: "invalid-format"} }
            }
            let problems: Problem[]
            try {
                problems = backupData.problem.map(dto => Problem.fromDTO(dto))
            } catch (e){
                return { ok: false, error: { code: "parse-failed"}}
            }
            try {
                await problemRepo.replaceAll(problems)
                await learningRepo.replaceAll(backupData.learning)
            } catch (e){
                return { ok: false, error: { code: "persist-failed"}}
            }

            return {
                ok: true,
                value: {
                    problemCount: backupData.problem.length,
                    learningCount: backupData.learning.length,
                },
            }

        }
    }
}

export interface BackupWriter {
    write(data: string, fileName: string): Promise<void>
    //revoke?(fileUrl: string): void
}