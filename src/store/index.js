// store.js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    selectedBranch: null,
  },

  mutations: {
    setSelectedBranch(state, branch) {
      state.selectedBranch = branch
    },
  },
})

export default store
