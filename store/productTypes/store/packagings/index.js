import ProducTypeService from '~/components/productTypes/services/'

const CHANGED_VIEW_VOLUMES_DIALOG_STATUS = 'CHANGED_VIEW_VOLUMES_DIALOG_STATUS'
const SET_VOLUMES = 'SET_VOLUMES'

  export const state = () => ({
    namespaced: true,
    state: {
      volumesDialogShow: false,
      volumes: []
    }
  })

  export default {
    showVolumesDialog: ({ commit }) => {
      commit(CHANGED_VIEW_VOLUMES_DIALOG_STATUS, true)
    },

    closeVolumesDialog: ({ commit }) => {
      commit(CHANGED_VIEW_VOLUMES_DIALOG_STATUS, false)
    },

    getProductTypeVolumeOptions: async ({ commit, rootGetters }, producTypeId) => {
      let params = rootGetters['navigationFilters/params']
      let productTypeVolumes = await ProducTypeService.getVolumes(producTypeId, params)

      commit(SET_VOLUMES, productTypeVolumes.data)
    },

    getProductTypeFilteredVolumeOptions: async ({ commit, rootGetters }, filterOptions) => {
      let params = rootGetters['navigationFilters/params']
      let productTypeVolumes = await ProducTypeService.getFilteredVolumes(filterOptions, params)

      commit(SET_VOLUMES, productTypeVolumes.data)
    }
  }
  export const mutations = {
    [CHANGED_VIEW_VOLUMES_DIALOG_STATUS]: (state, clicked) => {
      state.volumesDialogShow = clicked
    },
    [SET_VOLUMES]: (state, volumes) => {
      state.volumes = volumes
    }
  }

