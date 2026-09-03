# Plan: Add common node property "extras" (Neo4j Map type)

Implements [Gisat/ptr-be-core#69](https://github.com/Gisat/ptr-be-core/issues/69)
— Add a new common property called "extras" typed as a Neo4j Map.

## Context

- `PantherEntity` (`src/globals/panther/models.nodes.ts:10`) is the base
  interface shared by every graph node (Place, Period, Datasource, …). It
  currently holds only structural fields: `labels`, `key`, `nameDisplay`,
  `nameInternal`, `description`, `lastUpdatedAt`.
- Typed, label-specific properties are modeled as `Has*` mixin interfaces in
  `src/globals/panther/models.nodes.properties.general.ts` and
  `src/globals/panther/models.nodes.properties.datasources.ts`.
- Nodes are built from raw HTTP request bodies by
  `parseSinglePantherNode` / `parseBasicNodeFromBody`
  (`src/node/panther/parse.changeNodes.ts:20`). Basic fields (including
  `description`, which defaults to `""`) are parsed in
  `parseBasicNodeFromBody`; label-specific properties are applied per label.
- Shared types (`Nullable`, `Unsure`, …) live in
  `src/globals/coding/code.types.ts`; everything is re-exported through
  `src/index.browser.ts`.
- Issue #69 requires the new property to use the Neo4j Map type
  (https://neo4j.com/docs/cypher-manual/current/values-and-types/maps): a
  map is a collection of key-value pairs where keys are strings and values
  may be scalars (string/number/boolean), null, lists of values, or nested
  maps — i.e. a JSON-like recursive object.

## Design decisions

- `extras` is a **common** property, so it belongs on `PantherEntity`
  itself (inherited by every node type and by `FullPantherEntity`), not on a
  label-specific partial mixin.
- Follow the existing `description: Nullable<string>` pattern: the key is
  always present on the entity, its value is `null` when the request does
  not provide it (`extras: Nullable<Neo4jMap>`).
- The recursive `Neo4jMap` type is a general value type → placed in
  `src/globals/coding/code.types.ts` next to `Nullable`/`Unsure`.
- `HasExtras` mixin keeps the `Has*` naming convention and is the single
  source of the property; `PantherEntity` extends it.
- Parsing happens once in `parseBasicNodeFromBody` — no label loop change
  needed since it applies to all nodes.

## Changes

1. **`src/globals/coding/code.types.ts`** — add the recursive Neo4j Map type:
   ```ts
   /** Neo4j Map value — scalar, list of values, or nested map. */
   type Neo4jMapValue = string | number | boolean | null | Neo4jMapValue[] | { [key: string]: Neo4jMapValue }

   /** Neo4j Map — unordered key-value pairs with string keys. */
   type Neo4jMap = { [key: string]: Neo4jMapValue }
   ```
   Add both to the export block.

2. **`src/globals/panther/models.nodes.properties.general.ts`** — add mixin
   and import `Neo4jMap` + `Nullable`:
   ```ts
   /**
    * Common node property with arbitrary key-value data.
    * Keys are strings, values follow the Neo4j Map type
    * (https://neo4j.com/docs/cypher-manual/current/values-and-types/maps).
    */
   export interface HasExtras {
       extras: Nullable<Neo4jMap>
   }
   ```

3. **`src/globals/panther/models.nodes.ts`** — make the base entity extend
   the new mixin so every node carries `extras`:
   ```ts
   export interface PantherEntity extends HasExtras {
       labels: ...,
       key: string,
       ...
   }
   ```
   `FullPantherEntity` inherits it automatically via `PantherEntity`.

4. **`src/node/panther/parse.changeNodes.ts`** — parse `extras` in
   `parseBasicNodeFromBody`:
   - destructure `extras` from `bodyRaw`
   - add `extras: extras ?? null` to the returned `PantherEntity`
   - import `HasExtras` / `Neo4jMap` as needed for typing

5. **`src/index.browser.ts`** — export the new types:
   - `Neo4jMap`, `Neo4jMapValue` from `./globals/coding/code.types.js`
   - `HasExtras` from `./globals/panther/models.nodes.properties.general.js`

6. **Tests**
   - `tests/fixtures/graph.import.nodes.edges.json` — add an `extras` object
     to one fixture node (e.g. the `application` node n0), including a nested
     map and a list value to prove recursion, e.g.:
     ```json
     "extras": { "source": "gisat", "tags": ["demo", "test"], "meta": { "owner": "team-x" } }
     ```
   - `tests/functional/parsers.graphs.spec.ts` — add assertions:
     - parsed application node has `extras` equal to the fixture object
     - nodes without `extras` in the request have `extras === null`

7. **Docs** — `src/globals/panther/SharedFeature.md` — mention the common
   `extras` property in the node properties section.

## Files Modified

| File | Change |
|------|--------|
| src/globals/coding/code.types.ts | Add `Neo4jMapValue`, `Neo4jMap` types and export them |
| src/globals/panther/models.nodes.properties.general.ts | Add `HasExtras` mixin |
| src/globals/panther/models.nodes.ts | `PantherEntity` extends `HasExtras` |
| src/node/panther/parse.changeNodes.ts | Parse `extras` in `parseBasicNodeFromBody` (default `null`) |
| src/index.browser.ts | Export `Neo4jMap`, `Neo4jMapValue`, `HasExtras` |
| tests/fixtures/graph.import.nodes.edges.json | Add `extras` to fixture node |
| tests/functional/parsers.graphs.spec.ts | Assert `extras` parsed and defaulted |
| src/globals/panther/SharedFeature.md | Document `extras` common property |

## Verification

```bash
npm run lint
npm run build
npm test
```

## PR

Open PR referencing issue #69:
`feat: add common node property extras` — mention
"Closes https://github.com/Gisat/ptr-be-core/issues/69" in the PR body.
