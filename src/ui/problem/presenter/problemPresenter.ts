import type { Problem } from "@/domain/problem/entity/Problem";
import { problemTypeToLabel } from "@/domain/problem/entity/ProblemType";

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
        getText: (p: Problem) => problemTypeToLabel(p.type)
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