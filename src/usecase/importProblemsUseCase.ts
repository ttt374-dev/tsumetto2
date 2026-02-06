import { useProblemStore } from "@/application/store/useProblemStore";
import type { ImportOptions } from "@/application/useImportControler";
import { Problem } from "@/domain/problem/Problem";
import type { ProblemRepository } from "@/domain/problem/ProblemRepository";
import { useRepositoryContext } from "@/ui/App/providers/RepositoryProvider";

export type ImportResult = 
    | { ok: true, count: number}
    | { ok: false, message: string }


async function getExsitingTitle(repo: ProblemRepository): Promise<Set<string>>{
    //const store = useProblemStore(repo)
    const problems = await repo.load()
    return new Set(problems.map(p=>p.title))
}
function resolveTitle(title: string, existing: Set<string>) {
  if (!existing.has(title)) return title
  let i = 1
  while (existing.has(`${title} (${i})`)) i++
  return `${title} (${i})`
}
export function createImportProblemsUsecase(problemRepo: ProblemRepository) {    
    const importFile = async (file: File, options: ImportOptions): Promise<ImportResult> => {
        try {
            const buf = await file.arrayBuffer();
            const text = new TextDecoder("shift_jis").decode(buf);            
            const title = resolveTitle(file.name, await getExsitingTitle(problemRepo))
            console.log("import tags", options)
            const newProblem = Problem.createFromText(text, title)?.setTags(options.tags)

            if (!newProblem) { return { ok: false, message: "parse failed" }}
            await problemRepo.add(newProblem)
            console.log("import file", newProblem)
            return { ok: true, count: 1}
        } catch (e) {
            const message = `Failed to import file ${file.name}:`
            console.error(message, e);
            
            return { ok: false, message: message }
        }
    }
    const importFiles =  async (files: File[], options: ImportOptions): Promise<ImportResult> => {
        let successCount = 0
        let failedCount = 0

        console.log("import files", files)
        for (const file of files) {
            const result = await importFile(file, options)
            if (result.ok){
                successCount++
            } else {
                failedCount++
            }
        }
        if (failedCount > 0){
            return { ok: false, message: `failed to import ${failedCount} files`}    
        }
        return { ok: true, count: successCount}        
    }
    return {
        importFile,
        importFiles
    }
}