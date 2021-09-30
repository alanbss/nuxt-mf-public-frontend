<template>
  <div class="content-wrapper p-0" style="margin-top: 4.50rem;">
    <div class="content-body">
      <div class="row mx-md-0" style="height: calc(100vh - 5rem); overflow: hidden;">
        <pricing-resume
          @selectProductType="selectProductType"
          :isMobile="mobileBrowser"
          @update-products="updateRender"
          @clicked-select="clickedSelect"
          @clicked-reset="clickedReset"
        />
        <div class="col-8 col-md-10 vh-100 mt-1" ref="productsWindow" style="background: #F8F8F8; padding-bottom: 6rem; overflow: scroll;" id="products">

          <div class="row" v-if="this.$auth.user().supplierStatus == 'Precificação' && noPriceProducts > 0">
            <div class="col-md-12 mb-2">
              <vs-alert
              :active.sync="active1"
              closable
              color="#ff1616" icon="new_releases"
              close-icon="close"
              style="height: auto;"
              class="mt-1">
                <!-- <i class="feather icon-alert-circle font-medium-3" style="color: red;"></i> -->
                <h5>Você ainda não está liberado no sistema</h5>
                <strong style="font-size: 1.2em;">
                  Falta definir o preço de {{ noPriceProducts }}
                  <span v-if="noPriceProducts == 1"> produto</span><span v-else>produtos</span>
                  ainda. Quando você concluir, seus produtos automaticamente ficarão disponíveis para os clientes.
                </strong>
              </vs-alert>
            </div>
          </div>
          <div v-if="this.inSaleCounter > 0 " class="pr-1" :style="alertStyle()">
            <div class="animate__animated animate__heartBeat" style="color: white!important; background:red !important; border-radius: 10px; padding:10px">
              <div class="row" style="justify-content: center;">
                <span v-if="this.inSaleCounter == 1">{{this.inSaleCounter}} produto em oferta</span>
                <span v-else>{{this.inSaleCounter}} produtos em oferta</span>
              </div>
            </div>
          </div>
          <div class="row pt-1" v-if="loadedConfigs && showConfigs">
            <div class="col-md-6 mb-2">
              <v-quotation-delivery-card :configuration="configuration" @clicked-edit="clickedEdit" />
            </div>
            <div class="col-md-6 mb-2">
              <v-quotation-payment-methods-card :paymentMethods="paymentMethods" :configuration="configuration" :blockPayments="true" @clicked-edit="clickedEdit" />
            </div>
            <no-prices-modal
              :openPopup="openNoPrices"
              :noPriceCount="noPriceCount"
              :routeName="routeName"
              @update-popup="updatePopup"
              @clicked-stay="updateStay"
            />
          </div>
          <div ref="content" v-if="renderingProducts.length > 0">
            <pricing-products
              :mobileBrowser="mobileBrowser"
              :key="renderProducts"
              @sale-changed-up="checkSalesUp()"
              @sale-changed-down="checkSalesDown()"
              />
            <div v-if="loading" class="d-flex justify-content-center" style="margin-top: 200px;">
              <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
                <span class="sr-only">Loading...</span>
              </div>
            </div>

            <!-- <div class="card shadow-sm" style="margin-top: 5em; margin-bottom: 8em;">
              <div class="card-body text-center">
                <p class="font-medium-2">Sua lista de {{  }} acabou</p>
                <p class="font-small-3"><span class="d-inline-block pb-1 border-bottom">Esta lista torna mais rápida a monstagem das suas cotações.<br>Todo produto que você cota é automaticamente incluído aqui.</span></p>
                <p class="font-medium-2 font-weight-bold">Precisa de mais produtos?</p>
                <a href="/" class="btn btn-primary waves-effect waves-light">Procurar no site</a>
              </div>
            </div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import PricingResume from "~/components/suppliers/components/PricingResume";
import PricingProducts from "~/components/suppliers/components/PricingProducts";
import VQuotationPaymentMethodsCard from "~/components/quotations/Components/VQuotationPaymentMethodsCard";
import VQuotationDeliveryCard from "~/components/quotations/Components/VQuotationDeliveryCard";
import NoPricesModal from "~/components/suppliers/components/NoPricesModal";
import PricingProductExpedition from "~/components/products/components/PricingProductExpedition";
import { mapState, mapActions } from "vuex";
import { bus } from "@/main";

