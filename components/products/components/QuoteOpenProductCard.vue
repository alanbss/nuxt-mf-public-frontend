<template>

  <div class="row" v-if="prices.length">
    <div v-if="!isMobile" class="col-4 pt-1" style="border-right: solid 1px #9e9e9e;">
      <div class="row" >
        <div class="col-2 pb-1" style="padding-right: 5px; padding-left: 5px;">
          <a
            href="javascript:void(0);"
            @click="openPhotoModal"
            data-toggle="lightbox"
            title="Foto do produto"
            data-title="Maionese"
            class="float-right"
            tabindex="-1"
          >
            <img v-if="product.picture" class="rounded img-fluid" width="200" :src="product.picture" alt  />
            <img v-else class="rounded img-fluid" width="200" :src="noImageSrc" alt />
          </a>
          <product-photo-modal :product="product" :openPopup="openPhoto" @update-modal="updateModal" />
        </div>
        <div class="col-5 p-0 pb-1">
          <p class="m-0" style="color: #333;">
            <!-- <v-clamp autoresize :max-lines="1" :ellipsis="' '">
              {{ productCardTitle }}
              <template #after="{clamped}">
                <template v-if="clamped">
                  <v-popover-product-card :product="product" />
                </template>
              </template>
            </v-clamp> -->
            {{ productBrandName }}<span v-if="productBrandName && product.productLineName">,</span>
            <br v-if="productBrandName">
            {{ product.productLineName }}<span v-if="product.productLineName && product.productLineExtensionName">,</span>
            <br v-if="product.productLineName">
            {{ product.productLineExtensionName }}
          </p>
          <p class="m-0 font-weight-bold text-success"><b>{{ product.propertyName }}</b></p>
          <p class="m-0 font-weight-bold color-mf-laranja"><b>{{quantifiers(true)}}</b></p>
        </div>
        <div class="col-5 p-0 pb-1 font-small-3">
          <v-new-secondary-characteristics :product="product" />
        </div>
      </div>
    </div>
    <div v-if="!isMobile" class="col-8">
      <div
        :class="prices.length > 1 ? 'row' : 'row h-100'"
        v-for="price in prices"
        :key="price.id"
      >
        <div class="col-8 pt-1 pb-1 h-100">
          <div class="row" v-if="price.unavailable">
            <p class="ml-1" style="width: 100%; color: #d11b6d;">
              Indisponível
            </p>
          </div>
          <div v-else class="row" style="justify-content: space-between;">
            <div class="ml-1" style="width: 30%;">
              <span class="text-warning" v-if="!product.packagingName && !product.quantity">
                a granel
              </span>
              <span v-else>
                <b><span class="font-small-1">R$ </span>{{ formatPrice(calculatePrice(price, product)).substring(3) }}<br></b>
                <span class="text-warning">
                  p/
                  <span v-if="product.packagingName == 'Und.' && product.quantity == 1">
                    {{ product.unitsOfMeasurementName }}
                  </span>
                  <span v-else>
                    {{ product.packagingName }} {{ product.quantity }} {{ product.unitsOfMeasurementName }}
                  </span>
                  <!-- <span v-if="parseInt(product.packageQuantity) > 1">x {{ product.packageQuantity }}</span> -->
                </span>
              </span>
            </div>

            <div class="p-0" style="width: max-content;">
              <div class="flex-fill" v-if="product.packagingName && product.quantity && pricePerBaseUnit(price, false)">
                <i style="color: #5f6666;" v-if="product.packagingName != 'Und.'">{{ pricePerBaseUnit(price, false).substring(3)}}</i>
                <div v-if="product.unitsOfMeasurementMeasureType == 'solid'">
                  <i style="color: #5f6666;" > p/ kg</i>
                </div>
                <div v-else>
                  <div v-if="product.packagingName != 'Und.'" >
                    <i style="color: #5f6666;" v-if="product.unitsOfMeasurementMeasureType == 'liquid'"> p/ L</i>
                    <i style="color: #5f6666;" v-else> p/ und</i>
                  </div>
                </div>

              </div>
              <div class="flex-fill" v-else>
                <div v-if="product.unitsOfMeasurementMeasureType == 'solid'">
                  <i style="color: #5f6666;" > {{ formatPrice(price.price).substring(3) }}<br> p/ kg</i>
                </div>
                <div v-else>
                  <div v-if="product.packagingName != 'Und.'" >
                    <i style="color: #5f6666;" v-if="product.unitsOfMeasurementMeasureType == 'liquid'"> {{ formatPrice(price.price).substring(3) }}<br> p/ L</i>
                    <i style="color: #5f6666;" v-else> p/ und</i>
                  </div>
                </div>
              </div>
            </div>

            <div class="p-0" style="width: 25%;">
              <div v-if="price.supplierProductExpedition.productExpeditionQuantity && price.supplierProductExpedition.productExpeditionQuantity > 1">
                <span class="position-relative" style="">
                  <span class="font-small-1">R$ </span>{{ formatPrice(expeditionPrice(calculatePrice(price, product), price.supplierProductExpedition.productExpeditionQuantity, price.supplierProductExpedition.productExpeditionPricing)).substring(3) }}
                </span>
                <br>
                <span class="position-relative badge badge-pill" style="font-size: 90%; background-color: #e7e9ec; color: #3d3d3d;">
                  {{ price.supplierProductExpedition.productExpeditionMediumName }} {{ price.supplierProductExpedition.productExpeditionQuantity }}
                  {{ product.packagingName }}
                </span>
              </div>
            </div>
            <div class="p-0" style="width: 25%; text-align: center;">
              <b-badge  v-if="price.sale" style="height:15px; padding:2px; margin-right: 2px; background:red; margin-right:5px"><i class="feather icon-tag mr-25"/><span>Oferta</span></b-badge>
              <div v-if="price.supplierProductExpedition.discountPercentage1" class="badge badge-pill badge-light-warning font-small-2 font-weight-bold" style="color: #EA5455 !important;">
                - {{ String(price.supplierProductExpedition.discountPercentage1).replace('.', ',') }}% | {{ price.supplierProductExpedition.discountRange1 }}
                <span v-if="price.supplierProductExpedition.productExpeditionMediumName">{{ price.supplierProductExpedition.productExpeditionMediumName.substring(0, 2) }}</span>
              </div>
              <div v-if="price.supplierProductExpedition.discountPercentage2" class="badge badge-pill badge-light-warning font-small-2 font-weight-bold mt-50" style="color: #EA5455 !important;">
                - {{ String(price.supplierProductExpedition.discountPercentage2).replace('.', ',') }}% | {{ price.supplierProductExpedition.discountRange2 }}
                <span v-if="price.supplierProductExpedition.productExpeditionMediumName">{{ price.supplierProductExpedition.productExpeditionMediumName.substring(0, 2) }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="col-4 p-0" style="border-left: solid 1px #9e9e9e;">
          <div class="row" v-if="!price.unavailable" style="margin-left: 0;">
            <div class="col-12 p-0 pt-1">
              <div class="input-group input-group-sm float-left" style="width: auto; margin-left: 8px;">
                <vs-tooltip ref="minTooltip" :text="tooltipText(price.supplierProductExpedition)" :active="isDisabled(price.supplierProductExpedition, price.id)" position="top">
                  <div class="controls">
                    <NumberInputSpinner
                      :min="0"
                      :max="999999"
                      :disabled="isExpired"
                      :inputClass="quantityClass(price.id)"
                      :buttonClass="'spin-button btn-primary button-blue'"
                      :integerOnly="isInteger(price)"
                      :printText="expText(price, product)"
                      maxlength="4"
                      data-vv-name="quantity"
                      data-validation-containsnumber-regex="([^0-9]*[0-9]+)+"
                      v-model="priceInput[price.id]"
                      @input="emitPrice(price, priceInput[price.id], expeditionPrice(calculatePrice(price, product), price.supplierProductExpedition.productExpeditionQuantity, price.supplierProductExpedition.productExpeditionPricing), price.supplierProductExpedition.minimumOrder)"
                    />
                  </div>
                  <span>&nbsp;</span>
                </vs-tooltip>
              </div>
            </div>
            <div class="col-12 pl-0 pr-0 pb-0" style="padding-top: 8px;">
              <span
                v-if="calculatedPrice(price.id, formatQuantity(priceInput[price.id]), expeditionPrice(calculatePrice(price, product), price.supplierProductExpedition.productExpeditionQuantity, price.supplierProductExpedition.productExpeditionPricing)) > 0"
                class="d-flex"
                style="min-height: 24px; padding-left: 1.2rem;"
              >
                <span v-if="validDiscountById(price.id)[0] || validDiscountById(price.id)[1]" class="outer">
                  <span class="inner" style="width: 100px;">
                    {{ formatPrice(calculatedPrice(price.id, formatQuantity(priceInput[price.id]), expeditionPrice(calculatePrice(price, product), price.supplierProductExpedition.productExpeditionQuantity, price.supplierProductExpedition.productExpeditionPricing))).substring(3) }}
                  </span>
                </span>
                <span v-else class="font-weight-bold" style="margin-top: 2px;">
                  <span>
                    <span class="font-small-1">R$ </span>
                    {{ formatPrice(calculatedPrice(price.id, formatQuantity(priceInput[price.id]), expeditionPrice(calculatePrice(price, product), price.supplierProductExpedition.productExpeditionQuantity, price.supplierProductExpedition.productExpeditionPricing))).substring(3) }}
                  </span>
                </span>

                <div v-if="validDiscountById(price.id)[0] && !validDiscountById(price.id)[1]" class="w-100 mt-25" style="color: #111 !important; font-size: 12px;">
                  <span class="font-weight-bold">
                    <span class="font-small-1">R$ </span>{{ formatPrice(calculatedPriceWithDiscount(price, formatQuantity(priceInput[price.id]), expeditionPrice(calculatePrice(price, product), price.supplierProductExpedition.productExpeditionQuantity, price.supplierProductExpedition.productExpeditionPricing))).substring(3) }}
                  </span>
                </div>
                <div v-if="validDiscountById(price.id)[1] && !validDiscountById(price.id)[0]" class="w-100 mt-25" style="color: #111 !important; font-size: 12px;">
                  <span class="font-weight-bold">
                    <span class="font-small-1">R$ </span>{{ formatPrice(calculatedPriceWithDiscount(price, formatQuantity(priceInput[price.id]), expeditionPrice(calculatePrice(price, product), price.supplierProductExpedition.productExpeditionQuantity, price.supplierProductExpedition.productExpeditionPricing))).substring(3) }}
                  </span>
                </div>
              </span>
              <div class="ml-1 font-weight-bold" style="margin-top: 2px; min-height: 22px;" v-else>
                <span>&nbsp;</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="isMobile" class="col-12 pt-1" style="border-bottom: solid 1px #9e9e9e;">
      <div class="row">
        <div class="col-2 pb-1" style="padding-right: 5px; padding-left: 5px;">
          <a
            href="javascript:void(0);"
            @click="openPhotoModal"
            data-toggle="lightbox"
            title="Foto do produto"
            data-title="Maionese"
            class="float-right"
            tabindex="-1"
          >
            <img v-if="product.picture" class="rounded img-fluid" width="200" :src="product.picture" alt  />
            <img v-else class="rounded img-fluid" width="200" :src="noImageSrc" alt />
          </a>
          <product-photo-modal :product="product" :openPopup="openPhoto" @update-modal="updateModal" />
        </div>
        <div class="col-5 p-0 pb-1">
          <p class="m-0" style="color: #333;">
            {{ productBrandName }}<br v-if="productBrandName">
            {{ product.productLineName }}<br v-if="product.productLineName">
            {{ product.productLineExtensionName }}
          </p>
          <p class="m-0 font-weight-bold text-success"><b>{{ product.propertyName }}</b></p>
          <p class="m-0 font-weight-bold color-mf-laranja"><b>{{quantifiers(true)}}</b></p>
        </div>
        <div class="col-5 p-0 pb-1 font-small-3">
          <v-new-secondary-characteristics :product="product" />
        </div>
      </div>
    </div>
    <div v-if="isMobile" class="col-12">
      <div
        :class="prices.length > 1 ? 'row' : 'row h-100'"
        v-for="(price, index) in prices"
        :key="price.id"
      >
        <div class="col-12 pt-1 pb-1">
          <vs-divider border-style="dashed" class="mt-0 mb-1 ml-0 mr-0 p-0" v-if="index > 0" color="#b2b5b5">
            Alternativa
          </vs-divider>
          <div class="row" v-if="price.unavailable">
            <p class="ml-1" style="width: 100%; color: #d11b6d;">
              Indisponível
            </p>
          </div>
          <div v-else class="row">
            <div class="ml-1" style="width: 55%;">
              <span class="text-warning" v-if="!product.packagingName && !product.quantity">
                a granel
              </span>
              <span v-else>
                <b><span class="font-small-1">R$ </span>{{ formatPrice(calculatePrice(price, product)).substring(3) }}</b>
                <span class="text-warning" style="margin-left: 3px;">
                  p/
                  <span v-if="product.packagingName == 'Und.' && product.quantity == 1">
                    {{ product.unitsOfMeasurementName }}
                  </span>
                  <span v-else>
                    {{ product.packagingName }} {{ product.quantity }} {{ product.unitsOfMeasurementName }}
                  </span>
                  <!-- <span v-if="parseInt(product.packageQuantity) > 1">x {{ product.packageQuantity }}</span> -->
                </span>
              </span>
              <div v-if="price.supplierProductExpedition.productExpeditionQuantity && price.supplierProductExpedition.productExpeditionQuantity > 1" style="margin-top: 3px;">
                <!-- <span class="position-relative" style="">

                </span> -->
                <span class="position-relative badge badge-pill" style="margin-left: 3px; font-size: 90%; background-color: #e7e9ec; color: #3d3d3d;">
                  <span class="font-small-1">R$ </span>
                  <span style="margin-right: 5px">
                    {{ formatPrice(expeditionPrice(calculatePrice(price, product), price.supplierProductExpedition.productExpeditionQuantity, price.supplierProductExpedition.productExpeditionPricing)).substring(3) }}
                  </span>
                  {{ price.supplierProductExpedition.productExpeditionMediumName }} {{ price.supplierProductExpedition.productExpeditionQuantity }}
                  {{ product.packagingName }}
                </span>
              </div>
            </div>
            <div class="p-0" style="width: 15%;">
              <div class="flex-fill" v-if="product.packagingName && product.quantity && pricePerBaseUnit(price, false)">
                <i style="color: #5f6666;" v-if="product.packagingName != 'Und.'"> {{ pricePerBaseUnit(price, false).substring(3) }}</i><br>
                <div v-if="product.unitsOfMeasurementMeasureType == 'solid'">
                  <i style="color: #5f6666;" > p/ kg</i>
                </div>
                <div v-else>
                  <div v-if="product.packagingName != 'Und.'" >
                    <i style="color: #5f6666;" v-if="product.unitsOfMeasurementMeasureType == 'liquid'"> p/ L</i>
                    <i style="color: #5f6666;" v-else> p/ und</i>
                  </div>
                </div>
              </div>
              <div class="flex-fill" v-else>
                <div v-if="product.unitsOfMeasurementMeasureType == 'solid'">
                  <i style="color: #5f6666;" > {{ formatPrice(price.price).substring(3) }}<br> p/ kg</i>
                </div>
                <div v-else>
                  <div v-if="product.packagingName != 'Und.'" >
                    <i style="color: #5f6666;" v-if="product.unitsOfMeasurementMeasureType == 'liquid'"> {{ formatPrice(price.price).substring(3) }}<br> p/ L</i>
                    <i style="color: #5f6666;" v-else> p/ und</i>
                  </div>
                </div>
              </div>
            </div>
            <div class="p-0" style="width: 25%; text-align: center;">
              <b-badge  v-if="price.sale" style="height:15px; padding:2px; margin-right: 2px; background:red; margin-right:5px"><i class="feather icon-tag mr-25"/><span>Oferta</span></b-badge>
              <div v-if="price.supplierProductExpedition.discountPercentage1" class="badge badge-pill badge-light-warning font-small-2 font-weight-bold" style="color: #EA5455 !important;">
                - {{ String(price.supplierProductExpedition.discountPercentage1).replace('.', ',') }}% | {{ price.supplierProductExpedition.discountRange1 }}
                <span v-if="price.supplierProductExpedition.productExpeditionMediumName">{{ price.supplierProductExpedition.productExpeditionMediumName.substring(0, 2) }}</span>
              </div>
              <div v-if="price.supplierProductExpedition.discountPercentage2" class="badge badge-pill badge-light-warning font-small-2 font-weight-bold mt-50" style="color: #EA5455 !important;">
                - {{ String(price.supplierProductExpedition.discountPercentage2).replace('.', ',') }}% | {{ price.supplierProductExpedition.discountRange2 }}
                <span v-if="price.supplierProductExpedition.productExpeditionMediumName">{{ price.supplierProductExpedition.productExpeditionMediumName.substring(0, 2) }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12 p-0" style="border-top: solid 1px #9e9e9e;">
          <div class="row" style="margin-left: 0;">
            <div class="col-7 p-0 pt-1 pb-1">
              <div v-if="!price.unavailable" class="input-group input-group-sm float-left" style="width: auto; margin-left: 8px;">
                <vs-tooltip ref="minTooltip" :text="tooltipText(price.supplierProductExpedition)" :active="isDisabled(price.supplierProductExpedition, price.id)" position="bottom">
                  <div class="controls">
                    <NumberInputSpinner
                      :min="0"
                      :max="999999"
                      :disabled="isExpired"
                      :inputClass="quantityClass(price.id)"
                      :buttonClass="'spin-button btn-primary button-blue'"
                      :integerOnly="isInteger(price)"
                      :printText="expText(price, product)"
                      :readOnly="true"
                      maxlength="4"
                      data-vv-name="quantity"
                      data-validation-containsnumber-regex="([^0-9]*[0-9]+)+"
                      v-model="priceInput[price.id]"
                      @input="emitPrice(price, priceInput[price.id], expeditionPrice(calculatePrice(price, product), price.supplierProductExpedition.productExpeditionQuantity, price.supplierProductExpedition.productExpeditionPricing), price.supplierProductExpedition.minimumOrder)"
                    />
                  </div>
                  <span>&nbsp;</span>
                </vs-tooltip>
              </div>
            </div>
            <div class="col-5 p-0 pt-1 pb-1" style="padding-top: 8px;">
              <span
                v-if="calculatedPrice(price.id, formatQuantity(priceInput[price.id]), expeditionPrice(calculatePrice(price, product), price.supplierProductExpedition.productExpeditionQuantity, price.supplierProductExpedition.productExpeditionPricing)) > 0"
                class="d-flex"
                style="min-height: 24px;"
              >
                <span v-if="validDiscountById(price.id)[0] || validDiscountById(price.id)[1]" class="outer">
                  <span class="inner" style="width: 100px;">
                    {{ formatPrice(calculatedPrice(price.id, formatQuantity(priceInput[price.id]), expeditionPrice(calculatePrice(price, product), price.supplierProductExpedition.productExpeditionQuantity, price.supplierProductExpedition.productExpeditionPricing))).substring(3) }}
                  </span>
                </span>
                <span v-else class="font-weight-bold" style="margin-top: 2px;">
                  <span>
                    <span class="font-small-1">R$ </span>
                    {{ formatPrice(calculatedPrice(price.id, formatQuantity(priceInput[price.id]), expeditionPrice(calculatePrice(price, product), price.supplierProductExpedition.productExpeditionQuantity, price.supplierProductExpedition.productExpeditionPricing))).substring(3) }}
                  </span>
                </span>

                <div v-if="validDiscountById(price.id)[0] && !validDiscountById(price.id)[1]" class="w-100 mt-25" style="color: #111 !important; font-size: 12px;">
                  <span class="font-weight-bold">
                    <span class="font-small-1">R$ </span>{{ formatPrice(calculatedPriceWithDiscount(price, formatQuantity(priceInput[price.id]), expeditionPrice(calculatePrice(price, product), price.supplierProductExpedition.productExpeditionQuantity, price.supplierProductExpedition.productExpeditionPricing))).substring(3) }}
                  </span>
                </div>
                <div v-if="validDiscountById(price.id)[1] && !validDiscountById(price.id)[0]" class="w-100 mt-25" style="color: #111 !important; font-size: 12px;">
                  <span class="font-weight-bold">
                    <span class="font-small-1">R$ </span>{{ formatPrice(calculatedPriceWithDiscount(price, formatQuantity(priceInput[price.id]), expeditionPrice(calculatePrice(price, product), price.supplierProductExpedition.productExpeditionQuantity, price.supplierProductExpedition.productExpeditionPricing))).substring(3) }}
                  </span>
                </div>
              </span>
              <div class="ml-1 font-weight-bold" style="margin-top: 2px; min-height: 22px;" v-else>
                <span>&nbsp;</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <product-info-modal :openPopup="openPopup" :product="product" />
  </div>


</template>

<style>
 .button-blue {
   background-color: #27b6f6 !important;
   border-color: #27b6f6 !important;
 }
 .spin-button {
   width: 20px;
   height: 25px;
   float: left;
   border-radius: 5px !important;
 }
 .spin-input {
   width: 40px;
   float: left;
   padding: 2px 3px 2px 5px;
   font-size: 1em;
   border: 0;
   text-align: center;
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

//import QuotationProductExpedition from "~/components/products/components/QuotationProductExpedition";
import priceFormatter from "@/mixins/priceFormatter";
import VQuoteProductDescription from "~/components/products/components/VQuoteProductDescription";
import ProductInfoModal from "~/components/products/components/ProductInfoModal";
import ProductPhotoModal from "~/components/products/components/ProductPhotoModal";
import cardTitle from "~/components/products/mixins/cardTitle";
import VPopoverProductCard from "~/components/products/components/VPopoverProductCard";
import VClamp from "vue-clamp";
import NumberInputSpinner from '~/components/inputSpinner/NumberInputSpinner';
import VNewSecondaryCharacteristics from "~/components/products/components/VNewSecondaryCharacteristics";
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
      discountValid: [],
      noImageSrc: require(`~/assets/images/Produto-sem-imagem-Meu-Fornecedor.jpg`)
    }
  },
  created() {
    for(var i = 0; i < this.prices.length; i++) {
      this.discountValid.push({ id: this.prices[i].id, values: [false, false] })
      if(this.prices[i].quantity) {
        this.priceInput[this.prices[i].id] = String(this.prices[i].quantity).replace('.', ',')
        this.checkDiscounts(this.prices[i], this.prices[i].quantity, this.expeditionPrice(this.calculatePrice(this.prices[i].price, this.product), this.prices[i].supplierProductExpedition.productExpeditionQuantity, this.prices[i].supplierProductExpedition.productExpeditionPricing, this.prices[i].supplierProductExpedition.sale))
      }
      if(this.loadedTotals) {
        let found = this.loadedTotals.find(obj => obj.id == this.prices[i].id)
        if(found) {
          this.priceInput[this.prices[i].id] = String(found.quantity).replace('.', ',')
          this.checkDiscounts(this.prices[i], found.quantity, this.expeditionPrice(this.calculatePrice(this.prices[i].price, this.product), this.prices[i].supplierProductExpedition.productExpeditionQuantity, this.prices[i].supplierProductExpedition.productExpeditionPricing, this.prices[i].supplierProductExpedition.sale))
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
    expText(price, product) {
      var text = ''
      if(price.supplierProductExpedition.productExpeditionQuantity && price.supplierProductExpedition.productExpeditionQuantity > 1) {
        if(price.supplierProductExpedition.productExpeditionMediumName)
          text = text + price.supplierProductExpedition.productExpeditionMediumName
        if(price.supplierProductExpedition.productExpeditionQuantity)
          text = text + ' ' + price.supplierProductExpedition.productExpeditionQuantity
      }
      if(product.packagingName)
        text = text + ' ' + product.packagingName
      return text
    },
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
      if(exp.minimumOrder && (parseFloat(this.priceInput[id]) < parseFloat(exp.minimumOrder) || !parseFloat(this.priceInput[id]))) {
        return true
      } else {
        return false
      }
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
      if(priceObj.supplierProductExpedition && priceObj.supplierProductExpedition.productExpeditionPricing) {
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
    pricePerBaseUnit(priceObj, withUnit = true) {
      var price = 0

      if(priceObj.supplierProductExpedition.productExpeditionPricing == 1)
        price = this.product.unitsOfMeasurementEquivalence * parseFloat(priceObj.price)
      else if(priceObj.supplierProductExpedition.productExpeditionPricing == 2) {
        price = (this.product.unitsOfMeasurementEquivalence / parseFloat(this.product.quantity.replace(',', '.'))) * parseFloat(priceObj.price)
        // if(this.product.packageQuantity)
        //   price = price / parseFloat(this.product.packageQuantity)
      } else if(priceObj.supplierProductExpedition.productExpeditionPricing == 3) {
        price = (this.product.unitsOfMeasurementEquivalence / (parseFloat(this.product.quantity.replace(',', '.')) * parseFloat(priceObj.supplierProductExpedition.productExpeditionQuantity))) * parseFloat(priceObj.price)
        // if(this.product.packageQuantity)
        //   price = price / parseFloat(this.product.packageQuantity)
      }

      var text = this.formatPrice(price)
      if(withUnit) {
        switch(this.product.unitsOfMeasurementMeasureType) {
          case 'solid':
            text = this.formatPrice(price) + ' p/ kg'
            break;
          case 'liquid':
            text = this.formatPrice(price) + ' p/ L'
            break;
        }
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

      var text = pricePerUnit + '                                      ' + this.pricePerBaseUnit(price, true)

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
    isMobile: {
      type: Boolean,
    },
    blockInputs: {
      type: Boolean,
    },
    expired: {
      type: Boolean,
    },
  },
  components: {
    // VQuoteProductDescription,
    ProductInfoModal,
    ProductPhotoModal,
    // VClamp,
    // VPopoverProductCard,
    NumberInputSpinner,
    //QuotationProductExpedition,
    VNewSecondaryCharacteristics
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
