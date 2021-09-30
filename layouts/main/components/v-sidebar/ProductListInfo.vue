<template>
  <li v-if="productsInQuoteCart" class="nav-item text-white bg-primary text-center p-2 mb-1">
    <span class="d-block font-weight-bold font-medium-3">{{ productsInQuoteCart }} produtos</span>
    <span class="d-block font-small-3 mb-1">para cotar agora</span>
    <a
      href="#x"
      class="btn font-small-3 font-weight-bold bg-white text-primary width-100 m-auto"
    >Avançar</a>
  </li>

  <li v-else class="nav-item text-white bg-primary text-center p-2 mb-1">
    <span
      class="text-break-line d-block font-weight-bold font-medium-3"
    >Você ainda não selecionou produtos para cotar</span>
    <span class="d-block font-small-3 mb-1"></span>
  </li>
</template>

<script>
export default {
  name: "ProductListInfo",
  computed: {
    productsInQuoteCart() {
      if (this.$store.state.users.products.productQuoteCart)
        return this.$store.state.users.products.productQuoteCart.length
      else
        return 0
    },
  }
};
</script>

<style scoped>
span.text-break-line {
  display: block;
  word-wrap: break-word;
  white-space: normal;
}
</style>
