<template>
  <div>
    <ProgressBar :progressMax="progressMax" :progressValue="progressValue" />
    <SuccessToast v-if="showToast" />
    <div class="max-w-7xl mx-auto sm:px-6 lg:px-8 py-10">
      <h1 class="text-3xl mb-10 font-bold text-center">
        Restaurant Reservations
      </h1>
      <ThemeToggle />
      <DataTable
        @updateProgress="updateProgress"
        @showToast="updateShowToast"
      />
    </div>
  </div>
</template>

<script>
import ThemeToggle from './ThemeToggle.vue'
import DataTable from './DataTable.vue'
import ProgressBar from './ProgressBar.vue'
import SuccessToast from './SuccessToast.vue'

export default {
  components: {
    ThemeToggle,
    DataTable,
    ProgressBar,
    SuccessToast,
  },

  data() {
    return {
      progressMax: 0,
      progressValue: 0,
      showToast: false,
    }
  },

  methods: {
    updateProgress({ progressMax, progressValue }) {
      this.progressMax = progressMax
      this.progressValue = progressValue
    },

    updateShowToast(value) {
      this.showToast = value
    },
  },
}
</script>
