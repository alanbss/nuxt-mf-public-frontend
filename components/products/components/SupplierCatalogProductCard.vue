<template>
  <div class="col-xl-3 col-md-4 col-6 mb-3">
    <h4 v-if="showTypeName" class="font-medium-2 overflow-hidden" style="height: 22px">
      <a href="javascript:void(0);"
      >{{product.productTypeName}}</a>
    </h4>
    <div class="card font-small-3 mb-0">
      <div class="card-body p-0 position-relative">
        <a href="javascript:void(0);" @click="openInfoPopup">
          <v-product-card-title :product="product" />

          <div class="card-text p-1 pb-1 clearfix">
            <div class="mr-75 float-left position-relative" style="width: 43%; height: 100%;">
              <i
                class="feather icon-search position-absolute font-weight-bold text-muted"
                style="left: 3px; bottom: 3px; "
              ></i>
              <img v-if="product.picture" class="rounded img-fluid" :src="product.picture" alt style="width: auto; height: auto;" />
              <img v-else class="rounded img-fluid" :src="noImageSrc" alt style="width: auto; height: auto;" />
            </div>
            <div>
              <v-quote-product-description :product="product" :showComments="true" />
            </div>
          </div>
        </a>
      </div>
      <div class="card-footer p-0 pb-50 bg-white" v-if="expeditions.length > 0">
        <div
          class="p-1 pb-50 font-small-2"
          style="line-height: 18px;"
          v-for="exp in expeditions"
          :key="exp.id"
        >
          <span class="d-block">{{ exp.productExpeditionMediumName }} {{ exp.productExpeditionQuantity }}</span>
          <span class="d-block text-warning" v-if="exp.minimumOrder">
            Qtd. mín. p/ venda: <strong>{{ exp.minimumOrder }}</strong>
          </span>
          <span class="d-block" v-if="exp.supplierProductCode">
            Código: <strong>{{ exp.supplierProductCode }}</strong>
          </span>
          <span class="d-block">Precificação:
            <strong v-if="exp.productExpeditionPricing == 1">{{ product.unitsOfMeasurementName  }}</strong>
            <strong v-if="exp.productExpeditionPricing == 2">{{ product.packagingName }}</strong>
            <strong v-if="exp.productExpeditionPricing == 3">
              {{ exp.productExpeditionMediumName }} {{ exp.productExpeditionQuantity }}
              <!-- <span v-if="product.quantity">x {{ product.quantity }}</span> -->
            </strong>
          </span>
        </div>
      </div>
    </div>
    <product-info-modal :openPopup="openPopup" :product="product" :catalogPublic="catalogPublic" :supplierUserName="supplierUserName" />
  </div>
</template>

<script>
import { mapActions } from "vuex";

import VProductCardTitle from "@/resources/products/components/VProductCardTitle";
import VQuoteProductDescription from "@/resources/products/components/VQuoteProductDescription";
import VSecondaryCharacteristics from "@/resources/products/components/VSecondaryCharacteristics";
import ProductInfoModal from "@/resources/products/components/ProductInfoModal";
import VClamp from "vue-clamp";

export default {
  name: "SupplierCatalogProductCard",
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
    maxPerScreen() {
      if(window.innerWidth >= 1910) {
        return 6
      } else if(window.innerWidth >= 1680 && window.innerWidth < 1910) {
        return 5
      } else if(window.innerWidth >= 1450 && window.innerWidth < 1680) {
        return 4
      } else if(window.innerWidth >= 1220 && window.innerWidth < 1450) {
        return 3
      } else if(window.innerWidth >= 1000 && window.innerWidth < 1220) {
        return 4
      } else {
        return 2
      }
    },

    widthRatio() {
      return ((window.innerWidth / this.maxPerScreen) / window.innerWidth) * 100
    },
  },
  methods: {
    ...mapActions("users/products", [
      "insertProductToProductList",
      "removeProductFromProductList",
      "insertProductToQuoteCart",
      "removeProductFromQuoteCart"
    ]),
    openInfoPopup() {
      this.openPopup = !this.openPopup
    },
  },
  props: {
    product: {
      type: Object,
      required: true,
    },
    expeditions: {
      type: Array,
      required: true,
    },
    catalogPublic: {
      type: Boolean,
    },
    showTypeName: {
      type: Boolean,
    },
    supplierUserName: {
      type: String,
    },
  },
  components: {
    VProductCardTitle,
    ProductInfoModal,
    VQuoteProductDescription
  },
};
</script>
