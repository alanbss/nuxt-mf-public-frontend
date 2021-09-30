<template>
  <li class="nav-item" @mouseover="hover = true" @mouseleave="hover = false" :class="{ hover }">
    <router-link :to="{name: 'quotation-panel'}">
      <span class="menu-title">Cotações / Pedidos</span>
    </router-link>
  </li>
</template>

<script>
export default {
  name: "OpenQuotations",
  data() {
    return {
      hover: false,
    };
  },
};
</script>
