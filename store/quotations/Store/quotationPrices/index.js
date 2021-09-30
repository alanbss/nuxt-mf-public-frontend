import QuotationPricesService from '~/components/quotations/Services/quotations.prices.services'

const SET_QUOTATION_PRICES = 'SET_QUOTATION_PRICES'

export default {
  namespaced: true,
  state: {
    quotationPrices: [],
  },
  actions: {
    getPricesByQuotation: async ({ commit }, quotationId) => {
      let response = await QuotationPricesService.getPrices(quotationId)
      commit(SET_QUOTATION_PRICES, response.data)
    },

  },
  mutations: {
    [SET_QUOTATION_PRICES]: (state, prices) => {
      state.quotationPrices = prices
    },
  }
}
