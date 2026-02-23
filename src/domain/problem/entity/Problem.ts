import { v4 } from 'uuid'
import { KifData, type KifDataDTO } from '../../kif/entity'
import { parseKif } from '@/domain/kif/service/parser/parseKif'

export type Tags = string[]

export type ProblemData = {
    id: string
    title: string
    kifData: KifDataDTO
    createdAt: number
    updatedAt: number
    starred: boolean
    tags: string[]
    comment: string,

    deletedAt?: number
}
function createDefaultValues(): ProblemData {
    return {
        id: v4(),
        title: "untitled",
        kifData: KifData.create().toDTO(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        starred: false,
        tags: [],
        comment: "",

        deletedAt: undefined
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
        readonly updatedAt: number,
        readonly starred: boolean,
        readonly tags: Tags,
        readonly comment: string,
        readonly deletedAt?: number,
        
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
            updatedAt: this.updatedAt,
            starred: this.starred,
            tags: [...this.tags],
            comment: this.comment,

            deletedAt: this.deletedAt
        }
    }

    static fromDTO(dto: ProblemDTO): Problem {
        return new Problem(dto.id, dto.title, KifData.fromDTO(dto.kifData),
            dto.createdAt, dto.updatedAt, dto.starred, dto.tags, dto.comment, dto.deletedAt)
    }
    static createFromText(text: string, title: string): Problem | null{
        const r = parseKif(text)
        //console.log("carete from text", r, text)
        if (!r.ok) {
            console.error("parse error", r.error)
            return null
        }
        return this.create({title: title, kifData: r.value.toDTO()})
    }
    ////
    get isActive(): boolean{ return !this.deletedAt}
    
    touch(): Problem {
        return Problem.fromDTO({
            ...this.toDTO(),
            updatedAt: Date.now(),
        })
    }
    withUpdated(updater: (p: Problem) => Problem): Problem {
        const next = updater(this)
        if (next === this) return this
        return next.touch()
    }
    //////
    toggleStar(): Problem {
        const r= Problem.fromDTO({
            ...this.toDTO(),
            starred: !this.starred,
        })
        //console.log("toggle", r)
        return r
    }
    setStarred(starred: boolean): Problem {
        return Problem.fromDTO({
            ...this.toDTO(),
            starred: starred
        })
    }
    setTitle(title: string): Problem {
        return Problem.fromDTO({
            ...this.toDTO(),
            title: title,
        })

    }
    setTags(tags: string[]): Problem {
        return Problem.fromDTO({
            ...this.toDTO(),
            tags: tags
        })
    }
    get isDelete(): boolean {
        return !!this.deletedAt
    }
    softDelete(): Problem {
        return Problem.fromDTO({
            ...this.toDTO(),
            deletedAt: Date.now()
        })
    }
}
