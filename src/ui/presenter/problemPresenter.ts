import type { Problem } from "@/domain/problem/entity/Problem";
import type { ProblemType } from "@/domain/problem/entity/ProblemType";


export function toProblemViewData(p: Problem) {
    return {
        typeText: problemTypeLabelMap[p.type],
        tagsText: p.tags.join(","),
        plyLengthText: `${p.kifData.moves.length}手`,
    }
}

const problemTypeLabelMap: Record<ProblemType, string> = {
    "standard": "標準",
    "realistic": "実践",
    "hisshi": "必死",
    "tesuji": "手筋"
}

export function toProblemTypeText(type: ProblemType): string {
    return problemTypeLabelMap[type]
}

export const problemPresenter = {
    plyLength: {
        label: "手数",
        getText: (p: Problem) => toProblemViewData(p).plyLengthText
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
        getText: (p: Problem) => toProblemViewData(p).typeText
    },
    source: {
        label: "出典",
        getText: (p: Problem) => p.source
    },
    tags: {
        label: "タグ",
        getText: (p: Problem) => toProblemViewData(p).tagsText
    }
}