import Vue from 'vue'
import qs from 'qs'

export default {
  getAllCategoriesFromFamily(familyId) {
    return Vue.axios.get(`/api/v1/users/families/${familyId}/categories`)
  },

  getUsedCategoriesFromFamily(familyId, product) {
    return Vue.axios.get(`/api/v1/users/families/${familyId}/categories/used`, {
      params: { product },
      paramsSerializer: params => {
        return qs.stringify(params, {
          arrayFormat: "brackets",
          encode: false
        })
      }
    })
  },

  getProducts(categoryId, product, page) {
    return Vue.axios.get(`/api/v1/users/categories/${categoryId}/products`, {
      params: { product },
      paramsSerializer: params => {
        return qs.stringify(params, {
          arrayFormat: "brackets",
          encode: false
        }) + `&page=${page}`
      }
    })
  },
}
