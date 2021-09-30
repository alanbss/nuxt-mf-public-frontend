<template>
  <div>
    <span
      v-for="family in families"
      :key="family.id"
    >
      <span v-if="hasProductsFromFamily(family.name)">
        <div class="row">
          <div class="col-12 mb-1">
            <h3>{{ family.name }}</h3>
          </div>
        </div>

        <div class="row" v-if="quotationProducts && loaded">
          <quotation-product-card
            v-for="product in getByFamily(family.name)"
            :key="product.id" :product="product"
            :expeditions="productExpeditions(product.id)"
            :quotation="String(quotationId)"
            :prices="quotationPrices"
            @check-prices="checkPriceInputs()"
            @check-discounts="checkDiscountInputs()" />
        </div>
      </span>
    </span>

    <div class="row no-gutters bg-white border-light rounded shadow-sm align-items-center mt-1">
      <div class="col-md-2 col-2 p-1">
        <button v-if="this.currentPage !=1 " @click="backPage()" type="button" class="btn btn-outline-primary px-1 text-bold-600 waves-effect waves-light">
          <i class="feather icon-arrow-left"></i><span class="ml-25 d-sm-inline d-none">Voltar</span>
        </button>
      </div>
      <div class="col-md-8 col-2 p-1 text-center">
          <span class="d-sm-inline d-none">Página</span> {{ currentPage  }}/{{ totalPages  }}
      </div>
      <div class="col-md-2 col-8 p-1 text-right">
        <span @click="validatePrices()">
          <vs-tooltip text="É preciso preencher todos os preços e definir condições de pgt" :active="isDisabled" position="top">
            <button
              @click="saveInfo()"
              type="button"
              class="btn btn-primary px-1 text-bold-600 waves-effect waves-light"
              :disabled="isDisabled"
            >
              <b-spinner v-if="buttonLoading" small/>
              <span v-else v-html="buttonText"></span>
            </button>
            <span>&nbsp;</span>
          </vs-tooltip>
        </span>
      </div>
    </div>
  </div>

</template>

<script>
import { mapState, mapActions } from "vuex";
// import VQuotationPanelProducts from "@/resources/quotations/Components/VQuotationPanelProducts";
// import VQuotationPanelClient from "@/resources/quotations/Components/VQuotationPanelClient";
import QuotationProductCard from "@/resources/products/components/QuotationProductCard";

