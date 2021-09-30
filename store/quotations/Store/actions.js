import * as types from './mutations-types'
import QuotationService from '~/components/quotations/Services/quotations.services'

export default {

  getQuotation: async ({ commit }, data) => {
    let response = await QuotationService.get(data.id)
    commit(types.SET_QUOTATION, response.data)
    return response.data
  },

  getQuotationWithPayments: async ({ commit }, data) => {
    let response = await QuotationService.getWithPayments(data.id)
    commit(types.SET_QUOTATION, response.data)
    return response.data
  },

  getQuotationProducts: async ({ commit }, data) => {
    let response = await QuotationService.getHashedProducts(data.id)
    commit(types.SET_QUOTATION_PRODUCTS, response.data)
  },

  getAllQuotationProducts: async ({ commit }, data) => {
    let response = await QuotationService.getAllProducts(data.id)
    commit(types.SET_QUOTATION_PRODUCTS, response.data)
  },

  getOrders: async ({ commit }, data) => {
    let response = await QuotationService.getOrders(data)
    commit(types.SET_ORDERS, response.data)
  },

  hasOrders: async ({ commit }) => {
    let response = await QuotationService.hasOrders()
    return response.data
  },

  getQuotationProductsByPageNumber: async ({ commit, rootState }, data) => {
    let resourceUrl = rootState.pagination.userSelectedPage
    let response = await QuotationService.getQuotationProductsByPageNumber(data.id, resourceUrl)

    commit('pagination/SET_RESOURCE_PAGINATION', response.headers, { root: true })
    commit(types.SET_QUOTATION_PRODUCTS, response.data)
  },

  getValidQuotationProductsByPageNumber: async ({ commit, rootState }, data) => {
    let response = await QuotationService.getValidQuotationProductsByPageNumber(data.id, rootState.pagination.userSelectedPage)

    commit('pagination/SET_RESOURCE_PAGINATION', response.headers, { root: true })
    commit(types.SET_QUOTATION_PRODUCTS, response.data)
  },

  getValidQuotationProductsByPageNumberInfiniteScroll: async ({ commit, rootState }, data) => {
    let response = await QuotationService.getQuotationProductsByPageNumber(data.id, rootState.pagination.userSelectedPage)

    commit('pagination/SET_RESOURCE_PAGINATION', response.headers, { root: true })
    commit(types.ACUMMULATE_QUOTATION_PRODUCTS, response.data)
  },

  savePaymentInfo: async ({ commit }, data) => {
    let response = await QuotationService.savePaymentInfo(data)
    commit(types.SET_QUOTATION, response.data)
  },

  saveDeliveryInfo: async ({ commit }, data) => {
    let response = await QuotationService.saveDeliveryInfo(data)
    commit(types.SET_QUOTATION, response.data)
  },

  refuseQuotation: async ({ commit }, data) => {
    let response = await QuotationService.refuse(data.quotationId, data.justification, data.comments)
    commit(types.SET_QUOTATION, response.data)
  },

  acceptOrder: async ({ commit }, data) => {
    let response = await QuotationService.acceptOrder(data.quotationId, data.comments)
    commit(types.SET_QUOTATION, response.data)
  },

  refuseOrder: async ({ commit }, data) => {
    let response = await QuotationService.refuseOrder(data.quotationId, data.justification)
    commit(types.SET_QUOTATION, response.data)
  },

  acceptQuotation: async ({ commit }, data) => {
    let response = await QuotationService.accept(data.quotationId)
    commit(types.SET_QUOTATION, response.data)
  },

  dispatchQuotation: async ({ commit }, quotationId) => {
    let response = await QuotationService.dispatch(quotationId)
    commit(types.SET_QUOTATION, response.data)
  },

  readQuotation: async ({ commit }, id) => {
    let response = await QuotationService.read(id)
    commit(types.SET_QUOTATION, response.data)
  },

  setPaymentInfo: async ({ commit }, data) => {
    commit(types.SET_QUOTATION_PAYMENT_INFO, data)
  },

  setDeliveryInfo: async ({ commit }, data) => {
    commit(types.SET_QUOTATION_DELIVERY_INFO, data)
  },

  getQuotationProductsByCategory: async ({ commit }, data) => {
    let response = await QuotationService.getQuotationProductsByCategory(data)
    commit(types.SET_QUOTATION_PRODUCTS, response.data)
  },

  getQuotationProductsByCollection: async ({ commit }, data) => {
    let response = await QuotationService.getQuotationProductsByCollection(data)
    commit(types.SET_QUOTATION_PRODUCTS, response.data)
  },

  clearQuotationProducts: async ({ commit }) => {
    commit(types.SET_QUOTATION_PRODUCTS, [])
  },

  getQuotationCategories: async ({ commit }, data) => {
    let response = await QuotationService.getQuotationCategories(data.id, data.unavailable)
    commit(types.SET_QUOTATION_CATEGORIES, response.data)
  },

  getQuotationCategoriesCollections: async ({ commit }, data) => {
    let response = await QuotationService.getQuotationCategoriesCollections(data, data.unavailable)
    commit(types.SET_QUOTATION_CATEGORIES_COLLECTIONS, response.data)
  },

  getQuotationProductTypes: async ({ commit }, data) => {
    let response = await QuotationService.getQuotationProductTypes(data)
    commit(types.SET_QUOTATION_PRODUCT_TYPES, response.data)
  },

  clearQuotationProductTypes: async ({ commit }, data) => {
    commit(types.SET_QUOTATION_PRODUCT_TYPES, [])
  },

  saveExpeditionQuantities: async ({ commit }, data) => {
    let response = await QuotationService.saveExpeditionQuantities(data)
    commit(types.SET_QUOTATION, response.data)
  },

  saveExpeditionQuantitiesNoSet: async ({ commit }, data) => {
    let response = await QuotationService.saveExpeditionQuantities(data)
  },

  savePaymentMethod: async ({ commit }, data) => {
    let response = await QuotationService.savePaymentMethod(data)
    return response.data
  },

  getTotal: async ({ commit }, data) => {
    let response = await QuotationService.getTotal(data.id)
    return response.data
  },

}
