import { SET_CONFIGURATION } from './mutations-types'

export default {
  [SET_CONFIGURATION]: (state, supplierConfigurations) => {
    state.configuration = supplierConfigurations
  }
}