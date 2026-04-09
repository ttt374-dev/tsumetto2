import { Problem } from "@/domain/problem/entity/Problem";
import { describe, expect, it } from "vitest";
import { applyFilter } from "../applyFilter";
import { DefaultQueryState } from "../QueryState";


describe("filter", () => {
    it("tags filter", () => {
        const problems = [
            Problem.create({ id: "001" }).setTags(["foo"]),
            Problem.create({ id: "002" }).setTags(["bar"]),
        ]
        //const filterState = { ...DefaultFilterState, tags: ["foo"] }
        const queryState = { ...DefaultQueryState, tags: ["foo"]}
        const filtered = applyFilter(problems, {}, queryState)
        expect(filtered.map(p => p.id)).toEqual(["001"])
    })
    it("tags filter or", () => {
        const problems = [
            Problem.create({ id: "001" }).setTags(["foo"]),
            Problem.create({ id: "002" }).setTags(["bar"]),
        ]
        const queryState = { ...DefaultQueryState, tags: ["foo", "bar"] }
        const filtered = applyFilter(problems, {}, queryState)
        expect(filtered.map(p => p.id)).toEqual(["001", "002"])
    })

    it("source", () => {
        const problems = [
            Problem.create({ id: "001" }).setSource("foo"),
            Problem.create({ id: "002" }).setSource("bar"),
        ]
        const queryState = { ...DefaultQueryState, source: "foo" }
        const filtered = applyFilter(problems, {}, queryState)
        expect(filtered.map(p => p.id)).toEqual(["001"])  
    })
})

