import { SET_FAMILIES, SET_SEARCHED_FAMILIES, SET_FAMILY, SET_PRODUCTS } from './mutations-types'

export default {
  [SET_FAMILIES]: (state, families) => {
    state.families = families
  },
  [SET_SEARCHED_FAMILIES]: (state, families) => {
    state.searchedFamilies = families
  },
  [SET_FAMILY]: (state, family) => {
    state.family = family
  },
  [SET_PRODUCTS]: (state, products) => {
    state.products = products
  },
}
