/* --- In this part of the wizard, I am not sure if I understand the logic here
correctly. Instruction step 3 of the wizard suggests "A drag and drop style
input where users can map internal data attributes to Integration data
attributes...", based on what I understand first, I tried to setup the drag &
drop logic so that Internal data items can be dragged to Integration data
column, however when I checked the data_map payload to submit the configuration,
it doesn't look the same with the structure of Integration data. What I did is I
implemented the drag & drop logic so that it will give the same result of the
data_map structure in the config summary.--- */

<template>
  <div class="bg-green-500 flex flex-col text-white p-6">
    <h2 class="text-2xl mb-4">
      Select attribute items. Drag and drop selected items in the
      Internal/Integration columns respectively.
    </h2>
    <h3 class="font-semibold mb-8">
      *Please enter at least one attribute in Internal and Integration columns
      to proceed to the next step.*
    </h3>
    <div class="flex flex-grow mb-4">
      <!-- Left column -->
      <div class="flex flex-col w-1/2 mr-4">
        <h3 class="text-xl mb-2 text-yellow-300">Internal Data Attributes</h3>
        <div
          v-for="(category, index) in internalData"
          :key="`internal-${index}`"
          class="mb-4"
        >
          <h2 class="text-lg mb-2">{{ category.category }}</h2>
          <draggable
            v-model="category.attributes"
            group="internal-config"
            class="list-group"
          >
            <div
              v-for="(attribute, index) in category.attributes"
              :key="index"
              class="list-group-item"
            >
              <strong>{{ attribute.name }}:</strong> {{ attribute.id }}
            </div>
          </draggable>
        </div>
        <h3 class="text-xl mb-2 text-orange-300">
          Integration Data Attributes
        </h3>
        <div
          v-for="(category, index) in integrationData"
          :key="`integration-${index}`"
          class="mb-4"
        >
          <h2 class="text-lg mb-2">{{ category.category }}</h2>
          <draggable
            v-model="category.attributes"
            group="integration-config"
            class="list-group"
          >
            <div
              v-for="(attribute, index) in category.attributes"
              :key="index"
              class="list-group-item"
            >
              <strong>{{ attribute.name }}:</strong> {{ attribute.id }}
            </div>
          </draggable>
        </div>
      </div>

      <!-- Right column -->
      <div class="flex flex-col w-1/2">
        <h2 class="text-xl mb-2">Selected Config Attributes</h2>
        <div class="mb-4">
          <h3 class="text-xl mb-2 text-yellow-300">Internal Data</h3>
          <draggable
            v-model="configInternalAttributes"
            group="internal-config"
            class="list-group"
          >
            <div
              v-for="(attribute, index) in configInternalAttributes"
              :key="index"
              class="list-group-item"
            >
              <strong>{{ attribute.name }}:</strong> {{ attribute.id }}
            </div>
          </draggable>
        </div>
        <div>
          <h3 class="text-xl mb-2 text-orange-300">Integration Data</h3>
          <draggable
            v-model="configIntegrationAttributes"
            group="integration-config"
            class="list-group"
          >
            <div
              v-for="(attribute, index) in configIntegrationAttributes"
              :key="index"
              class="list-group-item"
            >
              <strong>{{ attribute.name }}:</strong> {{ attribute.id }}
            </div>
          </draggable>
        </div>
        <div class="flex justify-center mt-4">
          <button
            @click="submitDataMappings"
            :disabled="
              configInternalAttributes.length === 0 ||
              configIntegrationAttributes.length === 0
            "
            class="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { internalDataAttr } from '@/assets/js/internalData'
import { integrationDataAttr } from '@/assets/js/integrationData'
import DataService from '@/services/dataService'
import draggable from 'vuedraggable'

export default {
  props: ['selectedIntegration'],
  components: {
    draggable,
  },

  data() {
    return {
      internalData: [],
      integrationData: [],
      configInternalAttributes: [],
      configIntegrationAttributes: [],
      dataMap: [],
    }
  },

  mounted() {
    this.internalData = internalDataAttr
    this.integrationData = integrationDataAttr
    this.fetchInternalData()
    this.fetchIntegrationData()
  },

  methods: {
    async fetchInternalData() {
      try {
        this.apiInternal = await DataService.getInternalDataAttributes()
      } catch (error) {
        console.error(
          'Unable to fetch data at this time. Please try again.',
          error
        )
      }
    },

    async fetchIntegrationData() {
      // const integrationID = this.$store.state.selectedIntegration.id
      const integrationID = 1
      try {
        this.apiInternal = await DataService.getIntegrationDataAttributes(
          integrationID
        )
      } catch (error) {
        console.error(
          'Unable to fetch data at this time. Please try again.',
          error
        )
      }
    },

    submitDataMappings() {
      this.generateDataMap()
      this.$emit('data-mapped', this.dataMap)
    },

    generateDataMap() {
      this.dataMap = []

      for (let i = 0; i < this.configInternalAttributes.length; i++) {
        const internalAttribute = this.configInternalAttributes[i]?.id || '' // Use empty string if internalAttribute is falsy
        const integrationAttribute =
          this.configIntegrationAttributes[i]?.id || '' // Use empty string if integrationAttribute is falsy

        this.dataMap.push({
          internal: internalAttribute,
          integration: integrationAttribute,
        })
      }

      console.dir(this.dataMap)
    },
  },
}
</script>
