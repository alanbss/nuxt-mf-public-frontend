<template>
  <li class="nav-item" @mouseover="hover = true" @mouseleave="hover = false" :class="{ hover }">
    <router-link :to="{name: 'pricing'}">
      <span class="menu-title">Atualizar preços</span>
    </router-link>
  </li>
</template>

<script>
export default {
  name: "UpdatePrices",
  data() {
    return {
      hover: false,
    };
  },
};
</script>
