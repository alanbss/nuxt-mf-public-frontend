import Vue from 'vue'
import qs from 'qs'

const RESOURCE_URL = 'api/v1/users/product_types'

export default {
  fromCategory(categoryId) {
    return Vue.axios.get(`${RESOURCE_URL}/categories/${categoryId}`)
  },

  usedFromCategory(categoryId, product) {
    return Vue.axios.get(`${RESOURCE_URL}/categories/${categoryId}/used`, {
      params: { product },
      paramsSerializer: params => {
        return qs.stringify(params, {
          arrayFormat: "brackets",
          encode: false
        })
      }
    })
  },

  usedFromCategoryViewPage(categoryId, product) {
    return Vue.axios.get(`${RESOURCE_URL}/categories/${categoryId}/used_product_type_page`, {
      params: { product },
      paramsSerializer: params => {
        return qs.stringify(params, {
          arrayFormat: "brackets",
          encode: false
        })
      }
    })
  },

  usedFromFamily(familyId, product) {
    return Vue.axios.get(`api/v1/users/families/${familyId}/product_types/used`, {
      params: { product },
      paramsSerializer: params => {
        return qs.stringify(params, {
          arrayFormat: "brackets",
          encode: false
        })
      }
    })
  },

  usedFromFamilyOptimized(familyId, product) {
    return Vue.axios.get(`api/v1/users/families/${familyId}/product_types/used_optimized`, {
      params: { product },
      paramsSerializer: params => {
        return qs.stringify(params, {
          arrayFormat: "brackets",
          encode: false
        })
      }
    })
  },

  usedFromFamilyViewPage(familyId, product) {
    return Vue.axios.get(`api/v1/users/families/${familyId}/product_types/used_product_type_page`, {
      params: { product },
      paramsSerializer: params => {
        return qs.stringify(params, {
          arrayFormat: "brackets",
          encode: false
        })
      }
    })
  },

  getProducts(filterOptions, product, page) {
    return Vue.axios.get(`${RESOURCE_URL}/${filterOptions.productTypeId}/products`, {
      params: { filter_options: filterOptions.data, product, page: page },
      paramsSerializer: params => {
        return qs.stringify(params, {
          arrayFormat: "brackets",
          encode: false
        })
      }
    })
  },

  getFilteredIds(filterOptions, product) {
    return Vue.axios.get(`${RESOURCE_URL}/${filterOptions.productTypeId}/products/filtered_ids`, {
      params: { filter_options: filterOptions.data, product },
      paramsSerializer: params => {
        return qs.stringify(params, {
          arrayFormat: "brackets",
          encode: false
        })
      }
    })
  },

  getTags(productTypeId, product) {
    return Vue.axios.get(`${RESOURCE_URL}/${productTypeId}/tags`, {
      params: { product },
      paramsSerializer: params => {
        return qs.stringify(params, {
          arrayFormat: "brackets",
          encode: false
        })
      }
    })
  },

  getVolumes(productTypeId, product) {
    return Vue.axios.get(`${RESOURCE_URL}/${productTypeId}/packagings`, {
      params: { product },
      paramsSerializer: params => {
        return qs.stringify(params, {
          arrayFormat: "brackets",
          encode: false
        })
      }
    })
  },

  getBrands(productTypeId, product) {
    return Vue.axios.get(`${RESOURCE_URL}/${productTypeId}/brands`, {
      params: { product },
      paramsSerializer: params => {
        return qs.stringify(params, {
          arrayFormat: "brackets",
          encode: false
        })
      }
    })
  },

  getProperties(productTypeId, product) {
    return Vue.axios.get(`${RESOURCE_URL}/${productTypeId}/properties`, {
      params: { product },
      paramsSerializer: params => {
        return qs.stringify(params, {
          arrayFormat: "brackets",
          encode: false
        })
      }
    })
  },

  getFilteredTags(filterOptions, product) {
    return Vue.axios.get(`${RESOURCE_URL}/${filterOptions.productTypeId}/tags/filtered_tags`, {
      params: { filter_options: filterOptions.data, product },
      paramsSerializer: params => {
        return qs.stringify(params, {
          arrayFormat: "brackets",
          encode: false
        })
      }
    })
  },

  getFilteredVolumes(filterOptions, product) {
    return Vue.axios.get(`${RESOURCE_URL}/${filterOptions.productTypeId}/packagings/filtered_packagings`, {
      params: { filter_options: filterOptions.data, product },
      paramsSerializer: params => {
        return qs.stringify(params, {
          arrayFormat: "brackets",
          encode: false
        })
      }
    })
  },

  getFilteredBrands(filterOptions, product) {
    return Vue.axios.get(`${RESOURCE_URL}/${filterOptions.productTypeId}/brands/filtered_brands`, {
      params: { filter_options: filterOptions.data, product },
      paramsSerializer: params => {
        return qs.stringify(params, {
          arrayFormat: "brackets",
          encode: false
        })
      }
    })
  },

  getFilteredProperties(filterOptions, product) {
    return Vue.axios.get(`${RESOURCE_URL}/${filterOptions.productTypeId}/properties/filtered_properties`, {
      params: { filter_options: filterOptions.data, product },
      paramsSerializer: params => {
        return qs.stringify(params, {
          arrayFormat: "brackets",
          encode: false
        })
      }
    })
  },

  get(productTypeId) {
    return Vue.axios.get(`${RESOURCE_URL}/${productTypeId}`)
  }
}
