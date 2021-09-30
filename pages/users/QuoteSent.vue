<template>
  <div class="container-fluid p-0" :style="'margin-top: 4.50rem; height: ' + maxHeight + 'px; background-color: white;'">


    <div class="row align-items-center h-100">
      <div class="col-md-6 h-100 align-content-center flex-wrap mf-bg-img d-none d-md-flex">
        <div class="text-center w-75 m-auto">
          <img :src="require(`@/assets/images/mf-logo-white-2.png`)">
          <h3 class="mt-3 text-white">Cotação enviada com sucesso!</h3>
        </div>
      </div>
      <div
        class="col-md-6 d-flex align-content-center flex-wrap mf-bg-img mobile-mf-bg-img"
      >
        <div class="w-75 m-auto p-2"
         :style="'overflow-y: auto; overflow-x: hidden; height: ' + maxHeight + 'px;'"
        >

          <div class="row">
            <div class="timeline block mb-1">
              <div class="tl-item">
                  <div class="tl-dot b-warning"></div>
                  <div class="tl-content">
                    <h5 class="color-mf-verde">
                      Cotação aberta
                      <div class="badge badge-pill badge-md badge-light-success ml-1">
                        {{ formattedDate(quotes.createdAt) }}
                      </div>
                    </h5>
                    <h4>{{ quotes.products.length }} produtos cotados</h4>
                    <h4 class="color-mf-laranja">A cotação expira em {{ remainingTime(quotes.quotations[0].remainingTime) }}</h4>
                    <p>
                      Este é o tempo disponível para aguardar os fornecedores mandarem seus preços e você emitir pedidos de compra a eles.
                    </p>
                  </div>
              </div>
              <div class="tl-item active">
                  <div class="tl-dot b-primary"></div>
                  <div class="tl-content">
                    <h5 class="color-mf-verde">Precificação</h5>
                    <!-- <h4>{{ suppliersText(quotes.matchedSuppliers) }}</h4>
                    <p class="color-mf-laranja">
                      Avisaremos você, por email, cada vez que um fornecedor apresentar seus preços.
                    </p> -->
                    <span v-if="automaticQuotations().length">
                      <p>
                        <b>Aguarde alguns segundos.</b>
                      </p>
                      <table class="table">
                        <thead>
                          <tr v-for="quotation in automaticQuotations()" :key="quotation.supplierName">
                            <td
                             style="width: 40px; border-top: 1px solid #b5b9bd; border-bottom: 1px solid #b5b9bd; border-left: 1px solid #b5b9bd;"
                             v-if="findQuotationControlById(quotation.id).status">
                              <div class="text-left">
                                <i class="feather icon-dollar-sign" style="font-size: 1.5em;"></i>
                              </div>
                            </td>
                            <td
                             style="width: 40px; border-top: 1px solid #b5b9bd; border-bottom: 1px solid #b5b9bd; border-left: 1px solid #b5b9bd;"
                             v-if="!findQuotationControlById(quotation.id).status">
                              <div class="text-left">
                                <div class="spinner-grow" role="status">
                                  <span class="sr-only">Loading...</span>
                                </div>
                              </div>
                            </td>
                            <td
                             style="border-top: 1px solid #b5b9bd; border-bottom: 1px solid #b5b9bd; border-right: 1px solid #b5b9bd;"
                             v-if="findQuotationControlById(quotation.id).status">
                              {{ quotation.supplierName }}<br>
                              <router-link
                                :to="{ name: 'users.quotePanel', params: { quoteId: quotes.id }, query: { quotationId: quotation.id }}"
                                class="btn btn-primary" style="padding: 8px 15px 8px 15px;">
                                Ver os preços
                              </router-link>
                            </td>
                            <td
                             style="border-top: 1px solid #b5b9bd; border-bottom: 1px solid #b5b9bd; border-right: 1px solid #b5b9bd;"
                             v-if="!findQuotationControlById(quotation.id).status">
                              {{ quotation.supplierName }}<br>
                              <b>Puxando os preços...</b>
                            </td>
                          </tr>
                          <!-- <tr>
                            <td style="width: 40px;">
                              <div class="text-left">
                                <div class="spinner-grow" role="status">
                                  <span class="sr-only">Loading...</span>
                                </div>
                              </div>
                            </td>
                            <td>
                              teste<br>
                              <a href="/" class="btn btn-primary" style="padding: 8px 15px 8px 15px;">
                                Ver os preços
                              </a>
                            </td>
                          </tr> -->
                        </thead>
                      </table>
                    </span>
                    <span v-if="manualQuotations().length">
                      <p>
                        Aguarde estes fornecedores precificarem.<br>
                        Avisaremos você por email.
                      </p>
                      <table class="table">
                        <thead>
                          <tr v-for="quotation in manualQuotations()" :key="quotation.supplierName">
                            <td
                             style="width: 40px; border-top: 1px solid #b5b9bd; border-bottom: 1px solid #b5b9bd; border-left: 1px solid #b5b9bd;"
                             v-if="findQuotationControlById(quotation.id).situation == 'Pendente'"
                            >
                              <div class="text-left">
                                <i class="feather icon-clock" style="font-size: 1.5em;"></i>
                              </div>
                            </td>
                            <td
                              style="width: 40px; border-top: 1px solid #b5b9bd; border-bottom: 1px solid #b5b9bd; border-left: 1px solid #b5b9bd;"
                              v-if="findQuotationControlById(quotation.id).situation == 'Aceita' || findQuotationControlById(quotation.id).situation == 'Recusada'"
                            >
                              <div class="text-left">
                                <i class="feather icon-dollar-sign" style="font-size: 1.5em;"></i>
                              </div>
                            </td>
                            <td
                             style="border-top: 1px solid #b5b9bd; border-bottom: 1px solid #b5b9bd; border-right: 1px solid #b5b9bd;"
                             v-if="findQuotationControlById(quotation.id).situation == 'Aceita' || findQuotationControlById(quotation.id).situation == 'Recusada'"
                            >
                              {{ quotation.supplierName }}<br>
                              <router-link
                                :to="{ name: 'users.quotePanel', params: { quoteId: quotes.id }, query: { quotationId: quotation.id }}"
                                class="btn btn-primary" style="padding: 8px 15px 8px 15px;">
                                Ver os preços
                              </router-link>
                            </td>
                            <td
                             style="border-top: 1px solid #b5b9bd; border-bottom: 1px solid #b5b9bd; border-right: 1px solid #b5b9bd;"
                             v-if="findQuotationControlById(quotation.id).situation == 'Pendente'"
                            >
                              {{ quotation.supplierName }}<br>
                              <span style="color: gray;"><b>Esperando o vendedor</b></span>
                            </td>
                          </tr>
                        </thead>
                      </table>
                    </span>
                    <!-- <ul class="list-group" style="margin-bottom: 5px;">
                      <li class="list-group-item">

                      </li>
                    </ul>
                    <ul class="list-group">
                      <li class="list-group-item">
                        <p>teste</p>
                      </li>
                    </ul> -->
                  </div>
              </div>
              <div class="tl-item">
                  <div class="tl-dot muted b-danger"></div>
                  <div class="tl-content">
                    <h5 class="text-muted">Emissão de pedidos de compra</h5>
                    <p class="text-muted">
                      Na medida que os fornecedores apresentarem seus preços, você pode emitir pedidos de compra a cada um.
                    </p>
                  </div>
              </div>
            </div>
          </div>

          <hr class="my-2">

          <div class="row">
            <p class="col-md-12">
              <vs-button class="float-right" @click="goToHome()" type="line">Voltar ao site</vs-button>
            </p>
            <!-- <p class="col-md-7" v-if="parseInt(quotes.matchedSuppliers) > parseInt(quotes.noPrice)">
              <router-link
                :to="{ name: 'users.quotePanel', params: { quoteId: quotes.id }}"
                class="btn bg-white btn-outline-primary text-bold-600">
                Abrir o painel de cotação
              </router-link>
            </p> -->
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<style scoped>

