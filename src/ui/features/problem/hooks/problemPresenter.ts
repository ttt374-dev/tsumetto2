import type { Problem } from "@/domain/problem/entity/Problem";
import type { ProblemType } from "@/domain/problem/entity/ProblemType";

export const problemFieldLabels = {
    title: "タイトル",
    type: "問題タイプ",
    plyLength: "手数",
    source: "出典",
    tags: "タグ",
    createdAt: "作成日時",
    updatedAt: "更新日時",
    handicap: "手合割"
} as const

type ProblemViewField = keyof typeof problemFieldLabels

export function toProblemViewData(p: Problem): Record<ProblemViewField, string> {
    return {
        title: p.title,
        type: problemTypeLabels[p.problemType],
        source: p.source,
        tags: p.tags.join(", "),
        plyLength: `${p.kifData.moves.length}手`,
        createdAt: formatDate(p.createdAt),
        updatedAt: formatDate(p.updatedAt),
        handicap: p.kifData.headers["手合割"] ?? "",
    }
}

export const problemTypeLabels: Record<ProblemType, string> = {
    standard: "標準",
    realistic: "実践",
    hisshi: "必死",
    tesuji: "手筋",
    yose: "寄せ",
    wholegame: "ゲーム全体"
}

////////////////
// helper
function formatDate(ts: number) {
  return new Date(ts).toLocaleString()
}
