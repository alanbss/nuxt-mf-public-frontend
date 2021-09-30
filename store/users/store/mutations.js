import { SET_USER } from './mutations-types'

export default {
  [SET_USER]: (state, user) => {
    state.user = user
  }
}