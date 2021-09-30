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
    <div class="content-body">
        <div class="p-2" style="margin: -2.35rem -2.20rem 1.50rem -2.20rem; background: #EDEDED; border-bottom: solid 1px #D5D5D5;">
          <div class="px-75" v-if="order && client">
            <div class="float-right font-small-3">
              <span class="font-weight-bold font-small-3 position-relative d-sm-inline d-none" style="top: -4px;">
                {{ formattedDate(order.updated_at) }}
              </span>
              <button
                @click="backToQuotation(orderId)"
                id="back-button"
                class="btn btn-primary waves-effect waves-light font-small-3 px-1 ml-1 mt-n75"
                style="margin-top: -10px;width: 120px"
                v-if="$auth.check()"
              >
                <b-spinner v-if="backLoading" small/>
                <span v-else>Sair do pedido</span>
              </button>
            </div>
            <h6 class="m-0 font-weight-bold">{{ client.user.name }}</h6>
          </div>
        </div>

        <div class="row">
          <div class="col-12" v-if="currentPage == 1">
            <div class="card shadow-sm mb-1">
              <div class="card-body justify-content-start">
                <div class="avatar bg-rgba-success p-50 m-0 mr-2 mb-50 float-left" style="cursor: default;">
                  <div class="avatar-content">
                    <i class="feather icon-check text-success font-medium-5"></i>
                  </div>
                </div>
                <div class="ml-2">
                  <h4 class="card-title color-mf-verde">Pedido de compra recebido!</h4>
                  <p class="my-25">Este cliente já está aguardando por seu atendimento.</p>
                </div>
              </div>
            </div>
            <VQuotationPanelClient v-bind:client="client" :noMargin="true" v-if="client" />
            <div class="col-12">
              <hr class="m-0">
            </div>
            <div class="card shadow-sm pt-1">
                <div class="card-body">
                  <div class="row">
                    <div class="col">
                      <p class="font-weight-bold text-uppercase font-small-2">Valor total</p>
                      <p class="mb-0 font-medium-2">
                        <span class="d-block font-weight-bold">{{ formatPrice(total) }}</span>
                      </p>
                    </div>
                    <!-- <div class="col-4" v-if="quotation.supplierType != 'Automático'">
                      <p class="font-weight-bold text-uppercase font-small-2">Condições de pagamento</p>
                      <p class="mb-0 font-small-3">
                        {{ paymentName }}
                      </p>
                    </div> -->
                    <div class="col-4">
                      <p class="font-weight-bold text-uppercase font-small-2" v-if="quotation.deliveryRate">
                        Custo de frete
                      </p>
                      <p class="mb-0 font-small-3" v-if="quotation.deliveryRate">
                        {{ quotation.deliveryRate }}
                      </p>
                    </div>
                  </div>
                  <div class="row" v-if="quotation.orderComments">
                    <h5 class="ml-1 mb-50 pt-2 disabled-opacity" >
                      Você escreveu
                    </h5>
                    <textarea
                      v-model="quotation.orderComments"
                      disabled='true'
                      class="form-control mt-25 ml-1 mr-1"
                      id=""
                      rows="2"
                    >
                    </textarea>
                  </div>
                </div>
            </div>
          </div>

        </div>

        <VSupplierOrderProductsReview
          v-if="loadedOrder && orderProducts && orderProducts.length"
          ref="reviewProducts"
          :products="orderProducts"
          :order="order"
        />

        <div class="col-12">
          <vs-pagination :total="totalPages" v-model="currentPage" :max="10" :color="'#7367F0'" />
        </div>


    </div>

  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import priceFormatter from "@/mixins/priceFormatter";
import VSupplierOrderProductsReview from "~/components/orders/components/VSupplierOrderProductsReview";
import VQuotationPanelClient from "~/components/quotations/Components/VQuotationPanelClient";

export default {
  data() {
    return {
      color: "#0cb695",
      loader: "spinner",
      width: 110,
      height: 110,
      backgroundColor: "#0cb695",
      opacity: 0.3,
      fullPage: true,
      isLoading: false,
      orderId: undefined,
      loadedOrder: undefined,
      total: undefined,
      updated: false,
      backLoading:false
    };
  },

  created() {
    this.isLoading = true
    this.clearPagination()
    this.userSelectedPage(1)
    this.orderId = this.$route.params.orderId
    this.getValidOrderProductsByPageNumber({ id: this.orderId }).then(() => {
      this.updated = true
      this.isLoading = false
    })
    this.getOrder({ id: this.orderId }).then(() => {
      this.loadedOrder = this.order
      this.getClient(this.order.client_id)
    })
    this.getOrderTotal({ id: this.orderId }).then((total) => {
      this.total = total
    })
  },

  watch: {
    currentPage(pageNumber) {
      this.userSelectedPage(pageNumber)
      this.updated = false
      this.getValidOrderProductsByPageNumber({ id: this.orderId }).then(() => {
        this.updated = true
      })
    },
  },

  computed: {
    ...mapState("quotations", ["quotation", "quotationProducts"]),
    ...mapState("orders", ["order", "orderProducts"]),
    ...mapState("quotes", ["quotes"]),
    ...mapState("pagination", ["totalPages", "totalCount"]),
    ...mapState("suppliers", ["supplier"]),
    ...mapState("clients", ["client"]),
    currentPage: {
      get() {
        return this.$store.state.pagination.currentPage
      },
      set(value) {
        this.$store.dispatch("pagination/setCurrentPage", value)
      },
    },
    // paymentName() {
    //   if(this.quotation && this.quotation.paymentMethods) {
    //     let payment = this.quotation.paymentMethods.find(method => method.id == this.quotation.paymentMethodId)
    //     return payment.paymentMethod
    //   } else {
    //     return null
    //   }
    // }
  },

  methods: {
    ...mapActions("quotations", [
      "getQuotationWithPayments",
      "getValidQuotationProductsByPageNumber",
      "getTotal",
      "savePaymentMethod"
    ]),
    ...mapActions("orders", [
      "getOrderTotal",
      "getValidOrderProductsByPageNumber",
      "getOrder",
      "clearOrderProducts"
    ]),
    ...mapActions("pagination", ["userSelectedPage", "clearPagination"]),
    ...mapActions("suppliers", ["getSupplierById"]),
    ...mapActions("clients", ["getClient"]),
    formattedDate(date) {
      var m = new Date(date)
      var dateString = m.getDate() +"/"+ (m.getMonth() + 1) + "/" + m.getFullYear() + " - " + m.getHours() + ":" + String(m.getMinutes()).padStart(2, "0")
      return dateString
    },
    backToQuotation(){
      this.backLoading = true
      setTimeout(() => {
        this.backLoading = false
          location.href = `/cotacoes?quotationId=${this.quotationId}`
      }, 300);
    }
  },
  components: {
    VSupplierOrderProductsReview,
    VQuotationPanelClient
  },
  mixins: [priceFormatter]
};
</script>
