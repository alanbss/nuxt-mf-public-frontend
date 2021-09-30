<template>
  <div class="vh-100 overflow-auto" style="padding-bottom: 14rem;">
    <div class="px-2 bg-rgba-success">
      <horizontal-scroll>
        <ul class="nav nav-tabs mb-25" style="display: inline-block;">
          <li class="nav-item" v-for="family in families" :key="family.id"  style="display: inline-block;">
            <a href="javascript:void(0)" @click="selectFamily(family)" :class="familyClass(family.id)">
              {{ family.name }}
            </a>
          </li>
        </ul>
      </horizontal-scroll>
    </div>
    <div class="px-2 bg-white shadow-sm">
      <horizontal-scroll class="horizontal-scroll">
        <ul class="nav nav-tabs mb-25" v-if="selectedFamily && familyCategories.length" style="display: inline-block;">
          <li class="nav-item" v-for="category in familyCategories" :key="category.id" style="display: inline-block;">
            <a href="javascript:void(0)" v-if="category" @click="selectCategory(category)" :class="categoryClass(category.id)">
              {{ category.name }}
            </a>
          </li>
        </ul>
      </horizontal-scroll>
    </div>

    <div class="m-1">
      <div v-if="loading" class="d-flex justify-content-center" style="margin-top: 200px;">
        <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
      <span v-if="quotationProducts && !loading">
        <span v-for="productType in uniqueProductTypes" :key="productType">
          <span v-if="hasPrices(productType)">
            <h3 class="my-1" v-if="productType">
              {{ productType }}
              <!-- <a href="" class="font-small-3 ml-1">Comparar preços</a> -->
            </h3>
            <div class="row">
              <div class="col-xl-3 col-md-4 col-6 mb-3" v-for="product in fromProductType(productType)" :key="product.id">
                <QuoteProductCard
                  :product="product"
                  :quotation="String(quotation.id)"
                  :prices="productPrices(product.id)"
                  :loadedTotals="totals"
                  :expired="quotation.hasExpired"
                  @quantity-input="checkTotals"
                />
              </div>
            </div>
          </span>
        </span>
      </span>

        <div class="row px-1 py-50 position-fixed w-100 d-sm-flex d-none border-top-light mf-footer-order">
            <div class="col-10 col-md-8 pl-0">
                <span class="font-medium-1 font-weight-bold color-mf-verde pr-1 mr-1 float-left py-md-50" style="border-right: solid 1px #ccc;">
                  <span class="d-block d-md-inline">Mín. {{ formatPrice(quotation.minimumOrderValue) }} </span>
                  <span v-if="quotation.maximumOrderValue">
                    <span class="d-none d-md-inline">/</span> Máx. {{ formatPrice(quotation.maximumOrderValue) }}
                  </span>
                </span>
                <span class="font-medium-1 mr-1 py-md-50 float-left" v-show="!quotation.hasExpired">
                  <span class="d-block d-md-inline">Total: </span><span class="font-weight-bold text-success">
                    {{ formatPrice(this.total) }}
                  </span>
                </span>
            </div>
            <div class="col-2 col-md-2 text-right pl-0" v-show="!quotation.hasExpired">
              <vs-tooltip :text="tooltipText" :active="isDisabled" position="top">
                <button
                 :disabled='isDisabled'
                 type="button"
                 class="btn btn-primary text-bold-600 px-1 waves-effect waves-light"
                 @click="submitValues()"
                >
                  Avançar
                </button>
                <span>&nbsp;</span>
              </vs-tooltip>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import priceFormatter from "@/mixins/priceFormatter";
import QuoteProductCard from "@/resources/products/components/QuoteProductCard";
import HorizontalScroll from 'vue-horizontal-scroll';

import { mapActions, mapState } from "vuex";

