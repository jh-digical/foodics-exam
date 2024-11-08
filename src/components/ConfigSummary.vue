<template>
  <div class="bg-green-500 text-white p-8 rounded-lg shadow-lg">
    <h2 class="text-2xl font-bold mb-4">Integration Configuration Summary</h2>
    <p>
      <strong>Selected Integration:</strong>
      <span class="capitalize"> {{ selectedIntegration }}</span>
    </p>
    <div v-if="selectedIntegration" class="mt-4">
      <h3 class="text-lg font-semibold mb-2">Credentials:</h3>
      <p v-if="credentials" class="mb-2">
        <strong>Type:</strong
        ><span class="capitalize"> {{ credentials.type }}</span>
      </p>
      <p v-else>No credentials provided.</p>

      <h3 class="text-lg font-semibold mt-4 mb-2">Data Mappings:</h3>
      <ul v-if="dataMappings && dataMappings.length > 0" class="ml-4">
        <li v-for="(mapping, index) in dataMappings" :key="index">
          <strong>Internal:</strong> {{ mapping.internal }}
          <br />
          <strong>Integration:</strong> {{ mapping.integration }}
        </li>
      </ul>
      <p v-else>No data mappings provided.</p>
    </div>

    <button
      v-if="!configSubmitted"
      @click="submitIntegrationConfig"
      class="mt-8 bg-white text-green-500 hover:bg-green-700 hover:text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring focus:border-green-300"
    >
      Submit
    </button>
    <p v-if="configSubmitted" class="mt-8 text-green-700 font-semibold">
      Configuration submitted successfully!
    </p>
  </div>
</template>

<script>
import DataService from '@/services/dataService'

export default {
  props: ['selectedIntegration', 'credentials', 'dataMappings'],

  data() {
    return {
      configSubmitted: false,
    }
  },

  methods: {
    async submitIntegrationConfig() {
      const payload = {
        integration_type: this.selectedIntegration,
        credentials: this.credentials,
        data_map: this.dataMappings,
      }

      await DataService.sendIntegrationConfig(payload)

      console.log('Integration configuration submitted:', payload)
      this.configSubmitted = true
      this.$emit('integration-config-submitted')
    },
  },
}
</script>
