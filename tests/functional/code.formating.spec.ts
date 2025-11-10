import {
    flattenObject,
    isInEnum,
    sortStringArray,
    removeDuplicitiesFromArray,
    notEmptyString,
    enumValuesToString,
    enumCombineValuesToString,
    enumValuesToArray,
    randomNumberBetween
} from '../../src/index.node.js';

describe('flattenObject', () => {
    it('should flatten a nested object', () => {
        const nestedObj = {
            a: {
                b: {
                    c: 1
                }
            },
            d: 2
        }
        const expected = {
            'a.b.c': 1,
            'd': 2
        }
        expect(flattenObject(nestedObj)).toEqual(expected)
    })

    it('should handle empty objects', () => {
        expect(flattenObject({})).toEqual({})
    })

    it('should handle non-nested objects', () => {
        const obj = { a: 1, b: 2 }
        expect(flattenObject(obj)).toEqual(obj)
    })
})

describe('isInEnum', () => {
    enum TestEnum {
        A = 'A',
        B = 'B'
    }

    it('should return true for values in the enum', () => {
        expect(isInEnum('A', TestEnum)).toBe(true)
        expect(isInEnum('B', TestEnum)).toBe(true)
    })

    it('should return false for values not in the enum', () => {
        expect(isInEnum('C', TestEnum)).toBe(false)
    })
})

describe('sortStringArray', () => {
    it('should sort an array of strings', () => {
        const arr = ['banana', 'apple', 'cherry']
        const expected = ['apple', 'banana', 'cherry']
        expect(sortStringArray(arr)).toEqual(expected)
    })
})

describe('removeDuplicitiesFromArray', () => {
    it('should remove duplicate values from an array', () => {
        const arr = [1, 2, 2, 3, 4, 4, 5]
        const expected = [1, 2, 3, 4, 5]
        expect(removeDuplicitiesFromArray(arr)).toEqual(expected)
    })
})

describe('notEmptyString', () => {
    it('should return true for non-empty strings', () => {
        expect(notEmptyString('hello')).toBe(true)
    })

    it('should return false for empty strings', () => {
        expect(notEmptyString('')).toBe(false)
    })
})

describe('enumValuesToString', () => {
    enum TestEnum {
        A = 'A',
        B = 'B'
    }

    it('should return a string of enum values separated by the default separator', () => {
        expect(enumValuesToString(TestEnum)).toBe('A, B')
    })

    it('should return a string of enum values separated by a custom separator', () => {
        expect(enumValuesToString(TestEnum, ' | ')).toBe('A | B')
    })
})

describe('enumCombineValuesToString', () => {
    enum TestEnum1 {
        A = 'A',
        B = 'B'
    }

    enum TestEnum2 {
        C = 'C',
        D = 'D'
    }

    it('should return a string of combined enum values separated by the default separator', () => {
        expect(enumCombineValuesToString([TestEnum1, TestEnum2])).toBe('A, B, C, D')
    })

    it('should return a string of combined enum values separated by a custom separator', () => {
        expect(enumCombineValuesToString([TestEnum1, TestEnum2], ' | ')).toBe('A | B | C | D')
    })
})

describe('enumValuesToArray', () => {
    enum TestEnum {
        A = 'A',
        B = 'B'
    }

    it('should return an array of enum values', () => {
        expect(enumValuesToArray(TestEnum)).toEqual(['A', 'B'])
    })
})

describe('randomNumberBetween', () => {
    it('should return a number between the specified range', () => {
        const min = 1
        const max = 10
        const result = randomNumberBetween(min, max)
        expect(result).toBeGreaterThanOrEqual(min)
        expect(result).toBeLessThanOrEqual(max)
    })
})