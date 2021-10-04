import * as types from './mutations-types'
// import router from '@/router'
import SupplierConfigurationsService from '~/components/suppliers/services/supplierConfigurations'
import SupplierService from '~/components/suppliers/services/index'

export default {
  getSupplier: async ({ commit }) => {
    let response = await SupplierService.get()

    commit(types.SET_SUPPLIER, response.data)
  },

  getSupplierById: async ({ commit }, id) => {
    let response = await SupplierService.getById(id)

    commit(types.SET_SUPPLIER, response.data)
  },

  getSupplierBySlug: async ({ commit }, slug) => {
    let response = await SupplierService.getBySlug(slug)

    commit(types.SET_SUPPLIER, response.data)
  },

  getSupplierStates: async ({ commit }) => {
    let response = await SupplierConfigurationsService.getStatesPresence()

    commit(types.SET_SUPPLIER_STATES, response.data)
  },

  getSelectedState: async ({ commit }, stateId) => {
    let response = await SupplierConfigurationsService.getRegions(stateId)

    commit(types.SET_SELECTED_STATE, response.data)
  },

  enableStateSupplierModal: ({ commit, dispatch }, stateId) => {
    commit(types.SET_SUPPLIER_STATES_MODAL, true)
    dispatch('getSelectedState', stateId)
  },

  disableStateSupplierModal: ({ commit, dispatch }) => {
    commit(types.SET_SUPPLIER_STATES_MODAL, false)
    commit(types.SET_SELECTED_STATE, null)
    dispatch('getSupplierStates')
  },

  getPaymentMethods: async ({ commit }) => {
    let response = await SupplierConfigurationsService.getPaymentMethods()

    commit(types.SET_PAYMENT_METHODS, response.data)
  },

  addPaymentMethod: ({ commit, state }, paymentMethod) => {
    let paymentMethods = Object.assign([], state.paymentMethods)
    paymentMethods.push(paymentMethod)

    commit(types.SET_PAYMENT_METHODS, paymentMethods)
  },

  editPaymentMethod: ({ commit, state }, { paymentMethod, optionNumber }) => {
    let elementIndex = optionNumber - 1
    let paymentMethods = Object.assign([], state.paymentMethods)

    paymentMethods[elementIndex] = paymentMethod

    commit(types.SET_PAYMENT_METHODS, paymentMethods)
  },

  removePaymentMethod: ({ commit, state }, { paymentMethod, optionNumber }) => {
    let elementIndexToRemove = optionNumber - 1
    let paymentMethods = Object.assign([], state.paymentMethods)

    paymentMethods.splice(elementIndexToRemove, 1)
    commit(types.SET_PAYMENT_METHODS, Object.assign([], paymentMethods))

    if (paymentMethod.id) {
      commit(types.SET_PAYMENT_METHODS_TO_REMOVE, paymentMethod)
    }
  },

  savePaymentMethods: ({ commit,  dispatch }) => {
    dispatch('createPaymentMethods')
    dispatch('updatePaymentMethods')
    dispatch('destroyPaymentMethods')

    commit(types.SET_PAYMENT_METHODS, [])

    router.push({ name: "service-conditions" });
  },

  createPaymentMethods: async ({ getters }) => {
    let paymentMethods = getters.paymentMethodsWithoutId
    let response = null

    if (paymentMethods.length) {
      response = await SupplierConfigurationsService.createPaymentMethods(paymentMethods)
    }
    return response
  },

  updatePaymentMethods: async ({ getters }) => {
    let paymentMethods = getters.paymentMethodsWithId

    if (paymentMethods.length) {
      await SupplierConfigurationsService.updatePaymentMethods(paymentMethods)
    }
  },

  destroyPaymentMethods: async ({ commit, state }) => {
    let paymentMethodsToRemove = state.paymentMethodsToRemove.map(p => p.id)

    if (paymentMethodsToRemove.length) {
      paymentMethodsToRemove = Object.assign({}, { ids: paymentMethodsToRemove })

      await SupplierConfigurationsService.destroyPaymentMethods(paymentMethodsToRemove)
      commit(types.SET_PAYMENT_METHODS_TO_REMOVE, [])
    }
  },

  updateDeliveryRate: async ({ getters }, rate) => {
    await SupplierService.updateDeliveryRate(rate)
  },

  getQuotationsBySupplier: async ({ commit }) => {
    let response = await SupplierService.getQuotations()
    commit(types.SET_SUPPLIER_QUOTATIONS, response.data)
  },

  markQuotationAsRead: async ({ commit }, quotation) => {
    commit(types.SET_SUPPLIER_QUOTATION_AS_READ, quotation.id)
  },

  toggleDispatch: async ({ commit }, quotation) => {
    commit(types.TOGGLE_SUPPLIER_QUOTATION_DISPATCH, quotation.id)
  },

  updateSupplierQuotation: async ({ commit }, data) => {
    commit(types.UPDATE_SUPPLIER_QUOTATIONS, data)
  },

  getExpeditionsBySupplierAndQuotation: async ({ commit }, data) => {
    let response = await SupplierService.getExpeditionsByQuotation(data.quotationId)
    commit(types.SET_SUPPLIER_EXPEDITIONS, response.data)
  },

  getExpeditionsBySupplierAndQuotationAndPage: async ({ commit, rootState }, data) => {
    let page = rootState.pagination.currentPage
    let response = await SupplierService.getExpeditionsByQuotationAndPage(data.quotationId, page)
    commit(types.SET_SUPPLIER_EXPEDITIONS, response.data)
  },

  getOfferExpeditionsBySupplier: async ({ commit }, data) => {
    let response = await SupplierService.getOfferExpeditionsBySupplier(data.supplierId)
    commit(types.SET_SUPPLIER_OFFER_EXPEDITIONS, response.data)
  },

  getExpeditionsByProductTypeAndSupplier: async ({ commit }, data) => {
    let response = await SupplierService.getExpeditionsByProductTypeAndSupplier(data.productTypeId, data.supplierId)
    commit(types.SET_SUPPLIER_EXPEDITIONS, response.data)
  },

  getExpeditionsByProductTypeAndSupplierInfiniteScroller: async ({ commit }, data) => {
    let response = await SupplierService.getExpeditionsByProductTypeAndSupplier(data.productTypeId, data.supplierId)
    commit(types.ACCUMULATE_SUPPLIER_EXPEDITIONS, response.data)
  },

  getExpeditionsBySearchAndSupplier: async ({ commit, rootState }, data) => {
    let page = rootState.pagination.currentPage
    let response = await SupplierService.getExpeditionsBySearchAndSupplier(data.keyword, data.supplierId, data.categoryId, page)
    commit(types.ACCUMULATE_SUPPLIER_EXPEDITIONS, response.data)
  },

  getExpeditionsByProductType: async ({ commit }, productTypeId) => {
    let response = await SupplierService.getExpeditionsByProductType(productTypeId)
    commit(types.SET_SUPPLIER_EXPEDITIONS, response.data)
  },

  clearExpeditionsBySupplier: async ({ commit }) => {
    commit(types.SET_SUPPLIER_EXPEDITIONS, [])
  },

  clearSupplierExpeditions: async ({ commit }) => {
    commit(types.SET_SUPPLIER_EXPEDITIONS, null)
  },

  getCatalog: async ({ commit }) => {
    let response = await SupplierService.getCatalog()

    commit(types.SET_CATALOG, response.data)
  },

  getNoPriceData: async ({ commit }) => {
    let response = await SupplierService.getNoPriceData()

    commit(types.SET_NO_PRICE, response.data)
  },

  getCatalogById: async ({ commit }, supplierId) => {
    let response = await SupplierService.getCatalogById(supplierId)

    // troca de ordem limpeza e embalagens, apenas para apresentacao
    var catalog = response.data
    var embalagens = null
    var limpeza = null
    var utensilios = null
    if(catalog['Embalagens'])
      embalagens = catalog['Embalagens']
    if(catalog['Limpeza'])
      limpeza = catalog['Limpeza']
    if(catalog['Utensílios'])
      utensilios = catalog['Utensílios']

    if(embalagens && limpeza) {
      catalog['Embalagens'] = limpeza
      catalog['Limpeza'] = embalagens
      delete Object.assign(catalog, {['aux']: catalog['Limpeza'] })['Limpeza'];
      delete Object.assign(catalog, {['Limpeza']: catalog['Embalagens'] })['Embalagens'];
      delete Object.assign(catalog, {['Embalagens']: catalog['aux'] })['aux'];
    }
    if(utensilios) {
      delete Object.assign(catalog, {['aux']: catalog['Utensílios'] })['Utensílios'];
      delete Object.assign(catalog, {['Utensílios']: catalog['aux'] })['aux'];
    }

    commit(types.SET_CATALOG, response.data)
  },

  storeSearchProducts: async ({ commit, rootState }, data) => {
    let page = rootState.pagination.currentPage
    let response = await SupplierService.storeSearchProducts(data.keyword, data.supplierId, data.category, page)

    commit('pagination/SET_RESOURCE_PAGINATION', response.headers, { root: true })
    commit(types.ACCUMULATE_SUPPLIER_PRODUCTS, response.data)
  },

  getCatalogByProductType: async ({ commit }, productTypeId) => {
    let response = await SupplierService.getCatalogByProductType(productTypeId)

    commit(types.SET_SUPPLIER_PRODUCTS, response.data)
  },

  getCatalogByProductTypeAndSupplier: async ({ commit }, data) => {
    let response = await SupplierService.getCatalogByProductTypeAndSupplier(data.productTypeId, data.supplierId)

    commit(types.SET_SUPPLIER_PRODUCTS, response.data)
  },

  getSaleProducts: async ({ commit }) => {
    let response = await SupplierService.getSaleProducts()
    return response.data
    //commit(types.SET_RENDERING_PRODUCTS, response.data)
  },

  getSaleSupplierExpeditions: async ({ commit }) => {
    let response = await SupplierService.getSaleSupplierExpeditions()
    return response.data
    //commit(types.SET_RENDERING_PRODUCTS, response.data)
  },

  getCatalogByFamilyAndSupplier: async ({ commit }, data) => {
    let response = await SupplierService.getCatalogByFamilyAndSupplier(data.family, data.supplierId)
    return response.data
  },

  getCatalogByCategoryAndSupplier: async ({ commit }, data) => {
    let response = await SupplierService.getCatalogByCategoryAndSupplier(data.family, data.category, data.supplierId)
    return response.data
  },

  getCatalogByCollectionAndSupplier: async ({ commit }, data) => {
    let response = await SupplierService.getCatalogByCollectionAndSupplier(data.family, data.collection, data.supplierId)
    return response.data
  },

  getAllProductsByCategoryAndSupplier: async ({ commit }, data) => {
    let response = await SupplierService.getAllProductsByCategoryAndSupplier(data.family, data.category, data.supplierId)
    commit(types.SET_SUPPLIER_PRODUCTS, response.data)
  },

  getSampleCatalogByProductTypeAndSupplier: async ({ commit }, data) => {
    let response = await SupplierService.getSampleCatalogByProductTypeAndSupplier(data.productTypeId, data.supplierId)
    return response.data
  },

  getExpeditionsByFamilyAndSupplier: async ({ commit }, data) => {
    let response = await SupplierService.getExpeditionsByFamilyAndSupplier(data.family, data.supplierId)
    return response.data
  },

  getOfferProductsBySupplier: async ({ commit }, data) => {
    let response = await SupplierService.getOfferProductsBySupplier(data.supplierId)

    commit(types.SET_SUPPLIER_OFFER_PRODUCTS, response.data)
  },

  clearSupplierProducts: async ({ commit }) => {
    commit(types.SET_SUPPLIER_PRODUCTS, [])
  },

  getCatalogByProductTypeAndSupplierInfiniteScroller: async ({ commit }, data) => {
    let response = await SupplierService.getCatalogByProductTypeAndSupplier(data.productTypeId, data.supplierId)

    commit(types.ACCUMULATE_SUPPLIER_PRODUCTS, response.data)
  },

  setRenderingProducts: ({ commit }, structure) => {
    commit(types.SET_RENDERING_PRODUCTS, structure)
  },

  updateRenderingProducts: ({ commit }, data) => {
    commit(types.UPDATE_RENDERING_PRODUCTS, data)
  },

  hideAll: ({ commit }) => {
    commit(types.HIDE_BEFORE_INDEX_RENDERING_PRODUCTS)
  },

  canUserAccessStore: async ({ commit }, supplierId) => {
    let response = await SupplierService.canUserAccessStore(supplierId)
    return response.data
  },
}
