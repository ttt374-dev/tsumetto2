
export type ProblemType = "standard" | "realistic" | "hisshi" | "tesuji"

export function problemTypeToLabel(type: ProblemType): string{
    const labelMap: Record<ProblemType, string> = {
        "standard": "標準",
        "realistic": "実践",
        "hisshi": "必死",
        "tesuji": "手筋"
    }
    return labelMap[type]

}