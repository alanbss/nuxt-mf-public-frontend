import axios from 'axios'

const VIA_CEP = {
  searchByZipcode(zipcode) {
    let instance = axios.create()

    return instance.get(`https://viacep.com.br/ws/${zipcode}/json/`)
  }
}

export default VIA_CEP