import Vue from 'vue'

const RESOURCE_URL = 'api/v1/users'

export default {
  changeData(userData) {
    return Vue.axios.post(`${RESOURCE_URL}/data`, { email: userData.email,
                                                    name: userData.name,
                                                    legal_name: userData.legalName,
                                                    zipcode: userData.zipcode,
                                                    street: userData.street,
                                                    address_details: userData.addressDetails,
                                                    neighborhood: userData.neighborhood,
                                                    city: userData.city,
                                                    state_uf: userData.stateUf,
                                                    cpf: userData.cpf,
                                                    cnpj: userData.cnpj })
  },
}
