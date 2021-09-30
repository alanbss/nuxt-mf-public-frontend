import { SET_PRODUCTS } from './mutations-types'
import { ACCUMULATE_PRODUCTS } from './mutations-types'
import { SET_RANDOM_PRODUCTS } from './mutations-types'
import { ADD_TO_FAMILY_PRODUCTS } from './mutations-types'

export default {
  [SET_PRODUCTS]: (state, products) => {
    state.products = products
  },
  [ACCUMULATE_PRODUCTS]: (state, products) => {
    var all = state.products.concat(products)
    state.products = [...new Set(all)]
  },
  [SET_RANDOM_PRODUCTS]: (state, products) => {
    state.randomProducts = products
  },
  [ADD_TO_FAMILY_PRODUCTS]: (state, data) => {
    state.familyProducts.push(data)
  }
}
