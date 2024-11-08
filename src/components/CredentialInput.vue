<template>
  <div class="bg-green-500 p-6 rounded-lg shadow-md text-white">
    <!-- Dropdown to select input type -->
    <select
      v-model="selectedCredentialType"
      class="bg-white text-gray-800 rounded p-2 mb-4 w-full"
      @change="handleCredentialTypeChange"
    >
      <option value="" disabled selected>Select Credential Type</option>
      <option value="token" v-if="isTokenSupported">Token</option>
      <option value="secret_key" v-if="isSecretKeySupported">Secret Key</option>
    </select>

    <!-- Token input -->
    <textarea
      v-if="selectedCredentialType === 'token'"
      v-model="token"
      class="bg-white text-gray-800 rounded p-2 mb-4 w-full"
      placeholder="Enter Jwt Token"
    ></textarea>

    <!-- Secret Key inputs -->
    <div v-if="selectedCredentialType === 'secret_key'">
      <input
        v-model="clientSecret"
        class="bg-white text-gray-800 rounded p-2 mb-2 w-full"
        placeholder="Client Secret"
      />
      <input
        v-model="clientKey"
        class="bg-white text-gray-800 rounded p-2 mb-4 w-full"
        placeholder="Client Key"
      />
    </div>

    <button
      :disabled="isDisabled"
      class="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed"
      @click="submitCredentials"
    >
      Next
    </button>
  </div>
</template>

<script>
export default {
  props: ['integrationType'],

  data() {
    return {
      selectedCredentialType: '',
      token: '',
      clientSecret: '',
      clientKey: '',
    }
  },

  computed: {
    isTokenSupported() {
      return this.$store.state.integrations[
        this.integrationType
      ].supported_credentials.includes('token')
    },

    isSecretKeySupported() {
      return this.$store.state.integrations[
        this.integrationType
      ].supported_credentials.includes('secret_key')
    },

    selectedIntegration() {
      return this.$store.state.selectedIntegration.name
    },

    isDisabled() {
      return (
        !this.selectedCredentialType ||
        (this.selectedCredentialType === 'token' && !this.token) ||
        ((this.selectedCredentialType === 'secret_key' ||
          this.selectedCredentialType === 'secret_key') &&
          (!this.clientSecret || !this.clientKey))
      )
    },
  },

  methods: {
    handleCredentialTypeChange() {
      if (this.selectedCredentialType === 'token') {
        this.clientSecret = ''
        this.clientKey = ''
      } else if (this.selectedCredentialType === 'secret_key') {
        this.token = ''
      }
    },

    submitCredentials() {
      let credentials = null
      // const integration = this.integrations[this.integrationType]

      if (this.selectedCredentialType === 'token' && this.isTokenSupported) {
        credentials = {
          type: 'token',
          token: this.token,
        }
      } else if (
        this.selectedCredentialType === 'secret_key' &&
        this.isSecretKeySupported
      ) {
        credentials = {
          type: 'secret_key',
          clientSecret: this.clientSecret,
          clientKey: this.clientKey,
        }
      }

      if (credentials) {
        this.$emit('credentials-entered', credentials)
      } else {
        // Handle the case where neither token nor secret_key is supported
        credentials = {
          type: 'unsupported',
        }
      }
    },
  },
}
</script>
