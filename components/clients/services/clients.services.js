import Vue from 'vue'

const RESOURCE_URL = 'api/v1/users/clients'

export default {
  get(clientId) {
    return Vue.axios.get(`${RESOURCE_URL}/${clientId}/info`)
  },

  getTypeAndRegion(email) {
    return Vue.axios.post(`${RESOURCE_URL}/type_and_region`, { client: { email: email } })
  },

  checkCPF(cpf) {
    return Vue.axios.post(`${RESOURCE_URL}/check_cpf`, { client: { cpf: cpf } })
  },

  checkCNPJ(cnpj) {
    return Vue.axios.post(`${RESOURCE_URL}/check_cnpj`, { client: { cnpj: cnpj } })
  },

  checkEmail(email) {
    return Vue.axios.post(`${RESOURCE_URL}/check_email`, { client: { email: email } })
  },

}
