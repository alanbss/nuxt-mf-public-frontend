import {
  SET_SUPPLIER,
  SET_SUPPLIER_STATES,
  SET_SUPPLIER_STATES_MODAL,
  SET_SELECTED_STATE,
  SET_PAYMENT_METHODS,
  SET_PAYMENT_METHODS_TO_REMOVE,
  SET_SUPPLIER_QUOTATIONS,
  SET_SUPPLIER_QUOTATION_AS_READ,
  SET_SUPPLIER_EXPEDITIONS,
  ACCUMULATE_SUPPLIER_EXPEDITIONS,
  UPDATE_SUPPLIER_QUOTATIONS,
  SET_CATALOG,
  SET_SUPPLIER_PRODUCTS,
  ACCUMULATE_SUPPLIER_PRODUCTS,
  TOGGLE_SUPPLIER_QUOTATION_DISPATCH,
  SET_RENDERING_PRODUCTS,
  UPDATE_RENDERING_PRODUCTS,
  HIDE_BEFORE_INDEX_RENDERING_PRODUCTS,
  SET_NO_PRICE,
  SET_SUPPLIER_OFFER_EXPEDITIONS,
  SET_SUPPLIER_OFFER_PRODUCTS,
} from './mutations-types'

export default {
  [SET_SUPPLIER]: (state, supplier) => {
    state.supplier = supplier
  },
  [SET_SUPPLIER_EXPEDITIONS]: (state, expeditions) => {
    state.supplierExpeditions = expeditions
  },
  [SET_SUPPLIER_OFFER_EXPEDITIONS]: (state, expeditions) => {
    state.supplierOfferExpeditions = expeditions
  },
  [ACCUMULATE_SUPPLIER_EXPEDITIONS]: (state, expeditions) => {
    var all = state.supplierExpeditions.concat(expeditions)
    state.supplierExpeditions = [...new Set(all)]
  },
  [SET_SUPPLIER_QUOTATION_AS_READ]: (state, quotationId) => {
    for(var i = 0; i < state.supplierQuotations.length; i++) {
      if(state.supplierQuotations[i].id == quotationId) {
        state.supplierQuotations[i].read = true
      }
    }
  },
  [TOGGLE_SUPPLIER_QUOTATION_DISPATCH]: (state, quotationId) => {
    for(var i = 0; i < state.supplierQuotations.length; i++) {
      if(state.supplierQuotations[i].id == quotationId) {
        state.supplierQuotations[i].dispatched = !state.supplierQuotations[i].dispatched
      }
    }
  },
  [SET_SUPPLIER_QUOTATIONS]: (state, quotations) => {
    state.supplierQuotations = quotations
  },
  [UPDATE_SUPPLIER_QUOTATIONS]: (state, quotation) => {
    for(var i = 0; i < state.supplierQuotations.length; i++) {
      if(state.supplierQuotations[i].id == quotation.id) {
        state.supplierQuotations[i].status = quotation.status
      }
    }
  },
  [SET_SUPPLIER_STATES]: (state, supplierStates) => {
    state.supplierStates = supplierStates
  },
  [SET_SUPPLIER_STATES_MODAL]: (state, supplierStatesModal) => {
    state.supplierStatesModal = supplierStatesModal
  },
  [SET_SELECTED_STATE]: (state, selectedState) => {
    state.selectedState = selectedState
  },
  [SET_PAYMENT_METHODS]: (state, paymentMethods) => {
    state.paymentMethods = paymentMethods
  },
  [SET_PAYMENT_METHODS_TO_REMOVE]: (state, paymentMethod) => {
    state.paymentMethodsToRemove.push(paymentMethod)
  },
  [SET_CATALOG]: (state, catalog) => {
    state.catalog = catalog
  },
  [SET_NO_PRICE]: (state, data) => {
    state.noPriceData = data
  },
  [SET_SUPPLIER_PRODUCTS]: (state, products) => {
    state.supplierProducts = products
  },
  [SET_SUPPLIER_OFFER_PRODUCTS]: (state, products) => {
    state.supplierOfferProducts = products
  },
  [ACCUMULATE_SUPPLIER_PRODUCTS]: (state, products) => {
    var all = state.supplierProducts.concat(products)
    state.supplierProducts = [...new Set(all)]
  },
  [SET_RENDERING_PRODUCTS]: (state, structure) => {
    state.renderingProducts = structure
  },
  [UPDATE_RENDERING_PRODUCTS]: (state, data) => {
    for(let i = 0; i < state.renderingProducts.length; i++) {
      if(state.renderingProducts[i].id == data.id) {
        state.renderingProducts[i].products = data.products
        if(data.expeditions)
          state.renderingProducts[i].expeditions = data.expeditions
      }
    }
  },
  [HIDE_BEFORE_INDEX_RENDERING_PRODUCTS]: (state) => {
    for(let i = 0; i < state.renderingProducts.length; i++) {
      state.renderingProducts[i].products = []
      // if(data.expeditions)
      //   state.renderingProducts[i].expeditions = data.expeditions
    }
  },
}
