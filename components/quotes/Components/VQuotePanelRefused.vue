<template>
  <div class="vh-100 overflow-auto" style="padding-bottom: 8.80rem;">
    <div class="card shadow-sm m-1">
      <div class="card-body ml-2">
        <h4 class="font-weight-bold text-primary">
          <i class="feather icon-thumbs-down" style="margin-left: -25px;"></i>
          Este fornecedor recusou atender sua cotação
        </h4>
        <p class="font-small-3">
          A decisão é tomada unicamente pelo fornecedor,<br>
          você pode esclarecer diretamente com ele.
        </p>
        <div v-if="this.quotation.refuseJustification">
          <p class="font-small-2 mb-0">Razão informada</p>
          <h6 v-for="justification in justifications" :key="justification">{{ justification }}</h6>
          <h6>{{ quotation.refuseComments }}</h6>
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
    justifications() {
      return JSON.parse(this.quotation.refuseJustification)
    }
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
  },
};
</script>
