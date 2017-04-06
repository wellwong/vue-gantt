<template>
    <div id='gantt-placeholder' :style="ganttStyle"></div>
</template>
<script>

  import './gantt/codebase/dhtmlxgantt.css'
    import './common/dhtmlxgantt.lib.js'
//  import './gantt/codebase/dhtmlxgantt.js'
//  import './gantt/codebase/sources/dhtmlxgantt.js'
  import './gantt/codebase/locale/locale_cn.js'
  import './gantt/codebase/ext/dhtmlxgantt_marker.js'
  import './gantt/codebase/ext/dhtmlxgantt_tooltip.js'


//  import './common/dhtmlxgantt.lib.js'
//  import './common/dhtmlxgantt_marker.js'
//  import './common/dhtmlxgantt_tooltip.js'
//  import './common/dhtmlxgantt.lib.css'
  import './common/style.css'
//  import './common/Icon.css'



  import _ from 'lodash'
  import moment from 'moment'
  import $ from 'jquery'

  const gantt = window.gantt

  /////////////////////////////////////////////////////
//  const Gantt = React.createClass({
//    propTypes: {
//      data: React.PropTypes.object,
//      startDate: React.PropTypes.object,
//      endDate: React.PropTypes.object,
//      onShowTaskById: React.PropTypes.func.isRequired,
//      onTaskUpdate: React.PropTypes.func.isRequired,
//      onToday: React.PropTypes.func.isRequired,
//      hideWeekend: React.PropTypes.bool,
//      floatingPanelOpen: React.PropTypes.bool,
//    },
//  })


  ////////////////////////////////////////////////////////////////////////////////////////

  export default {
    name: 'GanttBody',
    props: {
      data: {
//        type: Object,
//        default() {
//          return {};
//        }
      },
      startDate: {
//        type: Number,
//        default() {
//          return 0;
//        }
      },
      endDate: {
//        type: Number,
//        default() {
//          return 0;
//        }
      },
      floatingPanelOpen: {
        type: Boolean,
        default() {
          return true;
        }
      },
//      hideWeekend: {
//        type: Boolean,
//        default() {
//          return false;
//        }
//      },
      onShowTaskById: {
        type: Function
      },
      onTaskUpdate: {
        type: Function
      },
      onToday: {
        type: Function
      }
    },
    data() {
      return {
        ganttStyle: {
          width: '100%',
          height: 'calc(100vh - 130px)',
          background: 'white'
        },
        demo_tasks: {
          data: [
            {
              "title": "32312",
              "space_id": "58c79ed016a8351f1ec889c4",
              "owner_id": "58b4f1ec1e1dbd6567f14bcd",
              "project_id": [
                "58d357d06ccdd601437c8563"
              ],
              "alt_id": "119",
              "description": "",
              "status": 0,
              "color": 0,
              "checklist": [],
              "members": [
                {
                  "_id": "58b4f1ec1e1dbd6567f14bcd",
                  "is_assignee": false
                }
              ],
              "tags": [],
              "due_date": "2017-03-31T10:00:00.000Z",
              "start_date": null,
              "created": "2017-03-23T05:07:51.030Z",
              "updated": "2017-03-23T05:07:51.030Z",
              "is_shared": false,
              "is_deleted": false,
              "completed_date": null,
              "is_archived": false,
              "id": "58d35827f509e1bb063e8555",
              "assignees": [],
              "followers": [
                "58b4f1ec1e1dbd6567f14bcd"
              ]
            },
            {
              "title": "2321",
              "space_id": "58c79ed016a8351f1ec889c4",
              "owner_id": "58b4f1ec1e1dbd6567f14bcd",
              "project_id": [
                "58d357d06ccdd601437c8563"
              ],
              "alt_id": "73",
              "description": "",
              "status": 0,
              "color": 0,
              "checklist": [],
              "members": [
                {
                  "_id": "58b4f1ec1e1dbd6567f14bcd",
                  "is_assignee": false
                }
              ],
              "tags": [],
              "due_date": "2017-03-31T10:00:00.000Z",
              "start_date": null,
              "created": "2017-03-23T05:07:40.670Z",
              "updated": "2017-03-23T05:07:40.670Z",
              "is_shared": false,
              "is_deleted": false,
              "completed_date": null,
              "is_archived": false,
              "id": "58d3581c26757c0743c4cf67",
              "assignees": [],
              "followers": [
                "58b4f1ec1e1dbd6567f14bcd"
              ]
            },
            { "id": 1, "text": "Office itinerancy", open:true, type:"project" },
            { "id": 2, "text": "Office facing", "start_date": "21-07-2014", "duration": "20", "parent": "1" },
            { "id": 3, "text": "Furniture installation", "start_date": "21-07-2014", "duration": "5", "parent": "1" },
            { "id": 4, "text": "The employee relocation", "start_date": "28-07-2014", "duration": "15", "parent": "1" },
            { "id": 5, "text": "Interior office", "start_date": "28-07-2014", "duration": "15", "parent": "1" },
            { "id": 6, "text": "Air conditioners installation", "start_date": "18-08-2014", "duration": "2", "parent": "1" },
            { "id": 7, "text": "Workplaces preparation", "start_date": "20-08-2014", "duration": "2", "parent": "1" },
            { "id": 8, "text": "Preparing workplaces for us", "start_date": "21-07-2014", "duration": "10", "parent": "1" },
            { "id": 9, "text": "Workplaces importation", "start_date": "22-08-2014", "duration": "1", "parent": "1" },
            { "id": 10, "text": "Analysis" , open:true, type:"project"},
            { "id": 11, "text": "Documentation creation", "start_date": "25-08-2014", "duration": "14", "parent": "10" },
            { "id": 12, "text": "Software design", "start_date": "25-08-2014", "duration": "10", "parent": "10" },
            { "id": 13, "text": "Interface setup", "start_date": "12-09-2014", "duration": "1", "parent": "10" },
            { "id": 14, "text": "Development" , open:true, type:"project"},
            { "id": 15, "text": "Develop System", "start_date": "15-09-2014", "duration": "5", "parent": "14" },
            { "id": 16, "text": "Integrate System", "start_date": "15-09-2014", "duration": "15", "parent": "14" },
            { "id": 17, "text": "Test", "start_date": "20-03-2017", "duration": "10", "parent": "14" }
          ]
        }
      }
    },
    created() {

    },
    computed: {

    },
    watch: {
//      startDate: {
//        handler: function (val, oldVal) {
//          this.componentDidMount()
//        },
//        deep: true
//      },
      endDate: 'componentDidMount'
    },
    mounted: function () {
      this.$nextTick(function () {
//        this.initiateGantt(this.ganttData)
        this.componentDidMount()
//            console.log(JSON.stringify(this.ganttData, null, 2))
      })
    },
    methods: {
      componentDidMount () {
        this._throttleOnTaskUpdate = _.throttle(item => {
          this.onTaskUpdate(item)
        }, 500)
        if (gantt.getVisibleTaskCount() > 0) gantt.clearAll()
        this.configGantt()
        this.templatesGantt()
        this.attachEventGantt()
        this.initiateGantt()
        this.addMarkerGantt()
        this.attachJqueryEvent()
        this.scrollToCurrentDay()
      },

      shouldComponentUpdate (nextProps) {
        if (!nextProps.floatingPanelOpen) gantt.unselectTask()
        gantt.setSizes()
        const updatedTask = _.differenceWith(nextProps.data.data, this.data.data, _.isEqual)
        if (updatedTask.length === 1) this.updateGanttTaskById(updatedTask[0])
        return this.isRetrieveNewData(this.props, nextProps)
      },

      componentWillUpdate (nextProps) {
        gantt.clearAll()
        this.configGantt(nextProps)
        this.templatesGantt(nextProps)
        this.attachEventGantt()
        this.initiateGantt(nextProps)
        this.addMarkerGantt()
        this.attachJqueryEvent()
        this.scrollToCurrentDay()
      },

      componentWillUnmount () {
        $(window).off('mousewheel')
      },

      scrollToCurrentDay () {
        const todayFlag = $('.today')
        if (todayFlag.length > 0) {
          const todayPosition = $(todayFlag).position().left
          const screenOffset = 180
          $('.gantt_task').animate({ scrollLeft: todayPosition - screenOffset }, 0)
        }
      },

      highlightRow (taskId) {
        this.clearHighlight()
        $(gantt.getTaskRowNode(taskId)).addClass('active')
        $('.gantt_task_row[task_id="' + taskId + '"]').addClass('active')
      },

      clearHighlight () {
        $('.gantt_row').removeClass('active')
        $('.gantt_task_row').removeClass('active')
        $('.gantt_tree_content').removeClass('active')
      },

//      isRetrieveNewData (oldData, newData) {
//        if (oldData.hideWeekend !== newData.hideWeekend) return true
//        const isSameDataLength = oldData.data.data.length === newData.data.data.length
//        const isSameDate = moment(newData.startDate).isSame(oldData.startDate, 'day') && moment(newData.endDate).isSame(oldData.endDate, 'day')
//        return (!isSameDataLength || !isSameDate)
//      },

      initiateGantt () {
        gantt.init('gantt-placeholder')
        gantt.clearAll()
        gantt.parse(this.data)
        gantt.config.start_date = this.startDate
        gantt.config.end_date = this.endDate
        gantt.render()
      },

      configGantt (props) {
        gantt.config.columns = [ { name: 'text', label: ' ', width: '*', tree: true } ]
        gantt.config.row_height = 21
        gantt.config.scale_unit = 'month'
        gantt.config.scale_height = 65
        gantt.config.date_scale = '%F, %Y'
        gantt.config.min_column_width = 31
        gantt.config.show_progress = false
        gantt.config.prevent_default_scroll = true
        gantt.config.grid_width = 245
        gantt.config.show_task_cells = false
        gantt.config.show_marker = true
        gantt.config.grid_resize = true
        gantt.config.smart_scales = true
        gantt.config.subscales = [
          { unit: 'week', step: 1, date: 'Week #%W' },
          { unit: 'day',
            step: 1,
            date: '%j',
            css: (date) => {
              let subClassName = 'sub_scale'
              if (date.getDay() === 6 || date.getDay() === 0) subClassName += ' weekend'
              return subClassName
            } }
        ]
        gantt.config.drag_links = false
        gantt.config.details_on_dblclick = false
      },

      templatesGantt (props) {
        gantt.templates.tooltip_text = (start, end, task) => {
          if (task.type === 'tasklist' || task.type === 'project') return task.text
          const durationUnit = task.duration > 1 ? _L.t('advanced_search.days') : _L.t('advanced_search.day')
          const durationText = `${_L.t('advanced_search.timeline.duration')} ${task.duration} ${durationUnit}`
          // We need dateOffset as if task has duedate as midnight we won't count it
          const dateOffset = moment(task.real_due_date).hour() === 0 ? 0 : 1
          const duration = moment(moment(task.real_due_date).startOf('day')).diff(moment(task.real_start_date).startOf('day'), 'days') + dateOffset
          switch (task.status) {
            case 'no-start-due':
            case 'no-start-due-completed':
              return _L.t('advanced_search.timeline.no_date_set')
            case 'planned': return _L.t('advanced_search.timeline.planned_task') + ', ' + durationText
            case 'completed': return _L.t('advanced_search.timeline.completed_task') + ', ' + durationText
            case 'due-today': return _L.t('advanced_search.timeline.due_today_task', { due_date: _L.formatDateTime(moment(task.real_due_date).toDate()) }) + ', ' + durationText
            case 'overdue': return _L.t('advanced_search.timeline.overdue_by', { no_of_day: duration }) + ', ' + durationText
            default: return durationText
          }
        }
        gantt.templates.grid_blank = function (item) {
          return '<div class="gantt_hide_item">' + item.status + '</div>'
        }
        gantt.templates.task_class = (start, end, task) => {
          return task.type === 'task' ? task.status + ' ' + task.type + ' ' + task.startDueStatus : task.type
        }
        gantt.templates.grid_row_class = (start, end, task) => {
          switch (task.type) {
            case 'project': return 'gantt_grid_project'
            case 'tasklist': return 'gantt_grid_tasklist'
          }
        }
        gantt.templates.grid_folder = (item) => ''
        gantt.templates.task_row_class = (start, end, task) => 'gantt_grid_row'
        gantt.templates.grid_file = (item) => ('<div class="gantt_label" style="background:' + item.label + '""></div>')
        gantt.templates.task_cell_class = (item, date) => {
          if (date.getDay() === 6 || date.getDay() === 0) return 'weekend'
        }
        gantt.templates.scale_cell_class = (date) => 'main_scale'
        gantt.templates.scale_row_class = (scale) => {
          switch (scale.unit) {
            case 'day': return 'day_scale'
            case 'month': return 'month_scale'
            default: return 'week_scale'
          }
        }
//        gantt.ignore_time = (date) => {
//          if (date.getDay() === 0 || date.getDay() === 6) {
//            return props.hideWeekend
//          }
//        }

        gantt.templates.grid_open = (item) => {
          const arrow = item.$open ? 'tw-icon-arrow-down tw-icon --name_arrow-down' : 'tw-icon-arrow-right tw-icon --name_arrow-right'
          const status = item.$open ? 'close' : 'open'
          return ('<div class="gantt_tree_icon gantt_' + status + '"><i class="' + arrow + '"></i></div>')
        }
        gantt.templates.task_text = (start, end, task) => {
          let text = ''
          if (task.startDueStatus) {
            text += '<div class="gantt_' + task.startDueStatus + '"></div>'
          }
          switch (task.type) {
            case 'project':
              text += '<div class="gantt_project_start-indicator"></div><div class="gantt_project_end-indicator"></div>'
              break
            case 'tasklist':
              text += '<div class="gantt_tasklist_start-indicator"></div><div class="gantt_tasklist_end-indicator"></div>'
              break
          }
          return text
        }
      },

      adjustMarkers (top) {
        const markers = [].slice.call(document.querySelectorAll('.gantt_marker_content'), 0)
        if (markers.length > 0) markers[0].style.top = top + 'px'
      },

      attachEventGantt () {
        gantt.attachEvent('onGanttScroll', (left, top) => this.adjustMarkers(top))
        gantt.attachEvent('onDataRender', () => this.adjustMarkers(gantt.getScrollState().y))
        gantt.attachEvent('onBeforeTaskUpdate', (id, item) => {
          this._throttleOnTaskUpdate(item)
          return true
        })
        gantt.attachEvent('onTaskClick', (id, e) => {
          const target = $(e.target)
          const status = target.siblings('.gantt_hide_item').text()
          return !(status === 'no-start-due' || target.text().includes('no-start-due'))
        })
      },

      attachJqueryEvent () {
        let downPositionX = ''

        $(window).on('mousewheel', (e) => {
          if (e.originalEvent.deltaY < 2) {
            if ($('.gantt_data_area').position().left < 1) e.preventDefault()
          }
        })
        $('.gantt_data_area, .gantt_grid_data, .gantt_row, .gantt_tree_content').on('mouseover', (e) => {
          const hoverTaskId = $($(e.target).closest('[task_id]')[0]).attr('task_id')
          if (this.props.floatingPanelOpen) {
            this.highlightRow(hoverTaskId)
            return
          }
          gantt.selectTask(hoverTaskId)
        })
        $('.gantt_task_row').on('mouseout', (e) => {
          if (this.props.floatingPanelOpen) return
          gantt.unselectTask()
        })
        $('.gantt_grid_scale').on('mouseover', (e) => {
          if (this.props.floatingPanelOpen) return
          gantt.unselectTask()
        })
        $('.gantt_task').on('mousedown', (e) => {
          downPositionX = e.clientX
          const taskId = $($(e.target).closest('[task_id]')[0]).attr('task_id')
          gantt.selectTask(taskId)
        })
        $('.gantt_task').on('mouseup', (e) => {
          if (e.clientX === downPositionX) {
            const taskId = $($(e.target).closest('[task_id]')[0]).attr('task_id')
            gantt.selectTask(taskId)
            this.onShowTaskById1(taskId)
          }
          if (!this.props.floatingPanelOpen) gantt.unselectTask()
        })
      },

      addMarkerGantt () {
        const stringDate = gantt.date.date_to_str(gantt.config.task_date)
        const today = moment().hour(12).minute(0).second(0).toDate()
        gantt.addMarker({
          start_date: today,
          css: 'today',
          text: _L.t('advanced_search.timeline.today'),
          title: _L.t('advanced_search.timeline.today') + ': ' + stringDate(today)
        })
        gantt.renderMarkers()
      },

      updateGanttTaskById (task) {
        const ganttTask = gantt.getTask(task.id)
        if (!ganttTask) return

        ganttTask.text = task.text
        ganttTask.duration = task.duration
        ganttTask.status = task.status
        ganttTask.start_date = moment(task.start_date, 'DD-MM-YYYY').toDate()
        ganttTask.end_date = moment(task.start_date, 'DD-MM-YYYY').add(task.duration, 'days').toDate()
        ganttTask.startDueStatus = task.startDueStatus
        ganttTask.label = task.label
        gantt.updateTask(task.id)
      },

      onShowTaskById1 (taskId) {
        this.onShowTaskById(taskId)
      },
    }
  }
</script>
