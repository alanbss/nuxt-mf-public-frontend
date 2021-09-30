import ProducTypeService from '@/resources/productTypes/services/'

const CHANGED_VIEW_BRANDS_DIALOG_STATUS = 'CHANGED_VIEW_BRANDS_DIALOG_STATUS'
const SET_BRANDS = 'SET_BRANDS'

export default {
  namespaced: true,
  state: {
    brandsDialogShow: false,
    brands: []
  },
  actions: {
    showBrandsDialog: ({ commit }) => {
      commit(CHANGED_VIEW_BRANDS_DIALOG_STATUS, true)
    },

    closeBrandsDialog: ({ commit }) => {
      commit(CHANGED_VIEW_BRANDS_DIALOG_STATUS, false)
    },

    getProductTypeBrands: async ({ commit, rootGetters }, producTypeId) => {
      let params = rootGetters['navigationFilters/params']
      let productTypeBrands = await ProducTypeService.getBrands(producTypeId, params)

      commit(SET_BRANDS, productTypeBrands.data)
    },

    getProductTypeFilteredBrands: async ({ commit, rootGetters }, filterOptions) => {
      let params = rootGetters['navigationFilters/params']
      let productTypeBrands = await ProducTypeService.getFilteredBrands(filterOptions, params)

      commit(SET_BRANDS, productTypeBrands.data)
    }
  },
  mutations: {
    [CHANGED_VIEW_BRANDS_DIALOG_STATUS]: (state, clicked) => {
      state.brandsDialogShow = clicked
    },
    [SET_BRANDS]: (state, brands) => {
      if(brands[brands.length - 1].id == null) {
        let brand = brands.pop()
        brands.unshift(brand)
      }
      state.brands = brands
    }
  }
}
