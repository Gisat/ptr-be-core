import { PantherFilter, parsePantherFilterCSV, webEncodeFilterCSV, webDecodeFilterCSV } from "../../src/globals/filtering/convertor.sql.csv"

describe("PantherFilter builder - single filter", () => {
    test("attribute and range setters build the expected filter", () => {
        const filter = PantherFilter()
            .attribute("price")
            .from(10)
            .to(100)
            .orderBy("name")
            .descend()
            .groupBy("type")
            .result()

        expect(filter).toEqual([
            {
                attributeName: "price",
                fromValue: 10,
                toValue: 100,
                orderBy: "name",
                ascending: "descend",
                groupBy: "type",
            },
        ])
    })

    test("equal accepts string, number, and boolean values", () => {
        const asString = PantherFilter().attribute("name").equal("foo").result()
        const asNumber = PantherFilter().attribute("qty").equal(5).result()
        const asBooleanTrue = PantherFilter().attribute("active").equal(true).result()
        const asBooleanFalse = PantherFilter().attribute("active").equal(false).result()

        expect(asString[0].equal).toBe("foo")
        expect(asNumber[0].equal).toBe(5)
        expect(asBooleanTrue[0].equal).toBe(true)
        expect(asBooleanFalse[0].equal).toBe(false)
    })

    test("result returns copies that do not mutate on later setter calls", () => {
        const builder = PantherFilter().attribute("price").from(1)
        const first = builder.result()
        builder.to(99)

        expect(first[0].toValue).toBeUndefined()
        expect(builder.result()[0].toValue).toBe(99)
    })

    test("ascend sets the sort direction to ascend", () => {
        expect(PantherFilter().attribute("a").ascend().result()[0].ascending).toBe("ascend")
    })
})

describe("PantherFilter builder - chaining", () => {
    test("nextAttribute builds multiple chained filters", () => {
        const filter = PantherFilter()
            .attribute("a")
            .nextAttribute("b", "and")
            .nextAttribute("c", "or")
            .result()

        expect(filter.length).toBe(3)
        expect(filter[0].attributeName).toBe("a")
        expect(filter[0].chainingInfo).toBeUndefined()
        expect(filter[1].attributeName).toBe("b")
        expect(filter[1].chainingInfo).toBe("and")
        expect(filter[2].attributeName).toBe("c")
        expect(filter[2].chainingInfo).toBe("or")
    })

    test("setters after nextAttribute apply only to the new filter", () => {
        const filter = PantherFilter()
            .attribute("a")
            .from(1)
            .nextAttribute("b", "and")
            .from(99)
            .result()

        expect(filter[0].fromValue).toBe(1)
        expect(filter[1].fromValue).toBe(99)
    })
})

describe("PantherFilter returnCSV - serialization", () => {
    test("single filter serializes with empty slots preserved", () => {
        const line = PantherFilter().attribute("price").from(10).to(100).descend().returnCSV()

        expect(line).toBe(", price, 10, 100, , , descend, ")
    })

    test("multi-filter chain serializes to newline-joined rows", () => {
        const csv = PantherFilter()
            .attribute("price")
            .descend()
            .nextAttribute("qty", "and")
            .equal(5)
            .ascend()
            .returnCSV()

        expect(csv).toBe(", price, , , , , descend, \nand, qty, , , 5, , ascend, ")
    })

    test("or chaining uses or in the chaining column", () => {
        const csv = PantherFilter()
            .attribute("a")
            .nextAttribute("b", "or")
            .returnCSV()

        expect(csv.split("\n")).toHaveLength(2)
        expect(csv.split("\n")[1].startsWith("or, ")).toBe(true)
    })

    test("returnEncodedCSV serializes to a single-line Base64url string", () => {
        const builder = PantherFilter()
            .attribute("price")
            .from(10)
            .to(100)
            .descend()
            .nextAttribute("qty", "and")
            .ascend()
            .equal(5)

        const encoded = builder.returnEncodedCSV()

        expect(encoded).toMatch(/^[A-Za-z0-9_-]+$/)
        expect(encoded).not.toContain("\n")
        expect(encoded).not.toContain("+")
        expect(encoded).not.toContain("/")
        expect(encoded).not.toContain("=")

        expect(JSON.parse(JSON.stringify(webDecodeFilterCSV(encoded))))
            .toEqual(JSON.parse(JSON.stringify(builder.result())))
    })
})

