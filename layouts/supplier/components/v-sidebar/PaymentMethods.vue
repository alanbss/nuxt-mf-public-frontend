<template>
  <li class="nav-item" @mouseover="hover = true" @mouseleave="hover = false" :class="{ hover }">
    <router-link :to="{name: 'payment-methods'}">
      <span class="menu-title">Formas de pagamento</span>
    </router-link>
  </li>
</template>

<script>
export default {
  name: "PaymentMethods",
  data() {
    return {
      hover: false,
    };
  },
};
</script>