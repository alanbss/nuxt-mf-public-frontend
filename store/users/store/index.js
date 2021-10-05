import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import products from './products/'
import contact from './contact/'

export const state = () => ({
  user: null
})

const modules = {
  products,
  contact
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
  modules
}
