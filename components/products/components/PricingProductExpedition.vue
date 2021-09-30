<template>
  <div class="p-1 pt-2" :style="checkFilledPrice()" v-bind:class="{ promoCardActive: this.switch2 }">
    <div class="clearfix">
      <div class="vs-checkbox-con vs-checkbox-danger mb-2" style="background-color: white; border-radius: 5px;">
          <input
            @change="addSupplierProductExpedition(expeditionObject)"
            @input="markInput(!unavailables)"
            type="checkbox"
            value="true"
            v-model="unavailables"
            tabindex="-1"
          >
          <span class="vs-checkbox vs-checkbox-sm">
            <span class="vs-checkbox--check">
              <i class="vs-icon feather icon-x"></i>
            </span>
          </span>
          <span :class="unavailableClass">Está indisponível</span>
      </div>
      <fieldset class="form-label-group mb-75 float-left w-50">
          <input
            @change="addSupplierProductExpedition(expeditionObject)"
            @input="checkPriceInput()"
            v-model="expeditions"
            v-on:keyup.enter="nextInput"
            v-currency="{currency: null, locale: 'pt-br', allowNegative: false}"
            v-validate="priceRules"
            data-vv-name="price"
            ref="exp"
            input type="tel" pattern="[0-9]*" novalidate
            :class="priceClass"
            tabindex="0"
            :id="'price' + expedition.id"
            placeholder="Preço"
          />
          <label>Preço</label>
      </fieldset>
      <span class="d-flex align-items-center pl-75 font-small-2" style="min-height: 40px;">
        <span v-if="expedition.productExpedition.pricing == 1">{{ product.unitsOfMeasurementName }}</span>
        <span v-else-if="expedition.productExpedition.pricing == 2">
          <span v-if="product.packagingName == 'Und.' && product.quantity == 1">{{ product.packagingName }}</span>
          <span v-else>{{ product.packagingName }} {{ product.quantity }}{{ product.unitsOfMeasurementName }}</span>
        </span>

        <span v-else-if="product.quantity == 1">
          <span v-if="expedition.productExpedition.mediumName != 'un.'">
            {{ expedition.productExpedition.mediumName }}
          </span> {{ expedition.productExpedition.quantity }} p/ {{ product.unitsOfMeasurementName }}
        </span>
        <span v-else>
          <span v-if="expedition.productExpedition.mediumName != 'un.'">
            {{ expedition.productExpedition.mediumName }}
          </span> {{ expedition.productExpedition.quantity }} p/ {{ product.quantity }} {{ product.unitsOfMeasurementName }}
        </span>
      </span>
    </div>
    <p v-show="errors.has('price')" class="danger font-small-2">{{
      errors.first("price")
    }}</p>
    <p class="mb-50 font-small-2" v-if="expedition.supplierProductCode">
      <strong>{{ expedition.supplierProductCode }}</strong>
    </p>
    <div class="row mb-0" style="margin-left: 2px;" v-if="activeDiscounts > 0">
      <div class="col-md-3 col-5 m-0 p-0">
        <fieldset class="form-label-group float-left" style="margin-bottom: 10px;">
          <p class="font-small-1 m-0" style="white-space: nowrap;">A prt de</p>
          <vs-tooltip-custom text="A quantidade precisa ser maior que 1" :active="errors.has('discountRange1')" position="top">
            <input
              @change="addSupplierProductExpedition(expeditionObject)"
              @input="checkDiscountInput()"
              :class="discountRange1Class"
              v-model="discountRanges[0]"
              v-validate="rangeRules1"
              min=0
              oninput="validity.valid||(value='');"
              data-vv-name="discountRange1"
              type="number"
              ref="range1"
              tabindex="0"
              id=""
              placeholder="A prt de"
            />
            <span>&nbsp;</span>
          </vs-tooltip-custom>
        </fieldset>
      </div>
      <div class="col-md-4 col-6 m-0 p-0">
        <fieldset class="form-label-group float-left" style="margin-left: 7px; margin-bottom: 10px;">
          <p class="font-small-2 m-0">%</p>
          <input
            @change="addSupplierProductExpedition(expeditionObject)"
            @input="checkDiscountInput()"
            :class="discountPercentage1Class"
            v-model="discountPercentages[0]"
            v-validate="percentageRules1"
            data-vv-name="discountPercentage1"
            v-currency="{currency: null, locale: 'pt-br', allowNegative: false, valueRange: { min: 0, max: 99.99 }}"
            type="text"
            ref="discount1"
            tabindex="0"
            id=""
            placeholder="%"
          />
        </fieldset>
      </div>
      <div class="col-md-4 col-12 m-0 p-0 d-flex align-items-center">
        <span class="font-small-2" style="margin-left: 7px; margin-bottom: 3px;">
          {{ discountedPrice(String(discountPercentages[0])) }}
        </span>
      </div>
    </div>

    <div class="row mb-0" style="margin-left: 2px; margin-top: 7px;" v-if="activeDiscounts > 1">
      <div class="col-md-3 col-5 m-0 p-0">
        <fieldset class="form-label-group float-left" style="margin-bottom: 10px;">
          <p class="font-small-1 m-0" style="white-space: nowrap;">A prt de</p>
          <vs-tooltip-custom :text="rangeTooltipText" :active="errors.has('discountRange2')" position="top">
            <input
              @change="addSupplierProductExpedition(expeditionObject)"
              @input="checkDiscountInput()"
              :class="discountRange2Class"
              v-model="discountRanges[1]"
              v-validate="rangeRules2"
              min=0
              oninput="validity.valid||(value='');"
              data-vv-name="discountRange2"
              type="number"
              ref="range2"
              tabindex="0"
              id=""
              placeholder="A prt de"
            />
            <span>&nbsp;</span>
          </vs-tooltip-custom>
        </fieldset>
      </div>
      <div class="col-md-4 col-6 m-0 p-0">
        <fieldset class="form-label-group float-left" style="margin-left: 7px; margin-bottom: 10px;">
          <p class="font-small-2 m-0">%</p>
          <input
            @change="addSupplierProductExpedition(expeditionObject)"
            @input="checkDiscountInput()"
            :class="discountPercentage2Class"
            v-model="discountPercentages[1]"
            v-validate="percentageRules2"
            data-vv-name="discountPercentage2"
            v-currency="{currency: null, locale: 'pt-br', allowNegative: false, valueRange: { min: 0, max: 99.99 }}"
            type="text"
            ref="discount2"
            tabindex="0"
            id=""
            placeholder="%"
          />
        </fieldset>
      </div>
      <div class="col-md-4 col-12 m-0 p-0 d-flex align-items-center">
        <span class="font-small-2" style="margin-left: 7px; margin-bottom: 3px;">
          {{ discountedPrice(String(discountPercentages[1])) }}
        </span>
      </div>
    </div>
    <!-- <p v-show="errors.has('discountRange1')" class="danger font-small-2">{{
      errors.first("discountRange1")
    }}</p>
    <p v-show="errors.has('discountRange2')" class="danger font-small-2">{{
      errors.first("discountRange2")
    }}</p>
    <p v-show="errors.has('discountPercentage1')" class="danger font-small-2">{{
      errors.first("discountPercentage1")
    }}</p>
    <p v-show="errors.has('discountPercentage2')" class="danger font-small-2">{{
      errors.first("discountPercentage2")
    }}</p> -->
    <div class="row">
      <div class="col-md-10 col-9 float-left">
        <vs-button
          v-show="activeDiscounts < maxDiscounts"
          @click="addDiscount"
          ref="addDiscountBtn"
          :disabled='unavailables'
          tabindex="-1"
          type="line"
          style="padding: 1px 2px; font-size: 12px;"
        >Desconto por qtd</vs-button>
      </div>
      <div class="col-md-2 col-2">
        <a v-show="activeDiscounts > 0" tabindex="-1" href="javascript:void(0);" @click="removeDiscount()">
          <i class="ficon feather icon-trash float-right" style="font-size: 18px;"></i>
        </a>
      </div>
      <div class="ml-1 mt-1 row">
      <vs-switch @click="checkSaleSwitch()" :disabled="isDisabled()" @change="addSupplierProductExpedition(expeditionObject)" id="promoSwitch2" color="warning" v-model="switch2" >
        <span slot="on" style="color: red;">Em Oferta</span>
        <span slot="off"></span>
      </vs-switch>
      <span class="ml-1">Oferta</span>
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
import Vue from 'vue';
import { mapState, mapActions } from "vuex";
import VsTooltipCustom from "~/components/tooltip/VSTooltipCustom";

