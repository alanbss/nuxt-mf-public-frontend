import * as types from './mutations-types'
import FamilyService from "@/resources/families/services/";

export default {
  getFamilies: async ({ commit }) => {
    let response = await FamilyService.getAll()

    commit(types.SET_FAMILIES, response.data)
  },

  getUsedFamilies: async ({ rootGetters }) => {
    let params = rootGetters['navigationFilters/params']
    let response = await FamilyService.getUsed(params)

    return response.data
    //commit(types.SET_FAMILIES, response.data)
  },

  getWithCategories: async({ commit }, familyId) => {
    let response = await FamilyService.getWithCategories(familyId)

    commit(types.SET_FAMILY, response.data)
  },

  getUsedWithCategories: async({ commit, rootGetters }, familyId) => {
    let params = rootGetters['navigationFilters/params']
    let response = await FamilyService.getUsedWithCategories(familyId, params)

    commit(types.SET_FAMILY, response.data)
  },

  getSearchWithCategories: async({ commit, rootGetters }, keyword) => {
    let params = rootGetters['navigationFilters/params']
    let response = await FamilyService.searchProducts(params, keyword)

    commit(types.SET_SEARCHED_FAMILIES, response.data)
  },

  getSupplierSearchWithCategories: async({ commit, rootGetters }, data) => {
    let response = await FamilyService.searchSupplierProducts(data.keyword, data.supplierId)

    commit(types.SET_SEARCHED_FAMILIES, response.data)
  },

  getProducts: async ({ commit, rootGetters, rootState }, familyId) => {
    let page = rootState.pagination.currentPage
    let params = rootGetters['navigationFilters/params']
    let response = await FamilyService.getProducts(familyId, params, page)

    commit('pagination/SET_RESOURCE_PAGINATION', response.headers, { root: true })
    commit(types.SET_PRODUCTS, response.data)
  },
}
