<template>

  <div class="content-wrapper p-0" style="margin-top: 4.50rem;">
      <div class="content-body">
          <div class="row mx-md-0" style="height: calc(100vh - 5rem); overflow: hidden;">
              <div class="col-md-3 p-0" style="border-right: solid 1px #D5D5D5;" v-if="showScreen('menu')">
                  <div class="p-1" style="background: #EDEDED;">
                      <ul class="nav nav-tabs nav-fill m-0" role="tablist">
                          <li class="nav-item">
                            <a :class="allTab" @click="selectTab('all')" role="tab" aria-selected="true">Tudo</a>
                          </li>
                          <li class="nav-item">
                            <a :class="quotationsTab" @click="selectTab('quotations')" role="tab" aria-selected="false">Cotações</a>
                          </li>
                          <li class="nav-item">
                            <a :class="ordersTab" @click="selectTab('orders')" role="tab" aria-selected="false">Pedidos</a>
                          </li>
                      </ul>
                  </div>

                  <div class="tab-content vh-100 overflow-auto">
                    <div class="tab-pane active" id="home" aria-labelledby="home-tab" role="tabpanel">
                      <ul class="list-group list-group-flush font-small-3 shadow-sm">
                        <span
                          v-for="quotation in allIncoming"
                          :key="quotation.id"
                        >
                          <li
                            v-if="printItem(quotation)"
                            class="list-group-item"
                          >
                            <a
                              v-if="quotation.status == 'Aceita' && justQuotations"
                              href="javascript:void(0);"
                              @click="selectQuotation(quotation)"
                              class="d-block text-dark"
                            >
                              <span class="float-right font-small-1">
                                {{ formattedDate(quotation.updatedAt) }}
                              </span>
                              <span>{{ quotation.clientName }}</span>
                              <span class="font-small-2 d-block mt-25" style="color: gray;">Cotação respondida</span>
                            </a>
                            <a
                              v-if="quotation.status == 'Pendente' && !quotation.hasExpired && justQuotations"
                              href="javascript:void(0);"
                              @click="selectQuotation(quotation)"
                              class="d-block text-dark"
                            >
                              <span class="float-right text-body font-small-1">
                                {{ formattedDate(quotation.updatedAt) }}
                                <span v-if="!quotation.read" class="d-block badge badge-success font-small-2 mt-25">Nova</span>
                              </span>
                              <strong>{{ quotation.clientName }}</strong>
                              <span class="font-small-2 d-block mt-25 font-weight-bold" style="color: d11b6d;">
                                Você tem {{ remainingTime(quotation.remainingTime) }} para responder
                              </span>
                            </a>
                            <a
                              v-if="quotation.status == 'Pendente' && quotation.hasExpired && justQuotations"
                              href="javascript:void(0);"
                              @click="selectQuotation(quotation)"
                              class="d-block text-dark disabled-opacity"
                            >
                              <span class="float-right text-body font-small-1">
                                {{ formattedDate(quotation.updatedAt) }}
                              </span>
                              <strong>{{ quotation.clientName }}</strong>
                              <span class="font-small-2 d-block mt-25">Expirada</span>
                            </a>
                            <a
                              v-if="quotation.status == 'Recusada' && justQuotations"
                              href="javascript:void(0);"
                              @click="selectQuotation(quotation)"
                              class="d-block text-dark disabled-opacity"
                            >
                              <span class="float-right font-small-1">
                                {{ formattedDate(quotation.updatedAt) }}
                              </span>
                              <span>{{ quotation.clientName }}</span>
                              <span class="font-small-2 d-block mt-25">Cotação recusada por você</span>
                            </a>
                            <a
                              v-if="quotation.status == 'Pedido de compra a confirmar' && justOrders"
                              href="javascript:void(0);"
                              @click="selectQuotation(quotation)"
                              class="d-block text-dark"
                            >
                              <span class="float-right font-small-1">
                                {{ formattedDate(quotation.updatedAt) }}
                                <span v-if="!quotation.read" class="d-block badge badge-warning font-small-2 mt-25">Novo</span>
                              </span>
                              <strong>{{ quotation.clientName }}</strong>
                              <span class="font-small-2 d-block mt-25 color-mf-laranja font-weight-bold">Pedido de compra</span>
                            </a>
                            <a
                              v-if="quotation.status == 'Pedido de compra confirmado' && justOrders"
                              href="javascript:void(0);"
                              @click="selectQuotation(quotation)"
                              class="d-block text-dark"
                            >
                              <span class="float-right font-small-1">
                                {{ formattedDate(quotation.updatedAt) }}
                                <span v-if="!quotation.read" class="d-block badge badge-warning font-small-2 mt-25">Novo</span>
                              </span>
                              <strong>{{ quotation.clientName }}</strong>
                              <span class="d-block mt-25">
                                <span class="font-small-2 color-mf-laranja font-weight-bold">Pedido</span>
                                <span class="badge badge-pill text-white bg-mf-laranja" style="margin-left: 5px; font-weight: bold;">Confirmado</span>
                              </span>
                            </a>
                            <a
                              v-if="quotation.status == 'Pedido de compra recusado' && justOrders"
                              href="javascript:void(0);"
                              @click="selectQuotation(quotation)"
                              class="d-block text-dark"
                            >
                              <span class="float-right font-small-1">
                                {{ formattedDate(quotation.updatedAt) }}
                                <span v-if="!quotation.read" class="d-block badge badge-warning font-small-2 mt-25">Novo</span>
                              </span>
                              <strong>{{ quotation.clientName }}</strong>
                              <span class="d-block mt-25">
                                <span class="font-small-2 color-mf-laranja font-weight-bold">Pedido</span>
                                <span class="badge badge-pill badge-danger" style="margin-left: 5px; font-weight: bold;">Recusado</span>
                              </span>
                            </a>
                          </li>
                        </span>
                      </ul>
                      <div class="p-2" v-if="supplierQuotations.length == 0 && justQuotations && justOrders">
                        <h6 style="color: #f57f17;">No momento não há demanda para você</h6>
                        <p>Vamos avisar você neste email ({{ this.user.email }}) assim que algum cliente solicitar</p>
                      </div>
                      <div class="p-2" v-if="quotationsCount == 0 && justQuotations && !justOrders">
                        <h6 style="color: #f57f17;">No momento não há cotações para você</h6>
                        <p>Vamos avisar você neste email ({{ this.user.email }}) assim que algum cliente solicitar</p>
                      </div>
                      <div class="p-2" v-if="ordersCount == 0 && justOrders && !justQuotations">
                        <h6 style="color: #f57f17;">No momento não há pedidos para você</h6>
                        <p>Vamos avisar você neste email ({{ this.user.email }}) assim que algum cliente solicitar</p>
                      </div>
                      <div
                        class="position-fixed border-top-light"
                        :style="mobileBrowser ? 'bottom: 0; margin-bottom: 8px; width: 100%;' : 'bottom: 0; margin-bottom: 8px; width: 25%;'"
                      >
                        <div class="card shadow-sm" style="background-color: #0cb695; margin: 5px 10px 0px 10px;">
                          <vs-row vs-w="12">
                            <vs-col vs-type="flex" vs-w="7">
                              <h6 style="font-weight: bolder; color: white; margin: 10px 0 10px 10px;">Enviar o catálogo para os seus clientes</h6>
                            </vs-col>
                            <vs-col vs-type="flex" vs-w="5" vs-align="center" vs-justify="flex-end" >
                              <button
                                type="button"
                                @click.prevent.stop="$refs.menu.open($event)"
                                class="btn waves-effect waves-light bg-white animate__animated animate__heartBeat"
                                style="padding-left: 5px; padding-right: 5px; margin-top: 8px; margin-bottom: 8px; margin-right: 10px; width: 100%; font-size: small;">
                                <i class="fa fa-whatsapp" style="color: #34af23;" aria-hidden="true"></i> Compartilhar
                              </button>
                            </vs-col>
                          </vs-row>
                        </div>
                      </div>
                    </div>
                    <vue-context ref="menu">
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
                    <div style="margin-bottom: 14rem;"></div>
                  </div>
              </div>
              <div class="col-md-9 p-0" style="background: #E5DDD5;" v-if="showScreen('panel')">
                <div class="p-2" style="background: #EDEDED; border-bottom: solid 1px #D5D5D5;">
                   <a href="javascript:void(0);" @click="currentScreen = 'menu';returnScrollPosition()" title="Voltar" class="d-md-none">
                    <i class="feather icon-arrow-left mr-1 mt-n25 float-left font-large-1"></i>
                  </a>
                  <h6 class="m-0 font-weight-bold" v-if="selectedClient">{{ selectedClient.user.name }}</h6>
                </div>

                <div
                  class="p-1 position-fixed w-100 border-top-light"
                  style="top: 120px; background: #fff200; z-index: 9999;"
                  v-if="selectedQuotation && selectedQuotation.status == 'Pendente' && !selectedQuotation.hasExpired"
                >
                  <p class="float-left m-0">
                    <button
                      type="button"
                      class="btn btn-outline-danger waves-effect waves-light bg-white text-bold-600"
                      id="recusar-alert"
                      @click="refuse(selectedQuotation.id)"
                      style="width: 150px; margin-right: 10px;"
                    >
                      <b-spinner v-if="refuseLoading" small/>
                      <span v-else>
                        <i class="feather icon-thumbs-down mr-50"></i> Recusar
                      </span>
                    </button>
                    <button @click="answerQuotation()" type="button" class="animate__animated animate__heartBeat animate__infinite animate__slow btn btn-primary text-bold-600 mr-2" style="width: 150px; padding-right: 5px; padding-left: 5px;">
                      <b-spinner v-if="acceptLoading" small/>
                      <span v-else>
                        <i class="feather icon-thumbs-up mr-50"></i> Precificar
                      </span>
                    </button>
                  </p>
                  <p class="float-left m-0">
                    <strong>Responda a cotação desse cliente</strong><br>
                    <span class="d-block mt-50 mt-md-0"><i class="feather icon-clock font-weight-bold"></i> Ela expira em {{ remainingTime(selectedQuotation.remainingTime) }}</span>
                  </p>
                  <refuse-quotation-modal
                    :openPopup="openRefuse"
                    :quotationId="quotationId"
                    @supplier-refused="updateQuotation"
                    @update-popup="updateRefusePopup"/>
                </div>

                <div class="vh-100 overflow-auto" ref="productsWindow" v-if="ready">

                  <div v-if="selectedQuotation && (selectedQuotation.status == 'Pendente' || selectedQuotation.status == 'Recusada')">
                    <div v-if="selectedQuotation.status == 'Pendente'" :style="mobileBrowser ? 'margin-top: 130px;' : 'margin-top: 80px;'"></div>
                    <VQuotationPanelClient v-bind:client="selectedClient" v-if="selectedClient" />
                    <VQuotationPanelProducts v-bind:products="quotationProducts" v-if="quotationProducts" />
                  </div>
                  <div ref="content" v-if="selectedQuotation && (!selectedQuotation.orderType && selectedQuotation.status == 'Pedido de compra a confirmar' || selectedQuotation.status == 'Pedido de compra confirmado' || selectedQuotation.status == 'Pedido de compra recusado')">
                    <div :style="mobileBrowser ? 'margin-top: 130px;' : 'margin-top: 80px;'"></div>
                    <VQuotationPanelOC
                      v-bind:quotation="selectedQuotation"
                      v-bind:client="selectedClient"
                      v-bind:mobileBrowser="mobileBrowser"
                      @loadedProducts="productsLoaded = true"
                      @update-quotation="updateQuotation"
                      v-if="quotationProducts && selectedClient && selectedQuotation.orderType != 'Direta'" />
                  </div>
                  <div ref="content" v-if="selectedQuotation && (selectedQuotation.orderType == 'Direta' && selectedQuotation.status == 'Pedido de compra a confirmar' || selectedQuotation.status == 'Pedido de compra confirmado' || selectedQuotation.status == 'Pedido de compra recusado')">
                    <div :style="mobileBrowser ? 'margin-top: 130px;' : 'margin-top: 80px;'"></div>
                    <VQuotationPanelDirectOrder
                      v-bind:quotation="selectedQuotation"
                      v-bind:client="selectedClient"
                      v-bind:mobileBrowser="mobileBrowser"
                      @loadedProducts="productsLoaded = true"
                      @update-quotation="updateOrder"
                      v-if="quotationProducts && selectedClient && selectedQuotation.orderType == 'Direta'" />
                  </div>
                  <VQuotationPanelAnswered v-if="selectedQuotation && selectedQuotation.status == 'Aceita'" :quotation="selectedQuotation" />

                  <div class="card shadow-sm m-1" v-if="selectedQuotation && selectedQuotation.status == 'Recusada'">
                    <div class="card-body">
                      <i class="feather icon-thumbs-down mr-2 float-left my-50 font-large-1"></i>
                      <p class="mb-25 font-weight-bold text-danger">Voce optou por recusar atender esta cotação</p>
                      <p class="mb-0">A ação não pode ser desfeita</p>
                    </div>
                  </div>

                  <div v-if="!selectedQuotation" class="row d-flex justify-content-center">
                    <div style="margin-top: 80px;">
                      <div class="row d-flex">
                        <h3 class="font-weight-bold mt-1 mb-1" style="color: #f57f17;">
                          Clique no menu ao lado para ver as<br>
                          demandas que chegam para você
                        </h3>
                      </div>
                      <div class="row d-flex">
                        <p class="mb-1">
                          Cotações<br>
                          É preciso preencher todos os preços dos produtos solicitados (ou os colocar como "indisponível")
                        </p>
                      </div>
                      <div class="row d-flex">
                        <p class="m-0">
                          Pedidos<br>
                          Procure sempre agilizar quando receber um pedido de compra, pois seu cliente já estará aguardando seu atendimento
                        </p>
                      </div>
                    </div>
                  </div>

                  <div style="margin-bottom: 14rem;"></div>
                </div>
              </div>
          </div>
      </div>
  </div>

