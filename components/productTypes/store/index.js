import brands from './brands/'
import tags from './tags/'
import packagings from './packagings/'
import properties from './properties/'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const state = {
  products: [],
  filterOptions: {
    productTypeId: null,
    filteredIds: [],
    data: {
      brand_ids: [],
      property_ids: [],
      packaging_ids: [],
      tag_ids: [],
    },
  },
}

const modules = {
  brands,
  properties,
  packagings,
  tags
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
  modules
}
