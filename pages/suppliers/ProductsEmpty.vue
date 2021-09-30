<template>
  <div class="content-wrapper" :key="updater">
    <div class="content-header row col-md-6 offset-md-3">
      <div class="content-header-left">
        <div class="row breadcrumbs-top">
          <div class>
            <h1 class="content-header-title">Etapa 2 de 2</h1>
          </div>
        </div>
      </div>
    </div>
    <div class="content-body">
      <div class="card col-md-6 offset-md-3">
        <div class="row">
          <div class>
            <div class="card-header"></div>
            <div class="card-content">
              <div class="card-body pt-25">
                <b-container>
                  <b-row class="align-items-center">
                    <b-col class="col-3" align="center">
                      <i class="feather icon-package pl-200 font-large-5"></i>
                    </b-col>

                    <b-col class="col-9">
                      <h4 class="card-title font-large-0">Agora só falta seu catálogo</h4>
                      <p
                        class="card-title color-mf-vermelho text-justify"
                      >Colocar seus produtos no Meu Fornecedor é nossa responsabilidade. Mas, é claro, precisamos da sua ajuda para o cadastramento.</p>
                    </b-col>
                  </b-row>
                </b-container>
                <p
                  class="mt-2 mb-1 font-small-5 text-justify"
                >Nos envie as informações sobre seus produtos. Marcas, tamanhos, formas de expedições e todo tipo de característica.</p>

                <p class="mb-1 font-small-5">Entre em contato!</p>
                <p class="mb-1 font-small-5">
                  <button type="submit" class="btn btn-success waves-effect waves-light mx-2 px-1">
                    <i class="fa fa-whatsapp mr-50"></i> WhatsApp
                  </button> (85) 98921-3161
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";

export default {
  name: "ProductsEmpty",
  data() {
    return {
      updater: 0
    };
  },
  updated() {
    window.location.reload()
  },
  mounted() {
    this.getConfiguration();
  },
  computed: {
    ...mapState("suppliers/configurations", ["configuration"]),
    ...mapGetters("suppliers/configurations", [
      "clientTypeCompleted",
      "minimumOrderValueCompleted",
      "deliveriesCompleted",
      "deliveryAreasCompleted",
      "paymentMethodsCompleted",
      "allCompleted",
    ]),
  },
  methods: {
    ...mapActions("suppliers/configurations", ["getConfiguration"]),
  },
  beforeRouteLeave (to, from , next) {
    this.updater++
  },
  components: {},
};
</script>
