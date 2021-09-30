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

          <div class="card shadow-sm mb-0">
            <div v-if="catalog">
              <div class="card bg-transparent mb-0" style="max-height: calc(100vh - 12em); overflow-y: scroll;">
                <div v-for="(collections, family) in catalog" :key="family">
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
              Não há produtos no catálogo.
            </div>
          </div>
        </div>
        <div class="col-md-9" v-if="showScreen('products')">
          <div v-if="selectedCategory && !showProducts">
            <div class="border-left pl-2">
              <a href="javascript:voi(0);" @click="currentScreen = 'menu'" title="Voltar" class="d-md-none">
                <i class="feather icon-arrow-left mr-1 mt-n25 float-left font-large-1"></i>
              </a>
              <h4>{{ selectedCategory.category }}</h4>
              <p class="font-small-3">Produtos inclusos no seu catálogo</p>
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
          </div>

          <div v-if="showProducts">
            <div class="mt-6 border-left pl-2">
              <a href="javascript:void(0)" @click="cleanSelectedProductType()" title="Voltar">
                <i class="feather icon-arrow-left my-50 mr-1 float-left font-large-1"></i>
              </a>
              <h4>{{ showProducts.name }}</h4>
              <p class="font-small-3">Produtos inclusos no seu catálogo</p>
            </div>
            <div style="max-height: calc(100vh - 17em); overflow-y: scroll;">
              <vs-row>
                <supplier-catalog-product-card
                  v-for="product in showProducts.products"
                  :key="product.id"
                  :product="product"
                  :expeditions="expeditionsByProduct(product.id)" />
              </vs-row>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import SupplierCatalogProductCard from "~/components/products/components/SupplierCatalogProductCard";

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
    this.isMobile()
    this.currentScreen = 'menu'
    this.isLoading = true
    this.getCatalog().then(() => {
      this.isLoading = false
    })
  },

  computed: {
    ...mapState("suppliers", ["catalog", "supplierProducts", "supplierExpeditions"]),
  },

  methods: {
    ...mapActions("suppliers", ["getCatalog", "getCatalogByProductType", "getExpeditionsByProductType"]),
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
      this.showProducts = null
    },
    selectProductType(productType) {
      this.isLoading = true
      this.getCatalogByProductType(productType.productTypeId).then(() => {
        this.getExpeditionsByProductType(productType.productTypeId).then(() => {
          this.showProducts = { name: productType.productType,
                                products: this.supplierProducts }
          this.isLoading = false
        })
      })
    },
    expeditionsByProduct(productId) {
      return this.supplierExpeditions.filter(exp => exp.productExpedition.productId == productId)
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
    //   let productsFromType = this.products.filter(prod => prod.productTypeId == productType.productTypeId)
    //   let productsInCart = []
    //   for(var i = 0; i < productsFromType.length; i++) {
    //     if(this.productQuoteCart.find(prod => prod.id == productsFromType[i].id)) {
    //       productsInCart.push(productsFromType[i])
    //     }
    //   }
    //   this.showProducts = { name: productType.productType,
    //                         products: productsInCart }
    // },
  },
  components: {
    SupplierCatalogProductCard,
  }
}
</script>
