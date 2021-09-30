<template>
  <li class="nav-item" @mouseover="hover = true" @mouseleave="hover = false" :class="{ hover }">
    <router-link :to="{name: 'client-types'}">
      <span class="menu-title">Tipo de Cliente</span>
    </router-link>
  </li>
</template>

<script>
export default {
  name: "ClientType",
  data() {
    return {
      hover: false,
    };
  },
};
</script>