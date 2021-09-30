import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const state = {
  quotes: [],
  openQuotes: [],
  filteredQuotations: [],
  quoteCategories: undefined,
  quoteSuppliers: 0
}

const modules = {
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
  modules
}
