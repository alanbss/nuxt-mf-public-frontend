import * as types from './mutations-types'
import OrdersService from '~/components/orders/services/orders.service'

export default {

  getOrder: async ({ commit }, data) => {
    let response = await OrdersService.get(data.id)
    commit(types.SET_ORDER, response.data)
    return response.data
  },

  getDirectOrders: async ({ commit }) => {
    let response = await OrdersService.getDirectOrders()
    commit(types.SET_DIRECT_ORDERS, response.data)
  },

  getSupplierDirectOrders: async ({ commit }) => {
    let response = await OrdersService.getSupplierDirectOrders()
    commit(types.SET_DIRECT_ORDERS, response.data)
  },

  updateDirectOrders: async ({ commit }, data) => {
    commit(types.UPDATE_DIRECT_ORDERS, data)
  },

  createOrder: async ({ commit }, data) => {
    let response = await OrdersService.createOrder(data)
    commit(types.SET_ORDER, response.data)
    return response.data
  },

  emitOrder: async ({ commit }, id) => {
    let response = await OrdersService.emitOrder(id)
    commit(types.SET_ORDER, response.data)
  },

  getValidOrderProductsByPageNumber: async ({ commit, rootState }, data) => {
    let response = await OrdersService.getValidOrderProductsByPageNumber(data.id, rootState.pagination.userSelectedPage)

    commit('pagination/SET_RESOURCE_PAGINATION', response.headers, { root: true })
    commit(types.SET_ORDER_PRODUCTS, response.data)
  },

  getValidOrderProductsByPageNumberInfiniteScroll: async ({ commit, rootState }, data) => {
    let response = await OrdersService.getValidOrderProductsByPageNumber(data.id, rootState.pagination.userSelectedPage)

    commit('pagination/SET_RESOURCE_PAGINATION', response.headers, { root: true })
    commit(types.ACUMMULATE_ORDER_PRODUCTS, response.data)
  },

  getOrderCategories: async ({ commit }, data) => {
    let response = await OrdersService.getOrderCategories(data.id)
    commit(types.SET_ORDER_CATEGORIES, response.data)
  },

  getPricesByOrder: async ({ commit }, id) => {
    let response = await OrdersService.getPricesByOrder(id)
    commit(types.SET_ORDER_EXPEDITIONS, response.data)
  },

  getOrderTotal: async ({ commit }, data) => {
    let response = await OrdersService.getTotal(data.id)
    return response.data
  },

  readOrder: async ({ commit }, id) => {
    let response = await OrdersService.read(id)
    commit(types.SET_ORDER, response.data)
  },

  acceptDirectOrder: async ({ commit }, data) => {
    let response = await OrdersService.acceptOrder(data.orderId, data.comments)
    commit(types.SET_ORDER, response.data)
  },

  refuseDirectOrder: async ({ commit }, data) => {
    let response = await OrdersService.refuseOrder(data.orderId, data.justification)
    commit(types.SET_ORDER, response.data)
  },

  clearOrderProducts: async ({ commit }) => {
    commit(types.SET_ORDER_PRODUCTS, [])
  },

}
