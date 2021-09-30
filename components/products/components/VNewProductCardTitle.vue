<template>
  <div>
    <p class="m-0 font-weight-bold color-mf-verde" style="font-size: 1.2em;">
      <b>{{ product.propertyName }}</b>
    </p>
    <p class="m-0" style="color: #3d3d3d; font-size: 1.08em;">
      <b>{{ productCardTitle }}</b>
    </p>
  </div>
</template>

<script>
import cardTitle from "@/resources/products/mixins/cardTitle";

export default {
  name: "VNewProductCardTitle",

  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  components: {

  },
  mixins: [cardTitle]
};
</script>
