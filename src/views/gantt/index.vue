<template>
  <div className='tw-gantt-container ax-timeline-view'>
    <Gantt :ganttData="ganttData"></Gantt>
  </div>
</template>
<script>
  import Gantt from '../../components/gantt';
//  import gdata from '../../gantt.json';
  import gdata from './taskAll.json';

  export default{
		name: 'gantts',
		data() {
			return {
        ganttData: gdata
			}
		},
		components: {
      Gantt
		},
    computed: {

    },
    mounted: function () {
      this.$nextTick(function () {
//            console.log(JSON.stringify(this.Dates, null, 2))
      })
    },
		methods: {

		}
	}
</script>
<style>
</style>
