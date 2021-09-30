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
    <div class="content-body" v-if="loadedOrder || (total && loadedQuotation && (loadedQuotation.status == 'Pedido de compra a confirmar' || loadedQuotation.status == 'Pedido de compra confirmado' || loadedQuotation.status == 'Pedido de compra recusado'))">
        <div class="p-2" style="margin: -2.35rem -2.20rem 1.50rem -2.20rem; background: #EDEDED; border-bottom: solid 1px #D5D5D5;">
            <div class="px-75">
                <div class="float-right font-small-3">
                  <VDropdownInfo :supplier="supplier" v-if="supplier" />
                  <button
                    @click="backToQuotes(quotation)"
                    id="back-button"
                    class="btn btn-primary waves-effect waves-light font-small-3 px-1 ml-1 mt-n75"
                    style="margin-top: -10px;width: 120px"
                  >
                    <b-spinner v-if="backLoading" small/>
                    <span v-else>Sair do pedido</span>
                  </button>
                </div>
                <h6 v-if="!order" class="m-0 font-weight-bold">{{ quotation.supplierName }}</h6>
                <h6 v-if="order" class="m-0 font-weight-bold">{{ supplier.user.name }}</h6>
            </div>
        </div>

        <div class="row">
          <div class="col-12" v-if="currentPage == 1">
            <div class="card shadow-sm">
                <div class="card-header d-block">
                    <div class="avatar bg-rgba-warning p-50 m-0 mr-3 mb-50 float-left" style="cursor: default;">
                        <div class="avatar-content">
                            <i class="feather icon-check text-warning font-medium-5"></i>
                        </div>
                    </div>
                    <div class="ml-2">
                        <span v-if="quotation && quotation.updatedAt" class="float-right font-small-3">{{ formattedDate(quotation.updatedAt) }}</span>
                        <span v-if="order && order.updated_at" class="float-right font-small-3">{{ formattedDate(order.updated_at) }}</span>
                        <h4 class="card-title color-mf-laranja">Pedido de compra emitido!</h4>
                        <p class="my-25">O fornecedor já foi informado, por email, sobre seu pedido.</p>
                    </div>
                </div>
                <div class="card-body row">
                    <div class="col">
                      <h5 class="mb-50 pt-1 disabled-opacity">Valor total</h5>
                      <p style="min-width: 240px;"><strong class="font-medium-3">{{ formatPrice(total) }}</strong></p>
                    </div>
                    <!-- <div class="col" v-if="quotation.supplierType != 'Automático'">
                      <h5 class="mb-50 pt-1 disabled-opacity">Condição de pagamento</h5>
                      <p class="font-small-3"  style="min-width: 160px;">
                        {{ paymentName }}
                      </p>
                    </div> -->

                      <div v-if="quotation.deliveryEstimate && !isDirect" class="col">
                        <h5 class="mb-50 pt-1 disabled-opacity">Prazo de entrega</h5>
                        <p class="font-small-3" style="min-width: 160px;">{{ quotation.deliveryEstimate }}</p>
                      </div>
                      <div v-else-if="!isDirect" class="col">
                        <h5 class="mb-50 pt-1 disabled-opacity">Este fornecedor não realiza entregas.</h5>
                      </div>
                      <div v-if="quotation.deliveryRoute && !isDirect" class="col">
                        <h5 class="mb-50 pt-1 disabled-opacity">Rota</h5>
                        <p class="font-small-3" style="min-width: 160px;">{{ quotation.deliveryRoute }}</p>
                      </div>
                      <div class="col" v-if="!isDirect">
                        <h5 class="mb-50 pt-1 disabled-opacity" v-if="quotation.deliveryRate && quotation.deliveryEstimate">
                          Custo do frete
                        </h5>
                        <p class="font-small-3" style="min-width: 160px;" v-if="quotation.deliveryRate && quotation.deliveryEstimate">
                          {{ quotation.deliveryRate }}
                        </p>
                      </div>


                      <div v-if="supplier.deliveryEstimate && isDirect" class="col">
                        <h5 class="mb-50 pt-1 disabled-opacity">Prazo de entrega</h5>
                        <p class="font-small-3" style="min-width: 160px;">{{ supplier.deliveryEstimate }}</p>
                      </div>
                      <div v-else-if="isDirect" class="col">
                        <h5 class="mb-50 pt-1 disabled-opacity">Este fornecedor não realiza entregas.</h5>
                      </div>
                      <div v-if="supplier.deliveryRoute && isDirect" class="col">
                        <h5 class="mb-50 pt-1 disabled-opacity">Rota</h5>
                        <p class="font-small-3" style="min-width: 160px;">{{ supplier.deliveryRoute }}</p>
                      </div>
                      <div class="col" v-if="isDirect">
                        <h5 class="mb-50 pt-1 disabled-opacity" v-if="supplier.lastDeliveryRate && supplier.deliveryEstimate">
                          Custo do frete
                        </h5>
                        <p class="font-small-3" style="min-width: 160px;" v-if="supplier.lastDeliveryRate && supplier.deliveryEstimate">
                          {{ supplier.lastDeliveryRate }}
                        </p>
                      </div>

                </div>
            </div>
          </div>

        </div>

        <VQuotationProductsReview
          v-if="!isDirect && loadedQuotation && quotationProducts && updated"
          :quotation="loadedQuotation"
          :products="quotationProducts"
          :blockEdit="true"
        />

        <VOrderProductsReview
          v-if="isDirect && loadedOrder && orderProducts && updated"
          :order="loadedOrder"
          :products="orderProducts"
          :blockEdit="true"
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
import VQuotationProductsReview from "@/resources/quotations/Components/VQuotationProductsReview";
import VOrderProductsReview from "@/resources/orders/components/VOrderProductsReview";
import VDropdownInfo from "@/resources/suppliers/components/VDropdownInfo";

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
      quotationId: undefined,
      orderId: undefined,
      loadedQuotation: undefined,
      total: undefined,
      updated: false,
      backLoading: false,
      isDirect: false,
      loadedOrder: undefined,
    };
  },

  created() {
    this.isLoading = true
    this.clearPagination()
    this.userSelectedPage(1)
    this.isDirect = this.$route.query.direct
    if(this.isDirect) {
      this.orderId = this.$route.params.quotationId
      this.getOrder({ id: this.orderId }).then(() => {
        this.loadedOrder = this.order
        this.getSupplierById(this.order.supplier_id)
        this.getValidOrderProductsByPageNumber({ id: this.orderId }).then(() => {
          this.updated = true
          this.isLoading = false
        })
      })
      this.getOrderTotal({ id: this.orderId }).then((total) => {
        this.total = total
      })
    } else {
      this.quotationId = this.$route.params.quotationId
      this.getQuotationWithPayments({ id: this.quotationId }).then(() => {
        this.loadedQuotation = this.quotation
        this.getSupplierById(this.quotation.supplierId)
      })
      this.getValidQuotationProductsByPageNumber({ id: this.quotationId }).then(() => {
        this.updated = true
        this.isLoading = false
      })
      this.getTotal({ id: this.quotationId }).then((total) => {
        this.total = total
      })
    }
  },

  watch: {
    currentPage(pageNumber) {
      this.userSelectedPage(pageNumber)
      this.updated = false
      if(this.isDirect) {
        this.getValidOrderProductsByPageNumber({ id: this.orderId }).then(() => {
          this.updated = true
        })
      } else {
        this.getValidQuotationProductsByPageNumber({ id: this.quotationId }).then(() => {
          this.updated = true
        })
      }
    },
  },

  computed: {
    ...mapState("quotations", ["quotation", "quotationProducts"]),
    ...mapState("quotes", ["quotes"]),
    ...mapState("pagination", ["totalPages", "totalCount"]),
    ...mapState("suppliers", ["supplier"]),
    ...mapState("orders", ["order", "orderProducts"]),
    currentPage: {
      get() {
        return this.$store.state.pagination.currentPage
      },
      set(value) {
        this.$store.dispatch("pagination/setCurrentPage", value)
      },
    },
    // paymentName() {
    //   if(this.quotation && this.quotation.paymentMethods && this.quotation.paymentMethods.length) {
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
    ...mapActions("pagination", ["userSelectedPage", "clearPagination"]),
    ...mapActions("suppliers", ["getSupplierById"]),
    ...mapActions("orders", [
      "getValidOrderProductsByPageNumber",
      "getOrder",
      "getOrderTotal"
    ]),
    cancelLink() {
      this.$router.push({ name: 'users.quotePanel',
                          params: { quoteId: this.quotation.quoteId },
                          query: { quotationId: this.quotationId } })
    },
    formattedDate(date) {
      var m = new Date(date)
      var dateString = m.getDate() +"/"+ (m.getMonth() + 1) + "/" + m.getFullYear() + " - " + m.getHours() + ":" + String(m.getMinutes()).padStart(2, "0")
      return dateString
    },
    backToQuotes(quotation){
      this.backLoading = true
      setTimeout(() => {
        this.backLoading = false
        if(this.$route.query.source == 'order-panel')
          location.href = `/pedidos-de-compra`
        else
          location.href =`/painel-de-cotacoes/${quotation.quoteId}?quotationId=${this.quotationId}`
      }, 300);
    }
  },
  components: {
    VDropdownInfo,
    VQuotationProductsReview,
    VOrderProductsReview
  },
  mixins: [priceFormatter]
};
</script>
