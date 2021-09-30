<template>
  <div>
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
    <div class="row" style="background-color: #e8e8e8; padding-right: 10px; padding-left: 10px;">
      <div class="col-12">
        <ul class="nav nav-tabs mb-25" style="display: inline-block;">
          <li class="nav-item" v-for="family in families" :key="family"  style="display: inline-block;">
            <a href="javascript:void(0)" @click="selectFamily(family)" :class="familyClass(family)" style="padding: 7px;">
              {{ compactName(family) }}
            </a>
          </li>
        </ul>
        <vs-button
          @click.prevent.stop="$refs.categoryMenu.open($event)"
          class="ml-1 float-right" color="rgb(255, 255, 255)" type="filled"
          style="padding: 4px 5px; margin-top: 3px; border: 1px solid rgba(var(--vs-primary),1);"
        >
          <span style="color: rgba(var(--vs-primary),1);"><i class="feather icon-filter"></i> Procurar</span>
        </vs-button>
      </div>
      <vue-context ref="categoryMenu">
        <div class="ml-1 mr-1">
          Procurar em
          <h5>{{ selectedFamily }}</h5>
          <div class="d-flex flex-column" style="max-width: 300px;">
            <div
              v-for="(collections, collection) in resumedProductList[selectedFamily]" :key="collection"
              style="margin-bottom: 5px; border: LightGray 1px solid; padding: 3px;"
            >
              <i>{{ collection }}</i>
              <li v-for="(types, category) in collections" :key="category">

                <vs-button
                color="primary"
                type="flat"
                style="color: inherit; padding-left: 0; padding-top: 3px; padding-bottom: 3px; text-align: left;"
                class="mf-item-list"
                @click="scrollToElement(category)">
                  {{ category }}
                </vs-button>
              </li>
            </div>
          </div>
        </div>
      </vue-context>
    </div>
    <div style="max-height: calc(100vh - 7.5em); overflow-y: scroll; overflow-x: hidden; scroll-behavior: smooth;" ref="productsWindow">
      <div ref="content">
        <div class="row" style="padding: 10px 0; background-color: white; padding-right: 10px; padding-left: 10px;">
          <div class="col-4">
            <span class="mb-0" style="color: black; font-weight: 450;">Minha lista</span>
          </div>
          <div class="col-8">
            <span class="mb-0 font-small-3" style="color: #5c5c5c;">Produtos que você já cotou</span>
          </div>
        </div>

        <div v-if="loadProductTypes && loadProductTypes.length" style="width: 96%; padding-right: 2%; padding-left: 2%;">
          <div v-for="category in getCategories(loadProductTypes)" :key="'cat' + category.name">
            <div
              class="card shadow-sm mt-2 mb-1"
              :id="'category-header-' + category.name"
              v-if="hasProductsFromCategory(category.name)"
              style="background-color: #F3FEFC;"
            >
              <div class="card-body d-flex justify-content-between">
                <div class="">
                  <i class="font-small-3" v-if="category.collection">{{ category.collection }}</i>
                  <!-- <i class="font-small-3" v-else><br></i> -->
                  <span class="d-block">{{ category.name }}</span>
                </div>
                <div class="text-center mt-1 mt-md-0 text-sm-right">
                  <add-all-button :categoryId="getCategoryId(category.name)" :count="true" :small="true" />
                </div>
              </div>
            </div>
            <!-- <div v-for="type in getTypesFromCategory(category.name, renderingStructure)" :key="'type' + type.productTypeId">
              <span v-if="type.rendered"> -->
                <div class="row pl-1" v-for="(chunk, index) in productChunks(productsFromCategory(category.name))" :key="index">
                  <span
                    v-for="product in chunk"
                    :key="'product' + product.id"
                    :style="widthRatio ? 'width: ' + widthRatio + '%;' : ''"
                    :id="'product-header-' + product.categoryId + '-' + product.id"
                  >
                    <product-card :product="product" :blockProductTypeTitle="true" :isProductList="true" />
                  </span>
                  <!-- <div v-if="loading" class="d-flex justify-content-center" style="margin-top: 100px; margin-left: 40px;">
                    <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
                      <span class="sr-only">Loading...</span>
                    </div>
                  </div> -->
                  <vs-divider class="mb-1" />
                </div>
              <!-- </span>
            </div> -->
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import AddAllButton from "@/resources/products/components/AddAllButton";
import ProductCard from "@/resources/products/components/ProductCard";
import VueContext from 'vue-context';
import 'vue-context/dist/css/vue-context.css';