</template>

<script>
import { mapState, mapActions } from "vuex";
import VQuotationPanelProducts from "@/resources/quotations/Components/VQuotationPanelProducts";
import VQuotationPanelClient from "@/resources/quotations/Components/VQuotationPanelClient";
import VQuotationPanelAnswered from "@/resources/quotations/Components/VQuotationPanelAnswered";
import VQuotationPanelOC from "@/resources/quotations/Components/VQuotationPanelOC";
import VQuotationPanelDirectOrder from "@/resources/quotations/Components/VQuotationPanelDirectOrder";
import RefuseQuotationModal from "@/resources/suppliers/components/RefuseQuotationModal";
import timeFormatter from "@/mixins/timeFormatter";

import VueContext from 'vue-context';
import 'vue-context/dist/css/vue-context.css';

export default {
  data() {
    return {
      selectedQuotation: undefined,
      selectedClient: undefined,
      justQuotations: true,
      justOrders: true,
      openRefuse: false,
      quotationId: 0,
      user: {},
      shareLink: undefined,
      mobileBrowser: false,
      currentScreen: undefined,
      scrollLocation: undefined,
      acceptLoading: false,
      refuseLoading: false,
      productsLoaded: false,
      ready: false,
      allIncoming: [],
    };
  },

  created() {
    if(this.$auth.user().supplierStatus == 'Precificação')
      this.$router.push({ name: "pricing" })
    this.isMobile()
    this.currentScreen = 'menu'
    this.getQuotationsBySupplier().then(() => {
      if(this.$route.query.quotationId)
        this.findAndSelect(this.$route.query.quotationId)
      this.getSupplierDirectOrders().then(() => {
        this.allIncoming = this.supplierQuotations.concat(this.directOrders)
        if(this.allIncoming.length > 1) {
          this.allIncoming = this.allIncoming.sort((a, b) => {
            if (a.updatedAt < b.updatedAt)
              return 1
            if (a.updatedAt > b.updatedAt)
              return -1
            return 0
          })
        }
      })
    })
    this.getSupplier().then(() => {
      this.shareLink = window.location.origin + '/' + this.supplier.nameForUrl
    })
    this.user = JSON.parse(JSON.stringify(this.$auth.user()))
  },

  computed: {
    ...mapState("quotations", ["quotation", "quotationProducts"]),
    ...mapState("suppliers", ["supplier", "supplierQuotations"]),
    ...mapState("clients", ["client"]),
    ...mapState("pagination", ["totalPages"]),
    ...mapState("orders", ["directOrders", "order"]),
    currentPage: {
      get() {
        return this.$store.state.pagination.currentPage;
      },
      set(value) {
        this.$store.dispatch("pagination/setCurrentPage", value);
      },
    },
    headerStyle() {
      if(this.selectedQuotation && this.selectedQuotation.status == 'Pendente')
        return "background: #EDEDED; border-bottom: solid 1px #D5D5D5; margin-top: 80px;"
      else
        return "background: #EDEDED; border-bottom: solid 1px #D5D5D5;"
    },
    allTab() {
      if(this.justQuotations && this.justOrders)
        return "nav-link pt-25 active"
      else
        return "nav-link pt-25"
    },
    quotationsTab() {
      if(this.justQuotations && !this.justOrders)
        return "nav-link pt-25 active"
      else
        return "nav-link pt-25"
    },
    ordersTab() {
      if(!this.justQuotations && this.justOrders)
        return "nav-link pt-25 active"
      else
        return "nav-link pt-25"
    },
    quotationsCount() {
      let quotations = this.supplierQuotations.filter(quotation => (quotation.status != 'Pedido de compra a confirmar' && quotation.status != 'Pedido de compra confirmado' && quotation.status != 'Pedido de compra recusado'))
      return quotations.length
    },
    ordersCount() {
      let orders = this.supplierQuotations.filter(quotation => (quotation.status == 'Pedido de compra a confirmar' || quotation.status == 'Pedido de compra confirmado' || quotation.status == 'Pedido de compra recusado'))
      return orders.length
    },
  },
  watch: {
    selectedQuotation(newVal) {
      if((newVal.status == 'Pedido de compra a confirmar' || newVal.status == 'Pedido de compra confirmado' || newVal.status == 'Pedido de compra recusado')) {
        setTimeout(() => {
          this.scroll()
        }, 500)
      }
    }
  },
  methods: {
    ...mapActions("quotations", [
      "getQuotationProducts",
      "refuseQuotation",
      "readQuotation"
    ]),
    ...mapActions("orders", [
      "getSupplierDirectOrders",
      "updateDirectOrders",
      "readOrder"
    ]),
    ...mapActions("suppliers", [
      "getQuotationsBySupplier",
      "updateSupplierQuotation",
      "markQuotationAsRead",
      "getSupplier"
    ]),
    ...mapActions("clients", ["getClient"]),
    formattedDate(date) {
      var m = new Date(date)
      var dateString = m.getDate() +"/"+ (m.getMonth() + 1) + "/" + m.getFullYear()
      return dateString
    },
    selectQuotation(quotation) {
      this.ready = false
      this.scrollLocation = document.querySelector('.tab-content').scrollTop
      this.selectedQuotation = quotation
      this.getQuotationProducts(quotation).then(() => {
        this.getClient(quotation.clientId).then(() => {
          this.selectedClient = this.client
          this.ready = true
        })
      })
      if(!quotation.read && (quotation.status == 'Pedido de compra a confirmar' || quotation.status == 'Pendente')) {
        if(quotation.orderType && quotation.orderType == 'Direta')
          this.readOrder(quotation.id)
        else
          this.readQuotation(quotation.id)
        this.markQuotationAsRead(quotation)
      }
      this.currentScreen = 'panel'
    },
    updateRefusePopup(value) {
      this.openRefuse = value
    },
    refuse(quotationId) {
      this.refuseLoading = true
      setTimeout(() => {
        this.refuseLoading = false
        this.quotationId = quotationId
        this.openRefuse = true
      }, 300);
    },
    updateQuotation(quotationId) {
      this.selectedQuotation = this.quotation
      this.updateSupplierQuotation(this.quotation)
    },
    updateOrder(orderId) {
      this.selectedQuotation = this.order
      this.updateDirectOrders(this.order)
    },
    answerQuotation() {
      this.acceptLoading = true
      setTimeout(() => {
          this.acceptLoading = false
          this.$router.push({ name: 'reply-quotation', params: { quotationId: this.selectedQuotation.id } })
      }, 300);
    },
    selectTab(tab) {
      switch(tab) {
        case 'all':
          this.justQuotations = true
          this.justOrders = true
          break
        case 'quotations':
          this.justQuotations = true
          this.justOrders = false
          break
        case 'orders':
          this.justQuotations = false
          this.justOrders = true
          break
      }
    },
    printItem(quotation) {
      if((quotation.status=='Pedido de compra a confirmar' || quotation.status=='Pedido de compra confirmado' || quotation.status=='Pedido de compra recusado') && !this.justQuotations && this.justOrders)
        return true
      else if((quotation.status!='Pedido de compra a confirmar' && quotation.status!='Pedido de compra confirmado' && quotation.status!='Pedido de compra recusado') && this.justQuotations && !this.justOrders)
        return true
      else if(this.justQuotations && this.justOrders)
        return true
      else
        return false
    },
    findAndSelect(quotationId) {
      var quotation = this.supplierQuotations.find(quotation => quotation.id == quotationId)
      if(quotation)
        this.selectQuotation(quotation)
    },
    shareOnWhatsapp() {
      var url = "https://api.whatsapp.com/send?text=" +
                'Precisando+cotar%3F%0D%0A' +
                'Veja+todos+os+produtos+da+' +
                 this.supplier.user.name.replace("&", "e")+
                '+na+plataforma+Meu+Fornecedor%0A' +
                'Monte+sua+cota%C3%A7%C3%A3o+e+receba+os+pre%C3%A7os%21%0D%0AAcesse+gr%C3%A1tis%3A%0A' +
                this.shareLink
      window.open(url, '_blank')
    },
    shareCopyLink() {
      this.$copyText(this.shareLink).then(() => {
        this.notifyInfo("Copiado para a área de transferência", "");
      })
    },
    isMobile() {
      if (screen.width <= 760 || window.innerWidth <= 760) {
        this.mobileBrowser = true
      } else {
        this.mobileBrowser = false
      }
    },
    showScreen(name){
      if(this.mobileBrowser && this.currentScreen == name) {
        return true
      } else if(!this.mobileBrowser) {
        return true
      } else {
        return false
      }
    },
    returnScrollPosition(){
      this.$nextTick(()=> {
        const el = document.querySelector('.tab-content')
        el.scrollTop = this.scrollLocation
        }
      )
    },
    scroll() {
      this.$refs['productsWindow'].onscroll = () => {
        if(this.$refs['productsWindow'] && this.$refs['content']) {
          let bottomOfWindow = this.$refs['productsWindow'].scrollTop + this.$refs['productsWindow'].offsetHeight > (this.$refs['content'].offsetHeight - 20)
          if(bottomOfWindow && !this.isLoading) {
            // var elem = this.loadProductTypes[this.totalRendered]
            if(this.currentPage < (this.totalPages) && this.productsLoaded) {
              this.productsLoaded = false
              this.currentPage++
            }

          }
        }
      }
    },
  },
  components: {
    VQuotationPanelProducts,
    VQuotationPanelClient,
    VQuotationPanelAnswered,
    VQuotationPanelOC,
    VQuotationPanelDirectOrder,
    RefuseQuotationModal,
    VueContext
  },
  mixins: [timeFormatter]
};
</script>
