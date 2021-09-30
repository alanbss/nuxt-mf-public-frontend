<template>
<div>
  <div class="header-navbar-shadow"></div>
  <div class="content-wrapper mt-0">
    <loading-overlay
      :active.sync="isLoading"
      :is-full-page="fullPage"
      :loader="loader"
      :color="color"
      :background-color="backgroundColor"
      :opacity="opacity"
      :width="width"
      :height="height"
    />
    <div class="content-body">
      <div class="py-2 px-2 bg-mf-verde" style="margin: -2.35rem -2.20rem 1.50rem -2.20rem;">
        <h4 class="m-0 pl-75 font-weight-bold text-white">
          <a href="/" title="Voltar" class="text-white position-relative" style="top: 3px;"><i class="feather icon-arrow-left font-medium-5 mr-1"></i></a>
          Revise antes de abrir a cotação
        </h4>
      </div>
      <div class="row" style="max-height: calc(100vh - 9em); overflow-y: scroll;">
          <div class="col-md-9 pb-5 pb-md-0" :style="this.mobileBrowser ? 'padding-top: 120px;' : 'padding-right: 50px;' ">
            <div v-for="(collections, family) in resumedQuoteCart" :key="family">
              <h3 v-if="productsFromFamily(family).length > 0">{{ family }}</h3>

              <span
                v-for="(categories, collection) in collections"
                :key="collection"
              >
                <span
                  v-for="(productTypes, category) in categories"
                  :key="category"
                  class=""
                >
                  <span
                    v-for="(properties, type) in productTypes"
                    :key="type"
                  >
                    <span v-if="productsFromProductType(type, category).length > 0">
                      <p class="mb-0 mt-2"><i v-if="collection">{{ collection }} &nbsp;|&nbsp;</i> {{ category }}</p>
                      <p class="mb-50 font-weight-bold">{{ type }}</p>
                      <div class="card shadow-sm">
                        <div class="card-body p-0">

                          <review-quote-product-card
                            v-for="product in productsFromProductType(type, category)"
                            :key="'product' + product.id"
                            :product="product"
                            :mobileBrowser="mobileBrowser"
                            @item-removed="updateQuoteCart"
                          />

                        </div>
                      </div>
                    </span>
                  </span>
                </span>
              </span>
              <br>
            </div>

            <div v-if="mobileBrowser" class="card shadow-sm bg-primary bg-lighten-5 mt-2">
              <div class="card-body p-1 text-center font-small-3">
                <span class="font-weight-bold d-block d-md-inline mb-1">Faltou alguma coisa?</span>
                <a href="/minha-lista-de-produtos" class="btn btn-outline-primary bg-white waves-effect waves-light font-weight-bold font-small-2 px-1 mx-1">Adicionar da minha lista</a>
                <a href="/" class="font-weight-bold font-small-2">Procurar no site</a>
              </div>
            </div>
            <v-footer :class="this.mobileBrowser == true ? 'mobile' : 'desktop' " style="margin-top:100px;" />
          </div>
          <div class="col-md-3 sidebar-mf-r position-fixed" :style="mobileBrowser ? '' : 'right: 25px'">
            <div class="card shadow-sm mb-2" style="background-color: #5ce9c6;">
              <div class="card-body p-1 text-center font-small-3 row">
                <div class="col-6 col-md-12">
                  <span class="d-block mb-25"><strong>{{ productsInQuoteCart }} produtos incluídos</strong></span>
                  <span class="d-block mt-25"><strong v-if="quoteSuppliers && !isDisabled">{{ quoteSuppliers }} {{ suppliersCountText }}</strong></span>
                </div>
                <div class="col-6 col-md-12">
                  <button
                    :disabled="isDisabled"
                    @click="newQuote()"
                    class="btn btn-primary waves-effect waves-light font-weight-bold font-small-2 w-100 mt-0 mt-md-1 px-0"
                  >
                    <b-spinner v-if="buttonLoading" small/>
                   <span v-else> <i class="feather icon-send mr-50"></i> ABRIR COTAÇÃO </span>
                  </button>
                </div>
              </div>
            </div>
            <div class="card shadow-sm mb-2" v-if="!mobileBrowser">
              <div class="card-body p-1 text-center font-small-3">
                <h5>Como funciona?</h5>
                <p>Vamos encaminhar sua cotação aos fornecedores que possuem o que você está precisando.</p>
                <p>Nós avisaremos você cada vez que eles responderem os preços (via email). Então você poderá emitir pedidos de compra a cada um.</p>
              </div>
            </div>
            <div v-if="!mobileBrowser" class="card shadow-sm bg-primary bg-lighten-5 mt-1">
              <div class="card-body p-1 text-center font-small-3 row">
                <div class="col-12 col-md-12">
                  <span class="font-weight-bold d-block d-md-inline mb-1">Faltou alguma coisa?</span>
                </div>
                <div class="col-12 col-md-12" v-if="productsInList > 0">
                  <button @click="toMyProducts()" style="width: 170px" class="btn btn-outline-primary bg-white waves-effect waves-light font-weight-bold font-small-2 px-1 mx-1 mt-1">
                  <b-spinner v-if="productLoading" small/>
                  <span v-else>Adicionar da minha lista</span>
                  </button>
                </div>
                <div class="col-12 col-md-12 mt-1">
                  <button @click="toHome()" style="color: blue" class="btn btn-link font-weight-bold font-small-2">
                    <b-spinner  variant="success" v-if="homeLoading" small/>
                    <span v-else>Procurar no site</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  </div>
</div>
</template>

<style>
.desktop{
  margin-left: 0px !important;
}
.mobile{
  margin-bottom: 20px;
}
</style>

