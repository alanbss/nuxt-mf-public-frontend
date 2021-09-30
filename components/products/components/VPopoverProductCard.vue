<template>
  <vs-dropdown vs-custom-content vs-trigger-click tabindex="-1">
    <a tabindex="-1" style="color: #007bff;" href.prevent>...</a>

    <vs-dropdown-menu class="popover-width">
      <div class="card h-100 font-small-3 mb-0">
        <div class="card-body p-0 position-relative">
          <div class="card-text border-bottom p-1">
            <p class="m-0">{{ productCardTitle }}</p>
            <p class="m-0 font-weight-bold">{{ product.propertyName }}</p>
            <p class="m-0">
              <small class="text-tiny">{{ quantifiers() }}</small>
            </p>
          </div>
        </div>

        <div class="card-text p-1 pb-4 clearfix">
          <div class="mr-75 float-left position-relative" style="width: 43%"></div>
          <span class="font-small-2">{{ secondaryCharacteristicsAsText }}</span>
        </div>
      </div>
    </vs-dropdown-menu>
  </vs-dropdown>
</template>

<script>
import cardTitle from "@/resources/products/mixins/cardTitle";

export default {
  name: "VPopoverProductCard",
  data() {
    return {
      secondary: []
    }
  },
  created() {
    this.secondary = [...this.product.secondaryCharacteristics]
    this.secondary.sort()
  },
  computed: {
    secondaryCharacteristicsAsText() {
      return this.secondary.join("\n");
    },
  },
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  mixins: [cardTitle],
};
</script>

<style scoped>
.popover-width {
  width: 20rem;
}

.card {
  box-shadow: none;
}
</style>
