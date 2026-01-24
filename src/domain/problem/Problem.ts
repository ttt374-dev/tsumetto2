import { v4 } from 'uuid'
import { KifData, type KifDataDTO } from '../kif/types'
import { parseKif } from '../kif/parser/parseKif'


export type ProblemData = {
    id: string
    title: string
    kifData: KifDataDTO
    createdAt: number
    starred: boolean
}
function createDefaultValues(): ProblemData {
    return {
        id: v4(),
        title: "untitled",
        kifData: KifData.create().toDTO(),
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
        readonly id: ProblemId,
        readonly title: string,
        readonly kifData: KifData,
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
            kifData: this.kifData.toDTO(),
            createdAt: this.createdAt,
            starred: this.starred
        }
    }

    static fromDTO(dto: ProblemDTO): Problem {
        return new Problem(dto.id, dto.title, KifData.fromDTO(dto.kifData), dto.createdAt, dto.starred)
    }
    static createFromText(text: string, title: string): Problem | null{
        const r = parseKif(text)
        if (!r.ok) return null
        return this.create({title: title, kifData: r.value.toDTO()})
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
