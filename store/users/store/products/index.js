import ProductListService from '~/components/clients/services/productList'
import ProductListResumeService from '~/components/clients/services/productListResume'
import ProductQuoteCartService from '~/components/clients/services/clients.product.quote.cart.services'
import ProductQuoteCartResumeService from '~/components/clients/services/clients.product.quote.cart.resume.services'
import CatalogService from '~/components/clients/services/catalog'

const SET_PRODUCT_LIST = 'SET_PRODUCT_LIST'
const SET_PRODUCT_TYPE_NAME = 'SET_PRODUCT_TYPE_NAME'
const SET_PRODUCT_TYPE_PROPERTIES = 'SET_PRODUCT_TYPE_PROPERTIES'
const SET_TOTAL_PRODUCT_LIST = 'SET_TOTAL_PRODUCT_LIST'
const SET_RESUMED_PRODUCT_LIST = 'SET_RESUMED_PRODUCT_LIST'
const SET_QUOTE_CART_PRODUCT_LIST = 'SET_QUOTE_CART_PRODUCT_LIST'
const SET_RESUMED_QUOTE_CART_LIST = 'SET_RESUMED_QUOTE_CART_LIST'
const SET_RENDERING_STRUCTURE = 'SET_RENDERING_STRUCTURE'
const UPDATE_RENDERING_STRUCTURE = 'UPDATE_RENDERING_STRUCTURE'
const UPDATE_RENDERING_STRUCTURE_BY_POSITION = 'UPDATE_RENDERING_STRUCTURE_BY_POSITION'
const SET_CURRENT_POSITION = 'SET_CURRENT_POSITION'
const HIDE_ALL_EXCEPT_POSITION = 'HIDE_ALL_EXCEPT_POSITION'
const HIDE_ALL_BEFORE_POSITION = 'HIDE_ALL_BEFORE_POSITION'
const UPDATE_POS_AND_HEIGHT = 'UPDATE_POS_AND_HEIGHT'
const UPDATE_RENDERED = 'UPDATE_RENDERED'
const SET_STORE_TOTAL = 'SET_STORE_TOTAL'
const LOAD_STORE_TOTAL = 'LOAD_STORE_TOTAL'
const SET_STORE_PRODUCTS = 'SET_STORE_PRODUCTS'
const REMOVE_FROM_STORE_PRODUCTS = 'REMOVE_FROM_STORE_PRODUCTS'
const SET_STORE_CAN_BUY = 'SET_STORE_CAN_BUY'
const SET_USER_CATALOG = 'SET_USER_CATALOG'
const SET_CATALOG_PRODUCTS = 'SET_CATALOG_PRODUCTS'
const ADD_TO_CATALOG_PRODUCTS = 'ADD_TO_CATALOG_PRODUCTS'

