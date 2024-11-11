<template>
  <div id="app">
    <progress
      v-if="progressMax"
      class="progress progress-warning w-full absolute top-0 z-[999]"
      :value="progressValue"
      :max="progressMax"
    ></progress>
    <div v-if="showToast" class="toast toast-top toast-end z-[999]">
      <div role="alert" class="alert alert-success">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 shrink-0 stroke-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
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
          <div v-if="!branches" class="text-center">
            <div class="skeleton h-80 w-full"></div>
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
        <!-- button below serves only a purpose of redirecting focus from multiselect, to fix it opening by default on modal open -->
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
    <dialog ref="branchReservationsModal" class="modal z-[99]">
      <div class="modal-backdrop bg-black/50"></div>
      <div class="modal-box">
        <h3 class="text-lg font-bold">
          Edit
          <span class="text-accent">{{
            selectedBranch?.name || 'branch'
          }}</span>
          reservation settings
        </h3>
        <p class="py-4">
          Branch working hours are
          <span class="badge badge-lg badge-info">{{
            ` ${selectedBranch?.opening_from} - ${selectedBranch?.opening_to}`
          }}</span>
        </p>
        <div class="space-y-2">
          <label class="form-control w-full">
            <div class="label">
              <span class="label-text"
                >Reservation Duration (minutes)<span class="text-error"
                  >*</span
                ></span
              >
            </div>
            <input
              v-model="selectedBranchReservationDuration"
              type="text"
              placeholder="minutes"
              class="input input-bordered w-full"
              required
            />
          </label>
          <div class="form-control w-full">
            <div class="label">
              <span class="label-text">Tables</span>
            </div>
            <multiselect
              v-model="currentSelectedTables"
              :options="selectedBranchTables"
              :multiple="true"
              label="name"
              track-by="id"
              :custom-label="tableCustomLabel"
              :prevent-autofocus="true"
              :disabled="isLoadingBulkUpdate"
            ></multiselect>
          </div>
          <div class="pt-4 space-y-4">
            <div
              v-for="n in 7"
              :key="n"
              class="collapse collapse-plus bg-base-200"
            >
              <input ref="applyAllDaysCheckbox" type="checkbox" />
              <div class="collapse-title text-xl font-medium capitalize">
                {{ daysList[n - 1] }}
              </div>
              <div class="collapse-content space-y-4">
                <div class="flex flex-wrap gap-4 items-center">
                  <div
                    v-for="(time, index) in selectedBranchReservationTimes[
                      daysList[n - 1]
                    ]"
                    :key="index"
                    class="indicator"
                  >
                    <div class="indicator-item">
                      <button
                        v-show="
                          !dayReservationTimes[
                            `isEdit${daysList[n - 1]}${index}`
                          ]
                        "
                        class="btn btn-error btn-xs rounded-full"
                        @click="deleteReservation(daysList[n - 1], index)"
                      >
                        ✕
                      </button>
                      <button
                        v-show="
                          dayReservationTimes[
                            `isEdit${daysList[n - 1]}${index}`
                          ]
                        "
                        class="btn btn-warning btn-xs rounded-full"
                        @click="saveNewReservation(daysList[n - 1], index)"
                      >
                        Save?
                      </button>
                    </div>
                    <div class="indicator-item indicator-middle">
                      <button
                        v-show="
                          dayReservationTimes[
                            `isEdit${daysList[n - 1]}${index}`
                          ]
                        "
                        class="btn btn-error btn-xs rounded-full"
                        @click="cancelEditReservation"
                      >
                        Cancel
                      </button>
                    </div>
                    <button
                      class="btn btn-success"
                      @click="editReservationTime(daysList[n - 1], index)"
                    >
                      {{ time.join('-') }}
                    </button>
                  </div>
                </div>
                <input
                  v-model="dayReservationTimes[daysList[n - 1]]"
                  v-mask="'##:##-##:##'"
                  type="text"
                  class="input input-bordered w-full"
                  placeholder="hh:mm - hh:mm"
                  @input="handleReservationInputChange"
                />
                <div class="flex items-center justify-between">
                  <div class="flex space-x-2 items-center">
                    <button
                      class="btn btn-primary btn-sm"
                      @click="addDayReservation(daysList[n - 1])"
                      :disabled="
                        selectedBranchReservationTimes[daysList[n - 1]]
                          ?.length === 3 || isEditingTime
                      "
                    >
                      Add Reservation
                    </button>
                    <span class="text-info text-sm"
                      >{{
                        3 -
                        (selectedBranchReservationTimes[daysList[n - 1]]
                          ?.length || 0)
                      }}
                      left</span
                    >
                  </div>
                  <button
                    v-if="n === 1"
                    class="btn btn-outline btn-secondary btn-xs ml-auto"
                    @click.prevent="applyOnAllDays"
                    :disabled="
                      isEditingTime ||
                      !selectedBranchReservationTimes['saturday']?.length
                    "
                  >
                    Apply on all days
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-action">
          <button
            class="btn"
            :disabled="isLoadingBulkUpdate"
            @click="closeBranchReservationsModal"
          >
            Close
          </button>
          <button
            class="btn btn-primary"
            @click="saveBranchReservations"
            :disabled="selectedBranchReservationDuration < 30 || isSavingBranch"
          >
            <span v-if="isSavingBranch" class="loading loading-spinner"></span>
            {{ isSavingBranch ? 'Saving...' : 'Save' }}
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
import { cloneDeep } from 'lodash'

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
      daysList: [
        'saturday',
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
      ],
      selectedBranchTables: [],
      currentSelectedTables: [],
      selectedBranchReservationTimes: {
        saturday: [],
        sunday: [],
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
      },
      clonedSelectedBranchReservationTimes: {},
      dayReservationTimes: {},
      isEditingTime: false,
      selectedBranchReservationDuration: '',
      isSavingBranch: false,
    }
  },

  computed: {
    selectedBranch() {
      return this.$store.state.selectedBranch
    },
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
        this.clonedSelectedBranchReservationTimes = cloneDeep(
          this.selectedBranchReservationTimes
        )
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
      this.$store.commit('setSelectedBranch', branch)
      console.log(this.$store.state.selectedBranch)
      if (this.selectedBranch) {
        this.selectedBranchReservationDuration =
          this.selectedBranch.reservation_duration
        this.selectedBranchTables = this.createTableCollection(
          this.selectedBranch.sections
        )
        // cloneDeep fixes the reactivity issue on the visual data update of reservation times per day
        if (this.selectedBranch.reservation_times) {
          this.selectedBranchReservationTimes = cloneDeep(
            this.selectedBranch.reservation_times
          )
        } else {
          this.selectedBranchReservationTimes = cloneDeep(
            this.clonedSelectedBranchReservationTimes
          )
        }
      }
      this.dayReservationTimes = {}
      this.openBranchReservationsModal()
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

    openBranchReservationsModal() {
      this.$refs.branchReservationsModal.show()
      this.$refs.applyAllDaysCheckbox[0].checked = true
    },
    closeBranchReservationsModal() {
      this.$refs.branchReservationsModal.close()
      this.selectedBranchTables = []
      this.currentSelectedTables = []
      this.dayReservationTimes = {}
      this.isEditingTime = false
      this.selectedBranchReservationTimes = {}
      for (const ref of this.$refs.applyAllDaysCheckbox) {
        ref.checked = false
      }
    },

    tableCustomLabel({ name, section }) {
      return `${section} - (${name})`
    },

    applyOnAllDays() {
      for (const day of this.daysList) {
        // Skip Saturday
        if (day === 'saturday') continue

        this.$set(this.selectedBranchReservationTimes, day, [
          ...(this.selectedBranchReservationTimes?.['saturday'] ?? []),
        ])
      }
      for (const ref of this.$refs.applyAllDaysCheckbox) {
        ref.checked = true
      }
    },

    createTableCollection(sections) {
      return sections.flatMap((section) =>
        section.tables.map((table) => ({
          id: table.id,
          name: table.name,
          section: section.name,
        }))
      )
    },

    addDayReservation(day) {
      if (!this.dayReservationTimes[day]) return
      const newTime = this.dayReservationTimes[day].split('-')
      this.$set(this.selectedBranchReservationTimes, day, [
        ...this.selectedBranchReservationTimes[day],
        newTime,
      ])
      this.dayReservationTimes[day] = ''
      console.log(this.selectedBranchReservationTimes)
    },

    editReservationTime(day, index) {
      this.isEditingTime = true
      this.dayReservationTimes = {}
      this.dayReservationTimes[`isEdit${day}${index}`] = true
      this.dayReservationTimes[day] =
        this.selectedBranchReservationTimes[day][index].join('-')
      console.log(this.dayReservationTimes)
      console.log(this.selectedBranchReservationTimes[day][index])
    },

    saveNewReservation(day, index) {
      console.log(this.dayReservationTimes[day])
      this.selectedBranchReservationTimes[day][index] =
        this.dayReservationTimes[day].split('-')
      this.dayReservationTimes = {}
      this.isEditingTime = false
    },

    cancelEditReservation() {
      this.dayReservationTimes = {}
      this.isEditingTime = false
    },

    deleteReservation(day, index) {
      this.selectedBranchReservationTimes[day].splice(index, 1)
      this.cancelEditReservation()
    },

    handleReservationInputChange(event) {
      if (!event.target.value) {
        this.dayReservationTimes = {}
        this.isEditingTime = false
      }
    },

    async saveBranchReservations() {
      if (this.selectedBranchReservationDuration < 30) return
      this.isSavingBranch = true
      try {
        const payload = {
          reservation_duration: this.selectedBranchReservationDuration,
          reservation_times: this.selectedBranchReservationTimes,
        }
        const response = await DataService.saveBranchReservations(
          this.selectedBranch.id,
          payload
        )
        if (response) {
          this.showToast = true
          setTimeout(() => {
            this.showToast = false
          }, 3000)
        }
        await this.fetchBranches()
      } catch (error) {
        console.error(error)
      }
      this.closeBranchReservationsModal()
      this.isSavingBranch = false
    },
  },
}
</script>
