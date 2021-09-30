<template>
  <div class="card-text border-bottom p-1 rounded-top" style="background: rgba(34,41,47,.03);">
    <p class="m-0" style="color: #333;">
      <v-clamp autoresize :max-lines="1" :ellipsis="' '">
        {{ productCardTitle }}
        <template #after="{clamped}">
          <template v-if="clamped">
            <v-popover-product-card :product="product" />
          </template>
        </template>
      </v-clamp>
    </p>

    <p class="m-0 font-weight-bold text-success">
      <v-clamp autoresize :max-lines="1" :ellipsis="' '">
        {{ product.propertyName }}
        <template #after="{clamped}">
          <template v-if="clamped">
            <v-popover-product-card :product="product" />
          </template>
        </template>
      </v-clamp>
    </p>

    <p class="m-0 color-mf-laranja">
      <small class="text-tiny">{{quantifiers()}}</small>
    </p>
  </div>
</template>

<script>
import cardTitle from "@/resources/products/mixins/cardTitle";
import VPopoverProductCard from "@/resources/products/components/VPopoverProductCard";
import VClamp from "vue-clamp";

export default {
  name: "VProductCardTitle",

  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  components: {
    VClamp,
    VPopoverProductCard,
  },
  mixins: [cardTitle]
};
</script>
