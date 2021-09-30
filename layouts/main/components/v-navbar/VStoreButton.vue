<template>
  <li class="nav-item position-relative float-right">
    <span
      v-if="isMobile"
      v-show="storeTotal > 0"
      class="badge badge-pill badge-up margin-emit-btn mr-1 font-small-3"
      style="background: #ffcc00; color: black; top: 9px; right: 72px; z-index: 9999;"
      ref="priceBadge"
    >
      {{ formatPrice(storeTotal) }}
    </span>
    <span
      v-else
      v-show="storeTotal > 0"
      class="badge badge-pill badge-up margin-emit-btn mr-1 font-small-3"
      style="background: #ffcc00; color: black; top: 9px; right: 122px; z-index: 9999;"
      ref="priceBadge"
    >
      {{ formatPrice(storeTotal) }}
    </span>
    <div>
      <span id="tooltip-button-1">
        <button
          @click="goToReviewOrder()"
          :disabled="isDisabled"
          :class="[
          !isDisabled ?
          'btn btn-outline-azul margin-emit-btn waves-effect font-small-3 waves-light px-2 animate__animated animate__flash mr-10' :
          'btn btn-outline-primary waves-effect margin-emit-btn font-small-3 waves-light px-2 mr-10'
          ]"
        >
          <!-- <span class="button-text-full">{{ storeTotal }}</span> -->
          <span v-if="isMobile" class="">Emitir</span>
          <span v-else class="">Emitir pedido</span>

        </button>
      </span>
      <b-tooltip target="tooltip-button-1" placement="bottom" triggers="hover" v-if="isDisabled">
        Valor mín. não atingido
      </b-tooltip>
    </div>
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
    .margin-emit-btn {
      margin-top: 10px;
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
  .mr-10 {
    margin-right: 10px;
  }
</style>

<script>
//import VQuoteButton from "~/components/quotes/Components/VQuoteButton";
import priceFormatter from "@/mixins/priceFormatter";
import { mapActions, mapState } from "vuex";

export default {
  name: "VStoreButton",
  components: {
    //VQuoteButton
  },
  computed: {
    productsInStoreCart() {
      if (this.$store.state.users.products.storeProducts)
        return this.$store.state.users.products.storeProducts.length
      else
        return 0
    },
    storeTotal() {
      if (this.$store.state.users.products.storeTotal)
        return this.$store.state.users.products.storeTotal
      else
        return 0
    },
    isDisabled() {
      return !(this.storeTotal > 0 && this.storeCanBuy)
    },
    isMobile() {
      if (screen.width <= 760 || window.innerWidth <= 760) {
        return true
      } else {
        return false
      }
    },
    ...mapState("users/products", ["storeProducts", "storeCanBuy"]),
    ...mapState("suppliers", ["supplier"]),
  },
  watch: {
    storeTotal() {
      this.$refs.priceBadge.classList.add('animate__animated', 'animate__heartBeat');

      this.$refs.priceBadge.addEventListener('animationend', () => {
        this.$refs.priceBadge.classList.remove('animate__animated', 'animate__heartBeat')
      });
    }
  },
  methods:{
    ...mapActions("orders", [
      "createOrder"
    ]),
    newQuote() {
      //this.createQuote(this.productQuoteCart.map(product => product.id)).then(() => {
        this.$router.push('users.reviewQuote')
      //})
    },
    goToReviewOrder() {
      this.isLoading = true
      setTimeout(() => {
        this.isLoading = false
        this.createOrder({ supplierId: this.supplier.id, products: this.storeProducts }).then((response) => {
          this.$router.push({ name: 'users.reviewOrder', params: { supplierSlug: this.$route.params.supplierSlug, orderId: response.id } })
        })
      }, 300);
    }
  },
  mixins: [
    priceFormatter
  ]
};
</script>
