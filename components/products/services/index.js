import Vue from 'vue'
import qs from 'qs'

const RESOURCE_URL = 'api/v1/users/products'

export default {
  getCatalog() {
    return Vue.axios.get(`api/v1/products/catalog`)
  },

  getAll(product) {
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

  getRandom(product) {
    return Vue.axios.get(`${RESOURCE_URL}/random`, {
      params: { product },
      paramsSerializer: params => {
        return qs.stringify(params, {
          arrayFormat: "brackets",
          encode: false
        })
      }
    })
  },

  getRandomFromFamily(product, familyId) {
    return Vue.axios.get(`${RESOURCE_URL}/random_from_family`, {
      params: { product },
      paramsSerializer: params => {
        return qs.stringify(params, {
          arrayFormat: "brackets",
          encode: false
        }) + `&family_id=${familyId}`
      }
    })
  },

  getFromIds(ids) {
    return Vue.axios.post(`${RESOURCE_URL}/by_ids`, { product_ids: ids })
  },

  getIdsInListFromCategory(categoryId) {
    return Vue.axios.get(`/api/v1/users/products/categories/list_ids/${categoryId}`)
  },

  getInListFromCategory(categoryId) {
    return Vue.axios.get(`/api/v1/users/products/categories/list/${categoryId}`)
  },

  getInListFromProductType(productTypeId, page) {
    return Vue.axios.get(`/api/v1/users/products/product_types/list/${productTypeId}?page=${page}`)
  },

  getInListFromProperty(productTypeId, propertyId) {
    return Vue.axios.get(`/api/v1/users/products/product_types/list_from_property/${productTypeId}/${propertyId}`)
  },

  search(product, keyword, category, page) {
    if(category)
      product.category_id = category
    if(!product || product.region_id == undefined || product.serves_type == undefined) {
      product = { region_id: null, serves_type: null }
    }
    return Vue.axios.get(`/api/v1/users/products/search/${keyword}`, {
      params: { product },
      paramsSerializer: params => {
        return qs.stringify(params, {
          arrayFormat: "brackets",
          encode: false
        }) + `&page=${page}`
      }
    })
  },

  hasProducts(product) {
    return Vue.axios.get(`${RESOURCE_URL}/has_products`, {
      params: { product },
      paramsSerializer: params => {
        return qs.stringify(params, {
          arrayFormat: "brackets",
          encode: false
        })
      }
    })
  },

  getByProductTypeId(producTypeId) {
    const url = `/api/v1/users/product_types/${producTypeId}/products`

    return Vue.axios.get(url)
  },

  saveExpeditions(expeditions) {
    const url = `/api/v1/users/quotation_prices/`

    return Vue.axios.post(url, { supplier_product_expeditions: expeditions })
  },

  savePricing(expeditions) {
    const url = `/api/v1/users/suppliers/supplier_product_expeditions/save`

    return Vue.axios.post(url, { supplier_product_expeditions: expeditions })
  },
  saveSales(sale) {
    const url = `/api/v1/users/sales_status/${sale}`

    return Vue.axios.put(url)
  },
}