export default {
  name: "Pricing",
  data() {
    return {
      productTypeId: undefined,
      mobileBrowser: false,
      loadedConfigs: false,
      loading: false,
      loaded: false,
      openNoPrices: false,
      showConfigs: true,
      noPriceCount: 0,
      renderProducts: 0,
      lastScrollTop: 0,
      currentPosition: 0,
      routeName: '',
      lastRequest: null,
      showedSavePopup: false,
      inSaleCounter: 0,
      checked: false,
    };
  },
  beforeRouteLeave(to, from, next) {
    if(!this.showedSavePopup && to.name != 'cover' && to.name != 'home') {
      this.routeName = to.name
      this.showedSavePopup = true
      this.savePrices()
      return
    } else {
      next()
    }
  },
  created() {
    if(this.$auth.user().supplierQuotationType != 'Automático')
      this.$router.push({ name: 'home' })
    this.isMobile()
    this.setRenderingProducts([])
    this.getConfiguration().then(() => {
      this.loadedConfigs = true
    })
    this.getPaymentMethods()
  },
  mounted() {
    this.getSaleProducts().then((i) => {
      this.inSaleCounter = i.length
    })
    this.scroll()
  },
  updated() {
    if(!this.loaded)
      this.loadMore()
  },
  computed: {
    ...mapState("quotations", [
      "paymentInfo",
      "deliveryInfo"
    ]),
    ...mapState("products/supplierProductExpeditions", ["supplierProductExpeditions"]),
    ...mapState("suppliers", [
      "supplierProducts",
      "supplierExpeditions",
      "renderingProducts",
      "paymentMethods",
      "noPriceData"
    ]),
    ...mapState("suppliers/configurations", ["configuration"]),
    ...mapState("products", ["products"]),
    ...mapState("users/products", [
      "productTypeName",
      "properties",
      "renderingStructure",
    ]),
    noPriceProducts() {
      var total = 0
      if(this.noPriceData) {
        for(var i in this.noPriceData) {
          total += this.noPriceData[i]
        }
      }
      return total
    },

  },
  methods: {
    ...mapActions("products/supplierProductExpeditions", [
      "savePricing",
    ]),
    ...mapActions("suppliers", [
      "getCatalog",
      "getCatalogByProductType",
      "getExpeditionsByProductType",
      "setRenderingProducts",
      "updateRenderingProducts",
      "hideAll",
      "getPaymentMethods",
      "updateDeliveryRate",
      "getSaleProducts",
      "getSaleSupplierExpeditions"
    ]),
    ...mapActions("suppliers/configurations", [
      "getConfiguration"
    ]),
    ...mapActions("products", [
      "getProducts",
      "getProductsInListFromProductType",
      "getProductsInListFromProperty",
      "getProductsInListFromPropertyAndUpdate"
    ]),
    ...mapActions("productTypes", ["getProductsByPageNumber"]),
    ...mapActions("users/products", ["updateRenderingStructureByPosition"]),
    clickedReset() {
      this.showConfigs = true
      this.$refs['productsWindow'].scrollTop = 0
      this.loaded = false
      this.currentPosition = 0
      this.lastRequest = { productTypeId: null, propertyId: null }
      this.loadMore()
    },
    updateStay() {
      this.showedSavePopup = false
    },
    updatePopup(val) {
      this.openNoPrices = val
    },
    selectProductType(selected) {
      this.productTypeId = selected
    },
    isMobile() {
      if (screen.width <= 760 || window.innerWidth <= 760) {
        this.mobileBrowser = true
      } else {
        this.mobileBrowser = false
      }
    },
    scroll() {
      this.$refs['productsWindow'].onscroll = () => {
        if(this.$refs['productsWindow'] && this.$refs['content']) {
          let bottomOfWindow = this.$refs['productsWindow'].scrollTop + this.$refs['productsWindow'].offsetHeight > this.$refs['content'].offsetHeight;
          if(bottomOfWindow && !this.loading) {
            if((this.currentPosition) < this.renderingProducts.length) {
              let productTypeId = this.renderingProducts[this.currentPosition].id
              if(productTypeId != this.lastRequest) {
                this.loaded = true
                this.lastRequest = productTypeId
                this.currentPosition++
                this.loadProductType({ productTypeId: productTypeId }, false)
              }
            }
          } else if(this.loading) {
            setTimeout(() => {
              this.$refs['productsWindow'].dispatchEvent(new Event('scroll'))
            }, 800)
          }
          this.lastScrollTop = this.$refs['productsWindow'].scrollTop
        }
      }
    },

    loadMore(force = false) {
      if(this.$refs['productsWindow'] && this.$refs['content'] && !this.loaded) {
        let lessThanWindow = this.$refs['productsWindow'].offsetHeight > this.$refs['content'].offsetHeight
        if((lessThanWindow || force) && this.$refs['productsWindow'].scrollTop == 0) {
          if((this.currentPosition) < this.renderingProducts.length) {
            let productTypeId = this.renderingProducts[this.currentPosition].id
            if(productTypeId != this.lastRequest) {
              this.loaded = true
              this.lastRequest = productTypeId
              this.currentPosition++
              this.loadProductType({ productTypeId: productTypeId }, true)
            }
          }
        }
      }
    },

    loadProductType(productType, loadMore = false) {
      this.loading = true
      this.getCatalogByProductType(productType.productTypeId).then(() => {
        this.getExpeditionsByProductType(productType.productTypeId).then(() => {
          this.updateRenderingProducts({ id:          productType.productTypeId,
                                         products:    this.supplierProducts,
                                         expeditions: this.supplierExpeditions}).then(() => {
            this.loading = false
            if(loadMore)
              this.loadAndUpdate()
          })
        })
      })
    },
   /*  showSaleProducts() {
      this.loading = true
      this.renderingProductsBack = this.renderingProducts
      if(this.checked == true){
        this.setRenderingProducts([])
        this.getSaleProducts().then((response) => {
          this.getSaleSupplierExpeditions().then((expeditions) => {
            var renderingProductsAux = []
            const unique = [...new Set(response.map(item => item.productTypeId))]
            for(var i = 0; i < unique.length; i++) {
              var products = response.filter(obj => obj.productTypeId == unique[i])
              renderingProductsAux.push({ id:           unique[i],
                                          name:         products[0].productTypeName,
                                          family:       products[0].familyName,
                                          products:     products,
                                          expeditions:  expeditions.filter(obj => obj.productExpedition.productTypeId == unique[i])})
            }
            this.setRenderingProducts(renderingProductsAux)
            this.loading = false
          })
        })
      }
      else{
        this.$router.go()
      }
    },
      changeChecked(){
        this.checked = !this.checked
    }, */
    checkSalesUp(){
      this.inSaleCounter++
      bus.$emit("showSaveTooltip")
    },
    checkSalesDown(){
      this.inSaleCounter--
      bus.$emit("showSaveTooltip")
    },

    loadAndUpdate() {
      if((this.currentPosition + 1) < this.renderingProducts.length) {
        let productTypeId = this.renderingProducts[this.currentPosition].id
        if(productTypeId != this.lastRequest) {
          this.lastRequest = productTypeId
          this.currentPosition++
          this.loadProductType({ productTypeId: productTypeId }, false)
        }
      }
    },

    updateRender() {
      this.renderProducts++
    },

    clickedSelect(index) {
      this.showConfigs = false
      this.hideAll()
      this.lastRequest = null
      this.currentPosition = index
      this.loaded = false
      this.loadMore(true)
      //this.$refs['productsWindow'].dispatchEvent(new Event('scroll'))
      // this.loaded = false
      // this.loadMore()
      this.$forceUpdate()
    },

    clickedEdit(val) {
      this.showedSavePopup = true
      this.routeName = val
      this.savePrices()
    },


    savePrices() {
      this.updateDeliveryRate(this.deliveryInfo)
      this.savePricing(this.supplierProductExpeditions).then((response) => {
        this.noPriceCount = response
        if(response > 0)
          this.openNoPrices = true
        else {
          this.$auth.fetch().then(() => {
            this.$router.push({ name: this.routeName })
          })
        }
      })
    },

    alertStyle(){
      if(this.mobileBrowser)
        return "z-index: 999; top: 0px; position: sticky; width: 200px; left: 20%;"
      else
        return "z-index: 999; top: 0px; position: sticky; width: 200px; left: 33%;"
    }
  },

  watch: {
  },
  components: {
    PricingResume,
    PricingProducts,
    VQuotationDeliveryCard,
    VQuotationPaymentMethodsCard,
    NoPricesModal
  },
};
</script>
