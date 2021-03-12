import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import Vuex from 'vuex'
import JsonExcel from "vue-json-excel";
import 'element-ui/lib/theme-chalk/index.css'
import router from './router/index'
import './plugins/install'
import store from './store'
Vue.component("downloadExcel", JsonExcel);
Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(Vuex);

new Vue({
  render: h => h(App),
  store,
  router,
}).$mount('#app')
