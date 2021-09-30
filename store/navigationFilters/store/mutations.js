import { SET_CEP,
         SET_REGION,
         SET_SUPPLIER_SERVES,
         SET_CITY,
         SET_ALLOWED
} from './mutations-types'

export default {
  [SET_CEP]: (state, cep) => {
    state.cep = cep
  },

  [SET_REGION]: (state, region) => {
    state.region = Object.assign({}, region)
  },

  [SET_CITY]: (state, city) => {
    state.city = city
  },

  [SET_SUPPLIER_SERVES]: (state, supplierServes) => {
    state.supplierServes = supplierServes
  },

  [SET_ALLOWED]: (state, value) => {
    state.allowed = value
  },
}
