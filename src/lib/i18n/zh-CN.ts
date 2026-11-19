const zhCN = {
  appName: 'ICS 甘特图',
  theme: '主题',
  language: '语言',
  loadCalendarsError: '无法加载已保存的日历：',

  common: {
    add: '添加',
    edit: '编辑',
    reset: '重置',
    cancel: '取消',
    remove: '删除',
    filter: '筛选',
    name: '名称',
    url: '网址',
    category: '分类',
    days: '天',
    selectDate: '选择日期',
  },

  filters: {
    recent: '近期',
    duration: '时长',
    range: '日期范围',
    blacklist: '分类黑名单',
    whitelist: '分类白名单',
    placeholder: '筛选',
    addFilter: '添加筛选',
    editFilter: '编辑筛选',
    removeFilter: '删除筛选',
    resetFilters: '重置筛选',
    rangeRequired: '请设置日期范围。',
    invalidRange: '开始日期不能晚于结束日期。',
    invalidRangeError: '日期范围无效。',
    categoryPlaceholder: '分类',
  },

  calendar: {
    heading: '日历',
    copyUrl: '复制网址',
    remove: '删除',
    addTitle: '添加新日历',
    fileTab: '文件',
    urlTab: '网址',
    nameLabel: '名称',
    fileLabel: '选择 ICS 文件',
    urlLabel: '网址',
    duplicateName: '已存在同名日历。',
    invalidContentType: '该网址未返回 ICS 日历。',
  },

  a11y: {
    close: '关闭',
    toggleSidebar: '切换侧边栏',
    sidebar: '侧边栏',
    mobileSidebarDescription: '显示移动端侧边栏。',
  },

  chart: {
    today: '跳转至今天',
    taskName: '任务名称',
    tooltip: {
      name: '名称',
      startDate: '开始日期',
      endDate: '结束日期',
      remainingTime: '剩余时间',
      finished: '已结束',
      lessThanOneHour: '不足一小时',
      remainingDays_other: '{{count}} 天',
      remainingHours_other: '{{count}} 小时',
    },
  },
} as const;

export default zhCN;
