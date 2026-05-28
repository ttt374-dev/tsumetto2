import { v4 } from 'uuid'
import { KifData, type KifDataDTO, type Player } from '../../kif/entity'
import { parseKif } from '@/domain/kif/service/parser/parseKif'
import type { ProblemType } from '@/domain/problem/entity/ProblemType'

export type Tags = string[]

export type ProblemData = {
    id: string
    title: string
    kifData: KifDataDTO    
    
    type: ProblemType
    source: string
    tags: string[]
    comment: string,
    hint: string,
    userSide: Player,

    isStarred: boolean
    isReferenceOnly: boolean
    
    createdAt: number
    updatedAt: number
    deletedAt?: number
}
function createDefaultValues(): ProblemData {
    const now = Date.now()
    return {
        id: v4(),
        title: "untitled",
        kifData: KifData.create().toDTO(),

        type: "standard",
        source: "",
        tags: [],
        comment: "",
        hint: "",
        userSide: "black",

        isStarred: false,
        isReferenceOnly: false,
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

        readonly type: ProblemType,
        readonly source: string,
        readonly tags: Tags,
        readonly comment: string,
        readonly hint: string,
        readonly userSide: Player,

        readonly isStarred: boolean,
        readonly isReferenceOnly: boolean,
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
            
            type: this.type,
            source: this.source,
            tags: [...this.tags],
            comment: this.comment,
            hint: this.hint,
            userSide: this.userSide,

            isStarred: this.isStarred,
            isReferenceOnly: this.isReferenceOnly,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,            
            deletedAt: this.deletedAt
        }
    }

    

    static fromDTO(dto: ProblemDTO): Problem {
        const d = normalizeProblemDTO(dto)
        return new Problem(d.id, d.title, KifData.fromDTO(d.kifData),            
            d.type, d.source, d.tags, d.comment, d.hint, d.userSide,
            d.isStarred, d.isReferenceOnly,
            d.createdAt, d.updatedAt, d.deletedAt)
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
            isStarred: !this.isStarred,
        })
        //console.log("toggle", r)
        return r
    }
    setStarred(starred: boolean): Problem {
        return Problem.fromDTO({
            ...this.toDTO(),
            isStarred: starred
        })
    }
    setReferenceOnly(isReferecenOnly: boolean): Problem {
        return Problem.fromDTO({
            ...this.toDTO(),
            isReferenceOnly: isReferecenOnly
        })
    }
    setTitle(title: string): Problem {
        return Problem.fromDTO({
            ...this.toDTO(),
            title,
        })

    }
    setType(type: ProblemType): Problem {
        return Problem.fromDTO({
            ...this.toDTO(),
            type,
        })
    }
    setSource(source: string): Problem {
        return Problem.fromDTO({
            ...this.toDTO(),
            source,
        })
    }
    setTags(tags: string[]): Problem {
        return Problem.fromDTO({
            ...this.toDTO(),
            tags
        })
    }
    setComment(comment: string): Problem {
        return Problem.fromDTO({
            ...this.toDTO(),
            comment,
        })
    }
    setHint(hint: string): Problem {
        return Problem.fromDTO({
            ...this.toDTO(),
            hint,
        })
    }
    setUserSide(userSide: Player): Problem {
        return Problem.fromDTO({
            ...this.toDTO(),
            userSide,
        })
    }
    get isDelete(): boolean {
        return !!this.deletedAt
    }
    addTags(tagsToAdd: string[]): Problem {
        let newTags = [...this.tags]
        let changed = false

        //console.log("tagstoremove", tagsToRemove)
        for (const tag of tagsToAdd) {
            if (!newTags.includes(tag)) {
                newTags.push(tag)
                changed = true
            }
        }        
        if (!changed) return this
        return Problem.fromDTO({
            ...this.toDTO(),
            tags: newTags,
        })
    }
    removeTags(tagsToRemove: string[]): Problem {
        let newTags = [...this.tags]
        let changed = false

        //console.log("tagstoremove", tagsToRemove)
        for (const tag of tagsToRemove){
            console.log("tag: ", tag, newTags)
            if(newTags.includes(tag)){
                newTags = newTags.filter(t=>t!==tag)
                changed = true
            }
        }
        //console.log("remove tags", tagsToRemove, changed, newTags)
        if (!changed) return this
        return Problem.fromDTO({
            ...this.toDTO(),
            tags: newTags,
        })
    }
    softDelete(): Problem {
        return Problem.fromDTO({
            ...this.toDTO(),
            deletedAt: Date.now()
        })
    }
}

// normalizer
function normalizeProblemDTO(dto: Partial<ProblemDTO>): ProblemDTO {
    const defaults = createDefaultValues()

    return {
        id: dto.id ?? defaults.id,
        title: dto.title ?? defaults.title,
        kifData: dto.kifData ?? defaults.kifData,

        type: dto.type ?? defaults.type,
        source: dto.source ?? defaults.source,
        tags: Array.isArray(dto.tags) ? dto.tags : [],
        comment: dto.comment ?? defaults.comment,
        hint: dto.hint ?? defaults.hint,
        userSide:  isPlayer(dto.userSide) ? dto.userSide : defaults.userSide,

        isStarred: dto.isStarred ?? defaults.isStarred,
        isReferenceOnly: dto.isReferenceOnly ?? defaults.isReferenceOnly,

        createdAt: dto.createdAt ?? Date.now(),
        updatedAt: dto.updatedAt ?? Date.now(),
        deletedAt: dto.deletedAt,
    }
}

function isPlayer(v: unknown): v is Player {
    return v === "black" || v === "white"
}