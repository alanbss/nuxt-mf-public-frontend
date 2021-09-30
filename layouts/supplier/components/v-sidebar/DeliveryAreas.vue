<template>
  <li class="nav-item" @mouseover="hover = true" @mouseleave="hover = false" :class="{ hover }">
    <router-link :to="{name: 'delivery-areas'}">
      <span class="menu-title">Área de entrega/atendimento</span>
    </router-link>
  </li>
</template>

<script>
export default {
  name: "DeliveryAreas",
  data() {
    return {
      hover: false,
    };
  },
};
</script>