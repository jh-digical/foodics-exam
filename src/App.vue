<template>
  <div id="app">
    <progress
      v-if="progressMax"
      class="progress progress-warning w-full absolute top-0 z-[999]"
      :value="progressValue"
      :max="progressMax"
    ></progress>
    <div v-if="showToast" class="toast toast-top toast-end z-[999]">
      <div class="alert alert-success">
        <span>Updated successfully</span>
      </div>
    </div>
    <div class="max-w-7xl mx-auto sm:px-6 lg:px-8 py-10">
      <h1 class="text-3xl mb-10 font-bold text-center">
        Restaurant Reservations
      </h1>
      <ThemeToggle />
      <div class="card bg-base-100 w-full shadow-xl">
        <div class="card-body">
          <div class="flex justify-between">
            <h2 class="card-title">Branches</h2>
            <div v-if="branches" class="card-actions justify-end">
              <button
                class="btn btn-outline btn-primary btn-sm"
                @click="openAddBranchesModal"
                :disabled="isLoadingBulkUpdate"
              >
                Add Branches
              </button>
              <button
                v-if="withReservationIds.length"
                class="btn btn-outline btn-warning btn-sm"
                @click="updateAllReservations(withReservationIds, false)"
                :disabled="isLoadingBulkUpdate"
              >
                <span
                  v-if="isLoadingBulkUpdate"
                  class="loading loading-spinner"
                ></span>
                {{
                  isLoadingBulkUpdate ? 'Updating...' : 'Disable Reservations'
                }}
              </button>
              <button
                v-if="!withReservationIds.length"
                class="btn btn-success btn-sm"
                @click="updateAllReservations(branchIdCollection, true)"
                :disabled="isLoadingBulkUpdate"
              >
                <span
                  v-if="isLoadingBulkUpdate"
                  class="loading loading-spinner"
                ></span>
                {{
                  isLoadingBulkUpdate ? 'Updating...' : 'Enable Reservations'
                }}
              </button>
            </div>
          </div>
          <div v-if="!branches" class="text-center mt-20">
            <span class="loading loading-spinner loading-lg text-accent"></span>
          </div>
          <div v-else class="relative overflow-x-auto">
            <table class="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Reference</th>
                  <th>Number of Tables</th>
                  <th>Reservation Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="branches && !withReservations.length">
                  <td colspan="4" class="text-center">No branches found.</td>
                </tr>
                <tr
                  v-for="branch in withReservations"
                  :key="branch.id"
                  class="hover"
                  @click="selectBranch(branch)"
                >
                  <td>{{ branch.name }}</td>
                  <td>{{ branch.reference ? branch.reference : 'N/A' }}</td>
                  <td>{{ countTablesWithReservations(branch) }}</td>
                  <td>{{ formatTime(branch.reservation_duration) }}</td>
                </tr>
              </tbody>
            </table>
            <div
              v-if="isLoadingBulkUpdate"
              class="absolute inset-0 bg-transparent w-full h-full"
            ></div>
          </div>
        </div>
      </div>
    </div>
    <dialog ref="addBranchesModal" class="modal z-[99]">
      <div class="modal-backdrop bg-black/50"></div>
      <div class="modal-box">
        <button
          class="btn-ghost absolute right-2 top-2 text-transparent opacity-0 pointer-events-none"
        ></button>
        <h3 class="text-lg font-bold">Add Branches</h3>
        <p class="py-4">Branches</p>
        <multiselect
          v-model="selectedNoReservations"
          :options="noReservations"
          :multiple="true"
          label="name"
          track-by="id"
          :prevent-autofocus="true"
          :disabled="isLoadingBulkUpdate"
        ></multiselect>
        <div class="modal-action">
          <form method="dialog">
            <!-- if there is a button in form, it will close the modal -->
            <button class="btn" :disabled="isLoadingBulkUpdate">Close</button>
          </form>
          <button
            class="btn btn-primary"
            @click="addBranches"
            :disabled="!noReservations.length || isLoadingBulkUpdate"
          >
            <span
              v-if="isLoadingBulkUpdate"
              class="loading loading-spinner"
            ></span>
            {{ isLoadingBulkUpdate ? 'Updating...' : 'Save' }}
          </button>
        </div>
      </div>
    </dialog>
  </div>
