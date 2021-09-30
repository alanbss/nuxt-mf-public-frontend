import * as types from './mutations-types'
import QuoteService from '~/components/quotes/Services/quotes.services'

export default {
  createQuote: async ({ commit }, data) => {
    let response = await QuoteService.createQuote(data)
    //dispatch('users/products/clearQuoteCart', null, {root: true})
    commit(types.SET_QUOTES, response.data)
  },

  countQuoteSuppliers: async ({ commit, rootGetters }, data) => {
    let params = rootGetters['navigationFilters/params']
    let response = await QuoteService.quoteSuppliers(data, params)
    //dispatch('users/products/clearQuoteCart', null, {root: true})
    commit(types.SET_QUOTE_SUPPLIERS, response.data)
  },

  getQuote: async ({ commit }, data) => {
    let response = await QuoteService.get(data)
    commit(types.SET_QUOTES, response.data)
  },

  markQuoteQuotationAsRead: async ({ commit }, quotationId) => {
    commit(types.MARK_QUOTE_QUOTATION_AS_READ, quotationId)
  },

  getOpenQuotes: async ({ commit }) => {
    let response = await QuoteService.getOpen()
    commit(types.SET_OPEN_QUOTES, response.data)
  },

  getQuoteCount: async ({ commit }) => {
    let response = await QuoteService.getQuoteCount()
    return response.data
  },

  getQuoteCategories: async ({ commit }, data) => {
    let response = await QuoteService.getCategories(data)
    commit(types.SET_QUOTE_CATEGORIES, response.data)
  },

  clearFilteredQuotations: async ({ commit }) => {
    commit(types.SET_FILTERED_QUOTATIONS, [])
  },

  filterByCategories: async ({ commit }, data) => {
    let response = await QuoteService.filterByCategories(data)

    if(response.data.length)
      commit(types.SET_FILTERED_QUOTATIONS, response.data)
    else
      commit(types.SET_FILTERED_QUOTATIONS, [{ status: 'Sem resultados' }])
  },

  getClientQuotesByPageNumber: async ({ commit, rootState }, data) => {
    let resourceUrl = rootState.pagination.userSelectedPage
    let response = await QuoteService.getClientQuotesByPageNumber(resourceUrl, data)

    commit('pagination/SET_RESOURCE_PAGINATION', response.headers, { root: true })
    commit(types.SET_QUOTES, response.data)
  },
}
