<template>
  <div class="card font-small-3 mb-0" v-if="prices.length">
    <div class="card-body p-0" v-if="ended">
      <div class="card-text border-bottom p-1 rounded-top" style="background: rgba(34,41,47,.03);">
        <a
          href="javascript:void(0);"
          @click="openPhotoModal"
          data-toggle="lightbox"
          title="Foto do produto"
          data-title="Maionese"
          class="float-right"
          tabindex="-1"
        >
          <i class="feather icon-image font-medium-1"></i>
        </a>
        <a href="javascript:void(0);" @click="openInfoPopup">
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
          <p class="m-0 text-dark"><b>{{ product.propertyName }}</b></p>
          <div>
            <v-quote-product-description :product="product" :showComments="true" />
          </div>
        </a>
      </div>
      <product-photo-modal :product="product" :openPopup="openPhoto" @update-modal="updateModal" />
      <div
        class="card-text"
        v-for="price in prices"
        :key="price.id"
      >
        <div class="p-1 border-top" v-if="price.unavailable && !blockInputs">
          <div class="clearfix pt-50 pl-50  rounded border">
            <p style="color: #d11b6d;">
              Indisponível
            </p>
          </div>
        </div>
        <div class="p-1 border-top" v-else-if="(price.quantity && blockInputs) || (price && !blockInputs)">
          <p>
            <span class="d-block">
              <span class="font-weight-bold font-medium-1">
              {{ formatPrice(calculatePrice(price, product)) }}
              </span>
              <span class="color-mf-laranja">
                p/
                <span v-if="!product.packagingName && !product.quantity">
                  {{ product.unitsOfMeasurementName }}
                </span>
                <span v-else>
                  {{ product.packagingName }} {{ product.quantity }} {{ product.unitsOfMeasurementName }}
                  <span v-if="parseInt(product.packageQuantity) > 1">x {{ product.packageQuantity }}</span>
                </span>
              </span>
              <!-- <span v-else>
                {{ price.supplierProductExpedition.productExpeditionMediumName }} {{ product.quantity }} x {{ price.supplierProductExpedition.productExpeditionQuantity }}
              </span> -->
            </span>
            <span class="d-block disabled-opacity" v-if="product.packagingName && product.quantity">
              <i>{{ pricePerBaseUnit(price) }}</i>
            </span>
          </p>
          <div v-if="blockInputs">
            <div class="bg-rgba-light p-50 rounded border">
              <p class="mb-50">
                <span
                  class="badge badge-pill badge-warning"
                  v-if="price.supplierProductExpedition.productExpeditionMediumName"
                >
                  {{ price.supplierProductExpedition.productExpeditionMediumName }} {{ price.supplierProductExpedition.productExpeditionQuantity }}
                </span>
                <!-- <span class="badge badge-pill badge-warning" v-else-if="price.supplierProductExpedition.productExpeditionQuantity">
                  x {{ price.supplierProductExpedition.productExpeditionQuantity }}
                </span> -->
                <span
                  v-if="price.supplierProductExpedition.productExpeditionQuantity"
                >
                  {{ formatPrice(calculatePrice(price, product) * price.supplierProductExpedition.productExpeditionQuantity) }}
                </span>
              </p>
              <p class="mb-50">
                  Qtd.:
                  <span class="font-weight-bold text-success font-medium-1">
                    {{ String(price.quantity).replace('.', ',') }}
                  </span>
              </p>
              <span
                class="d-flex"
                style="min-height: 24px; padding-left: 0.1rem;"
              >
                <span
                  v-if="hasDiscount(price, formatQuantity(price.quantity), false)"
                  class="text-dark"
                  style="text-decoration: line-through; font-size: 0.8rem !important;"
                >
                  {{ formatPrice(calculatedPrice(price.id, formatQuantity(price.quantity), expeditionPrice(calculatePrice(price, product), price.supplierProductExpedition.productExpeditionQuantity))).substring(3) }}
                </span>
                <span
                  v-else
                  class="text-dark font-weight-bold font-medium-1"
                >
                  {{ formatPrice(calculatedPrice(price.id, formatQuantity(price.quantity), expeditionPrice(calculatePrice(price, product), price.supplierProductExpedition.productExpeditionQuantity))) }}
                </span>
                <div
                  v-if="validDiscountById(price.id)[0] && !validDiscountById(price.id)[1]"
                  class="font-weight-bold font-medium-1 w-100"
                  style="color: #111 !important; font-size: 12px; margin-left: 5px;"
                >
                  {{ formatPrice(calculatedPriceWithDiscount(price, formatQuantity(price.quantity), expeditionPrice(calculatePrice(price, product), price.supplierProductExpedition.productExpeditionQuantity))) }}
                </div>
                <div
                  v-if="validDiscountById(price.id)[1] && !validDiscountById(price.id)[0]"
                  class="font-weight-bold font-medium-1 w-100"
                  style="color: #111 !important; font-size: 12px; margin-left: 5px;"
                >
                  {{ formatPrice(calculatedPriceWithDiscount(price, formatQuantity(price.quantity), expeditionPrice(calculatePrice(price, product), price.supplierProductExpedition.productExpeditionQuantity))) }}
                </div>
              </span>
              <div v-if="price.supplierProductExpedition.discountPercentage1" class="badge badge-pill badge-light-warning font-small-3 font-weight-bold w-100 mt-50" style="color: #EA5455 !important">
                {{ String(price.supplierProductExpedition.discountPercentage1).replace('.', ',') }}% desc. p/ {{ price.supplierProductExpedition.discountRange1 }}
                <span v-if="price.supplierProductExpedition.productExpeditionMediumName">{{ price.supplierProductExpedition.productExpeditionMediumName.substring(0, 2) }}</span>
              </div>
              <div v-if="price.supplierProductExpedition.discountPercentage2" class="badge badge-pill badge-light-warning font-small-3 font-weight-bold w-100 mt-50" style="color: #EA5455 !important">
                {{ String(price.supplierProductExpedition.discountPercentage2).replace('.', ',') }}% desc. p/ {{ price.supplierProductExpedition.discountRange2 }}
                <span v-if="price.supplierProductExpedition.productExpeditionMediumName">{{ price.supplierProductExpedition.productExpeditionMediumName.substring(0, 2) }}</span>
              </div>
            </div>
          </div>
          <div class="clearfix bg-rgba-light p-50 rounded border" v-else>
            <p class="mb-50" v-if="price.supplierProductExpedition.productExpeditionQuantity">
              <span class="badge badge-pill badge-warning" v-if="price.supplierProductExpedition.productExpeditionMediumName != 'un.'">
                {{ price.supplierProductExpedition.productExpeditionMediumName }} {{ price.supplierProductExpedition.productExpeditionQuantity }}
              </span>
              <span class="badge badge-pill badge-warning" v-else>
                x {{ price.supplierProductExpedition.productExpeditionQuantity }}
              </span>
              {{ formatPrice(expeditionPrice(calculatePrice(price, product), price.supplierProductExpedition.productExpeditionQuantity)) }}
            </p>
            <div class="form-group mb-0 float-left w-50">


            </div>
            <span class="d-flex align-items-center pl-50" style="min-height: 40px;">
              {{ formatPrice(calculatedPrice(price.id, formatQuantity(priceInput[price.id]), expeditionPrice(calculatePrice(price, product), price.supplierProductExpedition.productExpeditionQuantity))) }}
            </span>
            <p v-show="showMinAlert[price.id]" class="mb-0 danger font-small-2">
              Qtd. abaixo da mín. exigida.
            </p>
          </div>
        </div>
      </div>
    </div>
    <product-info-modal :openPopup="openPopup" :product="product" />
  </div>
