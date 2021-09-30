import Vue from 'vue'

const RESOURCE_URL = 'api/v1/users/clients/product_quote_cart'

export default {
  insertManyProducts(productIds) {
    return Vue.axios.post(`${RESOURCE_URL}/many`, { product_ids: productIds }, { withCredentials: true })
  },

  insertProduct(productId) {
    return Vue.axios.post(`${RESOURCE_URL}`, { product_id: productId }, { withCredentials: true })
  },

  removeProduct(productId) {
    return Vue.axios.post(`${RESOURCE_URL}/destroy`, { product_id: productId }, { withCredentials: true })
  },

  products() {
    return Vue.axios.post(`${RESOURCE_URL}/all`, null, { withCredentials: true })
  },

  clearQuoteCart() {
    return Vue.axios.post(`${RESOURCE_URL}/clear`, null, { withCredentials: true })
  },
}
