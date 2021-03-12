import Vue from 'vue'
import Vuex from 'vuex'
import vuexModules from './modules'

import state from './state'



Vue.use(Vuex)

export default new Vuex.Store({
    state,
    modules: vuexModules
})
