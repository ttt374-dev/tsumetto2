import type { ProblemDatasource } from "@/domain/problem/datasource/ProbleDatasource";
import type { ProblemDTO, ProblemId } from "@/domain/problem/entity/Problem";
import { Filesystem, Directory, Encoding} from "@capacitor/filesystem";


const PROBLEM_FILE = "problems.json";

export class LocalFileProblemDatasource implements ProblemDatasource {
    async findAll(): Promise<ProblemDTO[]> {
        return await this.read();
    }

    async findById(id: ProblemId): Promise<ProblemDTO | undefined> {
        const all = await this.read();
        return all.find(p => p.id === id);
    }
    async findByTitle(title: string): Promise<ProblemDTO | undefined>{
        const all = await this.read();
        return all.find(p => p.title === title)
    }

    async insert(dto: ProblemDTO): Promise<void> {
        const all = await this.read();
        if (all.some(p => p.id === dto.id)) {
            throw new Error("duplicate problem id")
        }
        all.push(dto);
        await this.write(all);
    }

    async insertMany(dtos: ProblemDTO[]): Promise<void> {
        const all = await this.read();
        await this.write([
            ...all,
            ...dtos
        ]);
    }

    async update(dto: ProblemDTO): Promise<void> {
        const all = await this.read();

        const index = all.findIndex(
            p => p.id === dto.id
        );

        if (index === -1) {
            throw new Error("problem not found");
        }

        all[index] = dto;
        await this.write(all);
    }

    async updateMany(
        dtos: ProblemDTO[]
    ): Promise<void> {

        const all = await this.read();

        const map = new Map(
            dtos.map(d => [d.id, d])
        );

        const next = all.map(p =>
            map.get(p.id) ?? p
        );

        await this.write(next);
    }

    async delete(id: string): Promise<void> {
        const all = await this.read();

        await this.write(
            all.filter(p => p.id !== id)
        );
    }

    async deleteMany(ids: string[]): Promise<void> {
        const idSet = new Set(ids);

        const all = await this.read();

        await this.write(
            all.filter(p => !idSet.has(p.id))
        );
    }

    async replaceAll(
        dtos: ProblemDTO[]
    ): Promise<void> {

        await this.write(dtos);
    }
    ////////////////////////////////
    private async read(): Promise<ProblemDTO[]> {
        try {
            const result = await Filesystem.readFile({
                path: PROBLEM_FILE,
                directory: Directory.Data,
                encoding: Encoding.UTF8,
            });

            const text =
                typeof result.data === "string"
                    ? result.data
                    : await result.data.text();

            return JSON.parse(text);

        } catch (e) {
            console.error("problem datasource read error", e);
            return [];
        }
    }

    private async write(
        dtos: ProblemDTO[]
    ): Promise<void> {

        try {
            await Filesystem.writeFile({
                path: PROBLEM_FILE,
                data: JSON.stringify(dtos),
                directory: Directory.Data,
                encoding: Encoding.UTF8,
            });

        } catch (e) {
            console.error("problem datasource write error", e);
            //throw e;
        }
    }

}