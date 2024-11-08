<template>
  <div class="bg-green-500 p-6 rounded-lg shadow-md text-white">
    <label class="text-lg mb-2 block">Select Integration:</label>
    <select
      v-model="selectedIntegration"
      class="bg-white text-gray-800 rounded p-2 mb-4 w-full"
    >
      <option value="" disabled selected>Select Integration Type</option>
      <option
        v-for="(integration, key) in integrations"
        :key="key"
        :value="key"
      >
        {{ integration.name }}
      </option>
    </select>
    <button
      :disabled="!selectedIntegration"
      @click="selectIntegration"
      class="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      Next
    </button>
  </div>
</template>

<script>
import { integrationTypes } from '@/assets/js/integrations'
import DataService from '@/services/dataService'

export default {
  data() {
    return {
      selectedIntegration: '',
      integrations: null,
      apiIntegrations: null,
    }
  },

  mounted() {
    this.fetchIntegrations()
    this.integrations = integrationTypes
    this.$store.commit('setIntegrations', this.integrations)
  },

  methods: {
    async fetchIntegrations() {
      try {
        this.apiIntegrations = await DataService.getIntegration()
      } catch (error) {
        console.error(
          'Unable to fetch data at this time. Please try again.',
          error
        )
      }
    },

    selectIntegration() {
      this.$emit('integration-selected', this.selectedIntegration)
      this.$store.commit(
        'setSelectedIntegration',
        this.integrations[this.selectedIntegration]
      )
    },
  },
}
</script>
