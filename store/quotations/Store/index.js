import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import quotationPrices from './quotationPrices/'

const state = {
  quotation: [],
  deliveryInfo: undefined,
  paymentInfo: undefined,
  quotationProducts: undefined,
  quotationCategories: [],
  quotationCategoriesCollections: [],
  quotationProductTypes: [],
  orders: []
}

const modules = {
  quotationPrices
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
  modules
}
