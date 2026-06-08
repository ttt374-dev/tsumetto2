import type { MissionRepository } from "@/domain/mission/repository/MissionRepository"
import type { ReviewEventRepository } from "@/domain/review/repository/ReviewEventRepository"
import { Problem, type ProblemDTO } from "@/domain/problem/entity/Problem"
import type { ReviewEvent, ReviewEventLog } from "@/domain/review/types/ReviewEvent"
import type { Mission } from "@/domain/mission/entity/Mission"
import type { ProblemRepository } from "@/domain/problem/repository/ProblemRepository"
import { autobackupFileWriter, manualBackupWriter, type BackupWriter } from "@/infrastructure/backup/BackupWriter"

//export type BackupRestoreResult = Result<BackupResotreResultOk, BackupRestoreError>
export type BackupRestoreResult =
    | { 
        ok: true,
        value: {
            count: BackupRestoreCount
        }
    }
    | {
        ok: false,
        error: BackupRestoreError
    }

export type BackupRestoreCount = {
    problem: number
    reviewEvent: number
    mission: number
}

export type BackupRestoreError =
    | { code: "file-io-error" }
    | { code: "invalid-format" }
    | { code: "parse-failed"; cause?: unknown }
    | { code: "persist-failed"; cause?: unknown }

///////////////////////////
export interface BackupRestoreUsecase {
    manualBackup(): Promise<BackupRestoreResult>
    autoBackup(): Promise<BackupRestoreResult>
    restore(data: BackupData): Promise<BackupRestoreResult>
}

export type BackupData = {
    problems: ProblemDTO[]
    reviewEvents: ReviewEventLog
    missions: Mission[]
}

export type BackupDeps = {
    problem: ProblemRepository
    reviewEvent: ReviewEventRepository
    mission: MissionRepository
}
export const autobackupFilename = "kif-autobackup.json"

export function createBackupRestoreUsecase(deps: BackupDeps): BackupRestoreUsecase {

    const createBackupJson = async (): Promise<{
        json: string
        counts: BackupRestoreCount
    }> => {

        const problems = await deps.problem.findAll()
        const reviewEvents = await deps.reviewEvent.findAll()
        const missions = await deps.mission.findAll()

        const backupData: BackupData = {
            problems: problems.map(p => p.toDTO()),
            reviewEvents,
            missions,
        }

        return {
            json: JSON.stringify(backupData, null, 2),
            counts: {
                problem: problems.length,
                reviewEvent: reviewEvents.length,
                mission: missions.length,
            }
        }
    }
    const backup = async (writer: BackupWriter, filename: string): Promise<BackupRestoreResult> => {        
        try {
            const { json, counts } = await createBackupJson()
            await writer.write(json, filename)
            return {
                ok: true,
                value: {
                    count: counts,
                }
            }
        } catch (e) {
            return { ok: false, error: { code: "file-io-error" } }
        }

    }
    const manualBackup = async () => {        
        return await backup(manualBackupWriter, `kif-backup-${Date.now()}.json`)
    }
    const autoBackup = async () => {
        return await backup(autobackupFileWriter, autobackupFilename)
    }
    const restore = async (backupData: BackupData): Promise<BackupRestoreResult> => {
        //console.log("restore", backupData.missions)
        let problems: Problem[]
        try {
            problems = backupData.problems.map(dto => Problem.fromDTO(dto))
            //console.log("restore", problems)
        } catch (e) {
            //console.log("restore error", e)
            if (e instanceof Error) {
                console.error(e.message)
            } else {
                console.error(String(e))
            }
            return { ok: false, error: { code: "parse-failed" } }
        }
        try {
            //const activeProblems = problems.filter(p=>!p.deletedAt)
            await deps.problem.replaceAll(problems)
            await deps.reviewEvent.replaceAll(backupData.reviewEvents)
            await deps.mission.replaceAll(backupData.missions)
        } catch (e) {
            return { ok: false, error: { code: "persist-failed" } }
        }

        return {
            ok: true,
            value: {
                count: {
                    problem: backupData.problems.length,
                    reviewEvent: backupData.reviewEvents.length,
                    mission: backupData.missions.length,
                }
            },
        }

    }
    ////////////////////
    return {
        manualBackup, autoBackup, restore,
    }
}
