import Vue from 'vue'

const RESOURCE_URL = '/api/v1/users/supplier_configurations/delivery_areas/'

export default {
  saveRegion(regionId) {
    let payload = { regionId }

    return Vue.axios.post(`${RESOURCE_URL}`, payload)
  },
  removeRegion(regionId) {
    return Vue.axios.delete(`${RESOURCE_URL}/${regionId}`)
  },
}