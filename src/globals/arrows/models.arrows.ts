import { UsedDatasourceLabels, UsedEdgeLabels, UsedNodeLabels } from "../panther/enums.panther";

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

export interface ArrowsEdge{
    id: string;
    fromId: string;
    toId: string;
    type: string | UsedEdgeLabels,
    properties?: object
    style?: object
}