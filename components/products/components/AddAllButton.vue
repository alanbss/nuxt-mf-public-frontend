<template>
  <span>
    <vs-button v-if="productIds && productIds.length" @click="addAllProducts" color="primary" type="border" style="width: 200px;">
      {{ buttonText }} <span v-if="count">({{ productIds.length }})</span><i class="feather icon-check-square font-medium-2" style="margin-left: 5px;"></i>
    </vs-button>
    <vs-button v-if="categoryId" @click="addAllAsyncProducts" color="primary" type="border" :style="small ? 'width: 140px; padding: 5px 2px;' : 'width: 200px;'">
      {{ buttonText }} <span v-if="count">({{ productAsyncIds.length }})</span><i v-if="!small" class="feather icon-check-square font-medium-2" style="margin-left: 5px;"></i>
    </vs-button>
  </span>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import ProductsService from "@/resources/products/services";

export default {
  name: "AddAllButton",
  data() {
    return {
      productAsyncIds: [],
      mobileBrowser: false,
    }
  },
  created() {
    this.isMobile()
  },
  mounted() {
    if(this.categoryId) {
      this.getProductIds(this.categoryId)
    }
  },
  computed: {
    ...mapGetters("users/products", ["productIsOnList", "productIsOnCart", "productCartIsEmpty"]),
    infoMessage() {
      return this.productIds.length + ` produtos adicionados.`;
    },
    infoAsyncMessage() {
      return this.productAsyncIds.length + ` produtos adicionados.`;
    },
    buttonText() {
      if(this.mobileBrowser)
        return 'Adic. todos'
      else
        return 'Adicionar todos'
    }
  },
  methods: {
    ...mapActions("users/products", [
      "insertManyProductsToQuoteCart",
    ]),
    addAllProducts() {
      this.insertManyProductsToQuoteCart(this.productIds).then(() => {
        this.cartInfo(this.infoMessage, "add-cart-toast-class", "feather icon-plus-circle")
      })
    },
    addAllAsyncProducts() {
      this.insertManyProductsToQuoteCart(this.productAsyncIds).then(() => {
        this.cartInfo(this.infoAsyncMessage, "add-cart-toast-class", "feather icon-plus-circle")
      })
    },
    async getProductIds(categoryId) {
      // let getIds = []
      // getIds.push(this.productsFromPropertyNotInQuote(categoryName).map(product => product.id))
      // let [productIds] = getIds
      if(categoryId) {
        ProductsService.getIdsInListFromCategory(categoryId).then((response) => {
          this.productAsyncIds = response.data
        })
      }
    },
    isMobile() {
      if (screen.width <= 760 || window.innerWidth <= 760) {
        this.mobileBrowser = true
      } else {
        this.mobileBrowser = false
      }
    },
  },
  props: {
    productIds: {
      type: Array,
    },
    categoryId: {
      type: Number
    },
    count: {
      type: Boolean
    },
    small: {
      type: Boolean
    }
  },
  components: {

  },
};
</script>
