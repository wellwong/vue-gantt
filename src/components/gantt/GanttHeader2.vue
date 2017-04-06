<template>
  <div className='tw-gantt-header'>
    <div className='tw-gantt-header__navigator'>
      <div className='tw-gantt-header__today'>
        <!--<Button @click="onToday" style='blend-dark'>-->
          <!--今天-->
        <!--</Button>-->
        <button @click="onToday">
          今天
        </button>
      </div>
      <div className='tw-gantt-header__arrow'>
        <button class="el-icon-arrow-left" @click="onPrev">上</button>
        <button class="el-icon-arrow-right" @click="onNext">下</button>
        <!--<Button icon='arrow-left' @click="onPrev">上</Button>-->
        <!--<Button icon='arrow-right' @click="onNext">下</Button>-->
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'GanttHeader',
    props: {
      onToday: {
        type: Function
      },
      onPrev: {
        type: Function
      },
      onNext: {
        type: Function
      },
    },
    data() {
      return {

      }
    },
    created() {

    },
    computed: {

    },
    watch: {

    },
    mounted: function () {
      this.$nextTick(function () {
//            console.log(JSON.stringify(this.ganttData, null, 2))
      })
    },
    methods: {

    }
  }
</script>
