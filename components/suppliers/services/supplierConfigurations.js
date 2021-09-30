import Vue from 'vue'

const RESOURCE_URL = '/api/v1/users/supplier_configurations'

export default {
  getConfigurations() {
    return Vue.axios.get(`${RESOURCE_URL}`)
  },

  getClientTypes() {
    return Vue.axios.get(`${RESOURCE_URL}/client_types`)
  },

  saveClientTypes(clientTypes) {
    let payload = { clientTypes }

    return Vue.axios.post(`${RESOURCE_URL}/client_types`, payload)
  },

  getMinimumOrderValue() {
    return Vue.axios.get(`${RESOURCE_URL}/minimum_order_values`)
  },

  saveMinimumOrderValue(minimumOrderValue) {
    let payload = { minimumOrderValue }

    return Vue.axios.post(`${RESOURCE_URL}/minimum_order_values`, payload)
  },

  getDeliveryConditions() {
    return Vue.axios.get(`${RESOURCE_URL}/delivery_conditions`)
  },

  saveDeliveryConditions(deliveryConditions) {
    let payload = { deliveryConditions }

    return Vue.axios.post(`${RESOURCE_URL}/delivery_conditions`, payload)
  },

  getStatesPresence() {
    return Vue.axios.get(`${RESOURCE_URL}/states_presences`)
  },

  getRegions(stateId) {
    return Vue.axios.get(`${RESOURCE_URL}/states/${stateId}/`)
  },

  getPaymentMethods() {
    return Vue.axios.get(`${RESOURCE_URL}/payment_methods`)
  },

  createPaymentMethods(paymentMethods) {
    let payload = { paymentMethods }

    return Vue.axios.post(`${RESOURCE_URL}/payment_methods`, { payment_method: payload })
  },

  updatePaymentMethods(paymentMethods) {
    let payload = { paymentMethods }

    return Vue.axios.put(`${RESOURCE_URL}/payment_methods`, { payment_method: payload })
  },

  destroyPaymentMethods(ids) {
    let payload = { payment_method: { payment_methods: ids } }

    return Vue.axios.delete(`${RESOURCE_URL}/payment_methods`, { data: payload })
  },

  
}
