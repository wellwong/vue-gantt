import Vue from 'vue'
import Router from 'vue-router'

import gantt from '../views/gantt'
import gantt2 from '../views/gantt/ganttTimeLine.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  saveScrollPosition: true,
  routes: [
    {
      path: '/',
      name: 'gantt',
      component: gantt
    },
    {
      path: '/gantt2',
      name: 'gantt2',
      component: gantt2
    },
    {
      path: '*',
      component: gantt
    }
  ]
})
