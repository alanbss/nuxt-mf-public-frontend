<template>
<div>
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
  <div
    class="p-1 position-fixed w-100 border-top-light"
    style="top: 120px; background: #0391D1; z-index: 990;"
    v-if="!mobileBrowser && quotation && quotation.status == 'Pedido de compra a confirmar' && !quotation.orderHasExpired"
  >
    <p class="float-left m-0 pr-2 text-white">
      <strong>Pedido de<br> compra recebido</strong><br>
    </p>
    <p class="float-left m-0 pl-2 pr-2 text-white" style="border-right: 1px solid white;">
      <strong class="font-small-2">Valor total</strong><br>
      <span class="d-block font-weight-bold font-medium-2">{{ formatPrice(total) }}</span>
    </p>
    <p class="float-left m-0 pl-3 pt-1 pr-2">
      <strong class="font-medium-3">Confirmar o pedido?</strong><br>
    </p>
    <p class="float-left m-0 pl-2">
      <button @click="accept(quotation.id)" type="button" class="btn text-bold-600 mr-2 animate__animated animate__heartBeat animate__infinite animate__slow" style="background-color: #FFFF00; width: 230px">
        <b-spinner v-if="acceptLoading" small/>
        <span v-else>
          Confirmar
        </span>
      </button>
      <vs-button
        type="line"
        color="#FFFFFF"
        style="padding-bottom: 2px;"
        @click="refuse(quotation.id)"
      >
        <b-spinner v-if="refuseLoading" small/>
        <span style="font-weight: bold;" v-else>
          Recusar
        </span>
      </vs-button>
    </p>
  </div>
  <div
    class="p-1 position-fixed w-100 border-top-light"
    style="top: 120px; background: #0391D1; z-index: 990;"
    v-if="!mobileBrowser && quotation && quotation.status == 'Pedido de compra confirmado'"
  >
    <p class="float-left m-0 pr-2 text-white">
      <strong>Pedido de<br> compra recebido</strong><br>
    </p>
    <p class="float-left m-0 pl-2 pr-2 text-white" style="border-right: 1px solid white;">
      <strong class="font-small-2">Valor total</strong><br>
      <span class="d-block font-weight-bold font-medium-2">{{ formatPrice(total) }}</span>
    </p>
    <p class="float-left m-0 pl-3 pr-2">
      <strong class="font-medium-3">Pedido confirmado</strong><br>
      <span>Informar outro setor?</span>
    </p>
    <p class="float-left m-0 pl-2">
      <button
        ref="share"
        type="button"
        class="btn btn-outline-primary px-1 text-bold-600 waves-effect waves-light rounded"
        style="background-color: #FFFF00; width: 230px"
        @click.prevent.stop="$refs.menu.open($event)"
      >
        <i class="feather icon-share-2"></i><span class="d-sm-inline d-none"> Compartilhar</span>
      </button>
    </p>
  </div>
  <div
    class="p-1 position-fixed w-100 border-top-light"
    style="top: 120px; background: #0391D1; z-index: 990;"
    v-if="!mobileBrowser && quotation && quotation.status == 'Pedido de compra recusado'"
  >
    <p class="float-left m-0 pr-2 text-white">
      <strong>Pedido de<br> compra recebido</strong><br>
    </p>
    <p class="float-left m-0 pl-2 pr-2 text-white" style="border-right: 1px solid white;">
      <strong class="font-small-2">Valor total</strong><br>
      <span class="d-block font-weight-bold font-medium-2">{{ formatPrice(total) }}</span>
    </p>
    <p class="float-left m-0 mt-1 pl-3 pr-2">
      <strong class="font-medium-3">Pedido recusado</strong><br>
    </p>
    <p class="float-left m-0 mt-1 pl-3">
      <vs-dropdown v-if="showJustification">
        <a class="a-icon text-white" href="#">
          <span class="d-md-inline d-none ml-25">Ver justificativa</span><i class="feather icon-chevron-down"></i>
        </a>

        <vs-dropdown-menu>
          <vs-dropdown-item style="color: black;">{{ showJustification }}</vs-dropdown-item>
        </vs-dropdown-menu>
      </vs-dropdown>
    </p>
  </div>
  <div
    class="p-1 position-fixed w-100 border-top-light"
    style="top: 120px; background: #0391D1; z-index: 990;"
    v-if="mobileBrowser && quotation && quotation.status == 'Pedido de compra a confirmar' && !quotation.orderHasExpired"
  >
    <p class="float-left m-0 pr-1 text-white font-small-2">
      <strong>Pedido recebido</strong><br>
      <strong class="font-small-2">Valor total</strong><br>
      <span class="d-block font-weight-bold font-small-3">{{ formatPrice(total) }}</span>
    </p>
    <p class="float-left m-0 pl-1 pr-2">
      <strong class="font-medium-1">Confirmar o pedido?</strong><br>
      <button @click="accept(quotation.id)"
        type="button"
        class="btn text-bold-600 mr-1 animate__animated animate__pulse animate__infinite"
        style="background-color: #FFFF00; padding: 8px;"
      >
        <b-spinner v-if="acceptLoading" small/>
        <span v-else>
          Confirmar
        </span>
      </button>
      <vs-button
        type="line"
        color="#FFFFFF"
        style="padding-bottom: 2px;"
        @click="refuse(quotation.id)"
      >
        <b-spinner v-if="refuseLoading" small/>
        <span style="font-weight: bold;" v-else>
          Recusar
        </span>
      </vs-button>
    </p>
  </div>
  <div
    class="p-1 position-fixed w-100 border-top-light"
    style="top: 120px; background: #0391D1; z-index: 990;"
    v-if="mobileBrowser && quotation && quotation.status == 'Pedido de compra confirmado'"
  >
    <p class="float-left m-0 pr-1 text-white font-small-2">
      <strong>Pedido recebido</strong><br>
      <strong class="font-small-2">Valor total</strong><br>
      <span class="d-block font-weight-bold font-small-3">{{ formatPrice(total) }}</span>
    </p>
    <p class="float-left m-0 pt-1">
      <strong class="font-medium-1">Pedido confirmado</strong><br>
      <span class="font-small-3">Informar outro setor?</span>
    </p>
    <p class="float-left m-0 pl-1 pt-1">
      <button
        ref="share"
        type="button"
        class="btn btn-outline-primary px-1 text-bold-600 waves-effect waves-light rounded"
        style="background-color: #FFFF00;"
        @click.prevent.stop="$refs.menu.open($event)"
      >
        <i class="feather icon-share-2"></i><span class="d-sm-inline d-none"> Compartilhar</span>
      </button>
    </p>
  </div>
  <div
    class="p-1 position-fixed w-100 border-top-light"
    style="top: 120px; background: #0391D1; z-index: 990;"
    v-if="mobileBrowser && quotation && quotation.status == 'Pedido de compra recusado'"
  >
    <p class="float-left m-0 pr-1 text-white font-small-2">
      <strong>Pedido recebido</strong><br>
      <strong class="font-small-2">Valor total</strong><br>
      <span class="d-block font-weight-bold font-small-3">{{ formatPrice(total) }}</span>
    </p>
    <p class="float-left m-0 pl-2">
      <strong class="font-medium-2">Pedido recusado</strong><br>

      <vs-dropdown v-if="showJustification">
        <a class="a-icon text-white" href="#">
          <p></p>
          <span class="ml-25">Ver justificativa</span><i class="feather icon-chevron-down"></i>
        </a>

        <vs-dropdown-menu>
          <vs-dropdown-item v-if="showJustification" style="color: black;">{{ showJustification }}</vs-dropdown-item>
        </vs-dropdown-menu>
      </vs-dropdown>
    </p>
  </div>
  <refuse-order-modal
    :openPopup="openRefuse"
    :quotationId="Number(quotationId)"
    :quotation="quotation"
    @supplier-refused-order="updateQuotation"
    @update-popup="updateRefusePopup"/>
  <accept-order-modal
    :openPopup="openAccept"
    :quotationId="Number(quotationId)"
    :quotation="quotation"
    :configuration="configuration"
    @supplier-accepted-order="updateQuotation"
    @update-popup="updateAcceptPopup"/>
  <!-- <div class="card shadow-sm m-1">
      <div class="card-body justify-content-start">
          <div class="avatar bg-rgba-success p-50 m-0 mr-2 mb-50 float-left" style="cursor: default;">
              <div class="avatar-content">
                  <i class="feather icon-check text-success font-medium-5"></i>
              </div>
          </div>
          <div class="ml-2">
              <h4 class="card-title color-mf-verde">Pedido de compra recebido!</h4>
              <p class="my-25">
                  Este cliente já está aguardando por seu atendimento.<br>
                  <button @click="openOrder(quotation.id)" class="btn btn-primary px-1 text-bold-600 waves-effect waves-light mt-75" style="width: 145px">
                    <b-spinner v-if="orderLoading" small/>
                    <span v-else>Ver os produtos</span>
                  </button>
              </p>
          </div>
      </div>
  </div> -->
  <div class="card shadow-sm m-1">
    <div class="card-body">
      <div class="row">
        <div class="col-md-4 col-6">
            <p class="font-weight-bold text-uppercase font-small-2">Dados</p>
            <p class="mb-0 font-small-3">
                <span class="d-block">{{ client.user.name }}</span>
                <span class="d-block">{{ client.user.cnpj }}</span>
            </p>
        </div>
        <div class="col-md-4 col-6">
            <p class="font-weight-bold text-uppercase font-small-2">Endereço</p>
            <p class="mb-0 font-small-3">
                {{ client.user.street }}<br>
                {{ client.user.neighborhood }} - {{ client.user.city }} / {{ client.user.stateUf }}<br>
                {{ client.user.zipcode }}
            </p>
        </div>
        <div class="col-md-4">
            <p class="font-weight-bold text-uppercase font-small-2">Contato</p>
            <p class="mb-0 font-small-3">
              <span class="d-block"><i class="fa fa-phone mr-50 text-primary"></i> {{ client.user.phone }}</span>
              <span class="d-block"><i class="fa fa-envelope-o mr-50 text-primary"></i> {{ client.user.email }}</span>
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

  <!-- <div class="card shadow-sm border-light m-1">
      <div class="card-body p-1">
          <div class="row">
              <div class="col-4">
                  <div class="btn-group dropup">
                      <button
                        ref="share"
                        type="button"
                        class="btn btn-outline-primary px-1 text-bold-600 waves-effect waves-light rounded"
                        @click.prevent.stop="$refs.menu.open($event)"
                      >
                        <i class="feather icon-share-2"></i><span class="ml-50 d-sm-inline d-none"> Compartilhar</span>
                      </button>
                  </div>
              </div>
              <div class="col-8 text-right">
                <div class="d-flex flex-row-reverse" style="margin-top: 8px;">
                  <label :class="isBold" for="">Pedido encaminhado</label>
                  <vs-switch color="dark" @click="clickDispatch()" v-model="dispatched" style="margin-right: 8px;"/>
                </div>
              </div>
          </div>
      </div>
  </div> -->
  <div class="card shadow-sm border-light m-1">
    <div class="card-body p-1">
      <VOrderProductsReview
        v-if="quotationProducts && quotationProducts.length"
        ref="reviewProducts"
        :quotation="quotation"
        :products="quotationProducts"
      />
    </div>
  </div>
  <vue-context ref="menu" style="z-index: 10000;">
    <li>
      <a @click.prevent="shareOnWhatsapp()">
        <i class="fa fa-whatsapp font-medium-2 mr-50"></i> Mandar p/ WhatsApp
      </a>
    </li>
    <li>
      <a @click.prevent="shareCopyLink()">
        <i class="feather icon-link font-medium-2 mr-50"></i> Copiar o link
      </a>
    </li>
  </vue-context>