export default {
  data() {
    return {
      families: [],
      selectedFamily: undefined,
      selectedCategory: undefined,
      uniqueProductTypes: [],
      totals: [],
      total: 0,
      hasBelowMin: false,
      loading: false
    }
  },
  mounted() {
    this.userEmail = this.$auth.user().email
  },
  computed: {
    //...mapGetters("users/products", ["productIsOnList", "productIsOnCart", "productCartIsEmpty"]),
    ...mapState("quotations", [
      "quotationCategories",
      "quotationProducts"
    ]),
    ...mapState("quotations/quotationPrices", [
      "quotationPrices"
    ]),
    familyCategories() {
      return this.quotationCategories.filter(category => category.family.id == this.selectedFamily.id)
    },
    tooltipText() {
      var min = 0
      if(this.quotation.minimumOrderValue)
        min = parseFloat(this.quotation.minimumOrderValue)

      if(this.total < min)
        return "O total está abaixo do mínimo"
      else if(this.total > parseFloat(this.quotation.maximumOrderValue))
        return "O total está acima do máximo"
      else
        return ''
    },
    isDisabled() {
      var min = 0
      if(this.quotation.minimumOrderValue)
        min = parseFloat(this.quotation.minimumOrderValue)

      if((this.total >= min && this.total > 0) && (this.total <= parseFloat(this.quotation.maximumOrderValue)) && !this.hasBelowMin)
        return false
      else if((this.total >= min && this.total > 0) && (!this.quotation.maximumOrderValue) && !this.hasBelowMin)
        return false
      else
        return true
    }
  },
  created() {
    this.loading = true
    let selectCategory = null
    this.getQuotationCategories(this.quotation.id).then(() => {
      for(let i = 0; i < this.quotationCategories.length; i++) {
        if(!this.families.find(family => family.id == this.quotationCategories[i].family.id))
          this.families.push(this.quotationCategories[i].family)
        if(this.$route.query.categoryId && this.quotationCategories[i].id == this.$route.query.categoryId)
          selectCategory = this.quotationCategories[i]
      }
      if(this.families.length) {
        this.families.sort((a, b) => a.name.localeCompare(b.name))
        if(selectCategory)
          this.selectFamilyAndCategory(selectCategory)
        else
          this.selectFamily(this.families[0])
      }
    })
    this.getPricesByQuotation(this.quotation.id).then(() => {
      this.loading = false
      this.loadTotals()
    })
  },
  methods: {
    ...mapActions("quotations", [
      "getQuotationCategories",
      "getQuotationProductsByCategory",
      "saveExpeditionQuantities"
    ]),
    ...mapActions("quotations/quotationPrices", [
      "getPricesByQuotation"
    ]),
    selectFamilyAndCategory(category) {
      this.selectedFamily = category.family
      this.selectCategory(category)
    },
    selectFamily(family) {
      this.selectedFamily = family
      this.selectCategory(this.familyCategories[0])
    },
    selectCategory(category) {
      this.loading = true
      this.selectedCategory = category
      this.getQuotationProductsByCategory({ quotationId: this.quotation.id, categoryId: category.id }).then(() => {
        this.uniqueProductTypes = [...new Set(this.quotationProducts.map(item => item.productTypeName))]
        this.loading = false
      })
    },
    productPrices(productId) {
      return this.quotationPrices
                 .filter(price =>
                   price.supplierProductExpedition.productExpeditionProductId == productId)
    },
    loadTotals() {
      for(var i = 0; i < this.quotationPrices.length; i++) {
        let price = this.quotationPrices[i]
        if(price.quantity) {
          let result = price.quantity * this.expeditionPrice(price.price, price.supplierProductExpedition.productExpeditionQuantity)
          let obj = { id: price.id, quantity: price.quantity, total: result, minimum: price.supplierProductExpedition.minimumOrder }
          this.checkTotals(obj)
        }
      }
    },
    familyClass(familyId) {
      if (this.selectedFamily && (this.selectedFamily.id == familyId))
        return "nav-link active font-weight-bold"
      else
        return "nav-link font-weight-bold"
    },
    categoryClass(categoryId) {
      if (this.selectedCategory && (this.selectedCategory.id == categoryId))
        return "nav-link active"
      else
        return "nav-link"
    },
    checkTotals(totals) {
      let found = this.totals.find(obj => obj.id == totals.id)
      if(found) {
        found.quantity = totals.quantity
        found.total = totals.total
      } else {
        this.totals.push(totals)
      }
      this.updateTotal()
    },
    updateTotal() {
      let sum = 0
      this.hasBelowMin = false
      for(let i = 0; i < this.totals.length; i++) {
        sum += this.totals[i].total
        var formattedQuantity = this.totals[i].quantity
        if(this.totals[i].minimum && this.totals[i].quantity != '' && (formattedQuantity < this.totals[i].minimum))
          this.hasBelowMin = true
      }
      this.total = sum
    },
    submitValues() {
      this.$vs.loading()
      this.saveExpeditionQuantities({ totals: this.totals, quotationId: this.quotation.id }).then(() => {
        this.$vs.loading.close()
        this.$router.push({ name: 'users.reviewQuotation', params: { quotationId: this.quotation.id }})
      })
    },
    fromProductType(productType) {
      return this.quotationProducts.filter(prod => prod.productTypeName == productType)
    },
    hasPrices(productType) {
      var products = this.fromProductType(productType)
      var ids = products.map(prod => prod.id)
      return this.quotationPrices
                 .filter(price => ids.includes(price.supplierProductExpedition.productExpeditionProductId))
                 .length
    },
    expeditionPrice(price, quantity) {
      if(quantity)
        return (price * quantity)
      else
        return price
    },
  },
  props: {
    quotation: {
      type: Object,
      required: true
    },
  },
  components: {
    QuoteProductCard,
    HorizontalScroll
  },
  mixins: [priceFormatter]
};
</script>
<style>
._horizontal-scroll[data-v-5ce095ec]{box-sizing:border-box;overflow-x:auto;overflow-y:hidden;text-align:left;white-space:nowrap}
</style>
