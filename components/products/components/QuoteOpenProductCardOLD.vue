<template>
  <div class="card font-small-3 mb-0" v-if="prices.length">
    <div class="card-body p-0">
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
          <p class="m-0 font-weight-bold text-success"><b>{{ product.propertyName }}</b></p>
          <div>
            <v-quote-product-description :product="product" :showComments="true" />
          </div>
        </a>
      </div>
      <product-photo-modal :product="product" :openPopup="openPhoto" @update-modal="updateModal" />
      <div
        class="card-text"
        v-for="(price, index) in prices"
        :key="price.id"
      >
        <div class="p-1 border-top" v-if="price.unavailable && !blockInputs">
          <div class="clearfix pt-50 pl-50  rounded border">
            <p style="color: #d11b6d;">
              Indisponível
            </p>
          </div>
        </div>
        <div :class="index == 0 ? 'pl-1 pr-1 pb-1 border-top' : 'pl-1 pr-1 pb-1'" v-else-if="(price.quantity && blockInputs) || (price && !blockInputs)">
          <div class="d-flex mt-1" v-if="index == 0">
              <div class="flex-fill">
                  <!-- <span v-if="price.supplierProductExpedition.productExpeditionPricing == 1">
                    {{ product.unitsOfMeasurementName }}
                  </span>
                  <span v-else-if="price.supplierProductExpedition.productExpeditionPricing == 2">
                    {{ product.packagingName }}
                    <span v-if="product.quantity != 1 && product.unitsOfMeasurementName != 'und'">
                      {{ product.quantity }}{{ product.unitsOfMeasurementName }}
                    </span>
                  </span>
                  <span v-else>
                    <span v-if="price.supplierProductExpedition.productExpeditionMediumName != 'un.'">
                      {{ price.supplierProductExpedition.productExpeditionMediumName }}
                    </span> {{ price.supplierProductExpedition.productExpeditionQuantity }} x {{ product.quantity }} {{ product.unitsOfMeasurementName }}
                  </span> -->
                  <span class="text-warning" v-if="!product.packagingName && !product.quantity">
                    a granel
                  </span>
                  <span v-else>
                    {{ formatPrice(calculatePrice(price, product)) }}<br><span class="text-warning">
                    p/
                    {{ product.packagingName }} {{ product.quantity }} {{ product.unitsOfMeasurementName }}
                    <span v-if="parseInt(product.packageQuantity) > 1">x {{ product.packageQuantity }}</span>
                  </span>
                </span>
              </div>
              <div class="flex-fill" v-if="product.packagingName && product.quantity && pricePerBaseUnit(price)">
                <i> {{ pricePerBaseUnit(price).substring(3) }}</i>
              </div>
              <div class="flex-fill" v-else>
                <i v-if="product.unitsOfMeasurementMeasureType == 'solid'"> {{ formatPrice(price.price) }} p/ kg</i>
                <i v-if="product.unitsOfMeasurementMeasureType == 'liquid'"> {{ formatPrice(price.price) }} p/ L</i>
              </div>
          </div>
          <div class="bg-rgba-light px-75 py-25 my-1 rounded border" v-if="price.supplierProductExpedition.productExpeditionQuantity">
            <p class="mb-50" v-if="price.supplierProductExpedition.productExpeditionQuantity">
              <!-- <span class="position-relative" style="top: 3px;" v-if="price.supplierProductExpedition.productExpeditionMediumName != 'un.'">
                {{ price.supplierProductExpedition.productExpeditionMediumName }} {{ price.supplierProductExpedition.productExpeditionQuantity }}
              </span> -->
              <span class="badge badge-pill bg-mf-laranja position-relative" style="top: 3px; font-size: 90%;">
                {{ price.supplierProductExpedition.productExpeditionMediumName }} {{ price.supplierProductExpedition.productExpeditionQuantity }}
              </span>
              <span class="position-relative" style="top: 3px; margin-left: 17px;">
                {{ formatPrice(expeditionPrice(calculatePrice(price, product), price.supplierProductExpedition.productExpeditionQuantity, price.supplierProductExpedition.productExpeditionPricing)) }}
              </span>
              <vs-tooltip :text="textPerExpedition(price)" style="white-space: pre-wrap;" class="float-right" v-if="index > 0">
                <i class="feather icon-alert-circle font-medium-1 position-relative" style="top: 2px"></i>
                <span>&nbsp;</span>
              </vs-tooltip>
            </p>
          </div>
          <div class="mb-1" v-else>
          </div>
          <div class="clearfix">
            <div class="input-group input-group-sm float-left" style="width: auto;">
              <vs-tooltip :text="tooltipText(price.supplierProductExpedition)" :active="isDisabled(price.supplierProductExpedition, price.id)" position="bottom">
                <div class="controls">
                  <NumberInputSpinner
                    :min="0"
                    :max="999999"
                    :disabled="isExpired"
                    :inputClass="quantityClass(price.id)"
                    :buttonClass="'spin-button btn-primary'"
                    :integerOnly="isInteger(price)"
                    maxlength="4"
                    data-vv-name="quantity"
                    data-validation-containsnumber-regex="([^0-9]*[0-9]+)+"
                    v-model="priceInput[price.id]"
                    @input="emitPrice(price, priceInput[price.id], expeditionPrice(calculatePrice(price, product), price.supplierProductExpedition.productExpeditionQuantity, price.supplierProductExpedition.productExpeditionPricing), price.supplierProductExpedition.minimumOrder)"
                  />
                  <!-- <input
                    type="text"
                    :disabled="isExpired"
                    :class="quantityClass(price.id)"
                    class="form-control font-weight-bold text-success"
                    data-validation-containsnumber-regex="([^0-9]*[0-9]+)+"
                    min="10"
                    max="999999"
                    maxlength="6"
                    data-vv-name="quantity"
                    required placeholder="Qtd."
                    v-model="priceInput[price.id]"
                    @input="emitPrice(price.id, priceInput[price.id], expeditionPrice(price.price, price.supplierProductExpedition.productExpeditionQuantity), price.supplierProductExpedition.minimumOrder)"
                  > -->
                </div>
                <span>&nbsp;</span>
              </vs-tooltip>
            </div>
            <span
              v-if="calculatedPrice(price.id, formatQuantity(priceInput[price.id]), expeditionPrice(calculatePrice(price, product), price.supplierProductExpedition.productExpeditionQuantity, price.supplierProductExpedition.productExpeditionPricing)) > 0"
              class="d-flex"
              style="min-height: 24px; padding-left: 0.4rem;"
            >
              <span v-if="validDiscountById(price.id)[0] || validDiscountById(price.id)[1]" class="outer">
                <span class="inner">
                  {{ formatPrice(calculatedPrice(price.id, formatQuantity(priceInput[price.id]), expeditionPrice(calculatePrice(price, product), price.supplierProductExpedition.productExpeditionQuantity, price.supplierProductExpedition.productExpeditionPricing))).substring(3) }}
                </span>
              </span>
              <span class="ml-1 font-weight-bold" style="margin-top: 2px;" v-else>
                <span>
                  {{ formatPrice(calculatedPrice(price.id, formatQuantity(priceInput[price.id]), expeditionPrice(calculatePrice(price, product), price.supplierProductExpedition.productExpeditionQuantity, price.supplierProductExpedition.productExpeditionPricing))) }}
                </span>
              </span>
              <div v-if="validDiscountById(price.id)[0] && !validDiscountById(price.id)[1]" class="font-weight-bold w-100 mt-25" style="color: #111 !important; font-size: 12px;">
                {{ formatPrice(calculatedPriceWithDiscount(price, formatQuantity(priceInput[price.id]), expeditionPrice(calculatePrice(price, product), price.supplierProductExpedition.productExpeditionQuantity, price.supplierProductExpedition.productExpeditionPricing))) }}
              </div>
              <div v-if="validDiscountById(price.id)[1] && !validDiscountById(price.id)[0]" class="font-weight-bold w-100 mt-25" style="color: #111 !important; font-size: 12px;">
                {{ formatPrice(calculatedPriceWithDiscount(price, formatQuantity(priceInput[price.id]), expeditionPrice(calculatePrice(price, product), price.supplierProductExpedition.productExpeditionQuantity, price.supplierProductExpedition.productExpeditionPricing))) }}
              </div>
            </span>
            <span class="ml-1 font-weight-bold" style="margin-top: 2px;" v-else>
              -
            </span>
          </div>
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
    </div>
    <product-info-modal :openPopup="openPopup" :product="product" />
  </div>
