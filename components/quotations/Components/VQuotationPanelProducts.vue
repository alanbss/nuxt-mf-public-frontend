<template>
  <div class="card shadow-sm m-1">
    <div class="card-body">
      <h6 class="font-weight-bold text-primary">O que ele quer cotar de você</h6>
      <p class="mb-2">Ao aceitar esta cotação os produtos serão mostrados detalhadamente</p>


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
  },
  methods: {
    ...mapActions("quotes", [
      "createQuote"
    ]),
  },
  props: {
    products: {
      type: Object,
      required: true
    },
  },
};
</script>
