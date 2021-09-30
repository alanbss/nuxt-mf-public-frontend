import * as types from './mutations-types'
import ProductTypeService from '@/resources/productTypes/services/'
import PaginationService from '@/services/pagination'

export default {
  getProducts: async ({ commit, rootGetters, rootState, dispatch }, data) => {
    let params = rootGetters['navigationFilters/params']
    let filterOptions = rootGetters['productTypes/filterOptions']
    let page = rootState.pagination.currentPage
    let response = await ProductTypeService.getProducts(filterOptions, params, page)

    commit('pagination/SET_RESOURCE_PAGINATION', response.headers, { root: true })
    commit(types.SET_PRODUCTS, response.data)

    dispatch("getFilteredIds", response.data);
  },

  getProductsAndAdd: async ({ commit, rootGetters, rootState }, data) => {
    let params = rootGetters['navigationFilters/params']
    let filterOptions = rootGetters['productTypes/filterOptions']
    let page = rootState.pagination.currentPage
    let response = await ProductTypeService.getProducts(filterOptions, params, page)

    commit('pagination/SET_RESOURCE_PAGINATION', response.headers, { root: true })
    commit(types.ADD_PRODUCTS, response.data)
  },

  getFilteredIds: async ({ commit, rootGetters, rootState }, data) => {
    let params = rootGetters['navigationFilters/params']
    let filterOptions = rootGetters['productTypes/filterOptions']
    let response = await ProductTypeService.getFilteredIds(filterOptions, params)

    var includedInQuote = data.filter(prod => prod.onQuotation != null).map(obj => obj.id)
    var result = response.data.filter(el => !includedInQuote.includes(el))

    commit(types.SET_FILTERED_PRODUCT_IDS, result)
  },

  getProductsByPageNumber: async ({ commit, rootState }) => {
    let resourceUrl = rootState.pagination.userSelectedPage
    let response = await PaginationService.getResourceByPageNumber(resourceUrl)

    commit('pagination/SET_RESOURCE_PAGINATION', response.headers, { root: true })
    commit(types.SET_PRODUCTS, response.data)
    return response.data
  },

  setFilterBrands: async ({ commit }, data) => {
    commit(types.SET_BRANDS, data)
  },

  setFilterPackagings: async ({ commit }, data) => {
    commit(types.SET_PACKAGINGS, data)
  },

  setFilterProperties: async ({ commit }, data) => {
    commit(types.SET_PROPERTIES, data)
  },

  setFilterProductType: async ({ commit }, data) => {
    commit(types.SET_PRODUCT_TYPE, data)
  },

  setFilterTags: async ({ commit }, data) => {
    commit(types.SET_TAGS, data)
  },

  clearFilters: async ({ commit }) => {
    commit(types.SET_TAGS, [])
    commit(types.SET_PROPERTIES, [])
    commit(types.SET_PACKAGINGS, [])
    commit(types.SET_BRANDS, [])
  },


}
