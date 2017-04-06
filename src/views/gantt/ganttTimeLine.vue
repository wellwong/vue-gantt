<template>
  <div className='tw-gantt-container ax-timeline-view'>
    <Gantt
      :ganttData="formatGanttData"
      :dateRange="dateRange"
      :onToday="onToday"
      :onPrevYear="onPrevYear"
      :onNextYear="onNextYear"
      :onGetTaskById="onGetTaskById"
    ></Gantt>
  </div>
</template>
<script>
  import Gantt from '../../components/gantt/index2.vue';
  import gdata from './taskAll.json';

  import _ from 'lodash'
  import moment from 'moment'
  import $ from 'jquery'

  //////////////////////////////////////////////
  import { ganttDataFromProject } from '../../components/gantt/common/tw-gantt/index.js'



//  const ProjectTimelinePage =({
//    propTypes: {
//      project: React.PropTypes.object.isRequired,
//      tasklists: React.PropTypes.array.isRequired,
//      tasks: React.PropTypes.array.isRequired,
//      loadState: React.PropTypes.object.isRequired,
//      hasLimitedAccess: React.PropTypes.bool.isRequired,


  //////////////////////////////////////////////////////

  export default{
    name: 'gantts',
    data() {
      return {
        dateRange: {
          start: moment().subtract(6, 'months'),
          end: moment().add(6, 'months')
        }
      }
    },
    components: {
      Gantt
    },
    computed: {},
    mounted: function () {
      this.$nextTick(function () {
        this.formatGanttData()
//            console.log(JSON.stringify(this.formatGanttData(), null, 2))
      })
    },
    methods: {
      formatGanttData (){
        const data = ganttDataFromProject({
          dateRange: this.dateRange,
          project: gdata.data.metadata.projects.project,
          tasklists: gdata.data.metadata.projects.project.tasklists,
          tasks: gdata.data.hits
        })
        console.log(data)
        return data
      },
      getInitialState () {
        this.dateRange.start = moment().subtract(6, 'months')
        this.dateRange.end = moment().add(6, 'months')
      },

      onGetTaskById (taskId) {
        return _.find(this.props.tasks, {_id: taskId})
      },

      onToday () {
        this.dateRange.start = moment().subtract(6, 'months')
        this.dateRange.end = moment().add(6, 'months')
      },

      onPrevYear () {
        this.dateRange.start = moment(this.state.start).subtract(1, 'year')
        this.dateRange.end = moment(this.state.end).subtract(1, 'year')
      },

      onNextYear () {
        this.dateRange.start = moment(this.state.start).add(1, 'year')
        this.dateRange.end = moment(this.state.end).add(1, 'year')
      }
    }
  }
</script>
<style>
</style>