</div>
</template>

<script>
//import { mapActions, mapGetters } from "vuex";
import { mapActions, mapState } from "vuex";
import priceFormatter from "@/mixins/priceFormatter";
import AcceptOrderModal from "@/resources/suppliers/components/AcceptOrderModal";
import RefuseOrderModal from "@/resources/suppliers/components/RefuseOrderModal";
import VOrderProductsReview from "@/resources/quotations/Components/VOrderProductsReview";

import VueContext from 'vue-context';
import 'vue-context/dist/css/vue-context.css';

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
      total: undefined,
      dispatched: false,
      shareLink: undefined,
      orderLoading: false,
      refuseLoading: false,
      acceptLoading: false,
      openRefuse: false,
      openAccept: false,
      isLoading: false,
      quotationId: 0,
      showJustification: null,
    }
  },
  created() {
    this.quotationId = this.quotation.id
    this.clearQuotationProducts()
  },
  mounted() {
    this.isLoading = true
    this.getConfiguration()
    this.clearPagination()
    this.userSelectedPage(1)
    this.clearQuotationProducts()
    this.getValidQuotationProductsByPageNumberInfiniteScroll({ id: this.quotationId }).then(() => {
      this.isLoading = false
      this.$emit('loadedProducts')
    })
    this.dispatched = this.quotation.dispatched
    this.getTotal({ id: this.quotation.id }).then((total) => {
      this.total = total
    })
    this.shareLink = window.location.host + '/pedido/' + this.quotation.id
  },
  updated() {
    if(this.quotation && this.quotation.refuseJustification) {
      this.showJustification = this.quotation.refuseJustification
    } else if(this.quotation && this.quotation.refuse_justification) {
      this.showJustification = this.quotation.refuse_justification
    }
  },
  watch: {
    currentPage(pageNumber) {
      this.isLoading = true
      this.userSelectedPage(pageNumber)
      this.updated = false
      this.getValidQuotationProductsByPageNumberInfiniteScroll({ id: this.quotationId }).then(() => {
        this.updated = true
        this.isLoading = false
        this.$refs.reviewProducts.updateData()
        this.$emit('loadedProducts')
      })
    },
  },
  computed: {
    //...mapGetters("users/products", ["productIsOnList", "productIsOnCart", "productCartIsEmpty"]),
    ...mapState("users/products", ["productQuoteCart"]),
    ...mapState("suppliers/configurations", ["configuration"]),
    ...mapState("pagination", ["totalPages", "totalCount"]),
    ...mapState("quotations", ["quotationProducts"]),
    isBold() {
      if(this.dispatched)
        return "font-weight-bold"
      else
        return ""
    },
    currentPage: {
      get() {
        return this.$store.state.pagination.currentPage
      },
      set(value) {
        this.$store.dispatch("pagination/setCurrentPage", value)
      },
    },
  },
  methods: {
    ...mapActions("quotes", [
      "createQuote"
    ]),
    ...mapActions("quotations", [
      "getTotal",
      "dispatchQuotation",
      "getValidQuotationProductsByPageNumberInfiniteScroll",
      "clearQuotationProducts"
    ]),
    ...mapActions("suppliers", [
      "toggleDispatch"
    ]),
    ...mapActions("suppliers/configurations", [
      "getConfiguration"
    ]),
    ...mapActions("pagination", ["userSelectedPage", "clearPagination"]),
    shareOnWhatsapp() {
      var url = "https://api.whatsapp.com/send?text=" +
                "Pedido+de+compra+recebido+%0D%0ACliente%3A+" +
                this.quotation.clientName +
                "+%0D%0AEm%3A+" +
                this.formattedDate(this.quotation.updatedAt) +
                "+%0D%0ALink+para+o+pedido+%0D%0A" +
                this.shareLink
      window.open(url, '_blank')
    },
    shareCopyLink() {
      this.$copyText(this.shareLink).then(() => {
        this.notifyInfo("Copiado para a área de transferência", "");
      })
    },
    clickDispatch() {
      this.dispatchQuotation(this.quotation.id)
      this.toggleDispatch(this.quotation)
    },
    formattedDate(date) {
      var m = new Date(date)
      var dateString = m.getDate() +"/"+ (m.getMonth() + 1) + "/" + m.getFullYear() + " - " + m.getHours() + ":" + String(m.getMinutes()).padStart(2, "0")
      return dateString
    },
    openOrder(quotationId) {
      this.orderLoading = true
      setTimeout(() => {
        this.orderLoading = false
          location.href = `/pedido/${quotationId}`
      }, 300);
    },
    refuse(quotationId) {
      this.refuseLoading = true
      setTimeout(() => {
        this.refuseLoading = false
        this.quotationId = quotationId
        this.openRefuse = true
      }, 300);
    },
    accept(quotationId) {
      this.acceptLoading = true
      setTimeout(() => {
        this.acceptLoading = false
        this.quotationId = quotationId
        this.openAccept = true
      }, 300);
    },
    updateRefusePopup(value) {
      this.openRefuse = value
    },
    updateAcceptPopup(value) {
      this.openAccept = value
    },
    updateQuotation(quotationId) {
      this.$emit('update-quotation', quotationId)
    }
  },
  props: {
    quotation: {
      type: Object,
      required: true
    },
    client: {
      type: Object,
      required: true
    },
    mobileBrowser: {
      type: Boolean
    }
  },
  components: {
    VueContext,
    RefuseOrderModal,
    AcceptOrderModal,
    VOrderProductsReview
  },
  mixins: [priceFormatter]
};
</script>
