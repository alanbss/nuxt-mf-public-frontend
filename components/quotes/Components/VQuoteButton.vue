<template>
  <button
    @click="setToViewQuote()"
    class="btn font-small-3 font-weight-bold bg-white text-primary width-100 m-auto waves-effect waves-light"
  > 
  <b-spinner v-if="isLoading" small/>
   <span v-else >Avançar</span>  
  </button>
</template>

<script>
//import { mapActions, mapGetters } from "vuex";
import { mapActions, mapState } from "vuex";

export default {
   data() {
    return {
      isLoading: false
    };
  },
  computed: {
    //...mapGetters("users/products", ["productIsOnList", "productIsOnCart", "productCartIsEmpty"]),
    ...mapState("users/products", ["productQuoteCart"]),
  },
  methods: {
    ...mapActions("quotes", [
      "createQuote"
    ]),
    newQuote() {
      //this.createQuote(this.productQuoteCart.map(product => product.id)).then(() => {
        this.$router.push('users.reviewQuote')
      //})
    },
    setToViewQuote() {
      this.isLoading = true
      setTimeout(() => {
        this.isLoading = false
        this.$router.push({ name: 'users.reviewQuote' })
      }, 300);
    }
  },
};
</script>
