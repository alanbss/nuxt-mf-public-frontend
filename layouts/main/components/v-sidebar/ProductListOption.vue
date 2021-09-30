<template>
  <span v-if="productsInList > 0">
    <li
      v-if="$auth.check()"
      class="nav-item text-black  pt-1 pb-1"
      style="background: yellow; border-top: 1px solid black; border-bottom: 1px solid black"
      @mouseover="hover = true"
      @mouseleave="hover = false"
      :class="{ hover }"
    >
      <a href="/minha-lista-de-produtos" class="pt-0 pb-0">
        <span class=" text-black">Minha lista ( {{ productsInList }} produtos )</span>
      </a>
      <i class="font-small-2 ml-1">Produtos favoritados para sua cotação</i>
    </li>

    <li
      v-else
      class="nav-item text-white bg-primary"
      @mouseover="hover = true"
      @mouseleave="hover = false"
      :class="{ hover }"
    >
      <a href="#x">
        <span class="menu-title">Minha lista (vazia)</span>
      </a>
      <i class="font-small-2 ml-1">A lista junta o que você costuma cotar</i>
    </li>
  </span>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "ProductListOption",
  data() {
    return {
      hover: false
    };
  },
  created() {
    if(this.$auth.check())
      this.getProductList()
  },
  computed: {
    productsInList() {
      if (this.$store.state.users.products.totalProductList)
        return this.$store.state.users.products.totalProductList
      else
        return 0
    },
  },
  methods: {
    ...mapActions("users/products", ["getProductList"]),
  }
};
</script>
