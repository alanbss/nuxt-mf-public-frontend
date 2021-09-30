<template>
  <li class="nav-item" @mouseover="hover = true" @mouseleave="hover = false" :class="{ hover }">
    <router-link :to="{ name: 'users.allQuotes' }">
      <span class="menu-title">Cotações realizadas</span>
    </router-link>
  </li>
</template>

<script>
export default {
  name: "QuotationsOption",
  data() {
    return {
      hover: false
    };
  }
};
</script>
