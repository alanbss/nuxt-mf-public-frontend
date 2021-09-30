import Vue from 'vue'

const RESOURCE_URL = 'api/v1/states/available'

export default {
  checkForAvailableUf(uf) {
    return Vue.axios.get(`${RESOURCE_URL}/${uf}`)
  },

  getEnabledStates() {
    return Vue.axios.get(`api/v1/states/enabled/states`)
  },
}
