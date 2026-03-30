import type { Result } from "@/shared/result"
import type { MissionRepository } from "@/domain/mission/repository/MissionRepository"
import type { ReviewEventRepository } from "@/domain/review/repository/ReviewEventRepository"
import { Problem, type ProblemDTO } from "@/domain/problem/entity/Problem"
import type { ReviewEventLog } from "@/domain/review/ReviewEvent"
import type { Mission } from "@/domain/mission/entity/Mission"
import type { ProblemRepository } from "@/domain/problem/repository/ProblemRepository"
import { useMissionStore } from "@/ui/mission/hooks/useMissionStore"
import { useProblemStore } from "@/ui/store/useProblemStore"

export type BackupResult = Result<BackupResultOk, BackupRestoreError>

type ResultCount = {
    problemCount: number
    learningCount: number
    missionCount: number
}
export type BackupResultOk = {
    filename: string
} & ResultCount

export type RestoreResultOk = ResultCount
export type BackupRestoreError =
    | { code: "file-io-error" }
    | { code: "invalid-format" }
    | { code: "parse-failed"; cause?: unknown }
    | { code: "persist-failed"; cause?: unknown }

export type RestoreResult = Result<RestoreResultOk, BackupRestoreError>
///////////////////////////
export interface BackupRestoreUsecase {
    backup(): Promise<BackupResult>
    restore(data: BackupData): Promise<RestoreResult>
}

export type BackupData = {
    problems: ProblemDTO[]
    reviewEvents: ReviewEventLog
    missions: Mission[]
}

export function useBackupRestoreUsecase(
    problemRepo: ProblemRepository,
    reviewRepo: ReviewEventRepository,
    missionRepo: MissionRepository,
    writer: BackupWriter,
): BackupRestoreUsecase { 
    const reloadProblems = useProblemStore(s=>s.reload)
    const reloadMissions = useMissionStore(s=>s.reload)
    // TODO: error check
    return {
        async backup(): Promise<BackupResult> {
            const filename = `kif-backup-${Date.now()}.json`

            let problems: Problem[]
            let learnings: ReviewEventLog
            let missions: Mission[]
            let backupData: BackupData
            let json: string

            try {
                problems = await problemRepo.load()
                learnings = await reviewRepo.load()
                missions = await missionRepo.findAll()
            } catch (e) {
                if (e instanceof Error) {
                    console.error(e.message)
                } else {
                    console.error(String(e))
                }
                return { ok: false, error: { code: `persist-failed` } }
            }

            try {
                backupData = {
                    problems: problems.map(p => p.toDTO()),
                    reviewEvents: learnings,
                    missions: missions,
                }
                json = JSON.stringify(backupData, null, 2)
            } catch (e) {
                return { ok: false, error: { code: "parse-failed" } }
            }
            try {

                await writer.write(json, filename)
            } catch (e) {
                return { ok: false, error: { code: "file-io-error" } }
            }
            return {
                ok: true,
                value: {
                    filename: filename,
                    problemCount: problems.length,
                    learningCount: learnings.length,
                    missionCount: missions.length,
                }
            }
        },

        async restore(backupData: BackupData): Promise<RestoreResult> {
            console.log("restore", backupData.missions)
            let problems: Problem[]
            try {
                problems = backupData.problems.map(dto => Problem.fromDTO(dto))
            } catch (e) {
                            if (e instanceof Error) {
                    console.error(e.message)
                } else {
                    console.error(String(e))
                }
                return { ok: false, error: { code: "parse-failed" } }
            }
            try {
                await problemRepo.replaceAll(problems)
                await reviewRepo.replaceAll(backupData.reviewEvents)
                await missionRepo.replaceAll(backupData.missions)
            } catch (e) {
                return { ok: false, error: { code: "persist-failed" } }
            }

            reloadProblems()
            reloadMissions()       

            return {
                ok: true,
                value: {
                    problemCount: backupData.problems.length,
                    learningCount: backupData.reviewEvents.length,
                    missionCount: backupData.missions.length,
                },
            }

        }
    }
}

export interface BackupWriter {
    write(data: string, fileName: string): Promise<void>
    //revoke?(fileUrl: string): void
}

