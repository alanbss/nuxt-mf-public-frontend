import * as types from './mutations-types';

export default {
  setUserEmail: ({
    commit,
  }, userEmail) => {
    commit(types.SET_USER_EMAIL, userEmail);
   },

}