export default {
  namespaced: true,
  state: {
    productTypeName: 'Todos',
    productList: [],
    properties: [],
    resumedProductList: [],
    totalProductList: 0,
    productQuoteCart: [],
    resumedQuoteCart: [],
    renderingStructure: null,
    currentPosition: 0,
    storeTotal: 0,
    storeProducts: [],
    storeCanBuy: false,
    catalog: [],
    catalogProducts: []
  },
  getters: {
    productListIsEmpty: state => state.productList.length === 0,

    productCartIsEmpty: state => !state.productQuoteCart || state.productQuoteCart.length === 0,

    productIsOnList: state => productId => {
      let productFound = state.productList.find(product => product.id === productId)

      return productFound ? true : false
    },

    productIsOnCart: state => productId => {
      let productFound = state.productQuoteCart.find(product => product.id === productId)

      return productFound ? true : false
    },
  },
  actions: {
    getProductList: async ({ commit, dispatch }) => {
      let productList = await ProductListService.products()

      commit(SET_TOTAL_PRODUCT_LIST, productList.headers['total-count'])
      commit(SET_PRODUCT_LIST, productList.data)
      dispatch('getResumedProductList')
    },

    getResumedProductList: async ({ commit }) => {
      let productResumedList = await ProductListResumeService.resumedList()

      commit(SET_RESUMED_PRODUCT_LIST, productResumedList.data)
    },

    insertProductToProductList: ({ dispatch }, productId) => {
      ProductListService.insertProduct(productId).then(() =>
        dispatch('getProductList')
      )
    },

    removeProductFromProductList: ({ dispatch }, productId) => {
      ProductListService.removeProduct(productId).then(() =>
        dispatch('getProductList')
      )
    },

    changeProductTypeName: ({ commit }, productTypeName) => {
      commit(SET_PRODUCT_TYPE_NAME, productTypeName)
    },

    getQuoteCart: async ({ commit }) => {
      let quoteCartList = await ProductQuoteCartService.products()
      commit(SET_QUOTE_CART_PRODUCT_LIST, quoteCartList.data)
    },

    getResumedQuoteCart: async ({ commit }) => {
      let productQuoteCartResumedList = await ProductQuoteCartResumeService.resumedList()

      commit(SET_RESUMED_QUOTE_CART_LIST, productQuoteCartResumedList.data)
    },

    insertManyProductsToQuoteCart: ({ dispatch }, productIds) => {
      ProductQuoteCartService.insertManyProducts(productIds).then(() => {
        dispatch('getQuoteCart')
      })
    },

    insertProductToQuoteCart: ({ dispatch }, productId) => {
      ProductQuoteCartService.insertProduct(productId).then(() => {
        dispatch('getQuoteCart')
      })
    },

    removeProductFromQuoteCart: ({ dispatch }, productId) => {
      ProductQuoteCartService.removeProduct(productId).then(() =>
        dispatch('getQuoteCart')
      )
    },

    clearQuoteCart: ({ commit }) => {
      ProductQuoteCartService.clearQuoteCart().then(() =>
        commit(SET_QUOTE_CART_PRODUCT_LIST, [])
      )
    },

    clearProductList: async ({ commit, dispatch }) => {
      commit(SET_TOTAL_PRODUCT_LIST, 0)
      commit(SET_PRODUCT_LIST, [])
    },

    clearResumedQuoteCart: ({ commit }) => {
      commit(SET_RESUMED_QUOTE_CART_LIST, [])
    },

    setStoreTotal: ({ commit }, total) => {
      commit(SET_STORE_TOTAL, total)
    },

    loadStoreTotal: ({ commit }) => {
      commit(LOAD_STORE_TOTAL)
    },

    setStoreCanBuy: ({ commit }, value) => {
      commit(SET_STORE_CAN_BUY, value)
    },

    updateStoreProducts: ({ commit }, totals) => {
      commit(SET_STORE_PRODUCTS, totals)
    },

    removeFromStoreProducts: ({ commit }, exp) => {
      commit(REMOVE_FROM_STORE_PRODUCTS, exp)
    },

    setProductProperties: ({ commit }, properties) => {
      commit(SET_PRODUCT_TYPE_PROPERTIES, properties)
    },

    setCurrentPosition: ({ commit }, value) => {
      commit(SET_CURRENT_POSITION, value)
    },

    setRenderingStructure: ({ commit }, structure) => {
      commit(SET_RENDERING_STRUCTURE, structure)
    },

    updateRenderingStructure: ({ commit }, data) => {
      commit(SET_RENDERING_STRUCTURE, data.productTypeId, data.propertyId)
    },

    updateRenderingStructureByPosition: ({ commit }, position) => {
      commit(UPDATE_RENDERING_STRUCTURE_BY_POSITION, position)
    },

    hideAllExceptPosition: ({ commit }, position) => {
      commit(HIDE_ALL_EXCEPT_POSITION, position)
    },

    hideAllBeforePosition: ({ commit }, position) => {
      commit(HIDE_ALL_BEFORE_POSITION, position)
    },

    updatePosAndHeight: ({ commit }, data) => {
      commit(UPDATE_POS_AND_HEIGHT, data)
    },

    updateRendered: ({ commit }, position) => {
      commit(UPDATE_RENDERED, position)
    },

    getAllCatalog: async ({ commit, rootGetters }) => {
      let params = rootGetters['navigationFilters/params']
      let response = await CatalogService.getAllCatalog(params)

      commit(SET_USER_CATALOG, response.data)
    },

    getCatalogByProductType: async ({ commit, rootGetters }, productTypeId) => {
      let params = rootGetters['navigationFilters/params']
      let response = await CatalogService.getCatalogByProductType(productTypeId, params)
      commit(SET_CATALOG_PRODUCTS, response.data)
    },

    getCatalogByFamily: async ({ commit, rootGetters }, data) => {
      let params = rootGetters['navigationFilters/params']
      let response = await CatalogService.getCatalogByFamily(data.family, params)
      return response.data
    },

    getCatalogByCategory: async ({ commit, rootGetters }, data) => {
      let params = rootGetters['navigationFilters/params']
      let response = await CatalogService.getCatalogByCategory(data.family, data.category, params)
      return response.data
    },

    getCatalogByCollection: async ({ commit, rootGetters }, data) => {
      let params = rootGetters['navigationFilters/params']
      let response = await CatalogService.getCatalogByCollection(data.family, data.collection, params)
      return response.data
    },

    getAllProductsByCategory: async ({ commit, rootGetters }, data) => {
      let params = rootGetters['navigationFilters/params']
      let response = await CatalogService.getAllProductsByCategory(data.family, data.category, params, data.page)

      if(data.page == 1)
        commit(SET_CATALOG_PRODUCTS, response.data)
      else
        commit(ADD_TO_CATALOG_PRODUCTS, response.data)
      return response
    },

    getSampleCatalogByProductType: async ({ commit, rootGetters }, data) => {
      let params = rootGetters['navigationFilters/params']
      let response = await CatalogService.getSampleCatalogByProductType(data.productTypeId, params)
      return response.data
    },

    canAddProduct: async ({ commit, rootGetters }, id) => {
      let params = rootGetters['navigationFilters/params']
      let response = await CatalogService.canAddProduct(id, params)
      return response.data
    },
  },
  mutations: {
    [SET_PRODUCT_LIST]: (state, productList) => {
      state.productList = productList
    },

    [SET_TOTAL_PRODUCT_LIST]: (state, total) => {
      state.totalProductList = total
    },

    [SET_CURRENT_POSITION]: (state, position) => {
      state.currentPosition = position
    },

    [SET_RENDERING_STRUCTURE]: (state, structure) => {
      state.renderingStructure = structure
    },

    [UPDATE_POS_AND_HEIGHT]: (state, data) => {
      state.renderingStructure[data.index].position = data.position
      state.renderingStructure[data.index].height = data.height
    },

    [UPDATE_RENDERING_STRUCTURE]: (state, productTypeId, propertyId) => {
      for(let i = 0; i < state.renderingStructure.length; i++) {
        if(state.renderingStructure[i].productTypeId == productTypeId && state.renderingStructure[i].propertyId == propertyId) {
          state.renderingStructure[i].rendered = true
          state.currentPosition = i
        }
      }
    },

    [UPDATE_RENDERED]: (state, position) => {
      state.renderingStructure[position].rendered = true
    },

    [UPDATE_RENDERING_STRUCTURE_BY_POSITION]: (state, position) => {
      state.renderingStructure[position].rendered = true
      state.currentPosition = position
    },

    [HIDE_ALL_EXCEPT_POSITION]: (state, position) => {
      for(let i = 0; i < state.renderingStructure.length; i++) {
        if(i != position)
          state.renderingStructure[i].rendered = false
      }
    },

    [HIDE_ALL_BEFORE_POSITION]: (state, position) => {
      for(let i = 0; i < state.renderingStructure.length; i++) {
        if(i != position) {
          state.renderingStructure[i].rendered = false
        } else {
          break
        }
      }
    },

    [SET_PRODUCT_TYPE_PROPERTIES]: (state, properties) => {
      state.properties = properties
    },

    [SET_RESUMED_PRODUCT_LIST]: (state, resumedProductList) => {
      state.resumedProductList = resumedProductList
    },

    [SET_PRODUCT_TYPE_NAME]: (state, productTypeName) => {
      state.productTypeName = productTypeName
    },

    [SET_QUOTE_CART_PRODUCT_LIST]: (state, quoteCartList) => {
      state.productQuoteCart = quoteCartList
    },

    [SET_RESUMED_QUOTE_CART_LIST]: (state, resumedQuoteCartList) => {
      state.resumedQuoteCart = resumedQuoteCartList
    },

    [SET_STORE_TOTAL]: (state, total) => {
      state.storeTotal = total
    },

    [LOAD_STORE_TOTAL]: (state) => {
      let sum = 0
      for(let i = 0; i < state.storeProducts.length; i++) {
        sum += state.storeProducts[i].total
      }
      state.storeTotal = sum
    },

    [SET_STORE_CAN_BUY]: (state, value) => {
      state.storeCanBuy = value
    },

    [SET_STORE_PRODUCTS]: (state, totals) => {
      let found = state.storeProducts.find(obj => obj.id == totals.id)
      if(found) {
        found.quantity = totals.quantity
        found.total = totals.total
      } else {
        state.storeProducts.push(Object.assign({}, totals))
      }
    },

    [REMOVE_FROM_STORE_PRODUCTS]: (state, exp) => {
      state.storeProducts = state.storeProducts.filter(obj => obj.id != exp.id)
    },

    [SET_USER_CATALOG]: (state, catalog) => {
      state.catalog = catalog
    },

    [SET_CATALOG_PRODUCTS]: (state, products) => {
      state.catalogProducts = products
    },

    [ADD_TO_CATALOG_PRODUCTS]: (state, products) => {
      state.catalogProducts = state.catalogProducts.concat(products)
    },
  }
}
