<template>
  <div v-if="!removed" :class="mobileBrowser ? 'p-1 row' : 'p-1'">
    <span :class="mobileBrowser ? 'col-5' : ''">
      <span style="margin-right: 8px;">
        <span v-if="product.brandName">{{ product.brandName }}</span>
        <span v-else>(marca não def.)</span>
        <span v-if="product.productLineName"> / {{ product.productLineName }}</span>
        <span v-if="product.productLineExtensionName"> / {{ product.productLineExtensionName }}</span>
      </span>
      <span v-if="product.propertyName" style="margin-right: 8px;">
        <strong class="text-success" v-if="product.propertyName">
          {{ product.propertyName }}
        </strong>
      </span>
      <span v-if="product.packagingName || product.unitsOfMeasurementName" style="margin-right: 8px;">
        <strong class="text-warning" v-if="product.packagingName">
          {{ product.packagingName }} / {{ product.quantity }} {{ product.unitsOfMeasurementName }}
        </strong>
        <strong class="text-warning" v-else>
          {{ product.unitsOfMeasurementName }}
        </strong>
      </span>
    </span>
    <span :class="mobileBrowser ? 'col-5' : ''">
      <span
        v-if="product.secondaryCharacteristics && product.secondaryCharacteristics.length"
        style="margin-right: 8px;"
      >
        <span v-if="product.secondaryCharacteristics && product.secondaryCharacteristics.length">
          {{ product.secondaryCharacteristics.join(' | ') }}
        </span>
      </span>
      <span style="width: 5%; margin-right: 8px;" class="text-center align-top">
        <a
          href="javascript:void(0);"
          @click="openPhotoModal"
          data-toggle="lightbox"
          title="Foto do produto"
          data-title="Maionese"
        >
          <i class="feather icon-image font-medium-3"></i>
        </a>
        <product-photo-modal :product="product" :openPopup="openPhoto" @update-modal="updateModal" />
      </span>
    </span>
    <span style="width: 5%;" :class="mobileBrowser ? 'col-2' : ''">
      <div v-if="removing" class="d-flex justify-content-center" style="right: 5px; top: -5px;">
        <div class="spinner-border text-primary" style="width: 1rem; height: 1rem;" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
      <a
        v-if="!removing"
        href="javascript:void(0);"
        @click="removeFromCart(product.id)"
        class="close font-large-1 position-relative"
        style="right: 5px; top: -5px;"
        title="Excluir"
        aria-label="Excluir"
      >
        <span aria-hidden="true">&times;</span>
      </a>
    </span>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

import ProductPhotoModal from "~/components/products/components/ProductPhotoModal";

export default {
  name: "ProductCard",
  data() {
    return {
      openPhoto: false,
      adding: false,
      removing: false,
      removed: false,
      columnWidth: []
    }
  },
  computed: {
    ...mapGetters("users/products", ["productIsOnList", "productIsOnCart", "productCartIsEmpty"]),
    classes() {
      if (this.isProductTypeView) {
        return "col-xl-2 col-md-4 col-6 mb-5";
      }

      if (this.isCategoryView || this.isFamilyView || this.isSearchView) {
        return "col-xl-3 col-md-4 col-6 mb-5";
      }

      return this.$route.name === "my-product-list"
        ? "col-xl-3 col-md-4 col-6 mb-3"
        : "col-xl-2 col-md-4 col-6 mb-3";
    },
    isProductTypeView() {
      return this.$route.name === "product-type";
    },
    isCategoryView() {
      return this.$route.name === "category";
    },
    isSearchView() {
      return this.$route.name === "users.search";
    },
    isFamilyView() {
      return this.$route.name === "family";
    },
    addedInfo() {
      var total = this.$store.state.users.products.productQuoteCart.length + 1
      if (this.$store.state.users.products.productQuoteCart)
        return total + ' produtos a cotar'
      else
        return '0 produtos a cotar'
    }
  },
  methods: {
    ...mapActions("users/products", [
      "insertProductToProductList",
      "removeProductFromProductList",
      "insertProductToQuoteCart",
      "removeProductFromQuoteCart"
    ]),
    buttonClass(id) {
      if(!this.productCartIsEmpty && this.productIsOnCart(id))
        return "position-absolute w-100 rounded-bottom bg-primary collapse show"
      else
        return "position-absolute w-100 rounded-bottom bg-primary collapse"
    },
    openPhotoModal() {
      this.openPhoto = true
    },
    updateModal(value) {
      this.openPhoto = value
    },
    removeFromCart(id) {
      this.removing = true
      this.removeProductFromQuoteCart(id).then(() => {
        this.cartInfo("Produto removido da cotação", "remove-cart-toast-class", "feather icon-minus-circle")
        setTimeout(() => {
          this.removing = false
          this.removed = true
          this.$emit('item-removed')
        }, 300);
      })
    },
    addToCart(id) {
      this.adding = true
      this.openLoadingInDiv()
      this.insertProductToQuoteCart(id).then(() => {
        this.cartInfo(this.addedInfo, "add-cart-toast-class", "feather icon-plus-circle")
        setTimeout(() => {
          this.adding = false
        }, 300);
      })
    },
    openLoadingInDiv() {
      let container = '#div-with-loading' + this.product.id
      this.$vs.loading({
        container: container,
        scale: 0.6
      })
    },
  },
  props: {
    product: {
      type: Object,
      required: true,
    },
    mobileBrowser: {
      type: Boolean
    }
  },
  components: {
    ProductPhotoModal
  },
};
</script>
