const en = {
  appName: 'ICS Gantt',
  theme: 'Theme',
  language: 'Language',
  loadCalendarsError: 'Unable to load saved calendars:',

  common: {
    add: 'Add',
    edit: 'Edit',
    reset: 'Reset',
    cancel: 'Cancel',
    remove: 'Remove',
    filter: 'Filter',
    name: 'Name',
    url: 'URL',
    category: 'Category',
    days: 'days',
    selectDate: 'Select a date',
  },

  filters: {
    recent: 'Recent',
    duration: 'Duration',
    range: 'Date Range',
    blacklist: 'Categories Blacklist',
    whitelist: 'Categories Whitelist',
    placeholder: 'Filter',
    addFilter: 'Add filter',
    editFilter: 'Edit filter',
    removeFilter: 'Remove filter',
    resetFilters: 'Reset Filters',
    rangeRequired: 'Please set the range.',
    invalidRange: 'Start date must not be after the end date.',
    invalidRangeError: 'Invalid date range.',
    categoryPlaceholder: 'Category',
    editor: {
      tips: {
        whitelist: 'Select categories to include',
        blacklist: 'Select categories to exclude',
      },
    },
    workspace: {
      tittle: 'Calendar Event Filters',
    },
    overview: {
      empty: 'No active filter',
      heading: 'Filter calendar events that:',
    },
    description: {
      range: {
        closed: 'Last between {{start,bold}} and {{end,bold}}',
        after: 'End after {{value,bold}}',
        before: 'Start before {{value, bold}}',
      },
      recent_one: 'In recent {{count, bold}} day',
      recent_other: 'In recent {{count, bold}} days',
      duration_one: 'Last for no more than {{count, bold}} day',
      duration_other: 'Last for no more than {{count, bold}} days',
      whitelist_single: 'Are this category: {{value, bold}}',
      whitelist_multiple: 'Are one these categories: {{value, bold}}',
      blacklist_single: 'Are not this category: {{value, bold}}',
      blacklist_multiple: 'Are none of these categories: {{value, bold}}',
    },
  },

  calendar: {
    heading: 'Calendars',
    copyUrl: 'Copy URL',
    remove: 'Remove',
    addTitle: 'Add a new calendar',
    fileTab: 'File',
    urlTab: 'URL',
    nameLabel: 'Name',
    fileLabel: 'Select your ICS file',
    urlLabel: 'URL',
    duplicateName: 'A calendar with this name already exists.',
    invalidContentType: 'The URL does not return an ICS calendar.',
  },

  a11y: {
    close: 'Close',
    toggleSidebar: 'Toggle sidebar',
    sidebar: 'Sidebar',
    mobileSidebarDescription: 'Displays the mobile sidebar.',
  },

  chart: {
    today: 'Today',
    taskName: 'Task name',
    tooltip: {
      name: 'Name',
      startDate: 'Start date',
      endDate: 'End date',
      remainingTime: 'Remaining time',
      finished: 'Finished',
      lessThanOneHour: 'Less than one hour',
      remainingDays_one: '{{count}} day',
      remainingDays_other: '{{count}} days',
      remainingHours_one: '{{count}} hour',
      remainingHours_other: '{{count}} hours',
    },
  },
} as const;

export default en;
