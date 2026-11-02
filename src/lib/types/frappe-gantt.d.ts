declare module 'frappe-gantt' {
  export type DateInput = string | Date;

  /**
   * Interval syntax accepted by Frappe Gantt:
   * `7d`, `1m`, `2y`, `1h`, `30min`, `10s`, and similar.
   */
  export type GanttInterval =
    `${number}${'y' | 'm' | 'd' | 'h' | 'min' | 's' | 'ms'}`;

  export type GanttViewModeName =
    | 'Hour'
    | 'Quarter Day'
    | 'Half Day'
    | 'Day'
    | 'Week'
    | 'Month'
    | 'Year'
    | (string & {});

  export type GanttScrollTarget = 'start' | 'end' | 'today' | DateInput;

  export type GanttLines = 'none' | 'vertical' | 'horizontal' | 'both';

  export type GanttPopupTrigger = 'click' | 'hover';

  export type GanttTaskId = string | number;

  export interface GanttTask {
    id: GanttTaskId;
    name: string;
    start: DateInput;
    end?: DateInput;
    /** Alternative to `end`, for example `"3d"` or `"1d 4h"`. */
    duration?: string;
    progress?: number;
    dependencies?: string | GanttTaskId[];
    custom_class?: string;
    description?: unknown;
    [key: string]: unknown;
  }

  export interface GanttHolidayDate {
    date: DateInput;
    label?: string;
  }

  export type GanttHolidayEntry =
    | 'weekend'
    | DateInput
    | GanttHolidayDate
    | Array<DateInput | GanttHolidayDate>;

  /**
   * CSS color/variable to holiday rule.
   * Example: `{ "var(--g-weekend-highlight-color)": "weekend" }`.
   */
  export type GanttHolidays = Record<string, GanttHolidayEntry>;

  export type GanttIgnoredPeriod =
    'weekend' | DateInput | ((date: Date) => boolean);

  export type GanttTextViewFormatter = (
    currentDate: Date,
    previousDate: Date | null,
    language: string,
  ) => string;

  export type GanttTextView = string | GanttTextViewFormatter;

  export interface GanttViewMode {
    name: GanttViewModeName;
    /** Time shown before the first and after the last task. */
    padding: GanttInterval | [GanttInterval, GanttInterval];
    /** Duration represented by one timeline column. */
    step: GanttInterval;
    lower_text?: GanttTextView;
    upper_text?: GanttTextView;
    upper_text_frequency?: number;
    thick_line?: (currentDate: Date) => boolean;
    date_format?: string;
    column_width?: number;
    snap_at?: GanttInterval;
  }

  export interface GanttPopupContext<TTask extends GanttTask = GanttTask> {
    task: TTask;
    chart: Gantt<TTask>;
    get_title: () => HTMLElement;
    get_subtitle: () => HTMLElement;
    get_details: () => HTMLElement;
    set_title: (html: string) => void;
    set_subtitle: (html: string) => void;
    set_details: (html: string) => void;
    /** Supply the action label and its click handler. */
    add_action: (html: string, callback: () => void) => void;
  }

  export type GanttPopup<TTask extends GanttTask = GanttTask> = (
    context: GanttPopupContext<TTask>,
  ) => string | false | void;

  export interface GanttOptions<TTask extends GanttTask = GanttTask> {
    /** Curve radius of dependency arrows. Default: `5`. */
    arrow_curve?: number;
    /** Move labels while scrolling horizontally. Default: `false`. */
    auto_move_label?: boolean;
    /** Task bar corner radius in pixels. Default: `3`. */
    bar_corner_radius?: number;
    /** Task bar height in pixels. Default: `30`. */
    bar_height?: number;
    /** Chart height in pixels, or `auto` to fit all rows. Default: `"auto"`. */
    container_height?: 'auto' | number;
    /** Width of each timeline column, overriding the view mode default. */
    column_width?: number | null;
    /** Date format used by the active view mode. */
    date_format?: string;
    /** Upper header height in pixels. Default: `45`. */
    upper_header_height?: number;
    /** Lower header height in pixels. Default: `30`. */
    lower_header_height?: number;
    /** Drag/resize snapping interval. Default: `"1d"`. */
    snap_at?: GanttInterval | null;
    /** Extend the timeline beyond the task range. Default: `true`. */
    infinite_padding?: boolean;
    /** Holidays mapped to highlight colors. */
    holidays?: GanttHolidays;
    /** Defines which days count as weekends. */
    is_weekend?: (date: Date) => boolean;
    /** Dates, weekend, or predicates excluded from task progress. */
    ignore?: GanttIgnoredPeriod | GanttIgnoredPeriod[];
    /** Locale passed to Frappe's date formatting. Default: `"en"`. */
    language?: string;
    /** Grid-line display mode. Default: `"both"`. */
    lines?: GanttLines;
    /** Move dependent tasks together while dragging. Default: `true`. */
    move_dependencies?: boolean;
    /** Padding around task bars in pixels. Default: `18`. */
    padding?: number;
    /** Popup renderer. `false` disables popups. */
    popup?: false | GanttPopup<TTask>;
    /** Event that opens the popup. Default: `"click"`. */
    popup_on?: GanttPopupTrigger;
    /** Prevent progress editing. Default: `false`. */
    readonly_progress?: boolean;
    /** Prevent date editing. Default: `false`. */
    readonly_dates?: boolean;
    /** Prevent all chart editing. Default: `false`. */
    readonly?: boolean;
    /** Raise `date_click` when the background is clicked. Default: `false`. */
    hover_on_date?: boolean;
    /** Keep duration fixed when resizing dates. Default: `false`. */
    fixed_duration?: boolean;
    /** Initial scroll target. Default: `"today"`. */
    scroll_to?: GanttScrollTarget | null;
    /** Render expected progress alongside actual progress. Default: `false`. */
    show_expected_progress?: boolean;
    /** Show the chart's "Today" button. Default: `true`. */
    today_button?: boolean;
    /** Initial predefined view name or configured view mode. Default: `"Day"`. */
    view_mode?: GanttViewModeName | GanttViewMode;
    /** Show the view-mode selector. Default: `false`. */
    view_mode_select?: boolean;
    /**
     * Available view modes. If supplied, Frappe automatically selects the
     * first mode as the initial view.
     */
    view_modes?: Array<GanttViewModeName | GanttViewMode>;

    /** Fired when a task bar is clicked. */
    on_click?: (task: TTask) => void;
    /** Fired when the pointer enters a task bar. */
    on_hover?: (
      task: TTask,
      screenX: number,
      screenY: number,
      event: MouseEvent,
    ) => void;
    /** Fired after a task bar is double-clicked. */
    on_double_click?: (task: TTask) => void;
    /** Fired when a task date is changed by dragging. */
    on_date_change?: (task: TTask, start: Date, end: Date) => void;
    /** Fired when task progress is changed by dragging. */
    on_progress_change?: (task: TTask, progress: number) => void;
    /** Fired when the active view mode changes. */
    on_view_change?: (mode: GanttViewMode) => void;
    /** Fired when the chart background is clicked. */
    on_date_click?: (date: string | null) => void;
  }

  export default class Gantt<TTask extends GanttTask = GanttTask> {
    constructor(
      wrapper: string | HTMLElement | SVGElement,
      tasks: TTask[],
      options?: GanttOptions<TTask>,
    );

    /** Re-render using merged options. */
    update_options(options: Partial<GanttOptions<TTask>>): void;

    /** Change view by name or full view-mode definition. */
    change_view_mode(
      viewMode?: GanttViewModeName | GanttViewMode,
      maintainPosition?: boolean,
    ): void;

    /** Replace tasks and re-render. */
    refresh(tasks: TTask[]): void;

    /** Update one task and redraw its bar. */
    update_task(taskId: GanttTaskId, newDetails: Partial<TTask>): void;

    /** Scroll to the current date when it lies within the timeline. */
    scroll_current(): void;

    /** Read a task by id. */
    get_task(id: GanttTaskId): TTask | undefined;

    /** Available view mode definitions. */
    options: GanttOptions<TTask>;
    tasks: TTask[];
  }
}
