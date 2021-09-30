<template>
  <div class="content-wrapper">
    <loading-overlay
      :active.sync="isLoading"
      :is-full-page="fullPage"
      :loader="loader"
      :color="color"
      :background-color="backgroundColor"
      :opacity="opacity"
      :width="width"
      :height="height"
    />
    <div class="content-body offset-md-3" v-if="!isLoading && supplier">
        <!-- <div class="p-2" style="margin: -2.35rem -2.20rem 1.50rem -2.20rem; background: #EDEDED; border-bottom: solid 1px #D5D5D5;">
            <div class="px-75">
                <div class="float-right font-small-3">
                  <VDropdownInfo :supplier="supplier" v-if="supplier" />
                  <span class="text-danger font-weight-bold font-small-3 ml-2"><i class="feather icon-clock mr-50"></i>Expira em {{ remainingTime(quotation.remainingTime) }}</span>
                </div>
                <h6 class="m-0 font-weight-bold">{{ quotation.supplierName }}</h6>
            </div>
        </div> -->

        <div class="row">
          <div class="col-md-9 col-lg-8 pr-0 pl-0">
            <div class="card shadow-sm bg-rgba-success mb-2">
              <div class="card-body justify-content-start">
                <div class="avatar bg-rgba-light pb-3 m-0 mr-2 mb-50 mt-1 mb-md-0 float-left" style="cursor: default;">
                  <div class="avatar-content">
                    <i class="feather icon-file-text text-body font-large-3 mt-1"></i>
                  </div>
                </div>
                <div class="ml-2">
                  <h4 class="card-title color-mf-verde font-large-1">Emitir pedido</h4>
                  <p>Confira o resumo e emita o pedido a este fornecedor</p>
                </div>
              </div>
            </div>
          </div>
          <div class="row ">
            <div class="col-md-6 mb-2">
              <div class="card h-100 shadow-sm">
                  <div class="card-body pb-0">
                      <div class="card-body p-1 ml-0">
                        <h6 class="disabled-opacity">Emitir pedido a</h6>
                        <h3 class="font-weight-bold">{{ supplier.user.name }}</h3>
                        <h6 class="">{{ supplier.user.legalName }}</h6>
                        <h6 class="">{{ formatCNPJ(supplier.user.cnpj) }}</h6>
                        <h6 class="">{{ completeAdress(supplier.user.street, supplier.user.addressDetails, supplier.user.neighborhood, supplier.user.city, supplier.user.stateUf) }}</h6>
                      </div>
                      <div class="card-body p-1">
                        <h4 class="card-title"><i class="feather icon-truck font-medium-2 mr-50"></i> Condições de entrega</h4>
                        <h5 v-if="supplier.deliveryEstimate" class="mb-50 pt-1 disabled-opacity">Prazo de entrega</h5>
                        <h5 v-else class="mb-50 pt-1 disabled-opacity">Este fornecedor não realiza entregas.</h5>

                        <p v-if="supplier.deliveryEstimate" class="font-small-3">
                          {{ supplier.deliveryEstimate !== "" ? supplier.deliveryEstimate : 'Nada descrito'}}
                        </p>
                        <h5 v-if="supplier.deliveryRoute" class="mb-50 pt-1 disabled-opacity">Rota</h5>
                        <p v-if="supplier.deliveryRoute" class="font-small-3">
                          {{ supplier.deliveryRoute !== "" ? supplier.deliveryRoute : 'Nada descrito' }}
                        </p>
                        <h5 class="mb-50 pt-1 disabled-opacity" v-if="supplier.lastDeliveryRate && supplier.deliveryEstimate">
                          Custo de frete
                        </h5>
                        <p v-if="supplier.lastDeliveryRate" class="font-small-3">
                          {{ supplier.lastDeliveryRate }}
                        </p>
                      </div>
                  </div>
              </div>
          </div>
          <div class="col-md-3 mb-2 pb-1">
              <div class="card shadow-sm">
                <div class="ml-1 mt-1">
                  <h4 class="card-title color-mf-laranja">
                    Seu pedido tem {{ productCount }}
                  </h4>
                  <p class="mb-1">
                    Você pode revisar antes de continuar
                  </p>
                  <div class="row">
                    <p class="col-11 mol-md-11 mb-0 pr-0">
                      <button type="button" @click="reviewOrder()" class="btn btn-outline-primary waves-effect waves-light" style="width: 100%;">
                        <b-spinner  variant="success" v-if="buttonLoading" small/>
                        <span v-else>Revisar produtos</span>
                      </button>
                    </p>
                  </div>
                </div>
                <hr class="mt-2">
                <div class="row">
                  <div class="col-11 col-md-11 ml-1 mt-0 ">
                      <i class="font-small-3 mb-50  disabled-opacity">
                        Depois de emitir, você voltará para o painel de cotação e
                        poderá emitir pedido para outros fornecedores
                      </i>
                  </div>
                </div>
                <div class="row mt-2 pb-1">
                  <div class="col-5 col-md-5">
                      <h5 class="mb-50  ml-1 disabled-opacity">Valor total</h5>
                  </div>
                  <div class="col-6 col-md-6 text-right mr-1">
                    <p>
                      <strong>
                        <span class="font-small-2">R$ </span>
                        <span class="font-medium-2">{{ formatPrice(total).substring(3) }}</span>
                      </strong>
                    </p>
                  </div>
                </div>
                <div class="row pb-2">
                  <div class="col-11 col-md-11 mr-1">
                      <button
                        @click="saveOrder"
                        type="button"
                        class="btn btn-primary px-1 text-bold-600 waves-effect waves-light ml-1"
                        style="width: 100%;"
                        >
                        <b-spinner v-if="acceptLoading" small/>
                        <span v-else>
                          <i class="feather icon-file-text d-sm-inline d-none"></i> Emitir Pedido
                        </span>

                      </button>
                      <span>&nbsp;</span>
                  </div>
                </div>

            </div>
          </div>

          <div class="col-12">
              <!-- <div class="card shadow-sm bg-rgba-warning">
                  <div class="card-body justify-content-start">
                      <div class="avatar bg-rgba-light p-50 m-0 mr-2 mb-50 mb-md-0 float-left" style="cursor: default;">
                          <div class="avatar-content">
                              <i class="feather icon-info text-body font-medium-5"></i>
                          </div>
                      </div>

                  </div>
              </div> -->
            </div>
          </div>

        </div>

        <!-- <div
          class="row no-gutters bg-white border-light rounded shadow-sm align-items-center mt-1"
        > -->