describe("parsePantherFilterCSV - parsing", () => {
    test("parses a single line into one filter with native types", () => {
        const parsed = parsePantherFilterCSV(", price, 10, 100, , name, descend, type")

        expect(parsed).toHaveLength(1)
        expect(parsed[0]).toEqual({
            attributeName: "price",
            fromValue: 10,
            toValue: 100,
            orderBy: "name",
            ascending: "descend",
            groupBy: "type",
        })
    })

    test("converts boolean and number equal values back to native types", () => {
        const parsed = parsePantherFilterCSV(
            ", active, , , true, , ascend, \n, qty, , , 5, , ascend, "
        )

        expect(parsed[0].equal).toBe(true)
        expect(parsed[1].equal).toBe(5)
    })

    test("parses multi-line input and sets chainingInfo on subsequent rows", () => {
        const parsed = parsePantherFilterCSV(
            ", a, , , , , ascend, \nand, b, , , , , ascend, \nor, c, , , , , ascend, "
        )

        expect(parsed).toHaveLength(3)
        expect(parsed[0].chainingInfo).toBeUndefined()
        expect(parsed[1].chainingInfo).toBe("and")
        expect(parsed[2].chainingInfo).toBe("or")
    })

    test("empty slots become undefined instead of empty strings", () => {
        const parsed = parsePantherFilterCSV(", name, , , , , , ")

        expect(parsed[0].fromValue).toBeUndefined()
        expect(parsed[0].toValue).toBeUndefined()
        expect(parsed[0].equal).toBeUndefined()
        expect(parsed[0].orderBy).toBeUndefined()
        expect(parsed[0].groupBy).toBeUndefined()
    })

    test("missing or invalid ascending defaults to ascend", () => {
        const missing = parsePantherFilterCSV(", a, , , , , , ")
        const invalid = parsePantherFilterCSV(", a, , , , , sideways, ")

        expect(missing[0].ascending).toBe("ascend")
        expect(invalid[0].ascending).toBe("ascend")
    })

    test("skips empty lines and trailing newlines", () => {
        const parsed = parsePantherFilterCSV("\n  \n, a, , , , , ascend, \n\n, b, , , , , ascend, \n")

        expect(parsed).toHaveLength(2)
        expect(parsed[0].attributeName).toBe("a")
        expect(parsed[1].attributeName).toBe("b")
    })
})

describe("PantherFilter CSV round-trip", () => {
    test("returnCSV followed by parsePantherFilterCSV reproduces the filters", () => {
        const builder = PantherFilter()
            .attribute("price")
            .from(10)
            .to(100)
            .descend()
            .nextAttribute("qty", "and")
            .ascend()
            .equal(5)
            .nextAttribute("active", "or")
            .descend()
            .equal(true)

        expect(JSON.parse(JSON.stringify(parsePantherFilterCSV(builder.returnCSV()))))
            .toEqual(JSON.parse(JSON.stringify(builder.result())))
    })
})

describe("webEncodeFilterCSV / webDecodeFilterCSV - Base64url transport", () => {
    test("encoded output is single-line, URL-safe, and opaque", () => {
        const filters = PantherFilter().attribute("price").from(10).to(100).descend().result()

        const encoded = webEncodeFilterCSV(filters)

        expect(encoded).toMatch(/^[A-Za-z0-9_-]+$/)
        expect(encoded).not.toContain("\n")
        expect(encoded).not.toContain("+")
        expect(encoded).not.toContain("/")
        expect(encoded).not.toContain("=")
        expect(encoded).not.toBe(", price, 10, 100, , , descend, ")
    })

    test("round-trip reproduces the filters", () => {
        const builder = PantherFilter()
            .attribute("price")
            .from(10)
            .to(100)
            .descend()
            .nextAttribute("qty", "and")
            .ascend()
            .equal(5)
            .nextAttribute("active", "or")
            .descend()
            .equal(true)

        const decoded = webDecodeFilterCSV(webEncodeFilterCSV(builder.result()))

        expect(JSON.parse(JSON.stringify(decoded)))
            .toEqual(JSON.parse(JSON.stringify(builder.result())))
    })

    test("throws on empty input", () => {
        expect(() => webDecodeFilterCSV(""))
            .toThrow(/non-empty/i)
        expect(() => webDecodeFilterCSV("   "))
            .toThrow(/non-empty/i)
    })

    test("throws on invalid Base64url characters", () => {
        expect(() => webDecodeFilterCSV("not valid !!!"))
            .toThrow(/invalid Base64url/i)
    })
})
