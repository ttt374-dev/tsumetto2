import { v4 } from 'uuid'

type KifContent = string   // TODO

export type ProblemData = {
  id: string
  title: string
  kifContent: KifContent
  createdAt: number
  starred: boolean
}

export type ProblemInit = Partial<ProblemData>
export type ProblemDTO = ProblemData
export type ProblemId = string

export class Problem {
  constructor(
    readonly id: string,
    readonly title: string,
    readonly kifContent: KifContent,
    readonly createdAt: number,
    readonly starred: boolean
  ) {}

  // 生成時
  static create(init?: ProblemInit): Problem {
    const now = Date.now()
    return new Problem(
      init?.id ?? v4(),
      init?.title ?? "untitled",
      //init?.kifContent ?? createKifContent(),
      init?.title ?? "",
      init?.createdAt ?? now,
      init?.starred ?? false
    )
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
    return new Problem(this.id, this.title, this.kifContent, this.createdAt, !this.starred)
  }
}
