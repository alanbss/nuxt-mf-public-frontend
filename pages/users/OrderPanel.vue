<template>
  <div class="content-wrapper p-0" style="margin-top: 4.50rem;">
    <div class="content-body">
      <div class="row mx-md-0 vh-100">
        <div class="col-md-2 p-0" style="border-right: solid 1px #D5D5D5;" v-if="showScreen('menu')">
          <div class="p-2" style="background: #EDEDED; border-bottom: solid 1px #D5D5D5">
            <h6 class="m-0">Pedido de compra</h6>
          </div>
          <div class="p-50 font-small-3">
            <span v-if="dateSelected || supplierSelected.id">
              <div class="position-relative">
                <div v-if="dateSelected" class="chip mt-25 border border-light bg-white">
                  <div class="chip-body">
                    <span class="chip-text text-primary">{{ dateSelected }}</span>
                    <div @click="closeChip('date')" class="chip-closeable ml-0">
                      <i class="feather icon-x text-primary font-weight-bold"></i>
                    </div>
                  </div>
                </div>
                <div v-if="supplierSelected.id" class="chip mt-25 border border-light bg-white">
                  <div class="chip-body">
                    <span class="chip-text text-primary">{{ supplierSelected.name }}</span>
                    <div @click="closeChip('supplier')" class="chip-closeable ml-0">
                      <i class="feather icon-x text-primary font-weight-bold"></i>
                    </div>
                  </div>
                </div>
              </div>
              <hr class="my-50">
            </span>
            <div class="position-relative">
              <div class="pickadate d-inline-block my-25 ml-75 mr-25">
                <a @click="cleanFilters" href="javascript:void(0)">
                 <b-spinner variant="success" v-if="buttonLoading" small/>
                 <span v-else>Últ. 14 dias</span>
                </a>
                <b-form-datepicker
                  class="ml-50"
                  size="sm"
                  id="datepicker"
                  button-only
                  v-model="dateSelected"
                  locale="pt-BR">
                </b-form-datepicker>
              </div>
              <a href="javascript:void(0);" @click="toggleFilters" class="d-inline-block my-25 ml-25">
                Fornecedor <i class="feather icon-chevron-down position-relative" style="top: 2px;"></i>
              </a>
            </div>
          </div>
          <div class="content-list" style="overflow-y: scroll;">
            <div v-if="allOrders.length" style="margin-bottom: -180px;">
              <ul class="list-group list-group-flush font-small-3 shadow-sm vh-100" style="padding-bottom: 15.70rem;">
                <li class="list-group-item" v-for="quotation in allOrders.slice().reverse()" :key="quotation.id">
                  <a
                    href="javascript:void(0);"
                    @click="selectQuotation(quotation)"
                    class="d-block text-dark">
                    <span class="float-right text-body font-small-1 text-right">
                      {{ formattedDate(quotation.updatedAt) }}
                    </span>
                    <strong>{{ quotation.supplierName }}</strong>
                    <span class="d-block mt-25">
                      <span class="text-primary" style="margin-right: 5px;"><i class="feather icon-file-text font-small-2"></i> Pedido</span>
                      <span v-if="quotation.status == 'Pedido de compra recusado'" class="badge badge-pill text-white" style="background-color: #d11b6d; border: 1px solid #d11b6d; font-weight: bold;">Recusado</span>
                      <span v-if="quotation.status == 'Pedido de compra confirmado'" class="badge badge-pill bg-mf-verde text-white" style="font-weight: bold;">Confirmado</span>
                      <span v-if="quotation.status == 'Pedido de compra a confirmar'" class="badge badge-pill bg-white color-mf-verde" style="border: 1px solid #0CB695; font-weight: bold;">Aguard. confirm.</span>
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="col-md-10 p-0" style="background: #E5DDD5;" v-if="showScreen('orders')">
          <span v-if="selectedQuotation">
            <div class="p-2" style="justifybackground: #EDEDED; border-bottom: solid 1px #D5D5D5">

              <a href="javascript:void(0);" @click="currentScreen = 'menu';returnScrollPosition()" title="Voltar" class="d-md-none">
                <i class="feather icon-arrow-left mr-1 mt-n25 float-left font-large-1"></i>
              </a>

              <div class="row " style="justify-content: space-between;">

                <h6 class="m-0 font-weight-bold">{{ selectedQuotation.supplierName }}</h6>

                <div class="float-right font-small-3 pr-2">
                  <vs-dropdown>
                    <a class="a-icon" href="#">
                      <i class="feather icon-phone"></i><span class="d-md-inline d-none ml-25">Contato</span>
                    </a>
                    <vs-dropdown-menu>
                      <vs-dropdown-item style="color: black;"><i class="feather icon-phone mr-25"></i> {{ supplier.user.phone}}</vs-dropdown-item>
                    </vs-dropdown-menu>
                  </vs-dropdown>
                  <VDropdownInfo :supplier="supplier" />
                </div>

              </div>

            </div>
            <VQuotePanelOC :quotation="selectedQuotation" :isOrderPanel="true" />
          </span>
          <div v-if="!selectedQuotation" class="row d-flex justify-content-center">
            <div style="margin-top: 100px;">
              <div class="row d-flex">
                <h3 class="font-weight-bold mt-1 mb-1" style="color: gray;">
                  Seus pedidos de compra
                </h3>
              </div>
              <div class="row d-flex">
                <p class="mb-1">
                  Use o menu ao lado para conferir os pedidos de<br>
                  compra que você já emitiu aos fornecedores
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <VOrderSupplierFilter :popupActive="filtersPopup" :orders="allOrders" @supplierSelected="filterBySupplierAndDate" @update-open="updateModalFilters"/>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import VQuotePanelOC from "@/resources/quotes/Components/VQuotePanelOC";
import VOrderSupplierFilter from "@/resources/quotations/Components/VOrderSupplierFilter";
import VDropdownInfo from "@/resources/suppliers/components/VDropdownInfo";

