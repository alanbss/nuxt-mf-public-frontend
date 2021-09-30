import * as types from './mutations-types'
import PaginationService from '@/services/pagination'
import ProductService from '@/resources/products/services/'
import CategoryService from '@/resources/categories/services/'

export default {
  getProducts: async ({ commit, rootGetters }) => {
    let params = rootGetters['navigationFilters/params']
    let response = await ProductService.getAll(params)

    commit('pagination/SET_RESOURCE_PAGINATION', response.headers, { root: true })
    commit(types.SET_PRODUCTS, response.data)
  },

  getRandomProducts: async ({ commit, rootGetters }) => {
    let params = rootGetters['navigationFilters/params']
    let response = await ProductService.getRandom(params)

    commit(types.SET_RANDOM_PRODUCTS, response.data)
  },

  getRandomProductsFromFamily: async ({ commit, rootGetters }, familyId) => {
    let params = rootGetters['navigationFilters/params']
    let response = await ProductService.getRandomFromFamily(params, familyId)

    let data = { familyId: familyId, products: response.data}

    commit(types.ADD_TO_FAMILY_PRODUCTS, data)
  },

  getProductsFromIds: async ({ commit, rootGetters }, ids) => {
    let response = await ProductService.getFromIds(ids)

    commit('pagination/SET_RESOURCE_PAGINATION', response.headers, { root: true })
    commit(types.SET_PRODUCTS, response.data)
  },

  searchProducts: async ({ commit, rootGetters, rootState }, data) => {
    let page = rootState.pagination.currentPage
    let params = rootGetters['navigationFilters/params']
    let response = await ProductService.search({ region_id: params.region_id, serves_type: params.serves_type }, data.keyword, data.category, page)

    commit('pagination/SET_RESOURCE_PAGINATION', response.headers, { root: true })
    commit(types.ACCUMULATE_PRODUCTS, response.data)
  },

  getProductsByCategory: async ({ commit, rootGetters, rootState }, categoryId) => {
    let page = rootState.pagination.currentPage
    let params = rootGetters['navigationFilters/params']
    let response = await CategoryService.getProducts(categoryId, params, page)

    commit('pagination/SET_RESOURCE_PAGINATION', response.headers, { root: true })
    commit(types.SET_PRODUCTS, response.data)
  },

  getProductsInListFromProductType: async ({ commit, rootState }, productTypeId) => {
    let page = rootState.pagination.currentPage
    let response = await ProductService.getInListFromProductType(productTypeId, page)

    commit('pagination/SET_RESOURCE_PAGINATION', response.headers, { root: true })
    commit(types.ACCUMULATE_PRODUCTS, response.data)
  },

  getProductsInListFromProperty: async ({ commit, rootState }, data) => {
    //let page = rootState.pagination.currentPage
    let response = await ProductService.getInListFromProperty(data.productTypeId, data.propertyId)
    //commit('pagination/SET_RESOURCE_PAGINATION', response.headers, { root: true })
    commit(types.ACCUMULATE_PRODUCTS, response.data)
  },

  getProductsInListFromPropertyAndUpdate: async ({ commit, rootState }, data) => {
    //let page = rootState.pagination.currentPage
    let response = await ProductService.getInListFromProperty(data.productTypeId, data.propertyId)
    commit('users/products/UPDATE_RENDERING_STRUCTURE_BY_POSITION', data.position, { root: true })
    commit(types.ACCUMULATE_PRODUCTS, response.data)
  },

  getProductsInListFromCategoryAndUpdate: async ({ commit, rootState }, data) => {
    //let page = rootState.pagination.currentPage
    let response = await ProductService.getInListFromCategory(data.categoryId)
    commit('users/products/UPDATE_RENDERING_STRUCTURE_BY_POSITION', data.position, { root: true })
    commit(types.ACCUMULATE_PRODUCTS, response.data)
  },

  getProductsInListFromCategory: async ({ commit, rootState }, data) => {
    //let page = rootState.pagination.currentPage
    let response = await ProductService.getInListFromCategory(data.categoryId)
    commit(types.ACCUMULATE_PRODUCTS, response.data)
  },

  getProductsByProductTypeId: async({ commit }, productTypeId) => {
    let response = await ProductService.getByProductTypeId(productTypeId)

    commit('pagination/SET_RESOURCE_PAGINATION', response.headers, { root: true })
    commit(types.SET_PRODUCTS, response.data)
  },

  getProductsByPageNumber: async ({ commit, rootState }) => {
    let resourceUrl = rootState.pagination.userSelectedPage
    let response = await PaginationService.getResourceByPageNumber(resourceUrl)

    commit('pagination/SET_RESOURCE_PAGINATION', response.headers, { root: true })
    commit(types.SET_PRODUCTS, response.data)
  },

  clearProducts: async ({ commit }) => {
    commit(types.SET_PRODUCTS, [])
  },
}