export default {
  name: "PricingProductExpedition",
  data() {
    return {
      switch2: undefined,
      expeditions: undefined,
      unavailables: false,
      activeDiscounts: 0,
      discountRanges: [null, null],
      discountPercentages: [null, null],
      maxDiscounts: 2,
    }
  },
  mounted() {
    if(this.expedition.price) {
      this.expeditions = (parseFloat(this.expedition.price).toFixed(2)).toString().replace('.', ',')
    }
    if(this.expedition.discountRange1 && this.expedition.discountPercentage1) {
      this.discountRanges[0] = String(this.expedition.discountRange1)
      this.discountPercentages[0] = String(this.expedition.discountPercentage1)
      this.activeDiscounts++
    }
    if(this.expedition.discountRange2 && this.expedition.discountPercentage2) {
      this.discountRanges[1] = String(this.expedition.discountRange2)
      this.discountPercentages[1] = String(this.expedition.discountPercentage2)
      this.activeDiscounts++
    }
    if(this.expedition.unavailability) {
      this.unavailables = this.expedition.unavailability
      setTimeout(() => {
        this.markInput(this.unavailables)
      }, 500)
    }
      this.switch2 = this.expedition.sale
  },
  computed: {
    ...mapState("products/supplierProductExpeditions", ["supplierProductExpeditions"]),
    rangeTooltipText() {
      if(this.discountRanges[1] && parseInt(this.discountRanges[1]) <= parseInt(this.discountRanges[0]))
        return 'A quantidade deve ser maior que a definida acima'
      else
        return 'A quantidade precisa ser maior que 1'
    },
    range2Min() {
      if(parseInt(this.discountRanges[0]) >= 2)
        return parseInt(this.discountRanges[0]) + 1
      else
        return 2
    },
    priceRules() {
      const priceRules = {
        required: this.isRequired,
        excluded: ['0', 'R$ 0,00'],
      };
      return priceRules;
    },
    rangeRules1() {
      const rangeRules1 = {
        required: this.activeDiscounts > 0,
        min_value: 2,
        excluded: ['0'],
      };
      return rangeRules1;
    },
    percentageRules1() {
      const percentageRules1 = {
        required: this.activeDiscounts > 0,
        // min_value: 0,
        // max_value: 99.99,
        excluded: ['0', '0,00'],
      };
      return percentageRules1;
    },
    rangeRules2() {
      const rangeRules2 = {
        required: this.activeDiscounts > 1,
        min_value: this.range2Min,
        excluded: ['0'],
      };
      return rangeRules2;
    },
    percentageRules2() {
      const percentageRules2 = {
        required: this.activeDiscounts > 1,
        // min_value: 0,
        // max_value: 99.99,
        excluded: ['0', '0,00'],
      };
      return percentageRules2;
    },
    isRequired() {
      return !this.unavailables
    },
    priceClass() {
      if(this.errors.has('price'))
        return 'form-control price-input is-invalid'
      else
        return 'form-control price-input'
    },
    discountRange1Class() {
      if(this.errors.has('discountRange1'))
        return 'form-control discount-input is-invalid-no-icon'
      else
        return 'form-control discount-input'
    },
    discountRange2Class() {
      if(this.errors.has('discountRange2'))
        return 'form-control discount-input is-invalid-no-icon'
      else
        return 'form-control discount-input'
    },
    discountPercentage1Class() {
      if(this.errors.has('discountPercentage1'))
        return 'form-control discount-input is-invalid'
      else
        return 'form-control discount-input'
    },
    discountPercentage2Class() {
      if(this.errors.has('discountPercentage2'))
        return 'form-control discount-input is-invalid'
      else
        return 'form-control discount-input'
    },
    expeditionObject() {
      return { id: this.expedition.id,
               unavailable: this.unavailables,
               expedition: this.expeditions,
               quotation: this.quotation,
               product: this.product.id,
               discountRanges: [...this.discountRanges],
               discountPercentages: [...this.discountPercentages],
               sale: this.switch2 }
    },
    unavailableClass() {
      if(this.unavailables)
        return "font-weight-bold unavailable"
      else
        return "text-muted"
    }
  },


  watch: {
    expeditions(newVal, oldVal) {
      if((newVal == '' || newVal == null) && (oldVal != null && oldVal != ''))
        this.$emit('deleted-price')
    }
  },
  methods: {
    ...mapActions("products/supplierProductExpeditions", ["addSupplierProductExpedition"]),
    discountedPrice(percentage) {
      if(this.expeditions && percentage) {
        var result = parseFloat(this.expeditions.replace('.', '').replace(',', '.')) * (100 - parseFloat(percentage.replace('.', '').replace(',', '.'))) * 0.01
        if(result)
          return 'R$ ' + result.toFixed(2).toString().replace('.', ',')
        else
          return '-'
      } else
        return '-'
    },
    checkPriceInput() {
      this.$emit('price-changed')
    },
    checkSaleSwitch() {
      if(this.switch2 == false)
        this.$emit('sale-true')
      else
        this.$emit('sale-false')
    },
    checkFilledPrice() {
      if((this.expeditions == undefined || this.expeditions == '' || this.expeditions == '0,00') && !this.unavailables)
        return 'background-color: #ffe374;'
      else
        return ''
    },
    isDisabled(){
      if((this.expeditions == undefined || this.expeditions == '' || this.expeditions == '0,00') || this.unavailables)
        return true
      else
        return false
    },
    checkDiscountInput() {
      setTimeout(() => {
        this.$validator.validate().then((response) => {
          this.$emit('discount-changed', response)
        })
      }, 500)
    },
    nextInput(event) {
      var inputs = document.getElementsByClassName('price-input')
      var nextOne = 0
      for(var i = 0; i < inputs.length; i++) {
        if(inputs[i] == event.target) {
          nextOne = i + 1
        }
      }
      while(inputs[nextOne] && inputs[nextOne].disabled) {
        nextOne++
      }
      if(nextOne < inputs.length)
        inputs[nextOne].focus()
    },
    markInput(value) {
      if(value) {
        this.$refs.exp.disabled = true
        if(this.activeDiscounts == 2) {
          this.$refs.range1.disabled = true
          this.$refs.discount1.disabled = true
          this.$refs.range2.disabled = true
          this.$refs.discount2.disabled = true
        } else if(this.activeDiscounts == 1) {
          this.$refs.range1.disabled = true
          this.$refs.discount1.disabled = true
        }
      } else {
        this.$refs.exp.disabled = false
        if(this.activeDiscounts == 2) {
          this.$refs.range1.disabled = false
          this.$refs.discount1.disabled = false
          this.$refs.range2.disabled = false
          this.$refs.discount2.disabled = false
        } else if(this.activeDiscounts == 1) {
          this.$refs.range1.disabled = false
          this.$refs.discount1.disabled = false
        }
      }
      this.checkPriceInput()
      this.checkDiscountInput()
    },
    validateExpeditions() {
      this.$validator.validate()
    },
    addDiscount() {
      this.activeDiscounts++
      this.checkDiscountInput()
    },
    removeDiscount() {
      Vue.set(this.discountRanges, this.activeDiscounts - 1, null)
      Vue.set(this.discountPercentages, this.activeDiscounts - 1, null)
      this.addSupplierProductExpedition(this.expeditionObject)
      this.activeDiscounts--
      this.checkDiscountInput()
    },
  },
  props: {
    expedition: {
      type: Object,
      required: true,
    },
    product: {
      type: Object,
      required: true,
    },
    quotation: {
      type: String,
      required: true,
    },
  },
  components: {
    VsTooltipCustom
  },
};
</script>

<style scoped>
.unavailable {
  color: #d11b6d;
}
.is-invalid-no-icon {
  border-color: #ea5455;
  box-shadow: 0 0 0 0.2rem rgba(234, 84, 85, 0.25);
}
</style>
