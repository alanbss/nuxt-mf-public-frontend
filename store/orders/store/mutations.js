import { SET_ORDER } from './mutations-types'
import { SET_ORDER_PRODUCTS } from './mutations-types'
import { SET_ORDER_CATEGORIES } from './mutations-types'
import { SET_ORDER_EXPEDITIONS } from './mutations-types'
import { SET_DIRECT_ORDERS } from './mutations-types'
import { UPDATE_DIRECT_ORDERS } from './mutations-types'
import { ACUMMULATE_ORDER_PRODUCTS } from './mutations-types'

export default {
  [SET_ORDER]: (state, order) => {
    state.order = order
  },

  [SET_ORDER_PRODUCTS]: (state, products) => {
    state.orderProducts = products
  },

  [SET_ORDER_CATEGORIES]: (state, categories) => {
    state.orderCategories = categories
  },

  [SET_ORDER_EXPEDITIONS]: (state, expeditions) => {
    state.orderExpeditions = expeditions
  },

  [SET_DIRECT_ORDERS]: (state, orders) => {
    state.directOrders = orders
  },

  [UPDATE_DIRECT_ORDERS]: (state, order) => {
    var found = state.directOrders.find(obj => obj.id == order.id)
    if(found)
      found.status = order.status
  },

  [ACUMMULATE_ORDER_PRODUCTS]: (state, products) => {
    var all = state.orderProducts.concat(products)
    state.orderProducts = [...new Set(all)]
  },
}
