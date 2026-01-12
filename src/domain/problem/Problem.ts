import { v4 } from 'uuid'

type KifContent = string   // TODO

export type ProblemData = {
    id: string
    title: string
    kifContent: KifContent
    createdAt: number
    starred: boolean
}
function createProblemDefaultValues(): ProblemData {
    return {
        id: v4(),
        title: "untitled",
        kifContent: "",
        createdAt: Date.now(),
        starred: false,
    }
}

export type ProblemInit = Partial<ProblemData>
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
    static create(init: Partial<ProblemInit> = {}): Problem {
        return Problem.fromDTO({ ...createProblemDefaultValues(), ...init })
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
        //return new Problem(this.id, this.title, this.kifContent, this.createdAt, !this.starred)
        //return Problem.create({starred: !this.starred}) 
        return Problem.fromDTO({
            ...this.toDTO(),
            starred: !this.starred,
        })
    }
    setTitle(title: string): Problem {
        //return Problem.create({title: title})
        return Problem.fromDTO({
            ...this.toDTO(),
            title: title,
        })

    }
}
