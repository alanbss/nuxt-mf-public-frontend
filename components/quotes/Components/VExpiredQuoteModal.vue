<template>
  <vs-popup title="Cotação expirada" :active.sync="open">
    <div class="row m-0 pb-2 d-flex justify-content-center">
      <i class="feather icon-info" style="font-size: 7em; color: #f8bb86;"></i>
    </div>
    <div class="row m-0 pb-1 d-flex justify-content-center">
      <h6>Você pode abrir esta cotação apenas para consulta.</h6>
      <h6>Como ela expirou, não é possível emitir pedidos de compra</h6>
      <h6>e os fornecedores não podem mais mandar preços.</h6>
    </div>
    <div class="row m-0 pb-1 d-flex justify-content-between">
      <vs-button class="ml-2" @click="open = false" color="primary" type="border">Cancelar</vs-button>
      <vs-button class="mr-2" @click="goToQuote()" color="primary" type="filled" style="width: 50px">
       <b-spinner v-if="buttonLoading" small />
       <span v-else>Abrir</span> 
      </vs-button>
    </div>
  </vs-popup>

</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "VExpiredQuoteModal",
  data() {
    return {
      open: false,
      buttonLoading: false
    }
  },
  watch: {
    openPopup() {
      this.open = this.openPopup
    },
    open() {
      this.$emit('update-popup', this.open)
    },
  },
  computed: {

  },
  methods: {
    goToQuote() {
      this.buttonLoading = true
      setTimeout(() => {
        this.buttonLoading = false
        this.open = false
        this.$router.push({ name: 'users.quotePanel', params: { quoteId: this.quoteId } })
      }, 300);
      
    }
  },
  props: {
    openPopup: {
      type: Boolean,
      required: true,
    },
    quoteId: {
      type: Number,
      required: true,
    },
  },
  components: {

  },
};
</script>
