<template>
  <li class="nav-item" @mouseover="hover = true" @mouseleave="hover = false" :class="{ hover }">
    <router-link :to="{name: 'minimum-order-value'}">
      <span class="menu-title">Valor mínimo de pedido</span>
    </router-link>
  </li>
</template>

<script>
export default {
  name: "MinimumOrderValue",
  data() {
    return {
      hover: false,
    };
  },
};
</script>