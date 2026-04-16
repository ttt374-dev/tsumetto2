import type { Problem } from "@/domain/problem/entity/Problem";
import type { ProblemType } from "@/domain/problem/entity/ProblemType";

type problemViewField = "title"| "type" | "source" | "tags" | "plyLength" | "createdAt" | "updatedAt" | "handicap"
export function toProblemViewData(p: Problem): Record<problemViewField, any> {
    return {
        title: p.title,
        type: problemTypeLabelMap[p.type],
        source: p.source,
        tags: p.tags.join(","),
        plyLength: `${p.kifData.moves.length}手`,
        createdAt: new Date(p.createdAt).toLocaleString(),
        updatedAt: new Date(p.updatedAt).toLocaleString(),
        handicap: p.kifData.headers["手合割"],
    }
}
export const problemFieldLabels: Record<problemViewField, string> = {
    title: "タイトル",
    type: "問題タイプ",
    plyLength: "手数",
    source: "出典",
    tags: "タグ",
    createdAt: "作成日時",
    updatedAt: "更新日時",
    handicap: "手合割"
}
const problemTypeLabelMap: Record<ProblemType, string> = {
    standard: "標準",
    realistic: "実践",
    hisshi: "必死",
    tesuji: "手筋",
    wholegame: "ゲーム全体"
}

export function toProblemTypeText(type: ProblemType): string {
    return problemTypeLabelMap[type]
}

