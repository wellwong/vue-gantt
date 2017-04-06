<template>
  <div class="ganttWrap">
    <GanttHeader
      :onPrev="onPrev"
      :onNext="onNext"
      :onToday="onToday"
    ></GanttHeader>
    <GanttBody
      :ganttData="ganttData"
      :onToday="onToday"
      :startDate="ganttStart"
      :endDate="ganttEnd"
      :onTaskUpdate="onTaskUpdate"
    ></GanttBody>
  </div>
</template>
<script>
  import GanttHeader from './GanttHeader.vue';
  import GanttBody from './GanttBody.vue';

  import _ from 'lodash'
  import moment from 'moment'
  import $ from 'jquery'

  //////////////////////////////////////////////
  export default{
		name: 'Gantt',
    props: {
      ganttData: {
        type: Object,
        default() {
          return {};
        }
      },
    },
		data() {
			return {
        ganttStart: this.getGanttDate().start,
        ganttEnd: this.getGanttDate().end,
        T_token: 0,
        data: null,
        timelineSetting: null
			}
		},
		components: {
      GanttHeader,
      GanttBody
    },
    computed: {

    },
    mounted: function () {
      this.$nextTick(function () {
        this.getGanttDate()
//            console.log(JSON.stringify(this.Dates, null, 2))
      })
    },
//    beforeCreate: function() {
//      this.getGanttDate()
//    },
		methods: {

      getGanttDate(num) {
        let ganttStart = new Date();
        let ganttEnd = new Date();
        let start, end;
        if(num){
          start = ganttStart.setMonth(ganttStart.getMonth() - 6 - 11 * num);
          end = ganttEnd.setMonth(ganttEnd.getMonth() + 6 - 11 * num);
        }else{
          start = ganttStart.setMonth(ganttStart.getMonth() - 6);
          end = ganttEnd.setMonth(ganttEnd.getMonth() + 6);
        }
        this.ganttStart = start;
        this.ganttEnd = end;
        return{
          start,
          end
        };
      },

      onPrevYear() {
        this.T_token++
        this.getGanttDate(this.T_token)
        console.log(this.ganttStart)
      },

      onNextYear() {
        this.T_token--
        this.getGanttDate(this.T_token)
        console.log(this.ganttEnd)
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
        if (currentPosition - ganttScreenWidth > 0) {
          this.$scroll(currentPosition - ganttScreenWidth, 'left', 'gantt_task');
//          $('.gantt_task').animate({ scrollLeft: currentPosition - ganttScreenWidth }, 400)
        } else {
          this.onPrevYear()
        }
      },

      onNext () {
        const ganttDataWidth = $('.gantt_data_area').width()
        const ganttScreenWidth = $('.gantt_task').width()
        const currentPosition = $('.gantt_task').scrollLeft()
        if (currentPosition + ganttScreenWidth < (ganttDataWidth - ganttScreenWidth)) {
          this.$scroll(currentPosition + ganttScreenWidth, 'left', 'gantt_task');
//          $('.gantt_task').animate({ scrollLeft: currentPosition + ganttScreenWidth }, 400)
        } else {
          this.onNextYear()
        }
      },

      onToday () {
        if (this.ganttStart && this.ganttEnd) {
          if (moment().isBetween(this.ganttStart,
              this.ganttEnd)) {
            const todayPosition = $($('.today')).position().left
            const screenOffset = 180

            this.$scroll(todayPosition - screenOffset, 'left', 'gantt_task');
//            $('.gantt_task').animate({ scrollLeft: todayPosition - screenOffset }, 400)
          } else {
            this.getGanttDate()
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

//      onLoadTask (updatedTaskId) {
//        return {"topic":"task:get-accessible-tasks","data":{"tasks":[{"time":[],"preview_image":null,"_id":"58d357ddb0bf22af7a1a1b1c","title":"12312","owner_id":"58b4f1ec1e1dbd6567f14bcd","space_id":"58c79ed016a8351f1ec889c4","alt_id":"67","__v":0,"created_source":"web","version":"3b2yIBPURjVU0CoY23qWbzscfCNfhz3oGNSjZFYOlGBpvmmyyznnJe0VM9TrY1z22bkI3Oq9EnmzQULMATthzE9pxfLTeGeGfv6D/q/YTIyezDprxoUOwGBh+aoTyhwBGKWOMT4TTwPnho/djvuLuhZMLHP2TexLvu4u7SraVUBixI/hiaNn4PqsrGjfwKStWZVSRUSfi3R3/hfw9VW70ih1QF5ppIT0QTJtJE5AFztlZ7BXagGUDJJ1F1g6de4tnlY05tbJNA1o3Vvu8SEGj8feofDmY1NHoqxwzZCR0HKfBbeN3TAq75NO7mrKvtSV8BNhJPq+6MYWJ6oOte5L13MzRzEn3mFvP0xrjQOsYAsioVNXzhi/zuubqSLxoD0P0YW81trCj6hzOMMc2aquELohi3Bygi60JDH8hFt3qzaIrvxlIx4BzMJVxIf2HcY5wJSntMAh3U1abIOHXu25EkHVkCsfglexNA1Z5mpVan4syFKmgQ9pTyZs1+BONAbXV4ayYECULKTSUfJax3BE0bNiK3Rid+zboO0QnPxkTiPX/vDO1e/ZyBkIFJ17/u5RAu0OIGmAEeSOTPmTq63cXEDce1q9z79KUcyW4NC0kOw=","points":null,"milestone_completed_dates":[],"is_milestone":false,"remind_recurring_due_date":null,"remind_recurring_type":"none","recurring_due_date":null,"recurring_type":"none","move_history":[],"seen_by":[],"completed_date":null,"is_set_preview":false,"preview_image_id":null,"links_count":0,"attachments_count":0,"comments_count":0,"comments":[],"activity":[],"is_deleted":false,"is_shared":false,"tags":[],"checklist":[],"teams":[],"members":[{"_id":"58b4f1ec1e1dbd6567f14bcd","is_assignee":false}],"color":0,"created":"2017-03-23T05:06:38.835Z","updated":"2017-03-29T03:33:08.268Z","status":0,"description":"","start_date":"2017-04-02T16:00:00.000Z","remind_date":null,"due_date":"2017-04-11T10:00:00.000Z"}],"_tag":"58db2b50273be8c8c7ec78f5"},"mid":44,"tag":"58db2b50273be8c8c7ec78f5"}
//      },
      onTaskUpdate (updatedTask) {
        this.onLoadTask(updatedTask[0]).then((task) => {
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
      }
		},
//    created: function () {
////      this.timelineSetting = this.getTimelineSetting();
////      this.data = this.filterData(this.ganttData.data, this.timelineSetting);
//    }
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
