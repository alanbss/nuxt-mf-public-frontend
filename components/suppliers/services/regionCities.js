import Vue from 'vue'

const RESOURCE_URL = '/api/v1/users/regions'

export default {
  getCities(regionId) {
    return Vue.axios.get(`${RESOURCE_URL}/${regionId}/cities`)
  },
}