const priceFormatter = {
  methods: {
    formatPrice(price) {
      var formatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      })

      return formatter.format(price)
    }
  }
}

export default priceFormatter
