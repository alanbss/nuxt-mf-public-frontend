import ContactService from '~/components/users/services/ContactService'

const SET_CONTACT_STATUS = 'SET_CONTACT_STATUS'

  export const state = () => ({
    namespaced: true,
    state: {
      status: null
    }
  })

  export default {

    sendMail: async ({ commit }, data) => {
      let response = await ContactService.sendMail(data)

      commit(SET_CONTACT_STATUS, response.data)
    },

  }
  export const mutations = {
    [SET_CONTACT_STATUS]: (state, status) => {
      state.status = status
    },
  }

