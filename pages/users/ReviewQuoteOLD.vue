<template>
<div>
  <div class="content-wrapper pb-0">
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
      <div class="row">
        <div class="col-md-3" v-if="showScreen('menu')">
          <h4 class="text-body">Revise sua cotação</h4>
          <p class="font-small-3">Revise antes de acionar os fornecedores</p>

          <div class="card shadow-sm mb-0">
            <div v-if="resumedQuoteCart">
              <div class="card bg-transparent mb-0" style="max-height: calc(100vh - 17em); overflow-y: scroll;">
                <div v-for="(collections, family) in resumedQuoteCart" :key="family">
                  <div slot="header" class="m-1 font-small-3 font-weight-bold">
                    {{ family }}
                  </div>
                  <span
                    v-for="(categories, collection) in collections"
                    :key="collection"
                  >
                    <div class="m-1 font-small-2">
                      {{ collection }}
                    </div>
                    <div id="'collapseCategoria' + index" class="" >
                      <div class="card-body font-small-3 pt-0">
                        <ul class="list-group list-group-flush">
                          <li
                            v-for="(productTypes, category) in categories"
                            :key="category"
                            class="list-group-item px-25"
                          >
                            <a href="javascript:void(0);" @click="defineCategory({ category, productTypes })" class="d-block">
                              <i class="feather icon-chevron-right mt-25 float-right font-medium-1 d-md-none"></i>
                              <strong>{{ category }}</strong>
                              <span class="d-block text-body mt-25">{{ productTypeQuantity(productTypes) }}</span>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </span>
                </div>
              </div>
            </div>
            <div v-else>
              Não há produtos para cotar.
            </div>
          </div>
        </div>
        <div class="col-md-9" v-if="showScreen('products')">
          <div v-if="selectedCategory && !showProducts">
            <div class="border-left pl-2">
              <a v-if="mobileBrowser" href="javascript:void(0)" @click="currentScreen = 'menu'" title="Voltar">
                <i class="feather icon-arrow-left my-50 mr-1 float-left font-large-1"></i>
              </a>
              <h4>{{ selectedCategory.category }}</h4>
              <p class="font-small-3">Produtos inclusos na cotação</p>
            </div>
            <div class="row pl-1">
              <div
                class="col-md-3 col-6 mb-1 pl-0"
                v-for="productType in selectedCategory.productTypes"
                :key="productType.id"
              >
                <div class="card h-100 shadow-sm p-1 font-small-3 mb-0">
                  <a href="javascript:void(0)" @click="selectProductType(productType)">
                    <i class="feather icon-arrow-right mt-25 float-right font-medium-1"></i>
                    <strong>{{ productType.productType }}</strong>
                    <span class="d-block text-body mt-25">{{ productsQuantityText(productType.quantity) }}</span>
                  </a>
                </div>
              </div>
            </div>
            <div class="mt-2 mb-3">
              <h6>Faltou algum produto?</h6>
              <p class="mt-2">
                <router-link
                  v-if="productsInList && productsInList > 0"
                  :to="{ name: 'my-product-list' }"
                  class="btn btn-outline-primary bg-white text-bold-600 waves-effect waves-light mr-2 mb-1"
                >
                  Adicionar da minha lista
                </router-link>
                <a href="/" class="font-weight-bold d-sm-inline d-block mb-1">Procurar no site</a>
              </p>
            </div>
          </div>

          <div v-if="showProducts">
            <div class="mt-6 border-left pl-2">
              <a href="javascript:void(0)" @click="cleanSelectedProductType()" title="Voltar">
                <i class="feather icon-arrow-left my-50 mr-1 float-left font-large-1"></i>
              </a>
              <h4>{{ showProducts.name }}</h4>
              <p class="font-small-3">Produtos inclusos na cotação</p>
            </div>
            <div style="max-height: calc(100vh - 17em); overflow-y: scroll;">
              <vs-row>
                <v-product-card v-for="product in showProducts.products" :key="product.id" :product="product" />
              </vs-row>
              <div class="mt-2 mb-0">
                <h6>Faltou algum produto?</h6>
                <p class="mt-2">
                  <router-link
                    v-if="productsInList && productsInList > 0"
                    :to="{ name: 'my-product-list' }"
                    class="btn btn-outline-primary bg-white text-bold-600 waves-effect waves-light mr-2 mb-1"
                  >
                    Adicionar da minha lista
                  </router-link>
                  <a href="/" class="font-weight-bold d-sm-inline d-block mb-1">Procurar no site</a>
                </p>
              </div>
            </div>
          </div>

          <div v-if="!selectedCategory && !showProducts && showScreen('start')">
            <div style="margin-top: 80px;">
              <div class="row d-flex justify-content-center">
                <h3 class="color-mf-verde font-weight-bold">Estamos quase lá!</h3>
              </div>
              <div class="row d-flex justify-content-center">
                <p class="m-0">Que tal revisar sua cotação agora?</p>
              </div>
              <div class="row d-flex justify-content-center">
                <p class="m-0">Confira se você incluiu tudo que está precisando.</p>
              </div>
              <div class="row d-flex justify-content-center">
                <h6 class="mt-2">Sua cotação tem {{ productsInQuoteCart }} produtos.</h6>
              </div>
              <div class="row d-flex justify-content-center" v-if="this.quoteSuppliers">
                <h6>E vai acionar {{ suppliersCountText }}.</h6>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  </div>
  <div class="w-100 py-1 px-2 bg-secondary position-fixed" style="bottom: 0">
    <p class="m-0 pt-50 pl-25 text-dark float-left">
      <i class="feather icon-file-text font-medium-3 d-sm-inline d-none"></i>
      <span class="d-sm-inline d-none">
        Sua cotação tem {{ productsInQuoteCart }} produtos<span v-if="this.quoteSuppliers">, acionará {{ suppliersCountText }}</span>
      </span>
    </p>
    <p class="m-0 pr-25 float-right">
      <button
        :disabled="isDisabled"
        type="button"
        @click="newQuote()"
        class="btn btn-primary waves-effect waves-light font-weight-bold"
      >
        <i class="feather icon-send"></i>&nbsp; Abrir cotação
      </button>
    </p>
  </div>
