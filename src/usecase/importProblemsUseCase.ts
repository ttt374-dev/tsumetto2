import { Problem } from "@/domain/problem/Problem";
import type { ProblemRepository } from "@/domain/problem/ProblemRepository";

export type ImportResult = 
    | { ok: true, count: number}
    | { ok: false, message: string }


export function createImportProblemsUsecase(problemRepo: ProblemRepository) {
    
    const importFile = async (file: File): Promise<ImportResult> => {
        try {
            const buf = await file.arrayBuffer();
            const text = new TextDecoder("shift_jis").decode(buf);            
            const newProblem = Problem.createFromText(text, file.name)

            if (!newProblem) { return { ok: false, message: "parse failed" }}
            await problemRepo.add(newProblem)
            return { ok: true, count: 1}
        } catch (e) {
            const message = `Failed to import file ${file.name}:`
            console.error(message, e);
            
            return { ok: false, message: message }
        }
    }
    const importFiles =  async (files: File[]): Promise<ImportResult> => {
        let successCount = 0
        let failedCount = 0

        for (const file of files) {
            const result = await importFile(file)
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