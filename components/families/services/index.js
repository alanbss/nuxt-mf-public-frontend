import Vue from 'vue'
import qs from 'qs'

const RESOURCE_URL = 'api/v1/families'

export default {
  getAll() {
    return Vue.axios.get(RESOURCE_URL)
  },

  getUsed(product) {
    return Vue.axios.get('api/v1/users/families/used', {
      params: { product },
      paramsSerializer: params => {
        return qs.stringify(params, {
          arrayFormat: "brackets",
          encode: false
        })
      }
    })
  },

  getCollectionPictures(familyId) {
    return Vue.axios.get(`/api/v1/users/families/${familyId}/categories_collections/collection_pictures`)
  },

  getFamiliesWithTotalProducts() {
    return Vue.axios.get('api/v1/users/families/count_total_products')
  },

  getAllWithCategoriesCollection() {
    return Vue.axios.get('api/v1/users/families')
  },

  getWithCategories(familyId) {
    return Vue.axios.get(`/api/v1/users/families/${familyId}/categories_collections`)
  },

  getUsedWithCategories(familyId, product) {
    return Vue.axios.get(`/api/v1/users/families/${familyId}/categories_collections/used`, {
      params: { product },
      paramsSerializer: params => {
        return qs.stringify(params, {
          arrayFormat: "brackets",
          encode: false
        })
      }
    })
  },

  searchProducts(product, keyword) {
    if(!product || product.region_id == undefined || product.serves_type == undefined) {
      product = { region_id: null, serves_type: null }
    }
    return Vue.axios.get(`/api/v1/users/families/search/${keyword}`, {
      params: { product },
      paramsSerializer: params => {
        return qs.stringify(params, {
          arrayFormat: "brackets",
          encode: false
        })
      }
    })
  },

  searchSupplierProducts(keyword, supplierId) {
    return Vue.axios.get(`/api/v1/users/families/search_supplier/${supplierId}/${keyword}`)
  },

  getProducts(familyId, product, page) {
    return Vue.axios.get(`/api/v1/users/families/${familyId}/products`, {
      params: { product },
      paramsSerializer: params => {
        return qs.stringify(params, {
          arrayFormat: "brackets",
          encode: false
        }) + `&page=${page}`
      }
    })
  },
  getSupplierFamilies(supplierId){
    return Vue.axios.get(`/api/v1/families/from_suplpier/${supplierId}`, {
      paramsSerializer: params => {
        return qs.stringify(params, {
          arrayFormat: "brackets",
          encode: false
        })
      }
    })
  }
}
