import {
  SET_USER_EMAIL,
} from './mutations-types'

export default {
  [SET_USER_EMAIL]: (state, userEmail) => {
    state.userEmail = userEmail
  },

}