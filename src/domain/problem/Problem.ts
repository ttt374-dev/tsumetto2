import { v4 } from 'uuid'

type KifContent = string   // TODO

export type ProblemData = {
    id: string
    title: string
    kifContent: KifContent
    createdAt: number
    starred: boolean
}
function createDefaultValues(): ProblemData {
    return {
        id: v4(),
        title: "untitled",
        kifContent: "",
        createdAt: Date.now(),
        starred: false,
    }
}

//export type ProblemInit = Partial<ProblemData>
export type ProblemDTO = ProblemData
export type ProblemId = string
/////////////////////////////////////////////////////////////////
export class Problem {
    constructor(
        readonly id: string,
        readonly title: string,
        readonly kifContent: KifContent,
        readonly createdAt: number,
        readonly starred: boolean
    ) { }


    // 生成時
    static create(init: Partial<ProblemData> = {}): Problem {
        return Problem.fromDTO({ ...createDefaultValues(), ...init })
    }

    // 永続化用 DTO
    toDTO(): ProblemDTO {
        return {
            id: this.id,
            title: this.title,
            kifContent: this.kifContent,
            createdAt: this.createdAt,
            starred: this.starred
        }
    }

    static fromDTO(dto: ProblemDTO): Problem {
        return new Problem(dto.id, dto.title, dto.kifContent, dto.createdAt, dto.starred)
    }

    //////
    toggleStar(): Problem {
        const r= Problem.fromDTO({
            ...this.toDTO(),
            starred: !this.starred,
        })
        console.log("toggle", r)
        return r
    }
    setTitle(title: string): Problem {
        return Problem.fromDTO({
            ...this.toDTO(),
            title: title,
        })

    }
}