export default {
  data() {
    return {
      selectedQuotation: undefined,
      showProducts: undefined,
      quoteId: undefined,
      filtersPopup: false,
      dateSelected: null,
      supplierSelected: { id: null, name: null },
      mobileBrowser: false,
      currentScreen: undefined,
      scrollLocation: undefined,
      buttonLoading: false,
      allOrders: []
    };
  },

  created() {
    this.getOrders({ supplier: null, date: null }).then(() => {
      if(this.$route.query.orderId)
        this.findAndSelect(this.$route.query.orderId)
      this.getDirectOrders().then(() => {
        this.allOrders = this.orders.concat(this.directOrders)
      })
    })
    this.isMobile()
    this.currentScreen = 'menu'
  },

  watch: {
    dateSelected(newVal) {
      this.getOrders({ supplier: this.supplierSelected.id, date: newVal })
    },
    supplierSelected(newVal) {
      this.getOrders({ supplier: this.supplierSelected.id, date: this.dateSelected })
    }
  },

  computed: {
    ...mapState("users", ["user"]),
    ...mapState("quotes", ["quotes"]),
    ...mapState("quotations", ["orders"]),
    ...mapState("orders", ["directOrders"]),
    ...mapState("suppliers", ["supplier"]),
  },

  methods: {
    ...mapActions("quotes", ["getQuote", "filteredQuotations"]),
    ...mapActions("quotations", ["getOrders", "getQuotationProducts"]),
    ...mapActions("suppliers", ["getSupplierById"]),
    ...mapActions("orders", ["getDirectOrders"]),
    selectQuotation(quotation) {
      this.scrollLocation = document.querySelector('.content-list').scrollTop
      this.selectedQuotation = quotation
      this.getQuotationProducts(quotation)
      this.currentScreen = 'orders'
      this.getSupplierById(quotation.supplierId)
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
      var quotation = this.orders.find(quotation => quotation.id == quotationId)
      if(quotation)
        this.selectQuotation(quotation)
    },
    filterBySupplierAndDate(selected) {
      if(selected)
        this.supplierSelected = selected
    },
    closeChip(name) {
      if(name == 'supplier')
        this.supplierSelected = { id: null, name: null }
      else
        this.dateSelected = null
    },
    cleanFilters() {
      this.buttonLoading = true
      setTimeout(() => {
        this.buttonLoading = false
        this.supplierSelected = { id: null, name: null }
        this.dateSelected = null
      }, 300);
    },
    updateModalFilters(val) {
      this.filtersPopup = val
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
          const el = document.querySelector('.content-list')
          el.scrollTop = this.scrollLocation
        }
      )
    }
  },
  components: {
    VQuotePanelOC,
    VOrderSupplierFilter,
    VDropdownInfo
  }
};
</script>
