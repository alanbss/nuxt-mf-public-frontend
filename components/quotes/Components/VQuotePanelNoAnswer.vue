<template>
  <div class="vh-100 overflow-auto" style="padding-bottom: 8.80rem;">
    <div class="card shadow-sm m-1" v-if="!quotation.hasExpired">
      <div class="card-body">
        <h6 class="font-weight-bold text-primary">Aguardando o fornecedor apresentar seus preços</h6>
        <p class="font-small-3">Não se preocupe, nós vamos avisar você por email quando ele responder.</p>
        <div class="alert alert-warning font-small-3 mb-0 d-inline-block" role="alert">
          <span class="text-dark">Fique atento ao seu email cadastrado: <strong>{{ userEmail }}</strong></span>
        </div>
      </div>
    </div>

    <div class="card shadow-sm m-1">
      <div class="card-body">
        <h6 class="font-weight-bold mb-2 text-primary">Este fornecedor tem estes produtos da sua cotação:</h6>
        <div class="row" :key="family" v-for="(categories, family) in products">
          <div class="col-12">
            <h4 class="card-title">{{ family }}</h4>
          </div>
          <div
            class="col-md-3 col-6"
            v-for="(productTypes, category) in categories"
            :key="category"
          >
              <div class="card">
                <h6 class="card-subtitle text-muted mb-1">{{ category }}</h6>
                <ul class="list-group list-group-flush font-small-3">
                  <li
                    class="list-group-item px-50 bg-white"
                    v-for="(product, index) in productTypes"
                    :key="index"
                  >
                    {{ product.productType }}
                  </li>
                </ul>
              </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card shadow-sm m-1" v-if="!quotation.hasExpired">
      <div class="card-body">
        <h6 class="font-weight-bold text-primary mb-2">O que você poderá fazer quando ele responder?</h6>

        <div class="row">
          <div class="col-md-6">
              <p><i class="feather icon-tag mr-1"></i> Ver os preços de seus produtos</p>
              <p><i class="feather icon-copy mr-1"></i> Comparar com outros fornecedores</p>
          </div>
          <div class="col-md-6">
              <p><i class="feather icon-truck mr-1"></i> Ver condições de pagamento e entrega</p>
              <p><i class="feather icon-shopping-bag mr-1"></i> Emitir pedidos de compra</p>
          </div>
        </div>
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
      userEmail: ''
    }
  },
  mounted() {
    this.userEmail = this.$auth.user().email
  },
  computed: {
    //...mapGetters("users/products", ["productIsOnList", "productIsOnCart", "productCartIsEmpty"]),
    ...mapState("users/products", ["productQuoteCart"]),
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
    products: {
      type: Object,
      required: true
    },
  },
};
</script>
