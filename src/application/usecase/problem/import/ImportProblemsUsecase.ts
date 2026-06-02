import { parseKif } from "@/domain/kif/service/parser/parseKif";
import { Problem, type ProblemDTO, type ProblemId } from "@/domain/problem/entity/Problem";
import type { ProblemRepository } from "@/domain/problem/repository/ProblemRepository";

export type ImportMetadata =  Pick<Partial<ProblemDTO>,"source" | "tags" | "problemType">
export type ImportPolicy = {
    duplicateTitleStrategy: DuplicateTitleStrategy
}

export type DuplicateTitleStrategy = "skip" | "rename" | "overwrite"
//export type ImportOptions = ProblemImportMetadata & ImportPolicy
export type ImportOptions = {
    metadata: ImportMetadata
    policy: ImportPolicy
}

export const DefaultImportOptions: ImportOptions = {
    metadata: {
        tags: [],
        problemType: "standard",
        source: "",
    },
    policy: {
        duplicateTitleStrategy: "skip"
    },     
}

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
        message?: string
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

export async function getExsitingTitle(repo: ProblemRepository): Promise<Set<string>> {
    const problems = await repo.findAll()
    return new Set(problems.filter(p => p.isActive).map(p => p.title))
}
function resolveTitle(title: string, existing: Set<string>) {
    if (!existing.has(title)) return title
    let i = 1
    while (existing.has(`${title} (${i})`)) i++
    return `${title} (${i})`
}
/////////////////////////////////////////////////
export function useImportProblemsUsecase(problemRepo: ProblemRepository) {
    const importFiles = async (files: File[], options: ImportOptions): Promise<ImportFilesResult> => {
        let imported = 0
        let skipped = 0
        let failed = 0
        const problems: Problem[] = []
        const results: ImportResult[] = []                
        
        const existingTitles = await getExsitingTitle(problemRepo)
        //console.log("import files", files)
        for (const file of files) {        
            
            let title = file.name
            let partial: Partial<ProblemDTO> = {}
            if (existingTitles.has(title)) {
                switch (options.policy.duplicateTitleStrategy) {
                    case "rename":
                        title = resolveTitle(file.name, existingTitles)
                        existingTitles.add(title)
                        break;
                    case "skip":
                        console.warn(`skipped by duplicated title: ${title}`)
                        results.push({status: "skipped", reason: "duplicate-title"})
                        skipped++
                        continue
                    //break;
                    case "overwrite":
                        const existingProblem = await problemRepo.findByTitle(title)                        
                        if (existingProblem) {
                            partial = {...existingProblem.toDTO(), createdAt: Date.now()}
                            console.log("overwrite", partial, options.metadata, options)
                            //await problemRepo.remove(existingProblem.id)
                            //await problemRepo.update()
                        }
                        break;
                }
            }
            
            const problem = await parseKifFile(file, {...partial, ...options.metadata, title})            

            if (!problem){
                console.error("parse kif file failed")
                results.push({ status: "failed", message: "kif parse filed"})
                failed++
                continue
            }
            problems.push(problem)
            results.push({ status: "imported", problemId: problem.id})
            imported++            
        }
        console.log("add many", problems)
        if (problems.length > 0){
            problemRepo.addMany(problems)
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
        //importFile,
        importFiles
    }
    //////////////////////////////////////
    /*
    const importFile000 = async (file: File, options: ImportOptions): Promise<ImportResult> => {
        try {
            const existingTitles = await getExsitingTitle(problemRepo)
            let title = file.name
            if (existingTitles.has(title)) {
                switch (options.duplicateTitleStrategy) {
                    case "rename":
                        title = resolveTitle(file.name, existingTitles)
                        break;
                    case "skip":
                        console.warn(`skipped by duplicated title: ${title}`)
                        return { status: "skipped", reason: "duplicate-title" }
                    //break;
                    case "overwrite":
                        const existingProblem = await problemRepo.findByTitle(title)
                        if (existingProblem) {
                            await problemRepo.remove(existingProblem.id)
                            //await problemRepo.update()
                        }
                }
            }
            
            const newProblem = await parseKifFile(file, title)            
            if (!newProblem) { return { status: "failed", message: "parse error" } }
            //await problemRepo.add(newProblem)
            await importProblem(newProblem, options)
            console.log("import file", newProblem)
            return { status: "imported", problemId: newProblem.id, importedAt: newProblem.createdAt }
        } catch (e) {
            const message = `Failed to import file ${file.name}:`
            console.error(message, e);

            return { status: "failed", message: message }
        }
    }
        */
}

const parseKifFile = async (file: File, partial?: Partial<ProblemDTO>) => {
    try { 
        const buf = await file.arrayBuffer();
        const text = new TextDecoder("shift_jis").decode(buf);
        const resKif = parseKif(text)
        if (!resKif.ok) return null
        console.log("partial", partial)
        return Problem.create({...partial, kifData: resKif.value.toDTO() })
    } catch (e){
        console.error("fail to read file", e)
        return null
    }
    
    //return Problem.createFromText(text, titl)
}