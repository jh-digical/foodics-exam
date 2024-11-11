import api from '@/services/api'

export default {
  getBranches() {
    return api.apiClient.get(
      '/branches?include[0]=sections&include[1]=sections.tables'
    )
  },

  updateBranchReservation(branchID, val = true) {
    return api.apiClient.put(`/branches/${branchID}`, {
      accepts_reservations: val,
    })
  },

  saveBranchReservations(branchID, payload) {
    return api.apiClient.put(`/branches/${branchID}`, payload)
  },
}
