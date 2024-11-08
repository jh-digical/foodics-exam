import Vue from 'vue'
import App from './App.vue'
import '@/assets/css/styles.scss'
import axios from 'axios'
import store from './store'
import 'vue-multiselect/dist/vue-multiselect.min.css'

Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  store,
  render: (h) => h(App),
}).$mount('#app')
