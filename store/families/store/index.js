import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const state = {
  families: [],
  family: {},
  products: [],
  searchedFamilies: [],
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