</div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import ClientProductQuoteCartService from '@/resources/clients/services/clients.product.quote.cart.services';
import VProductCard from "@/resources/products/components/ProductCard";

export default {
  data() {
    return {
      color: "#0cb695",
      loader: "spinner",
      width: 110,
      height: 110,
      backgroundColor: "#0cb695",
      opacity: 0.3,
      fullPage: true,
      isLoading: false,
      selectedCategory: undefined,
      showProducts: undefined,
      mobileBrowser: false,
      currentScreen: undefined
    };
  },

  created() {
    this.isLoading = true
    this.isMobile()
    this.currentScreen = 'menu'
    this.getQuoteCart().then(() => {
      this.isLoading = false
      if(this.$route.query.autoOpen && (this.$route.query.autoOpen == 'true' || this.$route.query.autoOpen == true))
        this.newQuote()
      else
        this.countQuoteSuppliers(this.productQuoteCart.map(product => product.id))
      this.getProductsFromIds(this.productsInCartIds)
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
        return this.quoteSuppliers + ' fornecedores'
      else if(this.quoteSuppliers == 1)
        return '1 fornecedor'
      else
        return null
    }
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
    newQuote() {
      if(this.$auth.check()) {
        this.$vs.loading()
        this.createQuote(this.productQuoteCart.map(product => product.id)).then(() => {
          this.clearQuoteCart()

          this.$vs.loading.close()
          this.$router.push({ name: 'users.quoteSent' })
        })
      } else {
        this.$router.push({ name: 'sign-up' })
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
    }
  },
  components: {
    VProductCard,
  }
};
</script>