</template>

<style>
 .spin-button {
   width: 15px;
   height: 20px;
   float: left;
   border-radius: 5px !important;
 }
 .spin-input {
   width: 40px;
   float: left;
   padding: 2px 3px 2px 10px;
   font-size: 1em;
   border: 0;
 }
  span.inner {
    color: black;
    font-size: 10px;
  }
  span.outer {
    color: red;
    text-decoration: line-through;
    margin-right: 3px;
  }
</style>

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
import NumberInputSpinner from '~/components/inputSpinner/NumberInputSpinner';
import Vue from 'vue';

export default {
  name: "QuotationProductCard",
  data() {
    return {
      showMinAlert: [],
      priceInput: [],
      totals: [],
      openPopup: false,
      openPhoto: false,
      discountValid: []
    }
  },
  created() {
    for(var i = 0; i < this.prices.length; i++) {
      this.discountValid.push({ id: this.prices[i].id, values: [false, false] })
      if(this.prices[i].quantity) {
        this.priceInput[this.prices[i].id] = String(this.prices[i].quantity).replace('.', ',')
        this.checkDiscounts(this.prices[i], this.prices[i].quantity, this.expeditionPrice(this.calculatePrice(this.prices[i].price, this.product), this.prices[i].supplierProductExpedition.productExpeditionQuantity, this.prices[i].supplierProductExpedition.productExpeditionPricing))
      }
      if(this.loadedTotals) {
        let found = this.loadedTotals.find(obj => obj.id == this.prices[i].id)
        if(found) {
          this.priceInput[this.prices[i].id] = String(found.quantity).replace('.', ',')
          this.checkDiscounts(this.prices[i], found.quantity, this.expeditionPrice(this.calculatePrice(this.prices[i].price, this.product), this.prices[i].supplierProductExpedition.productExpeditionQuantity, this.prices[i].supplierProductExpedition.productExpeditionPricing))
        }
      }
    }
  },
  mounted() {
    this.$nextTick(function () {
      this.$emit('all-mounted')
    })
  },
  updated() {
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
    }
  },
  methods: {
    validDiscountById(id) {
      return this.discountValid.find(obj => obj.id == id).values
    },
    quantityClass(id) {
      if(this.showMinAlert[id])
        return 'spin-input is-invalid'
      else
        return 'spin-input'
    },
    tooltipText(exp) {
      if(this.product.packagingName)
        return `Qtd mínima: ${exp.minimumOrder}`
      else
        return `Qtd mínima: ${exp.minimumOrder} ${this.product.unitsOfMeasurementName}`
    },
    isDisabled(exp, id) {
      if(exp.minimumOrder && this.priceInput[id] == exp.minimumOrder)
        return true
      else
        return false
    },
    expeditionPrice(price, quantity, type = null) {
      if(quantity)
        return (price * quantity)
      else
        return price
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
      let result = this.checkDiscounts(priceObj, quantity, price, false)
      if(!isNaN(result)) {
        return result
      }
      else
        return 0
    },
    emitPrice(priceObj, quantity, price, minimum) {
      var formattedQuantity = this.formatQuantity(quantity)
      if(minimum && quantity != '' && formattedQuantity < minimum)
        this.showMinAlert[priceObj.id] = true
      else
        this.showMinAlert[priceObj.id] = false

      quantity = this.verifyAllowed(priceObj.id, quantity)
      let calcQuantity = this.formatQuantity(quantity)
      let result = this.checkDiscounts(priceObj, calcQuantity, price)
      let obj = { id: priceObj.id, quantity: calcQuantity, total: result, minimum: minimum }
      this.$emit('quantity-input', obj)
    },
    checkDiscounts(priceObj, calcQuantity, price, checkArray = true) {
      var range1 = priceObj.supplierProductExpedition.discountRange1
      var range2 = priceObj.supplierProductExpedition.discountRange2
      var discount1 = priceObj.supplierProductExpedition.discountPercentage1
      var discount2 = priceObj.supplierProductExpedition.discountPercentage2

      var total = 0

      var discountData = this.discountValid.find(obj => obj.id == priceObj.id)

      if(!range1 && !range2) {
        total = calcQuantity * price
        if(checkArray && discountData) discountData.values = [false, false]
      } else if(range1 && !range2 && calcQuantity >= range1) {
        total = calcQuantity * price * ((100 - discount1) * 0.01)
        if(checkArray && discountData) discountData.values = [true, false]
      } else if(range1 && !range2 && calcQuantity < range1) {
        total = calcQuantity * price
        if(checkArray && discountData) discountData.values = [false, false]
      } else if(range2 >= range1 && calcQuantity >= range2) {
        total = calcQuantity * price * ((100 - discount2) * 0.01)
        if(checkArray && discountData) discountData.values = [false, true]
      } else if(range1 > range2 && calcQuantity >= range1) {
        total = calcQuantity * price * ((100 - discount1) * 0.01)
        if(checkArray && discountData) discountData.values = [true, false]
      } else if(calcQuantity < range1 && calcQuantity < range2) {
        total = calcQuantity * price
        if(checkArray && discountData) discountData.values = [false, false]
      } else if(range2 >= range1 && calcQuantity < range2 && calcQuantity >= range1) {
        total = calcQuantity * price * ((100 - discount1) * 0.01)
        if(checkArray && discountData) discountData.values = [true, false]
      } else if(range1 > range2 && calcQuantity < range1 && calcQuantity >= range2) {
        total = calcQuantity * price * ((100 - discount2) * 0.01)
        if(checkArray && discountData) discountData.values = [false, true]
      }

      return total
    },
    calculatePrice(priceObj, product) {
      var price = priceObj.price
      if(priceObj.supplierProductExpedition.productExpeditionPricing == 1) {
        price = parseFloat(priceObj.price) * parseFloat(this.product.quantity.replace(',', '.'))
        if(product.packageQuantity)
           price = price * parseFloat(this.product.packageQuantity)
      } else if(priceObj.supplierProductExpedition.productExpeditionPricing == 2) {
        price = priceObj.price
      } else if(priceObj.supplierProductExpedition.productExpeditionPricing == 3) {
        price = parseFloat(priceObj.price) / parseFloat(priceObj.supplierProductExpedition.productExpeditionQuantity)
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
        regex = /^(\d+)(.\d{0,2})?$/
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
        price = this.product.unitsOfMeasurementEquivalence * parseFloat(priceObj.price)
      else if(priceObj.supplierProductExpedition.productExpeditionPricing == 2) {
        price = (this.product.unitsOfMeasurementEquivalence / parseFloat(this.product.quantity.replace(',', '.'))) * parseFloat(priceObj.price)
        // if(this.product.packageQuantity)
        //   price = price / parseFloat(this.product.packageQuantity)
      } else {
        price = (this.product.unitsOfMeasurementEquivalence / (parseFloat(this.product.quantity.replace(',', '.')) * parseFloat(priceObj.supplierProductExpedition.productExpeditionQuantity))) * parseFloat(priceObj.price)
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
    textPerExpedition(price) {
      // var pricePerUnit = this.formatPrice(price.price) + ' p/ '
      // if(price.supplierProductExpedition.productExpeditionPricing == 1)
      //   pricePerUnit = pricePerUnit.concat(' ' + this.product.unitsOfMeasurementName)
      // else if(price.supplierProductExpedition.productExpeditionPricing == 2)
      //   pricePerUnit = pricePerUnit.concat(this.product.packagingName + ' ' + this.product.quantity + this.product.unitsOfMeasurementName)
      // else {
      //   if(price.supplierProductExpedition.productExpeditionMediumName != 'un.')
      //     pricePerUnit = pricePerUnit.concat(price.supplierProductExpedition.productExpeditionMediumName)
      //   pricePerUnit = pricePerUnit.concat(price.supplierProductExpedition.productExpeditionQuantity + ' x ' + this.product.quantity + this.product.unitsOfMeasurementName)
      // }

      var pricePerUnit = this.formatPrice(this.calculatePrice(price, this.product)) + ' p/ '
      if(!this.product.packagingName && !this.product.quantity)
        pricePerUnit = pricePerUnit.concat(' ' + this.product.unitsOfMeasurementName)
      else
        pricePerUnit = pricePerUnit.concat(this.product.packagingName + ' ' + this.product.quantity + this.product.unitsOfMeasurementName)
      if(parseInt(this.product.packageQuantity) > 1)
        pricePerUnit = pricePerUnit.concat(' x' + this.product.packageQuantity)

      var text = pricePerUnit + '                                      ' + this.pricePerBaseUnit(price)

      return text
    },
    isInteger(price) {
      if(price.supplierProductExpedition.productExpeditionQuantity)
        return true
      else
        return false
    }
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
    NumberInputSpinner,
    //QuotationProductExpedition
  },
  mixins: [priceFormatter, cardTitle]
};
</script>
<style>
._horizontal-scroll[data-v-5ce095ec]{box-sizing:border-box;overflow-x:auto;overflow-y:hidden;text-align:left;white-space:nowrap}

.vs-tooltip {
  white-space: pre-wrap;
}
</style>