.h-100 {
  height: 100% !important;
}

.tl-item {
    border-radius: 3px;
    position: relative;
    display: -ms-flexbox;
    display: flex
}

.tl-item>* {
    padding: 20px
}

.tl-item .avatar {
    z-index: 2
}

.tl-item:last-child .tl-dot:after {
    display: none
}

.tl-item.active .tl-dot:before {
    border-color: #0cb695;
    box-shadow: 0 0 0 4px rgba(68, 139, 255, .2)
}

.tl-item:last-child .tl-dot:after {
    display: none
}

.tl-item.active .tl-dot:before {
    border-color: #0cb695;
    box-shadow: 0 0 0 4px rgba(68, 139, 255, .2)
}

.tl-dot {
    position: relative;
}

.tl-dot:after,
.tl-dot:before {
    content: '';
    position: absolute;
    border-color: inherit;
    border-width: 2px;
    border-style: solid;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    top: 15px;
    left: 50%;
    transform: translateX(-50%);
}

.tl-dot:before {
  background: #0cb695;
}

.tl-dot.muted:before {
  background: grey;
}

.tl-dot:after {
    width: 0;
    height: auto;
    top: 25px;
    bottom: -15px;
    border-right-width: 0;
    border-top-width: 0;
    border-bottom-width: 0;
    border-radius: 0
}

