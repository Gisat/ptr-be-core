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
} from "../../src/coding/code.formating";

describe("Code helper functions", () => {

    describe("isInEnum", () => {
        enum TestEnum {
            A = "A",
            B = "B",
        }

        it("should return true if value is in enum", () => {
            expect(isInEnum("A", TestEnum)).toBe(true);
        });

        it("should return false if value is not in enum", () => {
            expect(isInEnum("C", TestEnum)).toBe(false);
        });
    });

    describe("sortStringArray", () => {
        it("should sort an array of strings", () => {
            const input = ["banana", "apple", "cherry"];
            const output = sortStringArray(input);
            expect(output).toEqual(["apple", "banana", "cherry"]);
        });
    });

    describe("removeDuplicitiesFromArray", () => {
        it("should remove duplicate items from an array", () => {
            const input = ["apple", "banana", "apple", "cherry"];
            const output = removeDuplicitiesFromArray(input);
            expect(output).toEqual(["apple", "banana", "cherry"]);
        });
    });

    describe("notEmptyString", () => {
        it("should return true for non-empty strings", () => {
            expect(notEmptyString("hello")).toBe(true);
        });

        it("should return false for empty strings", () => {
            expect(notEmptyString("")).toBe(false);
        });
    });

    describe("enumValuesToString", () => {
        enum TestEnum {
            A = "A",
            B = "B",
        }

        it("should return enum values as a string", () => {
            expect(enumValuesToString(TestEnum)).toBe("A, B");
        });
    });

    describe("enumCombineValuesToString", () => {
        enum TestEnum1 {
            A = "A",
            B = "B",
        }

        enum TestEnum2 {
            C = "C",
            D = "D",
        }

        it("should combine enum values into a single string", () => {
            expect(enumCombineValuesToString([TestEnum1, TestEnum2])).toBe("A, B, C, D");
        });
    });

    describe("enumValuesToArray", () => {
        enum TestEnum {
            A = "A",
            B = "B",
        }

        it("should return enum values as an array", () => {
            expect(enumValuesToArray(TestEnum)).toEqual(["A", "B"]);
        });
    });

    describe("randomNumberBetween", () => {
        it("should return a random number within the range", () => {
            const min = 1;
            const max = 10;
            const random = randomNumberBetween(min, max);
            expect(random).toBeGreaterThanOrEqual(min);
            expect(random).toBeLessThanOrEqual(max);
        });
    });

    describe("flattenObject", () => {
        it("should flatten a nested object", () => {
            const nestedObj = {
                a: {
                    b: {
                        c: 1,
                    },
                },
                d: 2,
            };
            const flatObj = flattenObject(nestedObj);
            expect(flatObj).toEqual({
                "a.b.c": 1,
                d: 2,
            });
        });
    });
});