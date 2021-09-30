import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const state = {
  // supplierServes: "PJ",
  // // Cep geral de Fortaleza
  // cep: "63575-000",
  // city: "Aiuaba",
  // region: {
  //   id: 230001,
  //   name: "Fortaleza",
  //   uf: "CE"
  // }
  supplierServes: null,
  // Cep geral de Fortaleza
  cep: null,
  city: null,
  region: {
    id: null,
    name: null,
    uf: null,
  },
  allowed: null,
}

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
}
