import Vue from 'vue'

const RESOURCE_URL = 'api/v1/users/clients/product_list_resume'

export default {
  resumedList() {
    return Vue.axios.get(`${RESOURCE_URL}`)
  },
}