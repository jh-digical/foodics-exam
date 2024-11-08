// store.js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    integrations: [],
    selectedIntegration: null,
  },

  mutations: {
    setIntegrations(state, integrations) {
      state.integrations = integrations
    },

    setSelectedIntegration(state, integration) {
      state.selectedIntegration = integration
    },
  },
})

export default store