</template>

<script>
import DataService from '@/services/dataService'
import ThemeToggle from './components/ThemeToggle.vue'
import Multiselect from 'vue-multiselect'

export default {
  components: {
    ThemeToggle,
    Multiselect,
  },
  data() {
    return {
      branches: null,
      branchIdCollection: [],
      isLoadingBulkUpdate: false,
      selectedNoReservations: [],
      noReservations: [],
      withReservations: [],
      withReservationIds: [],
      progressMax: 0,
      progressValue: 0,
      showToast: false,
    }
  },

  mounted() {
    this.fetchBranches()
  },

  methods: {
    async fetchBranches() {
      try {
        const response = await DataService.getBranches()
        const dataWithReservations = this.filterBranchesByReservations(
          response.data,
          true
        )
        const dataNoReservations = this.filterBranchesByReservations(
          response.data,
          false
        )
        this.branches = [...dataWithReservations, ...dataNoReservations]
        console.log(this.branches)
        this.branchIdCollection = this.collectBranchIds(this.branches)
        console.log(this.branchIdCollection)
        this.noReservations = dataNoReservations
        this.withReservations = dataWithReservations
        this.withReservationIds = this.collectBranchIds(dataWithReservations)
      } catch (error) {
        console.error(
          'Unable to fetch data at this time. Please try again.',
          error
        )
      }
    },

    async updateAllReservations(branchIds, val) {
      this.isLoadingBulkUpdate = true
      this.progressMax = branchIds.length
      for (const branchId of branchIds) {
        try {
          const response = await DataService.updateBranchReservation(
            branchId,
            val
          )
          // Check for successful update
          if (!response.data) {
            console.error(
              `Failed to update branch ${branchId}: ${response.statusText}`
            )
          } else {
            console.log(`Branch ${branchId} updated successfully.`)
            this.progressValue++
          }
        } catch (error) {
          console.error(`Error updating branch ${branchId}:`, error)
        }
      }
      await this.fetchBranches()
      this.isLoadingBulkUpdate = false
      this.progressMax = 0
      this.progressValue = 0
      this.showToast = true
      setTimeout(() => {
        this.showToast = false
      }, 3000)
    },

    collectBranchIds(branches) {
      return branches.map((branch) => branch.id)
    },

    countTablesWithReservations(data) {
      return data.sections
        .flatMap((section) => section.tables)
        .filter((table) => table.accepts_reservations === true).length
    },

    filterBranchesByReservations(data, val) {
      return data.filter((table) => table.accepts_reservations === val)
    },

    formatTime(minutes) {
      const hours = Math.floor(minutes / 60)
      const remainingMinutes = minutes % 60

      if (hours > 0 && remainingMinutes > 0) {
        return `${hours} hr${hours > 1 ? 's' : ''} ${remainingMinutes} min${
          remainingMinutes > 1 ? 's' : ''
        }`
      } else if (hours > 0) {
        return `${hours} hr${hours > 1 ? 's' : ''}`
      } else {
        return `${remainingMinutes} min${remainingMinutes > 1 ? 's' : ''}`
      }
    },

    selectBranch(branch) {
      console.log(branch.id)
    },

    async addBranches() {
      console.log(this.selectedNoReservations)
      this.closeAddBranchesModal()
      const branchIds = this.selectedNoReservations.map((branch) => branch.id)
      console.log(branchIds)
      await this.updateAllReservations(branchIds)
      this.selectedNoReservations = []
    },

    openAddBranchesModal() {
      this.$refs.addBranchesModal.show()
    },
    closeAddBranchesModal() {
      this.$refs.addBranchesModal.close()
    },
  },
}
</script>
