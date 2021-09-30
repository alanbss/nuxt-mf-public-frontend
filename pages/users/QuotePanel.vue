<template>
  <div class="content-wrapper p-0" style="margin-top: 0;">
    <div class="content-body">
      <div class="row mx-md-0" style="height: calc(100vh - 0.5rem); overflow: hidden;">
        <div class="col-md-2 p-0" style="border-right: solid 1px #D5D5D5;" v-if="showScreen('menu')">
          <div class="py-1 px-2 clearfix" style="background: #EDEDED; border-top: solid 1px transparent; border-bottom: solid 1px #D5D5D5">
            <span class="text-danger font-weight-bold float-right" data-toggle="tooltip" data-placement="bottom" title="Expira em">
              <i class="feather icon-clock"></i>
              <span v-if="quotes.quotations && quotes.quotations.length && !quotes.quotations[0].hasExpired">
                <vs-tooltip :text="remainingTimeTooltip(remainingTime(quotes.quotations[0].remainingTime))" class="float-right" position="bottom">
                  <span>{{ remainingTime(quotes.quotations[0].remainingTime) }}</span>
                  <span>&nbsp;</span>
                </vs-tooltip>
              </span>
              <span v-else>
                Expirada
              </span>
            </span>
            <button title="Voltar" class='btn btn-link' @click="toMyQuotation()" style="padding: 0px">
              <b-spinner style="margin-left: 25px" variant="success" v-if="buttonLoading" small/>
              <span v-else>
                <i class="feather icon-arrow-left font-medium-2 mr-25"></i> Voltar
              </span>

            </button>
          </div>

          <div class="py-1 px-2">
            <!-- <button
              type="button"
              data-toggle="modal"
              data-target="#comparar-precos"
              class="btn btn-outline-light px-50 bg-white font-weight-bold btn-sm waves-effect waves-light float-right"

            >
              Comparar preços
            </button> -->
            <a href="javascript:void(0);" @click="toggleFilters" class="font-small-3">
              <i class="feather icon-sliders"></i>
              Filtrar
            </a>
            <vs-button v-if="filteredQuotations.length" @click="clearCategories()" class="pt-0 pb-0 font-small-3" color="#27b6f6" type="flat">Limpar filtros</vs-button>
          </div>
          <div class="content-list" style="overflow-y: scroll;">
            <div v-if="filteredQuotations.length" style="margin-bottom: -37px;">
              <ul class="list-group list-group-flush font-small-3 shadow-sm" style="padding-bottom: 13.20rem; height: calc(100vh - 4.5rem)">
                <div v-if="newQuotations(filteredQuotations).length > 0">
                  <li class="list-group-item list-group-item-light" v-for="quotation in newQuotations(filteredQuotations)" :key="quotation.id">
                    <a
                      v-if="quotation.status == 'Aceita'  && quotation.processed"
                      href="javascript:void(0);"
                      @click="selectQuotation(quotation)"
                      class="d-block text-dark"
                    >
                      <span class="float-right text-body font-small-1 text-right">
                        {{ formattedDate(quotation.updatedAt) }}
                        <span v-if="!quotation.read && !hideRead.includes(quotation.id)" class="d-block badge badge-success font-small-2 mt-25">Novo</span>
                      </span>
                      <strong>{{ quotation.supplierName }}</strong>
                      <span class="d-block mt-25 text-primary">
                        <i class="feather icon-dollar-sign font-small-2"></i> ver os preços
                        <!-- <i class="feather icon-flag font-small-3 font-weight-bold text-danger ml-50"></i> -->
                      </span>
                    </a>
                  </li>
                </div>
                <div v-if="readQuotations(filteredQuotations).length > 0">
                  <li class="list-group-item list-group-item-light" v-for="quotation in readQuotations(filteredQuotations)" :key="quotation.id">
                    <a
                      v-if="quotation.status == 'Aceita'  && quotation.processed"
                      href="javascript:void(0);"
                      @click="selectQuotation(quotation)"
                      class="d-block text-dark"
                    >
                      <span class="float-right text-body font-small-1 text-right">
                        {{ formattedDate(quotation.updatedAt) }}
                      </span>
                      <strong>{{ quotation.supplierName }}</strong>
                      <span class="d-block mt-25 text-primary">
                        <i class="feather icon-dollar-sign font-small-2"></i> ver os preços
                        <!-- <i class="feather icon-flag font-small-3 font-weight-bold text-danger ml-50"></i> -->
                      </span>
                    </a>
                  </li>
                </div>
                <div v-if="gettinPrices(filteredQuotations).length > 0">
                  <li class="list-group-item list-group-item-light" v-for="quotation in gettinPrices(filteredQuotations)" :key="quotation.id">
                    <a
                      v-if="quotation.status == 'Aceita' && !quotation.processed"
                      href="javascript:void(0);"
                      @click="selectQuotation(quotation)"
                      class="d-block text-dark"
                    >
                    <span class="float-right text-body font-small-1">{{ formattedDate(quotation.updatedAt) }}</span>
                    <strong>{{ quotation.supplierName }}</strong>
                    <span class="d-block mt-25">
                      <i class="feather icon-clock font-small-2"></i> Puxando os preços...
                    </span>
                    </a>
                  </li>
                </div>
                <div v-if="orderedQuotations(filteredQuotations).length > 0">
                  <li class="list-group-item list-group-item-light" v-for="quotation in orderedQuotations(filteredQuotations)" :key="quotation.id">
                    <a
                      v-if="quotation.status == 'Pedido de compra a confirmar'"
                      href="javascript:void(0);"
                      @click="selectQuotation(quotation)"
                      class="d-block text-dark"
                    >
                      <span class="float-right text-body font-small-1">{{ formattedDate(quotation.updatedAt) }}</span>
                      <strong>{{ quotation.supplierName }}</strong>
                      <span class="d-block mt-25 text-primary">
                        <i class="feather icon-file-text font-small-2"></i> Pedido
                        <span class="badge badge-pill bg-white color-mf-verde" style="border: 1px solid #0CB695; font-weight: bold;">Aguard. confirm.</span>
                      </span>
                    </a>
                    <a
                      v-if="quotation.status == 'Pedido de compra confirmado'"
                      href="javascript:void(0);"
                      @click="selectQuotation(quotation)"
                      class="d-block text-dark"
                    >
                      <span class="float-right text-body font-small-1">{{ formattedDate(quotation.updatedAt) }}</span>
                      <strong>{{ quotation.supplierName }}</strong>
                      <span class="d-block mt-25 text-primary">
                        <i class="feather icon-file-text font-small-2"></i> Pedido
                        <span class="badge badge-pill bg-white color-mf-verde" style="font-weight: bold;">Confirmado</span>
                      </span>
                    </a>
                    <a
                      v-if="quotation.status == 'Pedido de compra recusado'"
                      href="javascript:void(0);"
                      @click="selectQuotation(quotation)"
                      class="d-block text-dark"
                    >
                      <span class="float-right text-body font-small-1">{{ formattedDate(quotation.updatedAt) }}</span>
                      <strong>{{ quotation.supplierName }}</strong>
                      <span class="d-block mt-25 text-primary">
                        <i class="feather icon-file-text font-small-2"></i> Pedido
                        <span class="badge badge-pill text-white" style="background-color: #d11b6d; border: 1px solid #d11b6d; font-weight: bold;">Recusado</span>
                      </span>
                    </a>
                  </li>
                </div>
                <div v-if="waitngPrices(filteredQuotations).length > 0">
                  <li class="list-group-item list-group-item-light" v-for="quotation in waitngPrices(filteredQuotations)" :key="quotation.id">
                    <a
                      v-if="quotation.status == 'Pendente' && !quotation.hasExpired"
                      href="javascript:void(0);"
                      @click="selectQuotation(quotation)"
                      class="d-block text-dark disabled-opacity"
                    >
                      <span class="float-right text-body font-small-1">{{ formattedDate(quotation.updatedAt) }}</span>
                      <strong>{{ quotation.supplierName }}</strong>
                      <span class="d-block mt-25">
                        <i class="feather icon-clock font-small-2"></i> Esperando o vendedor
                      </span>
                    </a>
                  </li>
                </div>
                <div v-if="refusedQuotations(filteredQuotations).length > 0">
                  <li class="list-group-item list-group-item-light" v-for="quotation in refusedQuotations(filteredQuotations)" :key="quotation.id">
                    <a
                      v-if="quotation.status == 'Recusada'"
                      href="javascript:void(0);"
                      @click="selectQuotation(quotation)"
                      class="d-block text-dark disabled-opacity"
                    >
                      <span class="float-right text-body font-small-1">{{ formattedDate(quotation.updatedAt) }}</span>
                      <strong>{{ quotation.supplierName }}</strong>
                      <span class="d-block mt-25">
                        <i class="feather icon-thumbs-down font-small-2"></i> Recusou a cotação
                      </span>
                    </a>
                  </li>
                </div>
                <div v-if="notShowed(filteredQuotations).length > 0">
                  <li class="list-group-item list-group-item-light" v-for="quotation in notShowed(filteredQuotations)" :key="quotation.id">
                    <a
                      v-if="quotation.status == 'Pendente' && quotation.hasExpired"
                      href="javascript:void(0);"
                      @click="selectQuotation(quotation)"
                      class="d-block text-dark disabled-opacity"
                    >
                      <span class="float-right text-body font-small-1">{{ formattedDate(quotation.updatedAt) }}</span>
                      <strong>{{ quotation.supplierName }}</strong>
                      <span class="d-block mt-25">
                        <i class="feather icon-clock font-small-2"></i> Não mostrou preços
                      </span>
                    </a>
                  </li>
                </div>
              </ul>
            </div>
            <div v-else style="margin-bottom: -37px;">
              <ul class="list-group list-group-flush font-small-3 shadow-sm" style="padding-bottom: 13.20rem; height: calc(100vh - 4.5rem)">
                <div v-if="newQuotations(quotes.quotations).length > 0">
                  <li class="list-group-item list-group-item-light" v-for="quotation in newQuotations(quotes.quotations)" :key="quotation.id">
                    <a
                      v-if="quotation.status == 'Aceita'  && quotation.processed"
                      href="javascript:void(0);"
                      @click="selectQuotation(quotation)"
                      class="d-block text-dark"
                    >
                      <span class="float-right text-body font-small-1 text-right">
                        {{ formattedDate(quotation.updatedAt) }}
                        <span v-if="!quotation.read && !hideRead.includes(quotation.id)" class="d-block badge badge-success font-small-2 mt-25">Novo</span>
                      </span>
                      <strong>{{ quotation.supplierName }}</strong>
                      <span class="d-block mt-25 text-primary">
                        <i class="feather icon-dollar-sign font-small-2"></i> ver os preços
                        <!-- <i class="feather icon-flag font-small-3 font-weight-bold text-danger ml-50"></i> -->
                      </span>
                    </a>
                  </li>
                </div>
                <div v-if="readQuotations(quotes.quotations).length > 0">
                  <li class="list-group-item list-group-item-light" v-for="quotation in readQuotations(quotes.quotations)" :key="quotation.id">
                    <a
                      v-if="quotation.status == 'Aceita'  && quotation.processed"
                      href="javascript:void(0);"
                      @click="selectQuotation(quotation)"
                      class="d-block text-dark"
                    >
                      <span class="float-right text-body font-small-1 text-right">
                        {{ formattedDate(quotation.updatedAt) }}
                      </span>
                      <strong>{{ quotation.supplierName }}</strong>
                      <span class="d-block mt-25 text-primary">
                        <i class="feather icon-dollar-sign font-small-2"></i> ver os preços
                        <!-- <i class="feather icon-flag font-small-3 font-weight-bold text-danger ml-50"></i> -->
                      </span>
                    </a>
                  </li>
                </div>
                <div v-if="gettinPrices(quotes.quotations).length > 0">
                  <li class="list-group-item list-group-item-light" v-for="quotation in gettinPrices(quotes.quotations)" :key="quotation.id">
                    <a
                      v-if="quotation.status == 'Aceita' && !quotation.processed"
                      href="javascript:void(0);"
                      @click="selectQuotation(quotation)"
                      class="d-block text-dark"
                    >
                    <span class="float-right text-body font-small-1">{{ formattedDate(quotation.updatedAt) }}</span>
                    <strong>{{ quotation.supplierName }}</strong>
                    <span class="d-block mt-25">
                      <i class="feather icon-clock font-small-2"></i> Puxando os preços...
                    </span>
                    </a>
                  </li>
                </div>
                <div v-if="orderedQuotations(quotes.quotations).length > 0">
                  <li class="list-group-item list-group-item-light" v-for="quotation in orderedQuotations(quotes.quotations)" :key="quotation.id">
                    <a
                      v-if="quotation.status == 'Pedido de compra a confirmar'"
                      href="javascript:void(0);"
                      @click="selectQuotation(quotation)"
                      class="d-block text-dark"
                    >
                      <span class="float-right text-body font-small-1">{{ formattedDate(quotation.updatedAt) }}</span>
                      <strong>{{ quotation.supplierName }}</strong>
                      <span class="d-block mt-25 text-primary">
                        <i class="feather icon-file-text font-small-2"></i> Pedido
                        <span class="badge badge-pill bg-white color-mf-verde" style="border: 1px solid #0CB695; font-weight: bold;">Aguard. confirm.</span>
                      </span>
                    </a>
                    <a
                      v-if="quotation.status == 'Pedido de compra confirmado'"
                      href="javascript:void(0);"
                      @click="selectQuotation(quotation)"
                      class="d-block text-dark"
                    >
                      <span class="float-right text-body font-small-1">{{ formattedDate(quotation.updatedAt) }}</span>
                      <strong>{{ quotation.supplierName }}</strong>
                      <span class="d-block mt-25 text-primary">
                        <i class="feather icon-file-text font-small-2"></i> Pedido
                        <span class="badge badge-pill bg-mf-verde text-white" style="font-weight: bold;">Confirmado</span>
                      </span>
                    </a>
                    <a
                      v-if="quotation.status == 'Pedido de compra recusado'"
                      href="javascript:void(0);"
                      @click="selectQuotation(quotation)"
                      class="d-block text-dark"
                    >
                      <span class="float-right text-body font-small-1">{{ formattedDate(quotation.updatedAt) }}</span>
                      <strong>{{ quotation.supplierName }}</strong>
                      <span class="d-block mt-25 text-primary">
                        <i class="feather icon-file-text font-small-2"></i> Pedido
                        <span class="badge badge-pill text-white" style="background-color: #d11b6d; border: 1px solid #d11b6d; font-weight: bold;">Recusado</span>
                      </span>
                    </a>
                  </li>
                </div>
                <div v-if="waitngPrices(quotes.quotations).length > 0">
                  <li class="list-group-item list-group-item-light" v-for="quotation in waitngPrices(quotes.quotations)" :key="quotation.id">
                    <a
                      v-if="quotation.status == 'Pendente' && !quotation.hasExpired"
                      href="javascript:void(0);"
                      @click="selectQuotation(quotation)"
                      class="d-block text-dark disabled-opacity"
                    >
                      <span class="float-right text-body font-small-1">{{ formattedDate(quotation.updatedAt) }}</span>
                      <strong>{{ quotation.supplierName }}</strong>
                      <span class="d-block mt-25">
                        <i class="feather icon-clock font-small-2"></i> Esperando o vendedor
                      </span>
                    </a>
                  </li>
                </div>
                <div v-if="refusedQuotations(quotes.quotations).length > 0">
                  <li class="list-group-item list-group-item-light" v-for="quotation in refusedQuotations(quotes.quotations)" :key="quotation.id">
                    <a
                      v-if="quotation.status == 'Recusada'"
                      href="javascript:void(0);"
                      @click="selectQuotation(quotation)"
                      class="d-block text-dark disabled-opacity"
                    >
                      <span class="float-right text-body font-small-1">{{ formattedDate(quotation.updatedAt) }}</span>
                      <strong>{{ quotation.supplierName }}</strong>
                      <span class="d-block mt-25">
                        <i class="feather icon-thumbs-down font-small-2"></i> Recusou a cotação
                      </span>
                    </a>
                  </li>
                </div>
                <div v-if="notShowed(quotes.quotations).length > 0">
                  <li class="list-group-item list-group-item-light" v-for="quotation in notShowed(quotes.quotations)" :key="quotation.id">
                    <a
                      v-if="quotation.status == 'Pendente' && quotation.hasExpired"
                      href="javascript:void(0);"
                      @click="selectQuotation(quotation)"
                      class="d-block text-dark disabled-opacity"
                    >
                      <span class="float-right text-body font-small-1">{{ formattedDate(quotation.updatedAt) }}</span>
                      <strong>{{ quotation.supplierName }}</strong>
                      <span class="d-block mt-25">
                        <i class="feather icon-clock font-small-2"></i> Não mostrou preços
                      </span>
                    </a>
                  </li>
                </div>
              </ul>
            </div>
          </div>
        </div>
        <div class="col-md-10 p-0" style="background: #E5DDD5;" v-if="showScreen('panel')">
          <span v-if="selectedQuotation && quotationProducts && selectedQuotation.status == 'Pendente'">
            <VQuotePanelInfoHeader @back-button="backToPanel" v-if="supplier" v-bind:supplier="supplier" v-bind:quotation="quotation" v-bind:openQuotation="false"/>
            <VQuotePanelNoAnswer v-bind:quotation="selectedQuotation" v-bind:products="quotationProducts"/>
          </span>
          <span v-if="selectedQuotation && selectedQuotation.status == 'Aceita'">
            <!-- <VQuotePanelInfoHeader v-if="supplier" v-bind:supplier="supplier" v-bind:quotation="quotation" v-bind:openQuotation="true"/> -->
            <VQuotePanelOpen
              v-if="supplier"
              :supplier="supplier"
              :quotation="selectedQuotation"
              :infoQuotation="quotation"
              :isMobile="mobileBrowser"
              @back-button="backButton" />
          </span>
          <span v-if="selectedQuotation && (selectedQuotation.status == 'Pedido de compra a confirmar' || selectedQuotation.status == 'Pedido de compra confirmado' || selectedQuotation.status == 'Pedido de compra recusado')">
            <VQuotePanelInfoHeader @back-button="backToPanel" v-if="supplier" v-bind:supplier="supplier" v-bind:quotation="quotation" v-bind:openQuotation="false"/>
            <VQuotePanelOC :quotation="selectedQuotation" />
          </span>
          <span v-if="selectedQuotation && selectedQuotation.status == 'Recusada'">
            <VQuotePanelInfoHeader @back-button="backToPanel" v-if="supplier" v-bind:supplier="supplier" v-bind:quotation="quotation" v-bind:openQuotation="false"/>
            <VQuotePanelRefused :quotation="selectedQuotation" />
          </span>
          <span v-if="!selectedQuotation">
            <VQuotePanelIdle />
          </span>
        </div>
      </div>
      <div v-if="quotes && quotes.quotations">
        <VQuotePanelFilters v-bind:quote="quotes" v-bind:popupActive="filtersPopup" @update-popup="updatePopup" ref="filters" />
        <VQuotePanelComparePrices v-bind:quote="quotes" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import VQuotePanelInfoHeader from "~/components/quotes/Components/VQuotePanelInfoHeader";