<script>
import { mapState, mapActions } from "vuex";
import ClientProductQuoteCartService from '@/resources/clients/services/clients.product.quote.cart.services';
import VProductCard from "@/resources/products/components/ProductCard";
import ReviewQuoteProductCard from "@/resources/products/components/ReviewQuoteProductCard";
import VFooter from "@/layouts/main/components/VFooter";

export default {
  data() {
    return {
      color: "#0cb695",
      loader: "spinner",
      width: 250,
      height: 250,
      backgroundColor: "#0cb695",
      opacity: 0.3,
      fullPage: true,
      isLoading: false,
      selectedCategory: undefined,
      showProducts: undefined,
      mobileBrowser: false,
      currentScreen: undefined,
      buttonLoading: false,
      productLoading: false,
      homeLoading: false
    };
  },

  created() {
    this.isLoading = true
    this.isMobile()
    this.currentScreen = 'menu'
    this.getQuoteCart().then(() => {

      if(this.$route.query.autoOpen && (this.$route.query.autoOpen == 'true' || this.$route.query.autoOpen == true)) {
        if(this.productQuoteCart && this.productQuoteCart.length)
          this.newQuote()
        else
          this.$router.push({ name: 'home' })
      } else {
        this.countQuoteSuppliers(this.productQuoteCart.map(product => product.id))
      }
      this.getProductsFromIds(this.productsInCartIds)
        setTimeout(() => {
         this.isLoading = false
        }, 1000);

    })


  },

  computed: {
    ...mapState("products", ["products"]),
    ...mapState("quotes", ["quoteSuppliers"]),
    ...mapState("users/products", [
      "productTypeName",
      "resumedQuoteCart",
      "productQuoteCart"
    ]),
    productsInCartIds() {
      return this.$store.state.users.products.productQuoteCart.map(product => product.id)
    },
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
    isDisabled() {
      if(this.productsInQuoteCart > 0)
        return false
      else
        return true
    },
    suppliersCountText() {
      if(this.quoteSuppliers && this.quoteSuppliers > 1)
        return 'fornec. serão acionados'
      else if(this.quoteSuppliers == 1)
        return 'fornec. será acionado'
      else
        return null
    },
  },

  methods: {
    ...mapActions("products", ["getProductsFromIds"]),
    ...mapActions("quotes", ["countQuoteSuppliers", "createQuote"]),
    ...mapActions("users/products", [
      "getQuoteCart",
      "getResumedQuoteCart",
      "clearQuoteCart",
      "clearResumedQuoteCart"
    ]),
    productTypeQuantity(types) {
      return types.length === 1 ? "1 tipo de produto" : `${types.length} tipos de produtos`;
    },
    defineCategory(data) {
      this.selectedCategory = data
      this.showProducts = null
      this.currentScreen = 'products'
    },
    productsQuantityText(quantity) {
      return quantity === 1 ? "1 produto" : `${quantity} produtos`;
    },
    updateQuoteCart() {
      this.getProductsFromIds(this.productsInCartIds)
    },
    cleanSelectedProductType() {
      //let name = this.selectedCategory.category
      //this.selectedCategory = null
      //this.selectCategory(name)
      this.showProducts = null
    },
    async selectCategory(name) {
      this.getResumedQuoteCart().then(() => {
        for(let key in this.resumedQuoteCart) {
          for(let category in this.resumedQuoteCart[key]) {
            if(category == name) {
              this.selectedCategory = { category: category, productTypes: this.resumedQuoteCart[key][category] }
            }
          }
        }
      })
    },
    selectProductType(productType) {
      let productsFromType = this.products.filter(prod => prod.productTypeId == productType.productTypeId)
      let productsInCart = []
      for(var i = 0; i < productsFromType.length; i++) {
        if(this.productQuoteCart.find(prod => prod.id == productsFromType[i].id)) {
          productsInCart.push(productsFromType[i])
        }
      }
      this.showProducts = { name: productType.productType,
                            products: productsInCart }
    },
    productsFromProductType(productTypeName, categoryName) {
      return this.products.filter(prod => (prod.productTypeName == productTypeName && prod.categoryName == categoryName))
    },
    productsFromFamily(familyName) {
      return this.products.filter(prod => prod.familyName == familyName)
    },
    newQuote() {
      if(!this.buttonLoading) {
        this.buttonLoading = true
        if(this.$auth.check()) {
           setTimeout(() => {
            this.buttonLoading = false
            this.$vs.loading()
            this.createQuote(this.productQuoteCart.map(product => product.id)).then(() => {
              this.clearQuoteCart()

              this.$vs.loading.close()
              this.$router.push({ name: 'users.quoteSent' })
            })
          }, 300);
        } else {
          setTimeout(() => {
            this.buttonLoading = false

            this.$router.push({ name: 'sign-up' })
          }, 300);
        }
      }
    },
    isMobile() {
      if (screen.width <= 760 || window.innerWidth <= 760) {
        this.mobileBrowser = true
      } else {
        this.mobileBrowser = false
      }
    },
    showScreen(name){
      if(this.mobileBrowser && this.currentScreen == name) {
        return true
      } else if(!this.mobileBrowser) {
        return true
      } else {
        return false
      }
    },
    toMyProducts(){
      this.productLoading = true
      setTimeout(() => {
        this.productLoading = false
        location.href = '/minha-lista-de-produtos'
      }, 300);
    },
    toHome(){
      this.homeLoading = true
      setTimeout(() => {
        this.homeLoading = false
        location.href ='/'
      }, 300);
    }
  },
  components: {
    ReviewQuoteProductCard,
    VFooter,
    // VProductCard,
  }
};
</script>
