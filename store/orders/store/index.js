import actions from './actions'
import getters from './getters'
import mutations from './mutations'

export const state = () => ({
  order: null,
  orderProducts: [],
  orderCategories: [],
  orderExpeditions: [],
  directOrders: []
})

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
