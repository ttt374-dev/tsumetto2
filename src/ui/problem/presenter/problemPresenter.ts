import type { Problem } from "@/domain/problem/entity/Problem";
import type { ProblemType } from "@/domain/problem/entity/ProblemType";


export const ProblemTypeLabelMap: Record<ProblemType, string> = {
    "standard": "標準",
    "realistic": "実践",
    "hisshi": "必死",
    "tesuji": "手筋"
}

export const problemPresenter = {
    plyLength: {
        label: "手数",
        getText: (p: Problem) => `${p.kifData.moves.length}手`
    },
    createdAt: {
        label: "追加日",
        getText: (p: Problem) => p.createdAt.toLocaleString()
    },
    updatedAt: {
        label: "更新日",
        getText: (p: Problem) => p.updatedAt.toLocaleString()
    },
    type: {
        label: "問題タイプ",
        getText: (p: Problem) => ProblemTypeLabelMap[p.type]
    },
    source: {
        label: "出典",
        getText: (p: Problem) => p.source
    },
    tags: {
        label: "タグ",
        getText: (p: Problem) => p.tags.join(",")
    }
}