<template>
  <li v-if="productsInQuoteCart" class="nav-item position-relative">   
    <div >
      <div v-if="productsInQuoteCart">
        <button
          @click="setToViewQuote()"
          :class="[
          productsInQuoteCart ?
          'btn btn-outline-azul waves-effect font-small-3 waves-light px-2 animate__animated animate__flash' :
          'btn btn-outline-primary waves-effect font-small-3 waves-light px-2'
          ]"
        >
        <span class="button-text-full">Abrir cotação $</span>
        <span class="button-text-small">Cotar $</span>

        </button>
      </div>
     <div v-else>
        <vs-dropdown vs-custom-content vs-trigger-click style="color: white;">
          <a
          :class="[productsInQuoteCart ?
          'btn btn-outline-azul waves-effect font-small-3 waves-light px-2 animate__animated animate__flash' :
          'btn btn-outline-primary waves-effect font-small-3 waves-light px-2'
          ]"
          href.prevent
        >
          <span class="button-text-full">Abrir cotação $</span>
          <span class="button-text-small">Cotar $</span>

        </a>
          <vs-dropdown-menu style="width: 300px;">
            <div class="text-white bg-primary text-center p-2 mb-1" style="border-radius:5px" >
              <span class="text-break-line d-block font-weight-bold font-medium-3">Você ainda não selecionou produtos para cotar</span>
              <span class="d-block font-small-3 mb-1"></span>
            </div>
          </vs-dropdown-menu>
        </vs-dropdown>
        </div>

    </div>
    
      

    <span
      v-if="isMobile"
      v-show="productsInQuoteCart"
      class="badge badge-pill badge-up margin-emit-btn mr-1 font-small-3"
      style="background: #ffcc00; color: black; top:2px; right: 72px; z-index: 9999;"
    >
      {{ productsInQuoteCart }}
    </span>
    <span
      v-else
      v-show="productsInQuoteCart"
      class="badge badge-pill badge-up margin-emit-btn mr-1 font-small-3"
      style="background: #ffcc00; color: black; top: 9px; right: 122px; z-index: 9999;"
    >
      {{ productsInQuoteCart }}
    </span>
  </li>
</template>

<style>
  @media only screen and (max-width: 760px) {
    .button-text-small{
      display: inline-block;
    }
    .button-text-full{
      display: none;
    }
  }
  @media only screen and (min-width: 761px) {
    .button-text-small{
      display: none;
    }
    .button-text-full{
      display: inline-block;
    }
  }
</style>

<script>
//import VQuoteButton from "@/resources/quotes/Components/VQuoteButton";
import { mapActions, mapState } from "vuex";
export default {
  name: "VQuotationButton",
  components: {
    //VQuoteButton
  },
  computed: {
    productsInQuoteCart() {
      if (this.$store.state.users.products.productQuoteCart)
        return this.$store.state.users.products.productQuoteCart.length
      else
        return 0
    },
    productsInList() {
      if (this.$store.state.users.products.totalProductList)
        return this.$store.state.users.products.totalProductList
      else
        return 0
    },
    isMobile() {
      if (screen.width <= 760 || window.innerWidth <= 760) {
        return true
      } else {
        return false
      }
    },
    ...mapState("users/products", ["productQuoteCart"]),
  },
  methods:{
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
  }
};
</script>
