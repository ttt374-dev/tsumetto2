import { v4 } from 'uuid'
import { KifData, type KifDataDTO } from '../../kif/entity'
import { parseKif } from '@/domain/kif/service/parser/parseKif'

export type Tags = string[]

export type ProblemData = {
    id: string
    title: string
    kifData: KifDataDTO    
    
    source: string
    tags: string[]
    comment: string,

    starred: boolean
    createdAt: number
    updatedAt: number
    deletedAt?: number
}
function createDefaultValues(): ProblemData {
    return {
        id: v4(),
        title: "untitled",
        kifData: KifData.create().toDTO(),
        source: "",
        tags: [],
        comment: "",

        starred: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
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

        readonly source: string,
        readonly tags: Tags,
        readonly comment: string,

        readonly starred: boolean,
        readonly createdAt: number,
        readonly updatedAt: number,
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
            starred: this.starred,
            source: this.source,
            tags: [...this.tags],
            comment: this.comment,

            createdAt: this.createdAt,
            updatedAt: this.updatedAt,            
            deletedAt: this.deletedAt
        }
    }

    static fromDTO(dto: ProblemDTO): Problem {
        return new Problem(dto.id, dto.title, KifData.fromDTO(dto.kifData),            
            dto.source, dto.tags, dto.comment,
            dto.starred, 
            dto.createdAt, dto.updatedAt, 
             dto.deletedAt)
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
    setSource(source: string): Problem {
        return Problem.fromDTO({
            ...this.toDTO(),
            source: source,
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
