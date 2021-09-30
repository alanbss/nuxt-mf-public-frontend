import ProductService from '@/resources/products/services/'

const ADD_SUPPLIER_PRODUCT_EXPEDITION = 'ADD_SUPPLIER_PRODUCT_EXPEDITION'
const SET_SUPPLIER_PRODUCT_EXPEDITION = 'SET_SUPPLIER_PRODUCT_EXPEDITION'

export default {
  namespaced: true,
  state: {
    supplierProductExpeditions: []
  },
  actions: {
    addSupplierProductExpedition: ({ commit }, object) => {
      commit(ADD_SUPPLIER_PRODUCT_EXPEDITION, object)
    },

    saveExpeditions: async ({ commit }, exps) => {
      let response = await ProductService.saveExpeditions(exps)
      //commit(SET_SUPPLIER_PRODUCT_EXPEDITION, [])
      return response.data
    },

    savePricing: async ({ commit }, exps) => {
      let response = await ProductService.savePricing(exps)

      return response.data
    },

    clearExpeditions: async ({ commit }, exps) => {
      commit(SET_SUPPLIER_PRODUCT_EXPEDITION, [])
    },

  },
  mutations: {
    [ADD_SUPPLIER_PRODUCT_EXPEDITION]: (state, exp) => {
      let found = state.supplierProductExpeditions.find(obj => obj.id == exp.id)
      if(found) {
        if(found.id || (!found.id && found.product == exp.product)) {
          found.unavailable = exp.unavailable
          found.expedition = exp.expedition
          found.discountRanges = exp.discountRanges
          found.discountPercentages = exp.discountPercentages
          found.sale = exp.sale
        } else {
          state.supplierProductExpeditions.push(exp)
        }
      } else {
        state.supplierProductExpeditions.push(exp)
      }
    },
    [SET_SUPPLIER_PRODUCT_EXPEDITION]: (state, val) => {
      state.supplierProductExpeditions = val
    },
  }
}
