import ViaCep from '@/api/viaCep'
import Ibge from '@/api/ibge'

export default {
  async getInformation(zipcode) {
    let address = null

    try {
      let [viaCep, states] = await Promise.all([
        ViaCep.searchByZipcode(zipcode),
        Ibge.states(),
      ])

      let ibgeState = states.data.find(state => state.sigla == viaCep.data.uf)

      address = this.mountAddressObject(viaCep.data, ibgeState)
      address.addressDetails =''
    } catch (error) {
      //console.log(error)
    }

    return address
  },

  mountAddressObject(viaCep, ibgeState) {
    return {
      stateId: ibgeState.id,
      state: ibgeState.nome,
      city: viaCep.localidade,
      neighborhood: viaCep.bairro,
      street: viaCep.logradouro,
      addressDetails: viaCep.complemento || ""
    }
  },
}