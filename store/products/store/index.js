import actions from './actions'
import getters from './getters'
import mutations from './mutations'
// import supplierProductExpeditions from './supplierProductExpeditions/'

export const state = () => ({
  products: [],
  randomProducts: [],
  familyProducts: []
})

// const modules = {
//   supplierProductExpeditions
// }

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
  // modules
}
