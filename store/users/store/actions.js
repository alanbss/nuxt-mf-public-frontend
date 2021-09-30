import * as types from './mutations-types'

export default {
  setUser: ({ commit }, user) => {
    commit(types.SET_USER, user)
  },

  clearUser: ({ commit }) => {
    commit(types.SET_USER, null)
  },

}
