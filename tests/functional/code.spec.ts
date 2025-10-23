import {
    isInEnum,
    sortStringArray,
    removeDuplicitiesFromArray,
    notEmptyString,
    enumValuesToString,
    enumCombineValuesToString,
    enumValuesToArray,
    randomNumberBetween,
    flattenObject,
} from "../../src/globals/coding/code.formating";

describe("Code helper functions", () => {
    enum TestEnum {
        A = "A",
        B = "B",
    }

    test("isInEnum - value in enum", () => {
        expect(isInEnum("A", TestEnum)).toBe(true);
    });

    test("isInEnum - value not in enum", () => {
        expect(isInEnum("C", TestEnum)).toBe(false);
    });

    test("sortStringArray", () => {
        expect(sortStringArray(["banana", "apple", "cherry"])).toEqual(["apple", "banana", "cherry"]);
    });

    test("removeDuplicitiesFromArray", () => {
        expect(removeDuplicitiesFromArray(["apple", "banana", "apple", "cherry"])).toEqual(["apple", "banana", "cherry"]);
    });

    test("notEmptyString - non-empty string", () => {
        expect(notEmptyString("hello")).toBe(true);
    });

    test("notEmptyString - empty string", () => {
        expect(notEmptyString("")).toBe(false);
    });

    test("enumValuesToString", () => {
        expect(enumValuesToString(TestEnum)).toBe("A, B");
    });

    test("enumCombineValuesToString", () => {
        enum TestEnum2 {
            C = "C",
            D = "D",
        }
        expect(enumCombineValuesToString([TestEnum, TestEnum2])).toBe("A, B, C, D");
    });

    test("enumValuesToArray", () => {
        expect(enumValuesToArray(TestEnum)).toEqual(["A", "B"]);
    });

    test("randomNumberBetween", () => {
        const min = 1, max = 10;
        const random = randomNumberBetween(min, max);
        expect(random).toBeGreaterThanOrEqual(min);
        expect(random).toBeLessThanOrEqual(max);
    });

    test("flattenObject", () => {
        const nestedObj = { a: { b: { c: 1 } }, d: 2 };
        expect(flattenObject(nestedObj)).toEqual({ "a.b.c": 1, d: 2 });
    });
});