tl-item.active .tl-dot:before {
    border-color: #0cb695;
    background: #0cb695;
    box-shadow: 0 0 0 4px rgba(68, 139, 255, .2);
}

.tl-dot {
    position: relative;
    border-color: rgba(160, 175, 185, .15)
}

.tl-dot:after,
.tl-dot:before {
    content: '';
    position: absolute;
    border-color: inherit;
    border-width: 2px;
    border-style: solid;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    top: 15px;
    left: 50%;
    transform: translateX(-50%);
}

.tl-dot:after {
    width: 0;
    height: auto;
    top: 25px;
    bottom: -15px;
    border-right-width: 0;
    border-top-width: 0;
    border-bottom-width: 0;
    border-radius: 0
}

.tl-content p:last-child {
    margin-bottom: 0
}

.tl-date {
    font-size: .85em;
    margin-top: 2px;
    min-width: 100px;
    max-width: 100px
}
</style>

<script>
import { mapState, mapActions } from "vuex";
import timeFormatter from "@/mixins/timeFormatter";

export default {
  data() {
    return {
      maxHeight: null,
      quotationsControl: [],
      notificationSound: new Audio(require(`@/assets/sounds/notification.mp3`)),
      timeouts: []
    };
  },

  mounted() {
    if(window.innerHeight < window.innerWidth)
      this.maxHeight = window.innerHeight - 63
    else
      this.maxHeight = document.getElementsByClassName('timeline')[0].offsetHeight + 180

    for(var i = 0; i < this.quotes.quotations.length; i++) {
      this.quotationsControl.push({ id: this.quotes.quotations[i].id, status: this.quotes.quotations[i].processed, situation: this.quotes.quotations[i].status })
      if(!this.quotes.quotations[i].processed || this.quotes.quotations[i].status == 'Pendente')
        this.checkStatusTimeout(this.quotes.quotations[i].id)
    }
  },

  beforeRouteLeave (to, from, next) {
    for(var i = 0; i < this.timeouts.length; i++) {
      clearTimeout(this.timeouts[i]);
    }
    next()
  },

  computed: {
    ...mapState("quotes", ["quotes"]),
  },

  methods: {
    ...mapActions("quotations", ["getQuotation"]),
    formattedDate(date) {
      var m = new Date(date)
      var dateString = m.getDate() +"/"+ (m.getMonth() + 1) + "/" + m.getFullYear() + " - " + m.getHours() + ":" + String(m.getMinutes()).padStart(2, "0")
      return dateString
    },
    suppliersText(total) {
      if (total > 1)
        return total + ' fornecedores acionados'
      else
        return '1 fornecedor acionado'
    },
    automaticQuotations() {
      if(this.quotes.quotations && this.quotes.quotations.length)
        return this.quotes.quotations.filter(obj => obj.supplierType == 'Automático')
      else
        return []
    },
    manualQuotations() {
      if(this.quotes.quotations && this.quotes.quotations.length)
        return this.quotes.quotations.filter(obj => obj.supplierType == 'Manual')
      else
        return []
    },
    checkStatusTimeout(quotationId) {
      var id = setTimeout(() => {
        this.getQuotation({ id: quotationId }).then((response) => {
          if(response.processed && response.supplierType == 'Automático') {
            this.findQuotationControlById(quotationId).status = true
            this.notificationSound.play()
          } else if((response.status == 'Aceita' || response.status == 'Recusada') && response.supplierType == 'Manual') {
            this.findQuotationControlById(quotationId).situation = response.status
            this.notificationSound.play()
          } else
            this.checkStatusTimeout(quotationId)
        })
      }, this.getRndInteger(7000, 14000))
      this.timeouts.push(id)
    },
    getRndInteger(min, max) {
      return Math.floor(Math.random() * (max - min) ) + min
    },
    findQuotationControlById(id) {
      var quotation = this.quotationsControl.find(obj => obj.id == id)
      if(quotation)
        return quotation
      else
        return { status: null, situation: null }
    },
    goToHome() {
      this.$router.push({ name: 'home' })
    }
  },
  components: {

  },
  mixins: [timeFormatter]
};
</script>
