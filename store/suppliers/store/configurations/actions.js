import * as types from './mutations-types'
import SupplierConfigurationService from '@/resources/suppliers/services/supplierConfigurations'

export default {
  getConfiguration: async ({ commit }) => {
    let configuration = await SupplierConfigurationService.getConfigurations()

    commit(types.SET_CONFIGURATION, configuration.data)
  }
}