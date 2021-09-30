import ProducTypeService from '@/resources/productTypes/services/'

const CHANGED_VIEW_TAGS_DIALOG_STATUS = 'CHANGED_VIEW_TAGS_DIALOG_STATUS'
const SET_TAGS = 'SET_TAGS'

export default {
  namespaced: true,
  state: {
    tagsDialogShow: false,
    tags: []
  },
  actions: {
    showTagsDialog: ({ commit }) => {
      commit(CHANGED_VIEW_TAGS_DIALOG_STATUS, true)
    },

    closeTagsDialog: ({ commit }) => {
      commit(CHANGED_VIEW_TAGS_DIALOG_STATUS, false)
    },

    getProductTypeTags: async ({ commit, rootGetters }, producTypeId) => {
      let params = rootGetters['navigationFilters/params']
      let productTypeTags = await ProducTypeService.getTags(producTypeId, params)

      commit(SET_TAGS, productTypeTags.data)
    },

    getProductTypeFilteredTags: async ({ commit, rootGetters }, filterOptions) => {
      let params = rootGetters['navigationFilters/params']
      let productTypeTags = await ProducTypeService.getFilteredTags(filterOptions, params)

      commit(SET_TAGS, productTypeTags.data)
    }
  },
  mutations: {
    [CHANGED_VIEW_TAGS_DIALOG_STATUS]: (state, clicked) => {
      state.tagsDialogShow = clicked
    },
    [SET_TAGS]: (state, tags) => {
      state.tags = tags
    }
  }
}
