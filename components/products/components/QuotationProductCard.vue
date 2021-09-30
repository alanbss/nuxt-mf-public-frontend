<template>
  <div class="col-xl-2 col-md-4 col-6 mb-5 pb-2" v-if="!expeditions.length || expeditions.filter(exp => exp.inUse).length">
      <h5 class="font-medium-1 mb-25 overflow-hidden" style="height: 20px">{{ product.productTypeName }}</h5>
      <h6 class="font-small-2 overflow-hidden disabled-opacity" style="height: 13px">
        <span v-if="product.categoryCollection" style="margin-right: 3px;"><i>{{ product.categoryCollection }}</i></span>
        {{ product.categoryName }}
      </h6>
      <div class="card h-100 font-small-3 mb-0" style="min-width: 205px !important;"  >
          <div class="card-body p-0">
            <img v-if="product.picture" class="rounded img-fluid" :src="product.picture" alt style="width: 95%; height: auto;" />
            <img v-else class="rounded img-fluid" :src="noImageSrc" alt style="width: 95%; height: auto;" />
            <v-product-card-title :product="product" />
              <div class="card-text border-bottom p-1 rounded-top" style="background: rgba(34,41,47,.03);">
                <v-secondary-characteristics :product="product" />
              </div>
              <div  class="card-text mb-n3">
                <quotation-product-expedition
                  v-for="exp in expeditions.filter(exp => exp.inUse)"
                  :key="exp.id"
                  :product="product"
                  :expedition="exp"
                  :quotation="quotation"
                  :prices="filteredPrices(exp.id)"
                  @discount-changed="emitDiscountChange()"
                  @price-changed="emitPriceChange()" />
                <span v-if="!expeditions.length">
                  <quotation-product-expedition
                    :key="'granel' + product.id"
                    :product="product"
                    :expedition="granelExp"
                    :quotation="quotation"
                    :prices="[]"
                    @discount-changed="emitDiscountChange()"
                    @price-changed="emitPriceChange()" />
                </span>
              </div>
          </div>
      </div>
  </div>
</template>

<style>
  .promoCardActive{
    border: 2px solid;
    border-image: linear-gradient(90deg, rgba(208,209,3,1), rgba(242,5,5,1)) 1;
  }
</style>

<script>
// import { mapActions } from "vuex";

import QuotationProductExpedition from "@/resources/products/components/QuotationProductExpedition";
import VProductCardTitle from "@/resources/products/components/VProductCardTitle";
import VSecondaryCharacteristics from "@/resources/products/components/VSecondaryCharacteristics";

export default {
  name: "QuotationProductCard",
  data() {
    return {
      openPhoto: false,
      noImageSrc: require(`@/assets/images/Produto-sem-imagem-Meu-Fornecedor.jpg`)
    }
  },
  mounted() {
    
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
    emitDiscountChange(val) {
      this.$emit('check-discounts', val)
    },
    filteredPrices(expId) {
      return this.prices.filter(price => price.supplierProductExpedition.id == expId)
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
    },
    prices: {
      type: Array,
      required: true,
    }
  },
  components: {
    VProductCardTitle,
    VSecondaryCharacteristics,
    QuotationProductExpedition,
  },
};
</script>
