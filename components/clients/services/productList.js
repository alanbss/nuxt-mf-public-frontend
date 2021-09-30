import Vue from 'vue'

const RESOURCE_URL = 'api/v1/users/clients/product_list'

export default {
  insertProduct(productId) {
    return Vue.axios.post(`${RESOURCE_URL}`, { product_id: productId })
  },

  removeProduct(productId) {
    return Vue.axios.delete(`${RESOURCE_URL}`, { data: { product_id: productId } })
  },

  products() {
    return Vue.axios.get(`${RESOURCE_URL}`)
  },

  getResumedProductList() {
    return Vue.axios.post(`${RESOURCE_URL}/resume`)
  },
}