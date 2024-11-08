import api from '@/services/api'

export default {
  getIntegration() {
    return api.apiClient.get('/integration')
  },

  getInternalDataAttributes() {
    return api.apiClient.get('/data/model')
  },

  getIntegrationDataAttributes(integration_id) {
    return api.apiClient.get(`/integration/${integration_id}/data/model`)
  },

  sendIntegrationConfig(payload) {
    return api.apiClient.post('/integration', payload)
  },

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
}
