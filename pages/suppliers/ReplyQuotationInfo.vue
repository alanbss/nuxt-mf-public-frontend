<template>

  <div class="content-wrapper">
    <div class="content-body" v-if="loadedTotals">
        <div class="p-2" style="margin: -2.35rem -2.20rem 1.50rem -2.20rem; background: #EDEDED; border-bottom: solid 1px #D5D5D5;">
            <div class="px-75">
                <span class="float-none float-sm-right text-danger font-weight-bold font-small-3 d-block pl-3 pl-0">
                  <i class="feather icon-clock mr-50"></i> Expira em {{ remainingTime(expiringTime) }}
                </span>
                <router-link title="Voltar" class="d-md-none" :to="{ name: 'quotation-panel' }">
                  <i class="feather icon-arrow-left mr-1 mt-n25 float-left font-large-1"></i>
                </router-link>
                <h6 class="m-0 font-weight-bold">
                  {{ quotation.clientName }}
                  <a href="javascript:void(0);" @click="openInfoModal()" class="font-small-2 ml-50">
                    Saiba mais
                  </a>
                </h6>
            </div>
        </div>

        <client-info-modal v-if="client" :client="client" :popupActive="openClientInfo" @updated-popup="updatePopup" />

        <div v-if="!this.fillingPrices">
          <div class="row" v-if="loadedConfigs">
              <div class="col-md-6 mb-2">
                <v-quotation-delivery-card :configuration="configuration" @clicked-edit="clickedEdit" />
              </div>
              <div class="col-md-6 mb-2">
                <v-quotation-payment-methods-card :paymentMethods="paymentMethods" :configuration="configuration" :blockPayments="true" @clicked-edit="clickedEdit" />
              </div>
          </div>

          <div class=" d-none row no-gutters bg-white border-light rounded shadow-sm align-items-center mt-1 justify-content-center">
            <div class="col-md-2 col-8 p-1 ">
              <vs-tooltip text="É preciso preencher todos os preços e definir condições de pgt" :active="isDisabled" position="top">
                <button
                  
                  @click="saveInfo()"
                  type="button"
                  class="btn btn-primary px-1 text-bold-600 waves-effect waves-light"
                  :disabled="isDisabled"
                  style="width: 200px"
                >
                <b-spinner v-if="saveLoading" small/>
                <span v-else>
                  Salvar e avançar
                  <i class="feather icon-arrow-down ml-25 d-sm-inline d-none"></i>
                </span>

                </button>
                <span>&nbsp;</span>
              </vs-tooltip>
            </div>
          </div>

        </div>
        <div>
          <reply-quotation-products @open-reply-info="openInfo" />
        </div>
      </div>
      <div v-else>
        <div class="d-flex justify-content-center">
          <div class="spinner-border" style="width: 3rem; height: 3rem;" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
      </div>
  </div>

</template>

<script>
import { mapState, mapActions } from "vuex";
// import VQuotationPanelProducts from "~/components/quotations/Components/VQuotationPanelProducts";
// import VQuotationPanelClient from "~/components/quotations/Components/VQuotationPanelClient";
import VQuotationPaymentMethodsCard from "~/components/quotations/Components/VQuotationPaymentMethodsCard";
import VQuotationDeliveryCard from "~/components/quotations/Components/VQuotationDeliveryCard";
import ReplyQuotationProducts from "~/components/suppliers/components/ReplyQuotationProducts";
import ClientInfoModal from "~/components/clients/components/ClientInfoModal";
import timeFormatter from "@/mixins/timeFormatter";

export default {
  data() {
    return {
      quotationId: undefined,
      fillingPrices: false,
      loadedConfigs: false,
      openClientInfo: false,
      expiringTime: null,
      saveLoading: false,
      backLoading: false,
      loadedTotals: false
    };
  },
  created() {
    //this.$vs.loading()
    this.quotationId = this.$route.params.quotationId
    this.clearPagination()
    this.getConfiguration().then(() => {
      this.loadedConfigs = true
    })
    this.getFamilies()
    this.getPaymentMethods()
    this.getQuotationProductsByPageNumber({ id: this.quotationId }).then(() => {
      this.loadedTotals = true
    })
    // this.getExpeditionsBySupplierAndQuotation({ quotationId: this.quotationId }).then(() => {
    //   this.$vs.loading.close()
    // })
    // this.getPricesByQuotation(this.quotationId)
    this.getQuotation({ id: this.quotationId }).then(() => {
      this.expiringTime = this.quotation.remainingTime
      if(!(this.quotation.status == 'Aceita' || this.quotation.status == 'Pendente'))
        this.$router.push({ name: 'quotation-panel'})
      this.getClient(this.quotation.clientId)
    })
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
    ...mapState("suppliers/configurations", ["configuration"]),
    ...mapState("pagination", ["totalPages"]),
    ...mapState("clients", ["client"]),
    isDisabled() {
      // let paymentFilled = true
      let priceValid = false

      // if(this.paymentInfo &&
      //   (this.paymentInfo.payment_methods && this.paymentInfo.payment_methods.length)) {
      //     paymentFilled = false
      // }

      if(this.paymentInfo && this.paymentInfo.maximum_order_value &&
        (parseFloat(this.paymentInfo.maximum_order_value.replace('R$ ', '').replace('.', '').replace(',', '.')) <= parseFloat(this.configuration.minimumOrderValue))) {
          priceValid = true
      }

      // return (paymentFilled || priceValid) && this.$auth.user().supplierQuotationType != 'Automático'
      return priceValid
    }
  },
  methods: {
    ...mapActions("quotations", [
      "getQuotationProductsByPageNumber",
      'getQuotation',
      'savePaymentInfo',
      'saveDeliveryInfo',
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
      'getPaymentMethods',
      'updateDeliveryRate'
    ]),
    ...mapActions("suppliers/configurations", [
      "getConfiguration"
    ]),
    ...mapActions("products/supplierProductExpeditions", [
      "saveExpeditions",
      "savePricing",
    ]),
    ...mapActions("clients", ["getClient"]),
    ...mapActions("pagination", ["clearPagination"]),
    saveInfo() {
      
      this.savePaymentInfo({ data: this.paymentInfo, quotationId: this.quotationId })
      this.saveDeliveryInfo({ data: this.deliveryInfo, quotationId: this.quotationId })
      this.fillingPrices = true
    },
    openInfoModal() {
      this.openClientInfo = true
    },
    openInfo() {
      this.fillingPrices = false
    },
    updatePopup(value) {
      this.openClientInfo = value
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
    }
  },
  components: {
    VQuotationDeliveryCard,
    VQuotationPaymentMethodsCard,
    ReplyQuotationProducts,
    ClientInfoModal
    // VQuotationPanelProducts,
    // VQuotationPanelClient
  },
  mixins: [timeFormatter]
};
</script>
