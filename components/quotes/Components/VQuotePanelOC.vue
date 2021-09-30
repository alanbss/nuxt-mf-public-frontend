<template>
  <div class="vh-100 overflow-auto" style="padding-bottom: 10rem;">
    <div class="card shadow-sm m-1">
      <div class="card-header d-block">
        <div class="avatar bg-rgba-warning p-50 m-0 mr-3 mb-50 float-left" style="cursor: default;">
          <div class="avatar-content">
              <i class="feather icon-check text-warning font-medium-5"></i>
          </div>
        </div>
        <div class="ml-2">
          <span class="float-right font-small-3">{{ formatDate(quotation.updatedAt) }}</span>
          <h4 class="card-title color-mf-laranja">Pedido de compra emitido!</h4>
          <p class="my-25">O fornecedor já foi informado, por email, sobre seu pedido.</p>
          <p class="my-25">
            <button @click="toOrder(quotation)" class="btn btn-link">
              <b-spinner variant="success" v-if="buttonLoading" small style="margin-left: 55px"/>
              <span v-else>Ver o pedido emitido</span>
            </button>
          </p>
        </div>
      </div>

      <div class="card-body" v-if="quotation.status == 'Pedido de compra a confirmar'">
        <div>
          <span class="badge badge-pill bg-white color-mf-verde font-medium-1" style="border: 1px solid #0CB695; font-weight: bold;">Aguardando a confirmação</span>
        </div>
        <h6 class="mt-1">
          Mandaremos um email para você assim que<br>
          o fornecedor confirmar sobre o seu pedido.</h6>
      </div>
      <div class="card-body" v-if="quotation.status == 'Pedido de compra confirmado'">
        <div>
          <span class="badge badge-pill bg-mf-verde text-white font-medium-1" style="font-weight: bold;">Pedido de compra confirmado</span>
        </div>
        <h6 class="mt-1">
          O fornecedor confirmou seu pedido de compra!
        </h6>
        <h4 class="pt-2"><i class="feather icon-truck"></i> Condições de entrega</h4>
        <div class="row" v-if="loadedQuotation">
          <div v-if="loadedQuotation.deliveryEstimate" class="col">
            <h5 class="mb-50 pt-1 disabled-opacity">Prazo de entrega</h5>
            <p class="font-small-3" style="min-width: 160px;">{{ loadedQuotation.deliveryEstimate }}</p>
          </div>
          <div v-else class="col">
            <h5 class="mb-50 pt-1 disabled-opacity">Fornecedor não realiza entregas.</h5>
          </div>
          <div v-if="loadedQuotation.deliveryRoute" class="col">
            <h5 class="mb-50 pt-1 disabled-opacity">Rota</h5>
            <p class="font-small-3" style="min-width: 160px;">{{ loadedQuotation.deliveryRoute }}</p>
          </div>
          <div class="col">
            <h5 class="mb-50 pt-1 disabled-opacity" v-if="loadedQuotation.deliveryRate && loadedQuotation.deliveryEstimate">
              Taxa e obs. frete
            </h5>
            <p class="font-small-3" style="min-width: 160px;" v-if="loadedQuotation.deliveryRate && loadedQuotation.deliveryEstimate">
              {{ loadedQuotation.deliveryRate }}
            </p>
          </div>
        </div>
        <div class="row" v-if="quotation.orderComments">
          <h5 class="ml-1 mb-50 pt-1 disabled-opacity" >
            Recado para você
          </h5>
          <textarea
            v-model="comments"
            disabled='true'
            class="form-control mt-25 ml-1 mr-1"
            id=""
            rows="2"
          >
          </textarea>
        </div>
      </div>
      <div class="card-body" v-if="quotation.status == 'Pedido de compra recusado'">
        <div>
          <span class="badge badge-pill text-white font-medium-1" style="background-color: #d11b6d; font-weight: bold;">Pedido de compra recusado</span>
        </div>
        <h6 class="mt-1">
          O fornecedor recusou seu pedido de compra.
        </h6>
        <div class="row" v-if="quotation.refuseJustification">
          <h6 class="ml-1 mb-50 pt-1" >
            Justificativa dele
          </h6>
          <textarea
            v-model="justification"
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
</template>

<script>

import { mapActions } from "vuex";

export default {
  data() {
    return {
      buttonLoading: false,
      loadedQuotation: null,
      comments: null,
      justification: null
    }
  },
  mounted() {

  },
  computed: {
    //...mapGetters("users/products", ["productIsOnList", "productIsOnCart", "productCartIsEmpty"]),


  },
  created() {
    this.getQuotationWithPayments({ id: this.quotation.id }).then((response) => {
      this.loadedQuotation = response
      this.comments = this.quotation.orderComments
      this.justification = this.quotation.refuseJustification
    })
  },
  // updated() {
  //   this.getQuotationWithPayments({ id: this.quotation.id }).then((response) => {
  //     this.loadedQuotation = response
  //     this.comments = this.quotation.orderComments
  //     this.justification = this.quotation.refuseJustification
  //   })
  // },
  watch: {
    quotation(newVal, oldVal) {
      if(newVal && oldVal && (newVal.id != oldVal.id)) {
        this.getQuotationWithPayments({ id: this.quotation.id }).then((response) => {
          this.loadedQuotation = response
          this.comments = this.quotation.orderComments
          this.justification = this.quotation.refuseJustification
        })
      }
    }
  },
  methods: {
    ...mapActions("quotations", ["getQuotationWithPayments"]),
    formatDate(date) {
      var m = new Date(date)
      var dateString = m.getDate() +"/"+ (m.getMonth() + 1) + "/" + m.getFullYear() + " - " + m.getHours() + ":" + String(m.getMinutes()).padStart(2, "0")
      return dateString
    },
    toOrder(quotationObj){
      this.buttonLoading = true
      setTimeout(() => {
        this.buttonLoading = false
        if(quotationObj.orderType && quotationObj.orderType == 'Direta') {
          if(this.isOrderPanel)
            this.$router.push({name: 'users.checkOrder', params: { quotationId: quotationObj.id }, query: { source: 'order-panel', direct: true }})
          else
            this.$router.push({name: 'users.checkOrder', params: { quotationId: quotationObj.id }, query: { direct: true }})
        } else {
          if(this.isOrderPanel)
            this.$router.push({name: 'users.checkOrder', params: { quotationId: quotationObj.id }, query: { source: 'order-panel' }})
          else
            this.$router.push({name: 'users.checkOrder', params: { quotationId: quotationObj.id }})
        }

      }, 300);
    }
  },
  props: {
    quotation: {
      type: Object,
      required: true
    },
    isOrderPanel: {
      type: Boolean,
    }
  },
  components: {

  },
};
</script>
