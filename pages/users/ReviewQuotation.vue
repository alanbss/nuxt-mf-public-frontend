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
    <div class="content-body offset-md-3" v-if="!isLoading && loadedTotals && loadedProducts && loadedQuotationFlag">
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
                        <h3 class="font-weight-bold">{{ quotation.supplierName }}</h3>
                        <h6 class="">{{ supplier.user.legalName }}</h6>
                        <h6 class="">{{ formatCNPJ(supplier.user.cnpj) }}</h6>
                        <h6 class="">{{ completeAdress(supplier.user.street, supplier.user.addressDetails, supplier.user.neighborhood, supplier.user.city, supplier.user.stateUf) }}</h6>
                      </div>
                      <!-- <div class="mt-2" v-if="quotation.supplierType != 'Automático'">
                        <div class="card shadow-sm bg-rgba-success">
                          <div class="card-body justify-content-start">
                            <h5 class="mb-1">Escolha a condição de pagamento</h5>
                            <b-alert class='justify-background-alert' variant="warning" show>
                              <p class="alert-body font-weight-bold">
                                Você não paga através da plataforma, estas opções servem para agilizar a comunicação entre você e o fornecedor.
                              </p>
                            </b-alert>
                            <div
                              class="vs-radio-con vs-radio-primary mt-1"
                              v-for="payment in quotation.paymentMethods"
                              :key="payment.id"
                            >
                                <input
                                  type="radio"
                                  name="condicao-pagamento"
                                  :value="payment.id"
                                  v-model="selectedPayment"
                                >
                                <span class="vs-radio">
                                  <span class="vs-radio--border"></span>
                                  <span class="vs-radio--circle"></span>
                                </span>
                                <span>{{ payment.paymentMethod }}</span>
                            </div>
                          </div>
                        </div>
                      </div> -->
                      <div class="card-body p-1">
                        <h4 class="card-title"><i class="feather icon-truck font-medium-2 mr-50"></i> Condições de entrega</h4>
                        <h5 v-if="quotation.deliveryEstimate" class="mb-50 pt-1 disabled-opacity">Prazo de entrega</h5>
                        <h5 v-else class="mb-50 pt-1 disabled-opacity">Este fornecedor não realiza entregas.</h5>

                        <p v-if="quotation.deliveryEstimate" class="font-small-3">
                          {{ quotation.deliveryEstimate !== "" ? quotation.deliveryEstimate : 'Nada descrito'}}
                        </p>
                        <h5 v-if="quotation.deliveryEstimate" class="mb-50 pt-1 disabled-opacity">Rota</h5>
                        <p v-if="quotation.deliveryEstimate" class="font-small-3">
                          {{ quotation.deliveryRoute !== "" ? quotation.deliveryRoute : 'Nada descrito' }}
                        </p>
                        <h5 class="mb-50 pt-1 disabled-opacity" v-if="quotation.deliveryRate && quotation.deliveryEstimate">
                          Custo de frete
                        </h5>
                        <p v-if="quotation.deliveryEstimate" class="font-small-3">
                          {{ quotation.deliveryRate }}
                        </p>
                      </div>
                  </div>
              </div>
          </div>
          <div class="col-md-3 mb-2 pb-1">
              <div class="card shadow-sm">
                <div class="ml-1 mt-1">
                  <h4 class="card-title color-mf-laranja">
                    Seu pedido tem {{ productCountText }}
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
                        @click="savePayment"
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
    this.isLoading = true
    this.clearPagination()
    this.quotationId = this.$route.params.quotationId
    this.getQuotationWithPayments({ id: this.quotationId }).then(() => {
      this.loadedQuotation = this.quotation
      this.getSupplierById(this.quotation.supplierId)
      document.getElementById('back-button')
              .setAttribute('href', `/painel-de-cotacoes/${this.quotation.quoteId}?quotationId=${this.quotationId}`)
      if(this.quotation.paymentMethodId)
        this.selectedPayment = this.quotation.paymentMethodId
      this.loadedQuotationFlag = true
      this.isLoading = false
    })
    this.getValidQuotationProductsByPageNumber({ id: this.quotationId }).then(() => {
      this.updated = true
      this.loadedProducts = true
      this.isLoading = false
    })
    this.getTotal({ id: this.quotationId }).then((total) => {
      this.total = total
      this.loadedTotals = true
      this.isLoading = false
    })
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
    productCount() {
      return this.totalCount
    },
    productCountText() {
      if(this.productCount == 1)
        return "1 produto"
      else
        return `${this.productCount} produtos`
    },
    isDisabled() {
      if(this.selectedPayment || this.quotation.supplierType == 'Automático')
        return false
      else
        return true
    },

  },

  methods: {
    ...mapActions("quotations", [
      "getQuotationWithPayments",
      "getValidQuotationProductsByPageNumber",
      "getTotal",
      "savePaymentMethod"
    ]),
    ...mapActions("pagination", ["userSelectedPage", "clearPagination"]),
    ...mapActions("suppliers", ["getSupplierById"]),
    reviewOrder() {
      this.buttonLoading = true
      setTimeout(() => {
        this.buttonLoading = false
        if(this.selectedPayment)
        this.savePaymentMethod({ quotationId: this.quotationId, method: this.selectedPayment, emit: false })
        this.$router.push({ name: 'users.reviewQuotationProducts', params: { quotationId: this.quotationId }})
      }, 300);
    },
    savePayment() {
      this.acceptLoading = true
      setTimeout(() => {
        this.acceptLoading = false
        this.isLoading = true
        this.savePaymentMethod({ quotationId: this.quotationId, method: this.selectedPayment, emit: true }).then(() => {
          this.isLoading = false
          this.$router.push({ name: 'users.quotePanel',
                              params: { quoteId: this.quotation.quoteId },
                              query: { quotationId: this.quotationId } })
        })
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