</template>

<script>
//import { mapActions, mapState } from "vuex";

//import QuotationProductExpedition from "@/resources/products/components/QuotationProductExpedition";
import priceFormatter from "@/mixins/priceFormatter";
import VQuoteProductDescription from "@/resources/products/components/VQuoteProductDescription";
import ProductInfoModal from "@/resources/products/components/ProductInfoModal";
import ProductPhotoModal from "@/resources/products/components/ProductPhotoModal";
import cardTitle from "@/resources/products/mixins/cardTitle";
import VPopoverProductCard from "@/resources/products/components/VPopoverProductCard";
import VClamp from "vue-clamp";
import Vue from 'vue';

export default {
  name: "OrderProductCard",
  data() {
    return {
      showMinAlert: [],
      priceInput: [],
      totals: [],
      openPopup: false,
      openPhoto: false,
      ended: false,
      discountValid: []
    }
  },
  mounted() {
    this.loadValues()
  },
  computed: {
    isExpired() {
      if(this.expired)
        return true
      else
        return false
    }
  },
  watch: {
    totals() {
      this.$emit('quantity-input', this.totals)
    },
    prices(newVal) {
      if(!this.ended)
        this.loadValues()
    }
  },
  methods: {
    validDiscountById(id) {
      return this.discountValid.find(obj => obj.id == id).values
    },
    loadValues() {
      if(this.prices.length) {
        for(var i = 0; i < this.prices.length; i++) {
          this.discountValid.push({ id: this.prices[i].id, values: [false, false] })
          if(this.prices[i].quantity) {
            Vue.set(this.priceInput, [this.prices[i].id], String(this.prices[i].quantity).replace('.', ','))
            this.hasDiscount(this.prices[i], this.formatQuantity(this.prices[i].quantity))
          }
          if(this.loadedTotals) {
            let found = this.loadedTotals.find(obj => obj.id == this.prices[i].id)
            if(found)
              Vue.set(this.priceInput, [this.prices[i].id], String(this.prices[i].quantity).replace('.', ','))
          }
        }
        this.ended = true
      }
    },
    quantityClass(id) {
      if(this.showMinAlert[id])
        return 'form-control font-weight-bold text-success is-invalid'
      else
        return 'form-control font-weight-bold text-success'
    },
    tooltipText(exp) {
      if(this.product.packagingName)
        return `Mín. ${exp.minimumOrder} ${this.product.packagingName}`
      else
        return `Mín. ${exp.minimumOrder} ${this.product.unitsOfMeasurementName}`
    },
    isDisabled(exp) {
      if(exp.minimumOrder)
        return true
      else
        return false
    },
    expeditionPrice(price, quantity) {
      if(quantity)
        return (price * quantity)
      else
        return price
    },
    hasDiscount(priceObj, quantity, checkArray = true) {
      var range1 = priceObj.supplierProductExpedition.discountRange1
      var range2 = priceObj.supplierProductExpedition.discountRange2
      var discount1 = priceObj.supplierProductExpedition.discountPercentage1
      var discount2 = priceObj.supplierProductExpedition.discountPercentage2

      var has = false

      var discountData = this.discountValid.find(obj => obj.id == priceObj.id)

      if(!range1 && !range2) {
        if(checkArray) discountData.values = [false, false]
        has = false
      } else if(range1 && !range2 && quantity >= range1) {
        if(checkArray) discountData.values = [true, false]
        has = true
      } else if(range1 && !range2 && quantity < range1) {
        if(checkArray) discountData.values = [false, false]
        has = false
      } else if(range2 >= range1 && quantity >= range2) {
        if(checkArray) discountData.values = [false, true]
        has = true
      } else if(range1 > range2 && quantity >= range1) {
        if(checkArray) discountData.values = [true, false]
        has = true
      } else if(quantity < range1 && quantity < range2) {
        if(checkArray) discountData.values = [false, false]
        has = false
      } else if(range2 >= range1 && quantity < range2 && quantity >= range1) {
        if(checkArray) discountData.values = [true, false]
        has = true
      } else if(range1 > range2 && quantity < range1 && quantity >= range2) {
        if(checkArray) discountData.values = [false, true]
        has = true
      }

      return has
    },
    calculatedPrice(id, quantity, price) {
      let result = quantity * price
      if(!isNaN(result)) {
        return result
      }
      else
        return 0
    },
    calculatedPriceWithDiscount(priceObj, quantity, price) {
      let result = this.checkDiscounts(priceObj, quantity, price)
      if(!isNaN(result)) {
        return result
      }
      else
        return 0
    },
    checkDiscounts(priceObj, calcQuantity, price) {
      var range1 = priceObj.supplierProductExpedition.discountRange1
      var range2 = priceObj.supplierProductExpedition.discountRange2
      var discount1 = priceObj.supplierProductExpedition.discountPercentage1
      var discount2 = priceObj.supplierProductExpedition.discountPercentage2

      var total = 0

      if(!range1 && !range2) {
        total = calcQuantity * price
      } else if(range1 && !range2 && calcQuantity >= range1) {
        total = calcQuantity * price * ((100 - discount1) * 0.01)
      } else if(range1 && !range2 && calcQuantity < range1) {
        total = calcQuantity * price
      } else if(range2 >= range1 && calcQuantity >= range2) {
        total = calcQuantity * price * ((100 - discount2) * 0.01)
      } else if(range1 > range2 && calcQuantity >= range1) {
        total = calcQuantity * price * ((100 - discount1) * 0.01)
      } else if(calcQuantity < range1 && calcQuantity < range2) {
        total = calcQuantity * price
      } else if(range2 >= range1 && calcQuantity < range2 && calcQuantity >= range1) {
        total = calcQuantity * price * ((100 - discount1) * 0.01)
      } else if(range1 > range2 && calcQuantity < range1 && calcQuantity >= range2) {
        total = calcQuantity * price * ((100 - discount2) * 0.01)
      }

      return total
    },
    calculatePrice(priceObj, product) {
      var price = priceObj.supplierProductExpedition.price
      if(priceObj.supplierProductExpedition.productExpeditionPricing == 1) {
        price = parseFloat(priceObj.supplierProductExpedition.price) * parseFloat(this.product.quantity.replace(',', '.'))
        if(product.packageQuantity)
           price = price * parseFloat(this.product.packageQuantity)
      } else if(priceObj.supplierProductExpedition.productExpeditionPricing == 2) {
        price = priceObj.supplierProductExpedition.price
      } else if(priceObj.supplierProductExpedition.productExpeditionPricing == 3) {
        price = parseFloat(priceObj.supplierProductExpedition.price) / parseFloat(priceObj.supplierProductExpedition.productExpeditionQuantity)
        // if(this.product.packageQuantity)
        //   price = price / parseFloat(this.product.packageQuantity)
      }
      return price
    },
    formatQuantity(quantity) {
      if(quantity && String(quantity).includes(','))
        quantity = String(quantity).replace(',', '.')
      return quantity
    },
    verifyAllowed(id, quantity) {
      var regex = null
      if(this.product.packagingName) {
        regex = /^[0-9]+$/
      } else {
        regex = /^(\d+)(,\d{0,2})?$/
      }
      if(!regex.test(quantity)) {
        this.priceInput[id] = quantity.slice(0, -1)
      }
      return this.priceInput[id]
    },
    openInfoPopup() {
      this.openPopup = !this.openPopup
    },
    updateModal(value) {
      this.openPhoto = value
    },
    openPhotoModal() {
      this.openPhoto = true
    },
    pricePerBaseUnit(priceObj) {
      var price = 0
      if(priceObj.supplierProductExpedition.productExpeditionPricing == 1)
        price = this.product.unitsOfMeasurementEquivalence * parseFloat(priceObj.supplierProductExpedition.price)
      else if(priceObj.supplierProductExpedition.productExpeditionPricing == 2) {
        price = (this.product.unitsOfMeasurementEquivalence / parseFloat(this.product.quantity.replace(',', '.'))) * parseFloat(priceObj.supplierProductExpedition.price)
        // if(this.product.packageQuantity)
        //   price = price / parseFloat(this.product.packageQuantity)
      } else {
        price = (this.product.unitsOfMeasurementEquivalence / (parseFloat(this.product.quantity.replace(',', '.')) * parseFloat(priceObj.supplierProductExpedition.productExpeditionQuantity))) * parseFloat(priceObj.supplierProductExpedition.price)
        // if(this.product.packageQuantity)
        //   price = price / parseFloat(this.product.packageQuantity)
      }

      var text = ''
      switch(this.product.unitsOfMeasurementMeasureType) {
        case 'solid':
          text = this.formatPrice(price) + ' p/ kg'
          break;
        case 'liquid':
          text = this.formatPrice(price) + ' p/ L'
          break;
      }
      return text
    },
  },
  props: {
    product: {
      type: Object,
      required: true,
    },
    prices: {
      type: Array,
      required: true,
    },
    loadedTotals: {
      type: Array
    },
    blockInputs: {
      type: Boolean,
    },
    expired: {
      type: Boolean,
    },
  },
  components: {
    VQuoteProductDescription,
    ProductInfoModal,
    ProductPhotoModal,
    VClamp,
    VPopoverProductCard,
  },
  mixins: [priceFormatter, cardTitle]
};
</script>
