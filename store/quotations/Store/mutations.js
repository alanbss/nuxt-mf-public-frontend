import { SET_QUOTATION } from './mutations-types'
import { SET_QUOTATION_PRODUCTS } from './mutations-types'
import { SET_QUOTATION_CATEGORIES } from './mutations-types'
import { SET_QUOTATION_CATEGORIES_COLLECTIONS } from './mutations-types'
import { UPDATE_QUOTATION } from './mutations-types'
import { SET_QUOTATION_DELIVERY_INFO } from './mutations-types'
import { SET_QUOTATION_PAYMENT_INFO } from './mutations-types'
import { SET_ORDERS } from './mutations-types'
import { SET_QUOTATION_PRODUCT_TYPES } from './mutations-types'
import { ACUMMULATE_QUOTATION_PRODUCTS } from './mutations-types'

export default {
  [SET_QUOTATION]: (state, quotation) => {
    state.quotation = quotation
  },

  [SET_ORDERS]: (state, orders) => {
    state.orders = orders
  },

  [SET_QUOTATION_PRODUCTS]: (state, products) => {
    state.quotationProducts = products
  },

  [ACUMMULATE_QUOTATION_PRODUCTS]: (state, products) => {
    var all = state.quotationProducts.concat(products)
    state.quotationProducts = [...new Set(all)]
  },

  [SET_QUOTATION_CATEGORIES]: (state, categories) => {
    state.quotationCategories = categories
  },

  [SET_QUOTATION_CATEGORIES_COLLECTIONS]: (state, collections) => {
    state.quotationCategoriesCollections = collections
  },

  [SET_QUOTATION_PRODUCT_TYPES]: (state, types) => {
    state.quotationProductTypes = types
  },

  [SET_QUOTATION_PAYMENT_INFO]: (state, data) => {
    state.paymentInfo = data
  },

  [SET_QUOTATION_DELIVERY_INFO]: (state, data) => {
    state.deliveryInfo = data
  },

  [UPDATE_QUOTATION]: (state, quotation) => {
    for(var i = 0; i < state.quotation.length; i++) {
      if(state.quotation[i].id == quotation.id) {
        state.quotation[i] = quotation
      }
    }
  }
}
