import Vue from 'vue'

const RESOURCE_URL = 'api/v1/users/search_regions/'

export default {
  create(cityName) {
    return Vue.axios.post(`${RESOURCE_URL}`, { cityName: cityName })
  },
}