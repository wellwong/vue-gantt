import _ from 'lodash'
import moment from 'moment'
import React from 'react'
import { compose, pure } from 'recompose'
import u from 'updeep'

import connectIO from '../../../../io-action/connectIO'
import withSelectors from '../../../../tw-app-core/withSelectors'
import { selectFloatingPanelIsOpen } from '../../../../tw-store/activeRoute/selectors'
import { selectCurrentUserSettings } from '../../../../tw-store/currentUser/selectors'
import * as ProjectActions from '../../../action-creators/ProjectActions'
import * as TaskActions from '../../../action-creators/TaskActions'
import { updateSettings } from '../../../action-creators/UserActions'
import Gantt from './Gantt.react'
import GanttHeader from './GanttHeader.react'

const enhance = compose(
  connectIO({
    onShowTask: () => (task) => TaskActions.showTask(task, { reveal: false }),
    onLoadTask: () => (taskId) => TaskActions.loadTask(taskId),
    setTaskStartDate: () => (task, date) => (
      TaskActions.setStartDate(task, date)
    ),
    setTaskDueDate: () => (task, date) => (
      TaskActions.setDueDateAndRecurringType(task, date)
    ),
    setTaskStartDateAndDueDate: () => (task, startDate, endDate) => (
      TaskActions.setStartDateAndDueDate(task, startDate, endDate)
    ),
    setProjectDueDate: () => (projectId, dueDate) => (
      ProjectActions.setDueDate(projectId, dueDate)
    ),
    updateSettings: () => (settings) => updateSettings(settings),
  }),
  withSelectors(() => ({
    currentUserSetting: selectCurrentUserSettings,
    floatingPanelOpen: selectFloatingPanelIsOpen,
  })),
  pure
)

