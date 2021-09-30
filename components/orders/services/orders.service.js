import Vue from 'vue'

const RESOURCE_URL = 'api/v1/users/orders'

export default {

  get(orderId) {
    return Vue.axios.get(`${RESOURCE_URL}/${orderId}`)
  },

  getDirectOrders() {
    return Vue.axios.get(`api/v1/users/clients/orders`)
  },

  getSupplierDirectOrders() {
    return Vue.axios.get(`api/v1/users/suppliers/orders`)
  },

  createOrder(data) {
    return Vue.axios.post(`${RESOURCE_URL}`, { supplier_product_expeditions: data.products, supplier_id: data.supplierId })
  },

  emitOrder(id) {
    return Vue.axios.get(`${RESOURCE_URL}/${id}/emit`)
  },

  getValidOrderProductsByPageNumber(orderId, resourceUrl) {
    if(resourceUrl)
      return Vue.axios.get(resourceUrl)
    else
      return Vue.axios.get(`${RESOURCE_URL}/${orderId}/products/valid`)
  },

  getOrderCategories(orderId) {
    return Vue.axios.get(`api/v1/users/clients/${orderId}/order_categories`)
  },

  getPricesByOrder(orderId) {
    return Vue.axios.get(`${RESOURCE_URL}/${orderId}/order_expeditions`)
  },

  getTotal(orderId) {
    return Vue.axios.get(`${RESOURCE_URL}/${orderId}/total`)
  },

  acceptOrder(orderId, comments) {
    return Vue.axios.post(`${RESOURCE_URL}/${orderId}/accept`, { comments: comments })
  },

  refuseOrder(orderId, justification) {
    return Vue.axios.post(`${RESOURCE_URL}/${orderId}/refuse`, { justification: justification })
  },

  read(orderId) {
    return Vue.axios.get(`${RESOURCE_URL}/${orderId}/read`)
  },

}
