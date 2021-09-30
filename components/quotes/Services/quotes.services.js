import Vue from 'vue'

const RESOURCE_URL = 'api/v1/users/quotes'

export default {
  // getAll() {
  //   return Vue.axios.get(`${RESOURCE_URL}`)
  // },

  get(quoteId) {
    return Vue.axios.get(`${RESOURCE_URL}/${quoteId}`)
  },

  getOpen() {
    return Vue.axios.get(`${RESOURCE_URL}/open`)
  },

  getQuoteCount() {
    return Vue.axios.get(`${RESOURCE_URL}/open_count`)
  },

  createQuote(productsInQuoteCart) {
    return Vue.axios.post(`${RESOURCE_URL}`, { products: productsInQuoteCart })
  },

  quoteSuppliers(productsInQuoteCart, params) {
    return Vue.axios.post(`${RESOURCE_URL}/count_suppliers`, { products: productsInQuoteCart, params: params })
  },

  getCategories(quoteId) {
    return Vue.axios.get(`${RESOURCE_URL}/${quoteId}/families_and_categories`)
  },

  filterByCategories(data) {
    return Vue.axios.post(`${RESOURCE_URL}/${data.quoteId}/filter_by_category`, { quote: { categories: data.categories }})
  },

  getClientQuotesByPageNumber(url, data) {
    if(url)
      return Vue.axios.get(url + `&date=${data.date}&open=${data.open}&closed=${data.closed}`)
    else
      return Vue.axios.get(`${RESOURCE_URL}/client?&date=${data.date}&open=${data.open}&closed=${data.closed}`)
  }
}
