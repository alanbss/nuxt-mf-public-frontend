<template>
  <div  class="col-xl-2 col-lg-3 col-md-4 col-12 mb-5 pb-2" style="padding-right: 8px; padding-left: 8px;">
      <h5 class="font-medium-1 mb-25 overflow-hidden" style="height: 20px">{{ product.productTypeName }}</h5>
      <h6 class="font-small-2 overflow-hidden disabled-opacity" style="height: 13px">
        <span v-if="product.categoryCollection" style="margin-right: 3px;"><i>{{ product.categoryCollection }}</i></span>
        {{ product.categoryName }}
      </h6>
      <div class="card h-100 font-small-3 mb-0" style="min-width: 180px !important;">
          <div class="card-body p-0">
            <img v-if="product.picture" class="rounded img-fluid" :src="product.picture" alt style="width: 95%; height: auto;" />
            <img v-else class="rounded img-fluid" :src="noImageSrc" alt style="width: 95%; height: auto;" />
            <v-product-card-title :product="product" />
              <div class="card-text border-bottom p-1 rounded-top" style="background: rgba(34,41,47,.03);">
                <v-secondary-characteristics :product="product" />
              </div>
                <pricing-product-expedition
                  v-for="exp in expeditions"
                  :key="exp.id"
                  :product="product"
                  :expedition="exp"
                  :quotation="quotation"
                  @discount-changed="emitDiscountChange()"
                  @price-changed="emitPriceChange()"
                  @sale-true="emitSaleChangeUp()"
                  @sale-false="emitSaleChangeDown()"
                  @deleted-price="emitPriceDeleted()"
                  
                />
                <span v-if="!expeditions.length">
                  <pricing-product-expedition
                    :key="'granel' + product.id"
                    :product="product"
                    :expedition="granelExp"
                    :quotation="quotation"
                    @discount-changed="emitDiscountChange()"
                    @price-changed="emitPriceChange()"
                    @sale-true="emitSaleChangeUp()"
                    @sale-false="emitSaleChangeDown()"
                    @deleted-price="emitPriceDeleted()"
        
                  />
                </span>
              </div>
      </div>
  </div>
</template>


<script>
// import { mapActions } from "vuex";

import PricingProductExpedition from "@/resources/products/components/PricingProductExpedition";
import VProductCardTitle from "@/resources/products/components/VProductCardTitle";
import VSecondaryCharacteristics from "@/resources/products/components/VSecondaryCharacteristics";

export default {
  name: "PricingProductCard",
  data() {
    return {
      openPhoto: false,
      noImageSrc: require(`@/assets/images/Produto-sem-imagem-Meu-Fornecedor.jpg`),
    }
  },
  computed: {
    granelExp() {
      return { id: null, supplierProductCode: null, productExpedition: { pricing: 1 } }
    },
  },
  methods: {
    emitPriceChange() {
      this.$emit('check-prices')
    },
    emitSaleChangeUp() {
      this.$emit('check-sale-up')
    },
    emitSaleChangeDown() {
      this.$emit('check-sale-down')
    },
    emitPriceDeleted() {
      this.$emit('price-deleted')
    },
    emitDiscountChange(val) {
      this.$emit('check-discounts', val)
    },
    validateExpeditions() {
      var validationArray = this.$children.map(child => {
        if(typeof child.validateExpeditions === 'function')
          return child.validateExpeditions()
        else
          return null
      })
    },
  },
  created() {
  },
  props: {
    product: {
      type: Object,
      required: true,
    },
    quotation: {
      type: String,
      required: true,
    },
    expeditions: {
      type: Array,
      required: true,
    }
  },
  components: {
    VProductCardTitle,
    VSecondaryCharacteristics,
    PricingProductExpedition,
  },
};
</script>
