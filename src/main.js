import Vue from 'vue'
import App from './App'
import router from './router'

import vueScroll from './js/vue-scroll-animate.js'

Vue.use(vueScroll)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
