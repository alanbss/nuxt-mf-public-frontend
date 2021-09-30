<template>
  <li class="nav-item" @mouseover="hover = true" @mouseleave="hover = false" :class="{ hover }">
    <router-link :to="{name: 'my-catalog'}">
      <span class="menu-title">Meu catálogo</span>
    </router-link>
  </li>
</template>

<script>
export default {
  name: "MyCatalog",
  data() {
    return {
      hover: false,
    };
  },
};
</script>
