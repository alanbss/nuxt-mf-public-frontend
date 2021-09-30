import Vue from 'vue'

const RESOURCE_URL = 'api/v1/users/quotations'

export default {
  // getAll() {
  //   return Vue.axios.get(`${RESOURCE_URL}`)
  // },

  get(quotationId) {
    return Vue.axios.get(`${RESOURCE_URL}/${quotationId}`)
  },

  getPurchaseRequests() {
    return Vue.axios.get(`${RESOURCE_URL}/orders_purchase_requests`)
  },

  getOrders(data) {
    return Vue.axios.get(`${RESOURCE_URL}/orders?supplier_id=${data.supplier}&date=${data.date}`)
  },

  hasOrders() {
    return Vue.axios.get(`${RESOURCE_URL}/has_orders`)
  },

  getWithPayments(quotationId) {
    return Vue.axios.get(`${RESOURCE_URL}/${quotationId}/payments`)
  },

  getHashedProducts(quotationId) {
    return Vue.axios.get(`${RESOURCE_URL}/${quotationId}/products/hashed`)
  },

  getAllProducts(quotationId) {
    return Vue.axios.get(`${RESOURCE_URL}/${quotationId}/products`)
  },

  getQuotationProductsByPageNumber(quotationId, resourceUrl) {
    if(resourceUrl)
      return Vue.axios.get(resourceUrl)
    else
      return Vue.axios.get(`${RESOURCE_URL}/${quotationId}/products`)
  },

  getValidQuotationProductsByPageNumber(quotationId, resourceUrl) {
    if(resourceUrl)
      return Vue.axios.get(resourceUrl)
    else
      return Vue.axios.get(`${RESOURCE_URL}/${quotationId}/products/valid`)
  },

  refuse(quotationId, justification, comments) {
    return Vue.axios.post(`${RESOURCE_URL}/${quotationId}/refuse`, { justification: justification, comments: comments })
  },

  acceptOrder(quotationId, comments) {
    return Vue.axios.post(`${RESOURCE_URL}/${quotationId}/accept_order`, { comments: comments })
  },

  refuseOrder(quotationId, justification) {
    return Vue.axios.post(`${RESOURCE_URL}/${quotationId}/refuse_order`, { justification: justification })
  },

  accept(quotationId) {
    return Vue.axios.get(`${RESOURCE_URL}/${quotationId}/accept`)
  },

  dispatch(quotationId) {
    return Vue.axios.get(`${RESOURCE_URL}/${quotationId}/dispatch`)
  },

  read(quotationId) {
    return Vue.axios.get(`${RESOURCE_URL}/${quotationId}/read`)
  },

  savePaymentInfo(data) {
    return Vue.axios.post(`${RESOURCE_URL}/${data.quotationId}/payment_info`, { data: data.data, quotation: { id: data.quotationId } })
  },

  saveDeliveryInfo(data) {
    return Vue.axios.post(`${RESOURCE_URL}/${data.quotationId}/delivery_info`, { data: data.data, quotation: { id: data.quotationId } })
  },

  getQuotationProductsByCategory(data) {
    return Vue.axios.get(`api/v1/users/clients/${data.quotationId}/${data.categoryId}/quotation_products`)
  },

  getQuotationProductsByCollection(data) {
    return Vue.axios.post(`api/v1/users/clients/from_collection/${data.quotationId}/quotation_products`, { collection_name: data.collectionName })
  },

  getQuotationCategories(quotationId, unavailable) {
    return Vue.axios.get(`api/v1/users/clients/${quotationId}/categories?getUnavailable=${unavailable}`)
  },

  getQuotationCategoriesCollections(quotationId, unavailable) {
    return Vue.axios.get(`api/v1/users/clients/${quotationId}/categories_collections?getUnavailable=${unavailable}`)
  },

  getQuotationProductTypes(quotationId) {
    return Vue.axios.get(`api/v1/users/clients/${quotationId}/product_types`)
  },

  saveExpeditionQuantities(data) {
    return Vue.axios.post(`api/v1/users/clients/${data.quotationId}/reply`, { quantities: data.totals })
  },

  savePaymentMethod(data) {
    return Vue.axios.post(`${RESOURCE_URL}/${data.quotationId}/save_payment`, { payment_method: data.method, emit: data.emit })
  },

  getTotal(quotationId) {
    return Vue.axios.get(`${RESOURCE_URL}/${quotationId}/total`)
  },

}
