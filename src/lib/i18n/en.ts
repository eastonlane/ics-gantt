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
