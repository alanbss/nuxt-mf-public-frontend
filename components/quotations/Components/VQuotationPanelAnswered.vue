<template>
  <div>
    <div class="card shadow-sm m-1">
      <div class="card-header justify-content-start">
          <div class="avatar bg-rgba-warning p-50 m-0 mr-2 mb-50 float-left" style="cursor: default;">
              <div class="avatar-content">
                  <i class="feather icon-check text-warning font-medium-5"></i>
              </div>
          </div>
          <div class="ml-2" v-if="this.$auth.user().supplierQuotationType == 'Manual'">
            <h4 class="card-title color-mf-laranja">Cotação respondida!</h4>
            <p class="my-25">O cliente já foi informado, por e-mail, sobre sua resposta.</p>
          </div>
          <div class="ml-2" v-else>
            <h4 class="card-title color-mf-laranja">Cotação respondida automaticamente!</h4>
            <p class="my-25">
              Ou seja, o cliente já tem acesso aos seus produtos com os preços. Por isso, lembre-se sempre de mantê-los atualizados!
            </p>
          </div>
      </div>
      <div class="card-body">
          <h5>E agora?</h5>
          <p class="font-small-3 mb-0">Agora é só aguardar pelo interesse dele.</p>
          <p class="font-small-3 mb-0 font-weight-bold">Pode ser que ele emita um pedido de compra a você.</p>
          <p class="font-small-3 mb-0">Se isso acontecer, vamos te avisar por email.</p>

          <h5 class="mt-3">Dica!</h5>
          <p class="font-small-3 mb-0">
            Fique sempre atento ao seu email! É por lá que informamos quando chega uma cotação para você. Também os pedidos de compra!
          </p>
      </div>
    </div>
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
    <div class="card shadow-sm m-1" v-if="!this.$auth.user().isAutomatic">
      <div class="card-header">
          <div class="w-100">
              <div class="avatar bg-rgba-light p-50 m-0 mr-2 mb-50 float-left" style="cursor: default;">
                      <div class="avatar-content">
                      <i class="feather icon-corner-up-left text-body font-medium-5"></i>
                  </div>
              </div>
              <h4 class="card-title">Precisa responder a cotação de novo?</h4>
              <p class="font-small-3 mb-0 font-weight-bold">
                <router-link :to="{ name: 'reply-quotation', params: { quotationId: quotation.id } }" title="Responder novamente">
                  Responder novamente
                </router-link>
              </p>
          </div>
      </div>
      <div class="card-body">
          <h5>Como funciona</h5>
          <p class="font-small-3 mb-0">Sua proposta pode ser toda alterada, mas o cliente ainda verá a atual enquanto você estiver reelaborando.</p>
      </div>
    </div>
  </div>
</template>

<script>
//import { mapActions, mapGetters } from "vuex";
import { mapActions, mapState } from "vuex";


export default {
  data() {
    return {

    }
  },
  mounted() {
    
  },
  computed: {
    //...mapGetters("users/products", ["productIsOnList", "productIsOnCart", "productCartIsEmpty"]),
    ...mapState("users/products", ["productQuoteCart"]),
    ...mapState("clients", ["client"]), 
  },
  methods: {
    ...mapActions("quotes", [
      "createQuote"
    ]),
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
  },
};
</script>
