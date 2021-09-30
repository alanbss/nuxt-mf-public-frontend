<template>
  <div :class="classes" :style="'background-color: transparent; margin-right: 6px; margin-left: 6px;'">
    <h6 v-if="!blockProductTypeTitle">
      <span v-if="product.categoryCollection"><i>{{ product.categoryCollection }}</i> | </span>
      <span>
        {{ product.categoryName }}
      </span>
    </h6>
    <h5 v-if="!blockProductTypeTitle" style="margin-bottom: 10px;">
      {{ product.productTypeName }}
    </h5>
    <div class="card-transparent font-small-3 mb-0 bg-transparent" style="height: auto;">
      <div class="card-body p-0 position-relative">
        <div class="text-center bg-white photo-height" style="padding: 5px; position: relative;">
          <a href="javascript:void(0);" @click="openInfoPopup">
            <img v-if="product.picture" class="rounded img-fluid" :src="product.picture" alt style="width: auto; height: 100%;" />
            <img v-else class="rounded img-fluid" :src="noImageSrc" alt style="width: auto; height: 100%;" />
            <div class="badge badge-pill badge-md bg-mf-laranja" style="position: absolute; bottom: 5px; left: 10px;">
              <b>{{ quantifiers(true) }}</b>
            </div>
          </a>
        </div>
        <a href="javascript:void(0);" @click="openInfoPopup">
          <div class="card-text p-1 rounded-top bg-transparen'">
            <v-new-product-card-title :product="product" />
          </div>

          <div class="card-text pl-1 clearfix bg-transparent">
            <v-new-secondary-characteristics :product="product" />
          </div>
        </a>
      </div>
    </div>
    <product-info-modal :openPopup="openPopup" :product="product" :catalogPublic="true" :supplierUserName="supplierUserName" />
  </div>
</template>

<style scoped>
@media only screen and (min-width: 768px) {
  .photo-height {
    height: 200px;
  }
}
@media only screen and (max-width: 767px) {
  .photo-height {
    height: 150px;
  }
}
.type-link {
  color: inherit;
}
.type-link:hover {
  color: inherit;
  text-decoration: underline;
}
</style>

<script>
import { mapActions, mapGetters } from "vuex";

import VNewProductCardTitle from "@/resources/products/components/VNewProductCardTitle";
import VNewSecondaryCharacteristics from "@/resources/products/components/VNewSecondaryCharacteristics";
import ProductInfoModal from "@/resources/products/components/ProductInfoModal";
import cardTitle from "@/resources/products/mixins/cardTitle";

export default {
  name: "ProductPublicCard",
  data() {
    return {
      openPopup: false,
      adding: false,
      removing: false,
      noImageSrc: require(`@/assets/images/Produto-sem-imagem-Meu-Fornecedor.jpg`)
    }
  },
  created() {

  },
  computed: {
    ...mapGetters("users/products", ["productIsOnList", "productIsOnCart", "productCartIsEmpty"]),
    classes() {
      // if (this.isProductTypeView) {
      //   return "col-xl-2 col-md-4 col-6 mb-5";
      // }

      // if (this.isCategoryView || this.isFamilyView || this.isSearchView) {
      //   return "col-xl-3 col-md-4 col-6 mb-5";
      // }

      return "mb-1"
    },
    hasWidth() {
      if(this.widthRatio)
        return 'width: ' + this.widthRatio + '%;'
      else
        return ''
    }
  },
  methods: {
    ...mapActions("users/products", [
      "insertProductToProductList",
      "removeProductFromProductList",
      "insertProductToQuoteCart",
      "removeProductFromQuoteCart"
    ]),
    backgroundClass(id) {
      if(!this.productCartIsEmpty && this.productIsOnCart(id))
        return " bg-white"
      else
        return " bg-transparent"
    },
    openInfoPopup() {
      this.openPopup = !this.openPopup
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
    blockProductTypeTitle: {
      type: Boolean
    },
    supplierUserName: {
      type: String,
    },
    showTypeName: {
      type: Boolean,
    },
  },
  components: {
    VNewProductCardTitle,
    VNewSecondaryCharacteristics,
    ProductInfoModal,
  },
  mixins: [cardTitle],
};
</script>
