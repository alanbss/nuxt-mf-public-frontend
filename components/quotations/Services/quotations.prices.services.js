import Vue from 'vue'

const RESOURCE_URL = '/api/v1/users/quotations'

export default {

  getPrices(quotationId) {
    return Vue.axios.get(`${RESOURCE_URL}/${quotationId}/quotation_prices`)
  },

}
