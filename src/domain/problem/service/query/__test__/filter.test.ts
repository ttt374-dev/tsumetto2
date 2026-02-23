import { Problem } from "@/domain/problem/entity/Problem";
import { describe, expect, it } from "vitest";
import { applyFilter } from "../applyFilter";
import { DefaultFilterState } from "../filter";
import { KifData, Move } from "@/domain/kif/entity";


describe("filter", () => {
    it("tags filter", () => {
        const problems = [
            Problem.create({ id: "001" }).setTags(["foo"]),
            Problem.create({ id: "002" }).setTags(["bar"]),
        ]
        const filterState = { ...DefaultFilterState, tags: ["foo"] }
        const filtered = applyFilter(problems, {}, filterState)
        expect(filtered.map(p => p.id)).toEqual(["001"])
    })
    it("tags filter or", () => {
        const problems = [
            Problem.create({ id: "001" }).setTags(["foo"]),
            Problem.create({ id: "002" }).setTags(["bar"]),
        ]
        const filterState = { ...DefaultFilterState, tags: ["foo", "bar"] }
        const filtered = applyFilter(problems, {}, filterState)
        expect(filtered.map(p => p.id)).toEqual(["001", "002"])
    })
})

