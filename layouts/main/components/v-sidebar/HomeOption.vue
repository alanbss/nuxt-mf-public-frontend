<template>
  <span>
    <li
      class="nav-item"
      @mouseover="hover = true"
      @mouseleave="hover = false"
      :class="{ hover }"
    >
      <a href="/" v-if="!supplierStore" >
        <span class="menu-title">
          <i class="vs-icon feather icon-home mr-1"></i>Início
        </span>
      </a>
      <a href="/" v-else >
        <span class="menu-title pl-1">
          Ir ao meu fornecedor
        </span>
      </a>
    </li>
  </span>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "HomeOption",
  data() {
    return {
      hover: false
    };
  },
  created() {

  },
  computed: {
    supplierStore() {
      return this.$route.meta.supplierStore
    },
  },
  methods: {

  }
};
</script>
