// backupRestoreUsecase.ts

import type { Result } from "@/shared/result"
import type { MissionRepository } from "@/domain/mission/repository/MissionRepository"
import type { LearningEventRepository } from "@/domain/learning/repository/LearningEventRepository"
import { Problem, type ProblemDTO } from "@/domain/problem/entity/Problem"
import type { LearningEventLog } from "@/domain/learning/entity/LearningEvent"
import type { Mission } from "@/domain/mission/entity/Mission"
import type { ProblemRepository } from "@/domain/problem/repository/ProblemRepository"
import { useMissionStore } from "@/ui/store/useMissionStore"
import { useProblemStore } from "@/ui/store/useProblemStore"

export type BackupResult = Result<BackupResultOk, BackupRestoreError>

type ResultCount = {
    problemCount: number
    learningCount: number
    deckCount: number
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
    learningEvents: LearningEventLog
    decks: Mission[]
}

export function useBackupRestoreUsecase(
    problemRepo: ProblemRepository,
    learningRepo: LearningEventRepository,
    deckRepo: MissionRepository,
    writer: BackupWriter,
): BackupRestoreUsecase { 
    const reloadProblems = useProblemStore(s=>s.reload)
    const reloadDecks = useMissionStore(s=>s.loadDecks)
    // TODO: error check
    return {
        async backup(): Promise<BackupResult> {
            const filename = `kif-backup-${Date.now()}.json`

            let problems: Problem[]
            let learnings: LearningEventLog
            let decks: Mission[]
            let backupData: BackupData
            let json: string

            try {
                problems = await problemRepo.load()
                learnings = await learningRepo.load()
                decks = await deckRepo.findAll()
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
                    learningEvents: learnings,
                    decks: decks,
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
                    deckCount: decks.length,
                }
            }
        },

        async restore(backupData: BackupData): Promise<RestoreResult> {
            console.log("restore", backupData.decks)
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
                await learningRepo.replaceAll(backupData.learningEvents)
                await deckRepo.replaceAll(backupData.decks)
            } catch (e) {
                return { ok: false, error: { code: "persist-failed" } }
            }

            reloadProblems()
            reloadDecks()       

            return {
                ok: true,
                value: {
                    problemCount: backupData.problems.length,
                    learningCount: backupData.learningEvents.length,
                    deckCount: backupData.decks.length,
                },
            }

        }
    }
}

export interface BackupWriter {
    write(data: string, fileName: string): Promise<void>
    //revoke?(fileUrl: string): void
}

