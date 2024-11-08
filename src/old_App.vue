<template>
  <div id="app" class="h-screen flex flex-col items-center justify-start">
    <h1 class="text-6xl mb-10 font-bold">Integration Setup Wizard</h1>
    <button
      v-if="currentStep >= 2 && showPreviousStepButton"
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out focus:outline-none focus:ring focus:border-blue-300 mb-6"
      @click="goToPreviousStep"
    >
      Back to Previous Step
    </button>
    <div v-if="currentStep === 1">
      <IntegrationSelect @integration-selected="setSelectedIntegration" />
    </div>
    <div v-else-if="currentStep === 2" class="mb-8">
      <CredentialInput
        :integrationType="selectedIntegration"
        @credentials-entered="setCredentials"
      />
    </div>
    <div v-else-if="currentStep === 3" class="mb-8">
      <DataMapping
        :selectedIntegration="selectedIntegration"
        @data-mapped="submitIntegration"
      />
    </div>
    <div v-else class="mb-8">
      <ConfigSummary
        :selectedIntegration="selectedIntegration"
        :credentials="credentials"
        :dataMappings="dataMappings"
        @integration-config-submitted="configSubmitted"
      />
    </div>
  </div>
</template>

<script>
import IntegrationSelect from './components/IntegrationSelect'
import CredentialInput from './components/CredentialInput'
import DataMapping from './components/DataMapping'
import ConfigSummary from './components/ConfigSummary'

export default {
  components: {
    IntegrationSelect,
    CredentialInput,
    DataMapping,
    ConfigSummary,
  },

  data() {
    return {
      currentStep: 1,
      selectedIntegration: null,
      credentials: null,
      dataMappings: null,
      showPreviousStepButton: true,
    }
  },

  methods: {
    setSelectedIntegration(integration) {
      this.selectedIntegration = integration
      this.currentStep = 2
    },

    setCredentials(credentials) {
      this.credentials = credentials
      this.currentStep = 3
    },

    submitIntegration(dataMappings) {
      this.dataMappings = dataMappings
      this.currentStep = 4
    },

    goToPreviousStep() {
      if (this.currentStep > 1) {
        this.currentStep -= 1
      }
      this.showPreviousStepButton = true
    },

    configSubmitted() {
      this.showPreviousStepButton = false
    },
  },
}
</script>