export default {
  name: "CatalogPublicMobile",
  data() {
    return {
      color: "#0cb695",
      loader: "spinner",
      width: 110,
      height: 110,
      backgroundColor: "#0cb695",
      opacity: 0.3,
      fullPage: true,
      selectedFamily: null,
      selectedCategory: null,
      familyCollections: null,
      familyCategories: null,
      showProducts: [],
      isLoading: false,
      loadProductTypes: [],
      totalRendered: 0,
      loadIndex: 0,
      scrollingDown: false,
      families: []
    };
  },
  mounted() {
    this.getResumedProductList().then(() => {
      for(var family in this.resumedProductList) {
        this.families.push(family)
      }
      if(this.resumedProductList) {
        this.initFamily(Object.keys(this.resumedProductList)[0])
      }
    })
    this.scroll()
  },

  updated() {

  },

  computed: {
    ...mapState("users/products", ["renderingStructure", "resumedProductList"]),
    ...mapState("products", ["products"]),
    ...mapState("suppliers", [
      "supplier",
      "supplierProducts",
      "supplierExpeditions"
    ]),
    collectionNames() {
      if(this.familyCollections)
        return Object.keys(this.familyCollections)
      else
        return null
    },
    maxPerScreen() {
      if(window.innerWidth >= 700) {
        return 3
      } else {
        return 2
      }
    },

    widthRatio() {
      return ((window.innerWidth / this.maxPerScreen) / window.innerWidth) * 100
    },
  },
  methods: {
    ...mapActions("products", [
      "getProductsByProductTypeId",
      "getProductsInListFromProductType",
      "getProductsInListFromProperty",
      "getProductsInListFromCategory",
      "clearProducts"
    ]),
    ...mapActions("users/products", [
      "changeProductTypeName",
      "getResumedProductList",
      "setProductProperties",
      "updatePosAndHeight"
    ]),
    ...mapActions("suppliers", [
      "getCatalogById",
      "getSupplierBySlug",
      "getCatalogByProductTypeAndSupplier",
      "getExpeditionsByProductType"
    ]),
    hasProductsFromCategory(categoryName) {
      return this.products.filter(product => (product.categoryName == categoryName)).length > 0
    },
    productsFromCategory(categoryName) {
      return this.products.filter(product => (product.categoryName == categoryName))
    },
    initFamily(familyName) {
      this.clearProducts()
      this.totalRendered = 0
      this.createFamilyData(this.resumedProductList[familyName])
      this.selectedFamily = this.families[0]
      if(this.loadProductTypes.length) {
        this.isLoading = true
        this.getProductsInListFromCategory({ categoryId: this.loadProductTypes[0].categoryId }).then(() => {
          this.totalRendered++
          this.loadProductTypes[0].rendered = true
          this.isLoading = false
          if(this.loadProductTypes[1]) {
            this.isLoading = true
            this.getProductsInListFromCategory({ categoryId: this.loadProductTypes[1].categoryId }).then(() => {
              this.totalRendered++
              this.loadProductTypes[1].rendered = true
              this.isLoading = false
              if(this.loadProductTypes[2]) {
                this.isLoading = true
                this.getProductsInListFromCategory({ categoryId: this.loadProductTypes[2].categoryId }).then(() => {
                  this.totalRendered++
                  this.loadProductTypes[2].rendered = true
                  this.isLoading = false
                })
              }
            })
          }
        })
      }
    },
    familyClass(family) {
      if (this.selectedFamily && (this.selectedFamily == family))
        return "nav-link active"
      else
        return "nav-link"
    },
    productChunks(products) {
      var result = []
      var data = products
      for(var i = 0; i < data.length; i++){
        if(i % this.maxPerScreen == 0)
          result.push([])
        result[Math.floor(i / this.maxPerScreen)].push(data[i]);
      }
      return result
    },
    selectFamily(family) {
      if(this.selectedFamily != family) {
        this.initFamily(family)
        this.selectedFamily = family
      }
    },
    selectCategory(family) {
      this.familyCollections = this.catalog[family]
    },
    compactName(family) {
      if(family == 'Alimentos e bebidas')
        return 'A&B'
      else if(family == 'Embalagens')
        return 'Embal.'
      else if(family == 'Limpeza')
        return 'Limp.'
      else
        return 'Utens.'
    },
    categoriesNames(collection) {
      return Object.keys(this.familyCollections[collection])
    },
    // selectFirstFromFamily(family) {
    //   let firstFamily = this.catalog[family]
    //   let firstCollection = firstFamily[Object.keys(firstFamily)[0]]
    //   let firstCategory = firstCollection[Object.keys(firstCollection)[0]]
    //   if(firstCategory && firstCollection) {
    //     this.selectProductType(firstCategory[0]).then(() => {
    //       if(this.loadProductTypes[1])
    //         this.selectProductType(this.loadProductTypes[1].productType).then(() => {
    //           if(this.loadProductTypes[2])
    //             this.selectProductType(this.loadProductTypes[2].productType)
    //         })
    //     })
    //   }
    // },
    async selectProductType(productType) {
      this.isLoading = true
      var ended = null
      ended = await this.getCatalogByProductTypeAndSupplier({ productTypeId: productType.productTypeId, supplierId: this.supplier.id }).then(() => {
        this.showProducts.push({ name: productType.productType,
                                 products: this.supplierProducts })
        this.isLoading = false
        this.loadProductTypes[this.totalRendered].rendered = true
        this.totalRendered++
      })
      return ended
    },
    scroll() {
      this.$refs['productsWindow'].onscroll = () => {
        if(this.$refs['productsWindow'] && this.$refs['content']) {
          let bottomOfWindow = this.$refs['productsWindow'].scrollTop + this.$refs['productsWindow'].offsetHeight > (this.$refs['content'].offsetHeight - 20)
          if(bottomOfWindow && !this.isLoading && this.totalRendered < this.loadProductTypes.length) {
            this.isLoading = true
            var elem = this.loadProductTypes[this.totalRendered]
            if(this.totalRendered < (this.loadProductTypes.length) && !elem.rendered) {
              this.getProductsInListFromCategory({ categoryId: elem.categoryId }).then(() => {
                this.totalRendered++
                elem.rendered = true
                this.isLoading = false
                if(this.scrollingDown)
                  this.checkScrollingDown()
              })
            }

          }
        }
      }
    },
    createFamilyData(data) {
      this.loadProductTypes = []
      let renderingList = []
      for(let collection in data) {
        for(let category in data[collection]) {
          for(let type in data[collection][category]) {
            let properties = data[collection][category][type]
            for(let i = 0; i < properties.length; i++) {
              let property = properties[i]
              if(!renderingList.find(obj => obj.categoryId == property.categoryId)) {
                renderingList.push({ categoryId: property.categoryId,
                                     rendered: false,
                                     categoryName: category,
                                     collectionName: collection,
                                     position: 0 })
              }
            }
          }
        }
      }
      this.loadProductTypes = renderingList
    },
    async scrollToElement(category) {
      this.selectedCategory = category
      for(var i = 0; i < this.loadProductTypes.length; i++) {
        if(this.loadProductTypes[i].categoryName == this.selectedCategory) {
          if(this.loadProductTypes[i].rendered) {
            var elmnt = document.querySelectorAll(`*[id^="category-header-${this.loadProductTypes[i].categoryName}"]`)[0]
            this.$refs['productsWindow'].scrollTop = elmnt.offsetTop - 50
          } else {
            this.scrollingDown = true
            this.$refs['productsWindow'].scrollTop = this.$refs['content'].offsetHeight
          }
          break
        }
      }
    },
    checkScrollingDown() {
      if(this.scrollingDown && this.loadProductTypes[this.totalRendered - 1].categoryName != this.selectedCategory) {
        this.$refs['productsWindow'].scrollTop = this.$refs['content'].offsetHeight
        this.$refs['productsWindow'].dispatchEvent(new CustomEvent('scroll'))
      } else if (this.scrollingDown) {
        this.scrollingDown = false
        setTimeout(() => {
          //var elmnt = this.$refs[this.loadProductTypes[this.totalRendered - 1].productType.productType]
          var elmnt = document.querySelectorAll(`*[id^="category-header-${this.loadProductTypes[this.totalRendered - 1].categoryName}"]`)[0]
          this.$refs['productsWindow'].scrollTop = elmnt.offsetTop - 50
        }, 700)
      }
    },
    getCategories(typeProducts) {
      let categories = typeProducts.map(prod => ({ name: prod.categoryName, collection: prod.collectionName }))
      let uniqueCategories = categories.filter((thing, index, self) => self.findIndex(t => t.name === thing.name && t.collection === thing.collection) === index)
      return uniqueCategories
    },
    getCategoryId(categoryName) {
      var hasProducts = this.products.filter(prod => (prod.categoryName == categoryName && prod.hasSupplier))
      if(hasProducts.length && hasProducts[0].categoryId) {
        return hasProducts[0].categoryId
      } else {
        return null
      }
    },
  },
  props: {

  },
  components: {
    VueContext,
    ProductCard,
    AddAllButton
  }
};
</script>
