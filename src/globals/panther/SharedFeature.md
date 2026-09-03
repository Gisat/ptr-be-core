# Panther Models and Logic
Panther models are based on graph data structure. Graph structure is flat and very flexible. 

## What are Graphs
Graph can be visualiset as dots connected by lines. 

Graphs have two parts: 
- node (dot)
- edge (line)

Nodes are connected by Edges into a graph. 

## Node Structure
Node has two main parts:
- Label(s)
- Properties

### Labels
Label is one or more Tags that define a "category" saing "What this Node is". 
Examples are Place, Period, Datasource etc.

Combination of multiple nodes can be used as multiple-level labeling. Like `[Datasource, WMS]` is combination of two labels for single node.

### Properties
Can be anything inside the node. Can be `key`, `name` or any general property we need.

Every node also carries an `extras` common property — a
[Neo4j Map](https://neo4j.com/docs/cypher-manual/current/values-and-types/maps)
of arbitrary key-value pairs (scalars, lists, nested maps) for
application-specific data that has no dedicated property. It is `null` when
the request does not provide it. Values are runtime-validated on parse and
must be JSON-like: strings, numbers, booleans, null, arrays, and nested objects.

> Note: a MAP is a Cypher [constructed type](https://neo4j.com/docs/cypher-manual/current/values-and-types/property-structural-constructed/),
> which cannot be stored as a native node property. When persisting `extras`,
> serialize it (e.g. to a JSON string property) or pass it as a query parameter.

## Edge Structure
Edge is connection betwee two nodes. Can be directed (from-to). 

Same as Nodes, Edge also can have:
- Label(s)
- Properties

Works the same as in the node case. 

Example of Edge Labels: `IS_RELATED`, `WAITING_FOR`, `CONTAINS`
Example of Edge properties: `expiration`, `length`, `priority`, `created`

## Resources
Please check resorces for visual explanation and many other examples.

- https://neo4j.com/docs/getting-started/graph-database/
- https://www.mongodb.com/resources/basics/databases/mongodb-graph-database