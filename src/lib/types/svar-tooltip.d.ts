export type TooltipContentData =
  | { task: ITask; segmentIndex: number | null; violated?: boolean }
  | { constraint: ITask; violated?: boolean }
  | { link: ILink }
  | { rollup: ITask }
  | { resource: IResource }
  | { histogram: IResourceHistogramTooltip }
  | { sCurve: ISCurveTooltip }
  | { deadline: ITask };
