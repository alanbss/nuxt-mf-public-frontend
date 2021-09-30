import ProducTypeService from '@/resources/productTypes/services/'

const CHANGED_VIEW_PROPERTIES_DIALOG_STATUS = 'CHANGED_VIEW_PROPERTIES_DIALOG_STATUS'
const SET_PROPERTIES = 'SET_PROPERTIES'

export default {
  namespaced: true,
  state: {
    propertiesDialogShow: false,
    properties: []
  },
  actions: {
    showPropertiesDialog: ({ commit }) => {
      commit(CHANGED_VIEW_PROPERTIES_DIALOG_STATUS, true)
    },

    closePropertiesDialog: ({ commit }) => {
      commit(CHANGED_VIEW_PROPERTIES_DIALOG_STATUS, false)
    },

    getProductTypeProperties: async ({ commit, rootGetters }, producTypeId) => {
      let params = rootGetters['navigationFilters/params']
      let productTypeProperties = await ProducTypeService.getProperties(producTypeId, params)

      commit(SET_PROPERTIES, productTypeProperties.data)
    },

    getProductTypeFilteredProperties: async ({ commit, rootGetters }, filterOptions) => {
      let params = rootGetters['navigationFilters/params']
      let productTypeProperties = await ProducTypeService.getFilteredProperties(filterOptions, params)

      commit(SET_PROPERTIES, productTypeProperties.data)
    }
  },
  mutations: {
    [CHANGED_VIEW_PROPERTIES_DIALOG_STATUS]: (state, clicked) => {
      state.propertiesDialogShow = clicked
    },
    [SET_PROPERTIES]: (state, properties) => {
      state.properties = properties
    }
  }
}
