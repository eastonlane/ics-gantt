// src/lib/types/svar-locales.d.ts

declare module '@svar-ui/gantt-locales' {
  // Define the exact shape of the Gantt dictionary based on your raw file
  export interface GanttLocale {
    // Header / sidebar
    'Task name': string;
    'Start date': string;
    'Add task': string;
    Duration: string;
    Task: string;
    Milestone: string;
    'Summary task': string;
    Resources: string;
    WBS: string;
    Hours: string;
    Capacity: string;

    // Sidebar
    Save: string;
    Delete: string;
    Name: string;
    Description: string;
    Type: string;
    'End date': string;
    Progress: string;
    Manual: string;
    Inactive: string;
    'Skip resource calendars': string;
    Predecessors: string;
    Successors: string;
    'Add task name': string;
    'Add description': string;
    'End-to-start': string;
    'Start-to-start': string;
    'End-to-end': string;
    'Start-to-end': string;
    'No links': string;
    'No assignments': string;
    'No segments': string;
    'Add resource': string;
    Resource: string;
    General: string;
    Scheduling: string;
    Deadline: string;
    None: string;
    'Start no earlier than': string;
    'Start no later than': string;
    'Finish no earlier than': string;
    'Finish no later than': string;
    'Must start on': string;
    'Must finish on': string;
    Constraint: string;
    Links: string;
    Lag: string;
    Segments: string;
    Ungrouped: string;
    Unassigned: string;
    Unschedule: string;

    // Context menu / toolbar
    Add: string;
    'Child task': string;
    'Task above': string;
    'Task below': string;
    'Convert to': string;
    Edit: string;
    Cut: string;
    Copy: string;
    Paste: string;
    Move: string;
    Up: string;
    Down: string;
    Indent: string;
    Outdent: string;
    Split: string;
    Segment: string;

    // Toolbar
    'New task': string;
    'Move up': string;
    'Move down': string;
    Undo: string;
    Redo: string;

    // Formats
    Week: string;
    Q: string;

    // Conflicts
    Conflicts: string;
    'No conflicts found': string;
    'Link violation': string;
    'Constraint violation': string;
    'From link': string;
    'Remove link': string;
    'Move task': string;
    'Remove constraint': string;
  }

  // The actual exported structure wraps the strings in a "gantt" object
  export interface LocaleExport {
    gantt: GanttLocale;
  }

  // Declare the named exports that SVAR uses
  export const en: LocaleExport;
  export const cn: LocaleExport;
  // Add other languages if you use them
  // export const de: LocaleExport;
}