export default {
  data() {
    return {
      quotationId: undefined,
      priceInputs: null,
      pricesFilled: false,
      discountsFilled: false,
      loaded: false,
      buttonLoading: false
    };
  },
  created() {
    this.$vs.loading()
    this.quotationId = this.$route.params.quotationId
    this.clearExpeditions()
    this.clearExpeditionsBySupplier()
    this.clearQuotationProducts()
    this.getFamilies()
    this.getQuotationProductsByPageNumber({ id: this.quotationId })
    this.loaded = false
    this.getExpeditionsBySupplierAndQuotationAndPage({ quotationId: this.quotationId }).then(() => {
      this.$vs.loading.close()
      this.loaded = true
    })
    this.getPricesByQuotation(this.quotationId)
    this.getQuotation({ id: this.quotationId })
  },
  updated() {
    setTimeout(() => {
      let prices = document.getElementsByClassName('price-input')
      if(prices.length) {
        this.priceInputs = prices
        this.checkPriceInputs()
      }
    }, 500)
  },
  watch: {
    currentPage(pageNumber, oldPage) {
      this.$vs.loading()
      this.loaded = false
      this.userSelectedPage(pageNumber)
      this.getQuotationProductsByPageNumber({ id: this.quotationId }).then(() => {
        this.$vs.loading.close()
      })
      this.getExpeditionsBySupplierAndQuotationAndPage({ quotationId: this.quotationId }).then(() => {
        this.loaded = true
      })
      if(oldPage > pageNumber)
        this.getPricesByQuotation(this.quotationId)
    },
  },
  computed: {
    ...mapState("quotations", [
      "quotation",
      "quotationProducts",
      "paymentInfo",
      "deliveryInfo"
    ]),
    ...mapState("quotations/quotationPrices", [
      "quotationPrices"
    ]),
    ...mapState("suppliers", [
      "supplierExpeditions",
      "paymentMethods"
    ]),
    ...mapState("families", ["families"]),
    ...mapState("products/supplierProductExpeditions", ["supplierProductExpeditions"]),
    ...mapState("pagination", ["totalPages"]),
    currentPage: {
      get() {
        return this.$store.state.pagination.currentPage
      },
      set(value) {
        this.$store.dispatch("pagination/setCurrentPage", value)
      },
    },
    isDisabled() {
      return this.pricesFilled || this.discountsFilled
    },
    buttonText() {
      if(this.currentPage == this.totalPages)
        return "Enviar <i class='feather icon-send ml-25 d-sm-inline d-none'></i>"
      else
        return "Salvar e avançar <i class='feather icon-arrow-right ml-25 d-sm-inline d-none'></i>"
    }
  },
  methods: {
    ...mapActions("quotations", [
      "getQuotationProductsByPageNumber",
      'clearQuotationProducts',
      'getQuotation',
      'acceptQuotation'
    ]),
    ...mapActions("quotations/quotationPrices", [
      "getPricesByQuotation"
    ]),
    ...mapActions("families", [
      "getFamilies",
    ]),
    ...mapActions("suppliers", [
      "getExpeditionsBySupplierAndQuotation",
      "getExpeditionsBySupplierAndQuotationAndPage",
      "clearExpeditionsBySupplier",
      'getPaymentMethods',
      'clearSupplierExpeditions'
    ]),
    ...mapActions("suppliers/configurations", [
      "getConfiguration"
    ]),
    ...mapActions("products/supplierProductExpeditions", [
      "saveExpeditions",
      "clearExpeditions"
    ]),
    ...mapActions("pagination", ["userSelectedPage"]),
    validatePrices() {
      var validationArray = this.$children.map(child => {
        if(typeof child.validateExpeditions === 'function')
          return child.validateExpeditions()
        else
          return null
      })
    },
    productExpeditions(productId) {
      var filterDuplicates = this.supplierExpeditions.filter((thing, index, self) => self.findIndex(t => t.id === thing.id) === index)
      if(this.supplierExpeditions)
        return filterDuplicates.filter(exp => exp.productExpedition.productId == productId)
      else
        return []
    },
    getByFamily(key){
      if(this.quotationProducts)
        return this.quotationProducts.filter(prod => prod.familyName == key).sort((a, b) => a.productTypeName.localeCompare(b.productTypeName))
      else
        return []
    },
    hasProductsFromFamily(familyName) {
      if(this.quotationProducts && this.quotationProducts.length)
        return this.quotationProducts.find(prod => prod.familyName == familyName)
      else
        return false
    },
    saveInfo() {
      this.buttonLoading = true
      setTimeout(() => {
        this.buttonLoading = false
          if(this.currentPage < this.totalPages) {
            this.saveExpeditions(this.supplierProductExpeditions)
            this.currentPage += 1
            window.scrollTo(0,0)
          } else {
            this.saveExpeditions(this.supplierProductExpeditions).then(() => {
              this.clearSupplierExpeditions()
              this.acceptQuotation({ quotationId: this.quotationId }).then(() => {
                this.$router.push({ name: 'quotation-panel', query: { quotationId: this.quotationId } })
              })
            })
          }
        this.$parent.saveInfo()
      }, 300);

    },
    backPage() {
      if(this.currentPage == 2){
        this.currentPage -= 1
        this.$parent.openInfo()
        window.scrollTo(0,0)
      }else if(this.currentPage > 1) {
        this.currentPage -= 1
        window.scrollTo(0,0)
      } else {
        this.getConfiguration().then(() => {
          this.$emit('open-reply-info')
        })
        window.scrollTo(0,0)
      }
    },
    checkPriceInputs() {
      this.pricesFilled = false
      var value = null
      var hasInvalid = false
      if(this.priceInputs) {
        for(var i = 0; i < this.priceInputs.length; i++) {
          if(!this.priceInputs[i].disabled &&
            (this.priceInputs[i].value == '' ||
             this.priceInputs[i].value == '0,00' ||
             hasInvalid))
            this.pricesFilled = true
        }
      }
    },
    checkDiscountInputs(val) {
      this.discountsFilled = false
      let discounts = document.getElementsByClassName('discount-input')
      var hasInvalid = false
      if(discounts) {
        for(var i = 0; i < discounts.length; i++) {
          hasInvalid = discounts[i].classList.contains('is-invalid') || discounts[i].classList.contains('is-invalid-no-icon')
          if(!discounts[i].disabled &&
            (discounts[i].value == '' || discounts[i].value[0] == '-' || hasInvalid))
            this.discountsFilled = true
        }
      }
    }
  },
  components: {
    QuotationProductCard,
    // VQuotationPanelProducts,
    // VQuotationPanelClient
  }
};
</script>
