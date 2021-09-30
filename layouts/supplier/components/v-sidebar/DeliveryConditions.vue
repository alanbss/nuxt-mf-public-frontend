<template>
  <li class="nav-item" @mouseover="hover = true" @mouseleave="hover = false" :class="{ hover }">
    <router-link :to="{name: 'delivery-conditions'}">
      <span class="menu-title">Forma de entrega/atendimento</span>
    </router-link>
  </li>
</template>

<script>
export default {
  name: "DeliveryConditions",
  data() {
    return {
      hover: false,
    };
  },
};
</script>