<!--
          <div class="p-1 text-right d-flex flex-row-reverse" style="width: 100%;">


            <button @click="cancelLink" type="button" class="btn btn-flat-primary px-1 text-bold-600 waves-effect waves-light">
              <b-spinner variant="success" v-if="cancelLoading" small/>
              <span v-else>
                <span  class="ml-25 d-sm-inline d-none">Cancelar</span>
              </span>
            </button>
          </div> -->
        <!-- </div> -->

    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import priceFormatter from "@/mixins/priceFormatter";
import VQuotationProductsReview from "@/resources/quotations/Components/VQuotationProductsReview";
// import VDropdownInfo from "@/resources/suppliers/components/VDropdownInfo";
import timeFormatter from "@/mixins/timeFormatter";

export default {
  data() {
    return {
      quotationId: undefined,
      loadedQuotation: undefined,
      total: undefined,
      selectedPayment: null,
      updated: false,
      color: "#0cb695",
      loader: "spinner",
      width: 110,
      height: 110,
      backgroundColor: "#0cb695",
      opacity: 0.3,
      fullPage: true,
      isLoading: false,
      buttonLoading: false,
      acceptLoading: false,
      cancelLoading: false,
      loadedTotals: false,
      loadedProducts: false,
      loadedQuotationFlag: false
    };
  },

  created() {
    this.clearPagination()
    this.orderId = this.$route.params.orderId
    this.getSupplierBySlug(this.$route.params.supplierSlug)
    this.getOrderTotal({ id: this.orderId }).then((response) => {
      this.total = response
    })
    if(this.$route.query.autoOpen && this.$auth.check() && (this.$route.query.autoOpen == 'true' || this.$route.query.autoOpen == true)) {
      this.emitOrder(this.orderId).then(() => {
        this.isLoading = false
        this.$router.push({ name: 'users.orderPanel' })
      })
    }
  },

  watch: {

  },

  computed: {
    ...mapState("quotations", ["quotation", "quotationProducts"]),
    ...mapState("quotes", ["quotes"]),
    ...mapState("pagination", ["totalPages", "totalCount"]),
    ...mapState("suppliers", ["supplier"]),
    currentPage: {
      get() {
        return this.$store.state.pagination.currentPage
      },
      set(value) {
        this.$store.dispatch("pagination/setCurrentPage", value)
      },
    },
    isDisabled() {
      if(this.selectedPayment || this.quotation.supplierType == 'Automático')
        return false
      else
        return true
    },
    productsInStoreCart() {
      if (this.$store.state.users.products.storeProducts)
        return this.$store.state.users.products.storeProducts.length
      else
        return 0
    },
    storeTotal() {
      if (this.$store.state.users.products.storeTotal)
        return this.$store.state.users.products.storeTotal
      else
        return 0
    },
    productCount() {
      if(this.productsInStoreCart == 1)
        return '1 produto'
      else
        return this.productsInStoreCart + ' produtos'
    }

  },

  methods: {
    ...mapActions("quotations", [
      "getQuotationWithPayments",
      "getValidQuotationProductsByPageNumber",
      "getTotal",
      "savePaymentMethod"
    ]),
    ...mapActions("pagination", ["userSelectedPage", "clearPagination"]),
    ...mapActions("suppliers", ["getSupplierById", "getSupplierBySlug"]),
    ...mapActions("orders", ["emitOrder", "getOrderTotal"]),
    reviewOrder() {
      this.buttonLoading = true
      setTimeout(() => {
        this.buttonLoading = false
        this.$router.push({ name: 'users.reviewOrderProducts', params: { supplierSlug: this.$route.params.supplierSlug } })
      }, 300);
    },
    saveOrder() {
      this.acceptLoading = true
      setTimeout(() => {
        this.acceptLoading = false
        this.isLoading = true
        if(this.$auth.check()) {
          this.emitOrder(this.orderId).then(() => {
            this.isLoading = false
            this.$router.push({ name: 'users.orderPanel' })
          })
        } else {
          this.acceptLoading = false
          this.$router.push({ name: 'sign-up', query: { directOrder: this.orderId, supplierSlug: this.$route.params.supplierSlug } })
        }
      }, 300);

    },
    formatCNPJ(value){
      return value.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
    },
    completeAdress(street, addressDetails, neighborhood, city, state){

      return `${street}, ${addressDetails}, ${neighborhood}, ${city} - ${state}`

    },
    cancelLink() {
      this.cancelLoading = true
      setTimeout(() => {
        this.cancelLoading = false
          this.$router.push({ name: 'users.quotePanel',
                            params: { quoteId: this.quotation.quoteId },
                            query: { quotationId: this.quotationId } })
      }, 300);
    }
  },
  components: {

  },
  mixins: [priceFormatter, timeFormatter]
};
</script>
