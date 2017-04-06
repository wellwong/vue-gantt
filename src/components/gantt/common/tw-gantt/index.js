import _ from 'lodash'
import moment from 'moment'

// import { STATUS } from '../tw-projects/Project'

// const { COMPLETE } = require('../react/constants').STORE.TASK_STORE.TASK_STATUS
const Colors = [
  '',
  '#a876cc',
  '#4882ab',
  '#52b166',
  '#ff941d',
  '#e95e51',
  '#a0744c'
]

export function getStartDate (startDate, dueDate) {
  if (startDate) {
    return moment(startDate).format('DD-MM-YYYY')
  } else if (dueDate) {
    return moment(dueDate).format('DD-MM-YYYY')
  } else {
    return null
  }
}

export function getDuration (startDate, dueDate) {
  if (!startDate) return 1
  // We need dateOffset as if task has duedate as midnight we won't count it
  const dateOffset = moment(dueDate).hour() === 0 ? 0 : 1
  const duration = moment(moment(dueDate).startOf('day')).diff(moment(startDate).startOf('day'), 'days') + dateOffset
  return duration || 1
}

export function getTaskStatus (startDate, dueDate, taskStatus) {
  if (!startDate && !dueDate) {
    let status = 'no-start-due'
    if (taskStatus === COMPLETE) status += '-completed'
    return status
  }
  if (taskStatus === COMPLETE) return 'completed'
  if (moment(dueDate).isBefore(moment(), 'day')) {
    return 'overdue'
  } else if (moment(dueDate).isSame(moment(), 'day')) {
    return 'due-today'
  } else {
    return 'planned'
  }
}

export function getNoStartDueDateIndicator (startDate, dueDate) {
  if (!startDate) return 'no-start-date'
  if (!dueDate) return 'no-due-date'
  return ''
}

export function ganttDataFromSearchResult (src) {
  const projects = _.map(src.metadata.projects, project => {
    if (project.status === STATUS.ON_HOLD || project.status === STATUS.CANCEL) return null
    return {
      id: project._id,
      text: project.title,
      start_date: getStartDate(project.start_date),
      duration: getDuration(project.start_date, project.due_date),
      progress: 0,
      open: true,
      type: 'project',
    }
  })

  const tasklists = _.reduce(src.metadata.tasklists, (acc, tasklist) => {
    if (!_.find(projects, { id: tasklist.project_id })) return acc
    const tasklistItem = {
      id: tasklist._id,
      text: tasklist.title,
      parent: tasklist.project_id,
      type: 'tasklist',
      open: true,
    }
    const tasks = _(src.hits)
    .filter(task => _.some(tasklist.tasks, t => t === task.id))
    .reject('is_deleted')
    .map(task => {
      return {
        id: task.id,
        text: task.title,
        start_date: getStartDate(task.start_date, task.due_date),
        duration: getDuration(task.start_date, task.due_date),
        startDueStatus: getNoStartDueDateIndicator(task.start_date, task.due_date),
        type: 'task',
        status: getTaskStatus(task.start_date, task.due_date, task.status),
        progress: 0,
        parent: tasklist._id,
        label: Colors[task.color],
        real_start_date: moment(task.start_date).toDate(),
        real_due_date: moment(task.due_date).toDate()
      }
    }).value()
    if (tasks.length === 0) return acc
    acc.push(tasklistItem)
    acc = acc.concat(tasks)
    return acc
  }, [ ])
  const tasklistProjectIds = _.map(tasklists, 'parent')
  const filteredProject = _.filter(_.compact(projects), p => _.includes(tasklistProjectIds, p.id))
  const filteredTasklist = _.uniqBy(tasklists, 'id')
  return {
    data: [ ...filteredProject, ...filteredTasklist ]
  }
}

export function ganttDataFromProject (src) {
  const project = [ {
    id: src.project._id,
    text: src.project.title,
    start_date: getStartDate(src.project.start_date),
    duration: getDuration(src.project.start_date, src.project.due_date),
    progress: 0,
    open: true,
    type: 'project',
  } ]
  const tasklists = _.reduce(src.tasklists, (acc, tasklist) => {
    const tasklistItem = {
      id: tasklist._id,
      text: tasklist.title,
      parent: tasklist.project_id,
      type: 'tasklist',
      open: true,
    }
    const tasks = _(src.tasks)
    .filter(task => _.some(tasklist.tasks, t => t === task._id))
    .reject('is_deleted')
    .map(task => {
      const noStartDue = task.start_date == null && task.due_date == null
      return {
        id: task._id,
        text: task.title,
        start_date: noStartDue ? moment(src.dateRange.start).startOf('day').toDate() : getStartDate(task.start_date, task.due_date),
        duration: noStartDue ? 366 : getDuration(task.start_date, task.due_date),
        startDueStatus: getNoStartDueDateIndicator(task.start_date, task.due_date),
        type: 'task',
        status: getTaskStatus(task.start_date, task.due_date, task.status),
        progress: 0,
        parent: tasklist._id,
        label: Colors[task.color],
        real_start_date: task.start_date,
        real_due_date: task.due_date
      }
    }).value()
    if (tasks.length === 0) return acc
    acc.push(tasklistItem)
    acc = acc.concat(tasks)
    return acc
  }, [ ])
  return {
    data: [ ...project, ...tasklists ]
  }
}



// WEBPACK FOOTER //
// ./src/tw-gantt/index.js
