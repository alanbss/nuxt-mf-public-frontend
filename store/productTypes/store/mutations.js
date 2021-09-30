import { SET_PRODUCTS } from './mutations-types'
import { SET_PRODUCT_TYPE } from './mutations-types'
import { SET_BRANDS } from './mutations-types'
import { SET_PROPERTIES } from './mutations-types'
import { SET_PACKAGINGS } from './mutations-types'
import { ADD_PRODUCTS } from './mutations-types'
import { SET_TAGS } from './mutations-types'
import { SET_FILTERED_PRODUCT_IDS } from './mutations-types'

export default {
  [SET_PRODUCTS]: (state, products) => {
    state.products = products
  },
  [ADD_PRODUCTS]: (state, products) => {
    for(var i = 0; i < products.length; i++)
      state.products.push(products[i])
  },
  [SET_PRODUCT_TYPE]: (state, productTypeId) => {
    state.filterOptions.productTypeId = productTypeId
  },
  [SET_BRANDS]: (state, brandIds) => {
    state.filterOptions.data.brand_ids = brandIds
  },
  [SET_PROPERTIES]: (state, propertyIds) => {
    state.filterOptions.data.property_ids = propertyIds
  },
  [SET_PACKAGINGS]: (state, packagingIds) => {
    state.filterOptions.data.packaging_ids = packagingIds
  },
  [SET_TAGS]: (state, tagIds) => {
    state.filterOptions.data.tags_ids = tagIds
  },
  [SET_FILTERED_PRODUCT_IDS]: (state, filteredIds) => {
    state.filterOptions.filteredIds = filteredIds
  }
}
