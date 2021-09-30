<template>
  <li class="nav-item" @mouseover="hover = true" @mouseleave="hover = false" :class="{ hover }">
    <router-link :to="{ name: 'users.orderPanel' }">
      <span class="menu-title">Pedidos de compra</span>
    </router-link>
  </li>
</template>

<script>
export default {
  name: "PurchaseRequestsOption",
  data() {
    return {
      hover: false
    };
  }
};
</script>