import VQuotePanelFilters from "~/components/quotes/Components/VQuotePanelFilters";
import VQuotePanelComparePrices from "~/components/quotes/Components/VQuotePanelComparePrices";
import VQuotePanelIdle from "~/components/quotes/Components/VQuotePanelIdle";
import VQuotePanelNoAnswer from "~/components/quotes/Components/VQuotePanelNoAnswer";
import VQuotePanelOpen from "~/components/quotes/Components/VQuotePanelOpen";
import VQuotePanelOC from "~/components/quotes/Components/VQuotePanelOC";
import VQuotePanelRefused from "~/components/quotes/Components/VQuotePanelRefused";
import timeFormatter from "@/mixins/timeFormatter";

export default {
  data() {
    return {
      selectedQuotation: undefined,
      showProducts: undefined,
      quoteId: undefined,
      filtersPopup: false,
      scrollLocation: undefined,
      buttonLoading: false,
      hideRead: []
    };
  },

  created() {
    this.quoteId = this.$route.params.quoteId
    this.isMobile()
    this.currentScreen = 'menu'
    this.getQuote(this.quoteId).then(() => {
      if(this.$route.query.quotationId)
        this.findAndSelect(this.$route.query.quotationId)
    })
  },

  destroyed() {
    document.getElementById("app").classList.remove("vh-100");
    document
      .getElementsByClassName("content-wrapper")[0]
      .classList.add("router-view");
  },

  computed: {
    ...mapState("users", ["user"]),
    ...mapState("suppliers", ["supplier"]),
    ...mapState("quotes", ["quotes", "filteredQuotations"]),
    ...mapState("quotations", ["quotation", "quotationProducts"]),
  },

  methods: {
    ...mapActions("suppliers", ["getSupplierById"]),
    ...mapActions("quotes", ["getQuote", "markQuoteQuotationAsRead"]),
    ...mapActions("quotations", [
      "getQuotationWithPayments",
      "getQuotationProducts",
      "readQuotation"
    ]),
    updatePopup(value) {
      this.filtersPopup = value
    },
    backToPanel(value){
      this.currentScreen = value
      this.$forceUpdate()
    },
    selectQuotation(quotation) {
      this.scrollLocation = document.querySelector('.content-list').scrollTop
      if(quotation.processed) {
        this.selectedQuotation = quotation
        if(quotation.status != 'Aceita')
          this.getQuotationProducts(quotation)
        this.getQuotationWithPayments({ id: quotation.id })
        this.getSupplierById(quotation.supplierId)
        if(!quotation.read && (quotation.status == 'Aceita')) {
          this.readQuotation(quotation.id)
          this.hideRead.push(quotation.id)
          //this.markQuoteQuotationAsRead(quotation.id)
        }
        this.currentScreen = 'panel'
        this.$forceUpdate()
      }
    },
    formattedDate(date) {
      var m = new Date(date)
      var dateString = m.getHours() + ":" + String(m.getMinutes()).padStart(2, "0") + ", " + m.getDate() +"/"+ (m.getMonth() + 1) + "/" + m.getFullYear()
      return dateString
    },
    toggleFilters() {
      this.filtersPopup = !this.filtersPopup
    },
    findAndSelect(quotationId) {
      var quotation = this.quotes.quotations.find(quotation => quotation.id == quotationId)
      if(quotation)
        this.selectQuotation(quotation)
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
    newQuotations(quotations){
      let cloneQuotes = [...quotations]
      return cloneQuotes.filter(quotation => quotation.status == 'Aceita' && !quotation.read && quotation.processed).sort((a,b) => a.supplierName.localeCompare(b.supplierName))
    },
    readQuotations(quotations){
      let cloneQuotes = [...quotations]
      return cloneQuotes.filter(quotation => quotation.status == 'Aceita' && quotation.read && quotation.processed).sort((a,b) => a.supplierName.localeCompare(b.supplierName))
    },
    gettinPrices(quotations){
      let cloneQuotes = [...quotations]
      return cloneQuotes.filter(quotation => quotation.status == 'Aceita' && !quotation.processed).sort((a,b) => a.supplierName.localeCompare(b.supplierName))
    },
    waitngPrices(quotations){
      let cloneQuotes = [...quotations]
      return cloneQuotes.filter(quotation => quotation.status == 'Pendente' && !quotation.hasExpired).sort((a,b) => a.supplierName.localeCompare(b.supplierName))
    },
    refusedQuotations(quotations){
      let cloneQuotes = [...quotations]
      return cloneQuotes.filter(quotation => quotation.status == 'Recusada').sort((a,b) => a.supplierName.localeCompare(b.supplierName))
    },
    notShowed(quotations){
      let cloneQuotes = [...quotations]
      return cloneQuotes.filter(quotation => quotation.status == 'Pendente' && quotation.hasExpired).sort((a,b) => a.supplierName.localeCompare(b.supplierName))
    },
    orderedQuotations(quotations){
      let cloneQuotes = [...quotations]
      return cloneQuotes.filter(quotation => (quotation.status == 'Pedido de compra a confirmar' || quotation.status == 'Pedido de compra confirmado' || quotation.status == 'Pedido de compra recusado'))
                        .sort((a,b) => a.supplierName.localeCompare(b.supplierName))
    },
    backButton() {
      this.currentScreen = 'menu'
      this.$forceUpdate()
      this.returnScrollPosition()
    },
    remainingTimeTooltip(time) {
      return 'Essa cotação expira em ' + time +
             '                          ' +
             'Este é o tempo que os fornecedores tem para apresentar preços e você emitir pedidos de compra.'
    },
    returnScrollPosition(){
      this.$nextTick(()=>{
        const el = document.querySelector('.content-list')
        el.scrollTop = this.scrollLocation
      }
     )
    },
    toMyQuotation(){
      this.buttonLoading = true
      setTimeout(() => {
        this.buttonLoading = false
        this.$router.push({ name: 'home' })
      }, 300);
    },
    clearCategories() {
      this.$refs.filters.clearCategories()
    }
  },
  components: {
    VQuotePanelFilters,
    VQuotePanelComparePrices,
    VQuotePanelIdle,
    VQuotePanelNoAnswer,
    VQuotePanelOpen,
    VQuotePanelOC,
    VQuotePanelInfoHeader,
    VQuotePanelRefused
  },
  mixins: [timeFormatter]
};
</script>
