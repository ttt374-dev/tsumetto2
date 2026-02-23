import { Problem, type ProblemId } from "@/domain/problem/entity/Problem";
import type { ProblemRepository } from "@/domain/problem/repository/ProblemRepository";

export type DuplicateTitleStrategy = "skip" | "rename" | "overwrite"
export type ImportOptions = {
    tags: string[]
    duplicateTitleStrategy: DuplicateTitleStrategy
}

export type ImportStatus =
  | "imported"   // 正常に追加 or 上書き
  | "skipped"    // 同名などで取り込まなかった
  | "failed"     // 技術的・業務的エラー

export type ImportResult =
  | {
      status: "imported"
      problemId: ProblemId
    }
  | {
      status: "skipped"
      reason: "duplicate-title" | "user-cancelled"
    }
  | {
      status: "failed"
      message: string
    }

export type ImportFilesResult = {
  summary: {
    total: number
    imported: number
    skipped: number
    failed: number
  }
  results: ImportResult[]  // 1ファイルごとの結果
}

//export type ImportResult = 
    //| { ok: true, count: number}
    //| { ok: false, message: string }

abstract class ImportError extends Error {
  abstract readonly code: string
}

async function getExsitingTitle(repo: ProblemRepository): Promise<Set<string>>{
    //const store = useProblemStore(repo)
    const problems = await repo.load()
    return new Set(problems.filter(p=>p.isActive).map(p=>p.title))
}
function resolveTitle(title: string, existing: Set<string>) {
  if (!existing.has(title)) return title
  let i = 1
  while (existing.has(`${title} (${i})`)) i++
  return `${title} (${i})`
}
/////////////////////////////////////////////////
export function useImportProblemsUsecase(problemRepo: ProblemRepository) {    
    const importFile = async (file: File, options: ImportOptions): Promise<ImportResult> => {
        try {
            const buf = await file.arrayBuffer();
            const text = new TextDecoder("shift_jis").decode(buf);    
            const existingTitles = await getExsitingTitle(problemRepo)
            let title = file.name
            if (existingTitles.has(title)){
                switch(options.duplicateTitleStrategy){
                    case "rename":
                        title = resolveTitle(file.name, existingTitles)
                        break;
                    case "skip":
                        console.warn(`skipped by duplicated title: ${title}`)
                        return { status: "skipped", reason: "duplicate-title"}
                        break;
                    case "overwrite":
                        break   // TODO                        
                }
            }
            //const title = resolveTitle(file.name, existingTitles)
            //console.log("import tags", options)
            const newProblem = Problem.createFromText(text, title)?.setTags(options.tags)

            console.log("import problem", newProblem)
            if (!newProblem) { return { status: "failed", message: "parse error"}}
            await problemRepo.add(newProblem)
            console.log("import file", newProblem)
            return { status: "imported", problemId: newProblem.id}
        } catch (e) {
            const message = `Failed to import file ${file.name}:`
            console.error(message, e);
            
            return { status: "failed", message: message }
        }
    }
    const importFiles =  async (files: File[], options: ImportOptions): Promise<ImportFilesResult> => {
        let imported = 0
        let skipped = 0
        let failed = 0
        const results = []

        console.log("import files", files)
        for (const file of files) {
            const result = await importFile(file, options)
            results.push(result)
            switch(result.status){
                case "imported": imported++; break
                case "skipped": skipped++; break
                case "failed": failed++; break
            }
        }
        return {
            summary: {
                total: imported + skipped + failed,
                imported: imported,
                skipped: skipped,
                failed: failed,
            },
            results: results
        }

    }
    return {
        importFile,
        importFiles
    }
}