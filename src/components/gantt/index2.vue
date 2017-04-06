<template>
  <div class="ganttWrap">
    <GanttHeader
      :onPrev="onPrev"
      :onNext="onNext"
      :onToday="onToday1"
    ></GanttHeader>
    <GanttBody
      :data="ganttData"
      :onToday="onToday"
      :startDate="startDate"
      :endDate="endDate"
      :onShowTaskById="onShowTaskById"
      :onTaskUpdate="onTaskUpdate"
    ></GanttBody>
  </div>
</template>
<script>
  import GanttHeader from './GanttHeader2.vue';
  import GanttBody from './GanttBody2.vue';

  import _ from 'lodash'
  import moment from 'moment'
  import $ from 'jquery'
  //////////////////////////////////////////////
  //////////////////////////////////////////////
//  const timelineSetting = this.getTimelineSetting()
//  const data = this.filterData(this.props.ganttData.data, timelineSetting)

  export default{
    name: 'Gantt',
    props: {
      ganttData: {
//        type: Object,
//        default() {
//          return {};
//        }
      },
      dateRange: {
        type: Object,
        default() {
          return {};
        }
      },
      onGetTaskById: {
        type: Function
      },
      onToday: {
        type: Function
      },
      onPrevYear: {
        type: Function
      },
      onNextYear: {
        type: Function
      }
    },
    data() {
      return {
        startDate: moment(this.dateRange.start).toDate(),
        endDate: moment(this.dateRange.end).toDate()
      }
    },
    components: {
      GanttHeader,
      GanttBody
    },
    computed: {},
    mounted: function () {
      this.$nextTick(function () {
//            console.log(JSON.stringify(this.Dates, null, 2))
      })
    },
    methods: {
      getInitialState () {
        return {
          showAboutTimelineModal: this.getShowAboutTimelineStatus(),
        }
      },

      getTimelineSetting () {
        const timelineSettings = this.currentUserSetting.timeline
        if (!timelineSettings) return { hide_weekend: false, hide_no_date_task: false }
        return {
          hide_weekend: timelineSettings.hide_weekend || false,
          hide_no_date_task: timelineSettings.hide_no_date_task || false,
          hide_completed_task: timelineSettings.hide_completed_task || false,
        }
      },

      getShowAboutTimelineStatus () {
        const userSettings = this.currentUserSetting
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
          this.onPrevYear()
        }
      },

      onNext () {
        const ganttDataWidth = $('.gantt_data_area').width()
        const ganttScreenWidth = $('.gantt_task').width()
        const currentPosition = $('.gantt_task').scrollLeft()
        if (currentPosition < (ganttDataWidth - ganttScreenWidth)) {
          $('.gantt_task').animate({ scrollLeft: currentPosition + ganttScreenWidth }, 400)
        } else {
          this.onNextYear()
        }
      },

      onToday1 () {
        if (this.dateRange) {
          if (moment().isBetween(this.dateRange.start,
              this.dateRange.end)) {
            const todayPosition = $($('.today')).position().left
            const screenOffset = 180
            $('.gantt_task').animate({ scrollLeft: todayPosition - screenOffset }, 400)
          } else {
            this.onToday()
          }
        }
      },

      onShowTaskById (taskId) {
        const task = this.onGetTaskById(taskId)
        if (!task) return
        this.onShowTask(task)
      },

      onShowAboutTimelineModal () {
        this.setState({ showAboutTimelineModal: true })
      },

      onCloseAboutTimelineModal () {
        this.setState({ showAboutTimelineModal: false })
        if (!this.currentUserSetting.timeline || !this.currentUserSetting.first_dismiss) {
          const updatedTimelineSetting = { first_dismiss: Date() }
          this.updateTimelineSetting(updatedTimelineSetting)
        }
      },

      onTaskUpdate (updatedTask) {
        this.onLoadTask(updatedTask.id).then((task) => {
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
              return this.setTaskStartDateAndDueDate(task, startMoment.toDate(), dueMoment.toDate())
            }
          }

          switch (updatedTask.startDueStatus) {
            case 'no-start-date': {
              if (dueMoment.isSame(task.due_date, 'minute')) return
              return this.setTaskDueDate(task, dueMoment.toDate())
            }
            case 'no-due-date': {
              if (startMoment.isSame(task.start_date, 'minute')) return
              return this.setTaskStartDate(task, startMoment.toDate())
            }
            default: return
          }
        })
      },

      onToggleHideWeekend () {
        const updatedTimelineSetting = { hide_weekend: !this.currentUserSetting.timeline.hide_weekend }
        this.updateTimelineSetting(updatedTimelineSetting)
      },

      onToggleHideNoDateTask () {
        const updatedTimelineSetting = { hide_no_date_task: !this.currentUserSetting.timeline.hide_no_date_task }
        this.updateTimelineSetting(updatedTimelineSetting)
      },

      onToggleHideCompletedTask () {
        const updateTimelineSetting = { hide_completed_task: !this.currentUserSetting.timeline.hide_completed_task }
        this.updateTimelineSetting(updateTimelineSetting)
      },
    }
  }

//  export function setTimeToMoment (dateMoment, timeMoment) {
//    return moment(dateMoment).set(
//      {
//        hour: moment(timeMoment).hour(),
//        minute: moment(timeMoment).minute()
//      }
//    )
//  }

</script>
<style>
</style>
