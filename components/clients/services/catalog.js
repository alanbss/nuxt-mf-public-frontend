import Vue from 'vue'
import qs from 'qs'

const RESOURCE_URL = 'api/v1/users/clients/catalog'

export default {
  getAllCatalog(product) {
    return Vue.axios.get(`${RESOURCE_URL}`, {
      params: { product },
      paramsSerializer: params => {
        return qs.stringify(params, {
          arrayFormat: "brackets",
          encode: false
        })
      }
    })
  },

  getCatalogByProductType(productTypeId, product) {
    return Vue.axios.get(`${RESOURCE_URL}/by_product_type/${productTypeId}`, {
      params: { product },
      paramsSerializer: params => {
        return qs.stringify(params, {
          arrayFormat: "brackets",
          encode: false
        })
      }
    })
  },

  getCatalogByFamily(family, product) {
    return Vue.axios.get(`${RESOURCE_URL}/by_family/${family}`, {
      params: { product },
      paramsSerializer: params => {
        return qs.stringify(params, {
          arrayFormat: "brackets",
          encode: false
        })
      }
    })
  },

  getCatalogByCollection(family, collection, product) {
    return Vue.axios.get(`${RESOURCE_URL}/by_collection/${family}/${collection}`, {
      params: { product },
      paramsSerializer: params => {
        return qs.stringify(params, {
          arrayFormat: "brackets",
          encode: false
        })
      }
    })
  },

  getCatalogByCategory(family, category, product) {
    return Vue.axios.get(`${RESOURCE_URL}/by_category/${family}/${category}`, {
      params: { product },
      paramsSerializer: params => {
        return qs.stringify(params, {
          arrayFormat: "brackets",
          encode: false
        })
      }
    })
  },

  getAllProductsByCategory(family, category, product, page) {
    return Vue.axios.get(`${RESOURCE_URL}/all_products_by_category/${family}/${category}`, {
      params: { page: page, product },
      paramsSerializer: params => {
        return qs.stringify(params, {
          arrayFormat: "brackets",
          encode: false
        })
      }
    })
  },

  getSampleCatalogByProductType(productTypeId, product) {
    return Vue.axios.get(`${RESOURCE_URL}/samples_by_product_type/${productTypeId}`, {
      params: { product },
      paramsSerializer: params => {
        return qs.stringify(params, {
          arrayFormat: "brackets",
          encode: false
        })
      }
    })
  },

  canAddProduct(productId, product) {
    return Vue.axios.get(`${RESOURCE_URL}/can_add/${productId}`, {
      params: { product },
      paramsSerializer: params => {
        return qs.stringify(params, {
          arrayFormat: "brackets",
          encode: false
        })
      }
    })
  },
}