const GanttContainer = React.createClass({

  propTypes: {
    ganttData: React.PropTypes.object,
    dateRange: React.PropTypes.object,
    enableOptions: React.PropTypes.object,
    onGetTaskById: React.PropTypes.func,
    onToday: React.PropTypes.func,
    onPrevYear: React.PropTypes.func,
    onNextYear: React.PropTypes.func,

    // Higher-order component
    onShowTask: React.PropTypes.func.isRequired,
    onLoadTask: React.PropTypes.func.isRequired,
    setTaskStartDateAndDueDate: React.PropTypes.func.isRequired,
    setTaskDueDate: React.PropTypes.func.isRequired,
    setTaskStartDate: React.PropTypes.func.isRequired,
    setProjectDueDate: React.PropTypes.func.isRequired,
    floatingPanelOpen: React.PropTypes.bool.isRequired,
    updateSettings: React.PropTypes.func.isRequired,
    currentUserSetting: React.PropTypes.object.isRequired,
  },

  getInitialState () {
    return {
      showAboutTimelineModal: this.getShowAboutTimelineStatus(),
    }
  },

  getTimelineSetting () {
    const timelineSettings = this.props.currentUserSetting.timeline
    if (!timelineSettings) return { hide_weekend: false, hide_no_date_task: false }
    return {
      hide_weekend: timelineSettings.hide_weekend || false,
      hide_no_date_task: timelineSettings.hide_no_date_task || false,
      hide_completed_task: timelineSettings.hide_completed_task || false,
    }
  },

  getShowAboutTimelineStatus () {
    const userSettings = this.props.currentUserSetting
    return !(userSettings.timeline && userSettings.timeline.first_dismiss)
  },

  filterData (data, settings) {
    let filteredData = data
    if (settings.hide_no_date_task) {
      filteredData = _.reject(filteredData, { status: 'no-start-due' })
    }
    if (settings.hide_completed_task) {
      filteredData = _.reject(filteredData, { status: 'completed' })
      filteredData = _.reject(filteredData, { status: 'no-start-due-completed' })
    }
    return { data: filteredData, tag: filteredData.tag }
  },

  updateTimelineSetting (updatedTimelineSetting) {
    const updatedUserSettings = u({ timeline: updatedTimelineSetting }, this.props.currentUserSetting)
    this.props.updateSettings(updatedUserSettings)
  },

  onPrev () {
    const ganttScreenWidth = $('.gantt_task').width()
    const currentPosition = $('.gantt_task').scrollLeft()
    if (currentPosition > 0) {
      $('.gantt_task').animate({ scrollLeft: currentPosition - ganttScreenWidth }, 400)
    } else {
      this.props.onPrevYear()
    }
  },

  onNext () {
    const ganttDataWidth = $('.gantt_data_area').width()
    const ganttScreenWidth = $('.gantt_task').width()
    const currentPosition = $('.gantt_task').scrollLeft()
    if (currentPosition < (ganttDataWidth - ganttScreenWidth)) {
      $('.gantt_task').animate({ scrollLeft: currentPosition + ganttScreenWidth }, 400)
    } else {
      this.props.onNextYear()
    }
  },

  onToday () {
    if (this.props.dateRange) {
      if (moment().isBetween(this.props.dateRange.start,
        this.props.dateRange.end)) {
        const todayPosition = $($('.today')).position().left
        const screenOffset = 180
        $('.gantt_task').animate({ scrollLeft: todayPosition - screenOffset }, 400)
      } else {
        this.props.onToday()
      }
    }
  },

  onShowTaskById (taskId) {
    const task = this.props.onGetTaskById(taskId)
    if (!task) return
    this.props.onShowTask(task)
  },

  onShowAboutTimelineModal () {
    this.setState({ showAboutTimelineModal: true })
  },

  onCloseAboutTimelineModal () {
    this.setState({ showAboutTimelineModal: false })
    if (!this.props.currentUserSetting.timeline || !this.props.currentUserSetting.first_dismiss) {
      const updatedTimelineSetting = { first_dismiss: Date() }
      this.updateTimelineSetting(updatedTimelineSetting)
    }
  },

  onTaskUpdate (updatedTask) {
    this.props.onLoadTask(updatedTask.id).then((task) => {
      // Hack as task without date is 366 days, Timeline should not be able to set date to it
      if (updatedTask.duration === 366) return
      // Hack for gantt if its midnight its shouldn't show
      const offset = moment(task.due_date).hour() === 0 ? 0 : 1
      const startMoment = task.start_date 
        ? setTimeToMoment(updatedTask.start_date, task.start_date)
        : moment(updatedTask.start_date)
      const dueMoment = task.due_date
        ? setTimeToMoment(moment(updatedTask.start_date).add(updatedTask.duration - offset, 'days'), task.due_date)
        : moment(updatedTask.start_date).add(updatedTask.duration - offset, 'days')
      
      if (startMoment.isSame(task.start_date, 'minute') && dueMoment.isSame(task.due_date, 'minute')) return
      if (updatedTask.duration > 1) {
        if (startMoment.isValid() && dueMoment.isValid()) {
          return this.props.setTaskStartDateAndDueDate(task, startMoment.toDate(), dueMoment.toDate())
        }
      }

      switch (updatedTask.startDueStatus) {
        case 'no-start-date': {
          if (dueMoment.isSame(task.due_date, 'minute')) return
          return this.props.setTaskDueDate(task, dueMoment.toDate())
        }
        case 'no-due-date': {
          if (startMoment.isSame(task.start_date, 'minute')) return
          return this.props.setTaskStartDate(task, startMoment.toDate())
        }
        default: return
      }
    })
  },

  onToggleHideWeekend () {
    const updatedTimelineSetting = { hide_weekend: !this.props.currentUserSetting.timeline.hide_weekend }
    this.updateTimelineSetting(updatedTimelineSetting)
  },

  onToggleHideNoDateTask () {
    const updatedTimelineSetting = { hide_no_date_task: !this.props.currentUserSetting.timeline.hide_no_date_task }
    this.updateTimelineSetting(updatedTimelineSetting)
  },

  onToggleHideCompletedTask () {
    const updateTimelineSetting = { hide_completed_task: !this.props.currentUserSetting.timeline.hide_completed_task }
    this.updateTimelineSetting(updateTimelineSetting)
  },

  render () {
    const timelineSetting = this.getTimelineSetting()
    const data = this.filterData(this.props.ganttData.data, timelineSetting)

    return (
      <div className='tw-gantt-container ax-timeline-view'>
        <GanttHeader
          onPrev={this.onPrev}
          onNext={this.onNext}
          onToday={this.onToday}
          hideWeekend={timelineSetting.hide_weekend}
          hideNoDateTask={timelineSetting.hide_no_date_task}
          hideCompletedTask={timelineSetting.hide_completed_task}
          showAboutTimelineModal={this.state.showAboutTimelineModal}
          onToggleHideWeekend={this.onToggleHideWeekend}
          onToggleHideNoDateTask={this.onToggleHideNoDateTask}
          onToggleHideCompletedTask={this.onToggleHideCompletedTask}
          onShowAboutTimelineModal={this.onShowAboutTimelineModal}
          onCloseAboutTimelineModal={this.onCloseAboutTimelineModal}
          enableOptions={this.props.enableOptions}
        />
        <Gantt
          data={data}
          onToday={this.onToday}
          startDate={moment(this.props.dateRange.start).toDate()}
          endDate={moment(this.props.dateRange.end).toDate()}
          floatingPanelOpen={this.props.floatingPanelOpen}
          hideWeekend={timelineSetting.hide_weekend}
          onShowTaskById={this.onShowTaskById}
          onTaskUpdate={this.onTaskUpdate}
        />
      </div>
    )
  }
})

export function setTimeToMoment (dateMoment, timeMoment) {
  return moment(dateMoment).set(
    {
      hour: moment(timeMoment).hour(),
      minute: moment(timeMoment).minute()
    }
  )
}

export default enhance(GanttContainer)



// WEBPACK FOOTER //
// ./src/react/components/v2/gantt/GanttContainer.react.js