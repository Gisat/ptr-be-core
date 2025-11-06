import { UsedDatasourceLabels, UsedEdgeLabels, UsedNodeLabels } from "../panther/enums.panther";

/**
 * Represents a node in the Arrows diagram/model.
 *
 * @remarks
 * This interface describes the minimal and optional data used to render and
 * identify a node inside an Arrows-based diagram or graph. Fields marked
 * optional may be omitted when not required by the renderer or business logic.
 *
 * @property id - A unique string identifier for the node. Required.
 * @property caption - An optional human-readable title or label for the node.
 * @property labels - Labels associated with the node. Can be one of:
 *   - string[]: plain text labels,
 *   - UsedNodeLabels[]: typed node label objects (see UsedNodeLabels),
 *   - UsedDatasourceLabels[]: typed datasource label objects (see UsedDatasourceLabels).
 *   Labels are typically used for filtering, categorization, or display.
 * @property properties - Optional arbitrary metadata for the node. Free-form object
 *   consumed by application logic (e.g., domain attributes, IDs, flags).
 * @property position - Optional position of the node in diagram coordinate space.
 *   - x: horizontal coordinate (number)
 *   - y: vertical coordinate (number)
 * @property style - Optional rendering/style overrides (e.g., shape, color, CSS classes).
 *   This is a renderer-specific, free-form object.
 */
export interface ArrowsNode{
    id: string;
    caption?: string,
    labels: string[] | UsedNodeLabels[] | UsedDatasourceLabels[],
    properties?: object
    position?: {
        x: number,
        y: number
    },
    style?: object
}

/**
 * Describes a directed edge between two nodes used by the Arrows model.
 *
 * The interface captures identity, connectivity, semantic typing and optional
 * metadata or rendering hints for an edge.
 *
 * @property id - Unique identifier for the edge.
 * @property fromId - Identifier of the source node (edge origin).
 * @property toId - Identifier of the target node (edge destination).
 * @property type - Semantic label or type for the edge; can be a free-form string or one of the predefined UsedEdgeLabels.
 * @property properties - Optional arbitrary metadata for the edge (key/value map) used for domain-specific data.
 * @property style - Optional presentation/visualization overrides (for example color, width, dash pattern) applied when rendering the edge.
 */
export interface ArrowsEdge{
    id: string;
    fromId: string;
    toId: string;
    type: string | UsedEdgeLabels,
    properties?: object
    style?: object
}