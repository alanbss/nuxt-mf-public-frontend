import axios from 'axios'

const IBGE_API = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados'

const IBGE = {
  states() {
    return axios.get(IBGE_API)
  }
}

export default IBGE