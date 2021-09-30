import Vue from 'vue'

const RESOURCE_URL = 'api/v1/users/clients/product_resume_quote_cart'

export default {
  resumedList() {
    return Vue.axios.get(`${RESOURCE_URL}`, { withCredentials: true })
  },
}
