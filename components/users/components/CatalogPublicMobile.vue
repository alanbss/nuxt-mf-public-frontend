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
    <ul class="nav nav-tabs mb-25" style="display: inline-block;">
      <li class="nav-item" v-for="family in Object.keys(catalog)" :key="family"  style="display: inline-block;">
        <a href="javascript:void(0)" @click="selectFamily(family)" :class="familyClass(family)" style="padding: 7px;">
          {{ compactName(family) }}
        </a>
      </li>
    </ul>
    <vs-select
      class="m-1"
      placeholder="Selecionar categoria de produto"
      v-model="selectedCategory"
      style="width: 95%;"
      v-if="selectedFamily"
      @input="scrollToElement()"
      >
      <div :key="collection" v-for="(collection) in collectionNames">
        <vs-select-group :title="collection">
          <vs-select-item :key="index2" :value="category" :text="category" v-for="(category, index2) in categoriesNames(collection)" />
        </vs-select-group>
      </div>
    </vs-select>
    <div style="max-width: 99%; max-height: calc(100vh - 15em); overflow-x: hidden; overflow-y: scroll;" ref="productsWindow">
      <div ref="content">
        <span v-for="obj in showProducts" :key="obj.name" :ref="obj.name">
          <div class="row mt-1" v-for="(chunck, index) in productChunks(obj.products)" :key="index">
            <span
            class="pl-1"
              v-for="product in chunck"
              :key="product.id"
              :ref="obj.name"
              :style="widthRatio ? 'width: ' + widthRatio + '%;' : ''"
            >
              <product-public-card :product="product" :showTypeName="true" :supplierUserName="supplier.user.name" />
            </span>
            <vs-divider class="mb-1" />
            </div> 
          </span>
        <div v-if="isLoading" class="d-flex justify-content-center" style="margin-top: 200px;">
          <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    </div>
    <!-- <vs-select
      class="selectExample"
      label="Categoria"
      v-model="selectedCategory"
      >
      <vs-select-item :key="index" :value="category" :text="category" v-for="(category, index) in categoriesNames" />
    </vs-select> -->
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import ProductPublicCard from "~/components/products/components/ProductPublicCard";

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
      scrollingDown: false
    };
  },
  mounted() {
    this.selectFamily(Object.keys(this.catalog)[0])
    this.scroll()
  },

  updated() {

  },

  computed: {
    ...mapState("users/products", ["renderingStructure"]),
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
    familyClass(family) {
      if (this.selectedFamily && (this.selectedFamily == family))
        return "nav-link active"
      else
        return "nav-link"
    },
     productChunks(products) {
      var result = []
      var data = products
      if(data) {
        for(var i = 0; i < data.length; i++){
          if(i % this.maxPerScreen == 0)
            result.push([])
          result[Math.floor(i / this.maxPerScreen)].push(data[i]);
        }
      }
      return result
    },
    selectFamily(family) {
      this.selectedFamily = family
      this.showProducts = []
      this.totalRendered = 0
      this.selectedCategory = null
      this.createFamilyData(this.catalog[family])
      this.selectCategory(family)
      this.selectFirstFromFamily(family)
    },
    selectCategory(family) {
      this.familyCollections = this.catalog[family]
    },
    compactName(family) {
      if(family == 'Alimentos e bebidas')
        return 'Alim. & Beb.'
      else
        return family
    },
    categoriesNames(collection) {
      return Object.keys(this.familyCollections[collection])
    },
    selectFirstFromFamily(family) {
      let firstFamily = this.catalog[family]
      let firstCollection = firstFamily[Object.keys(firstFamily)[0]]
      let firstCategory = firstCollection[Object.keys(firstCollection)[0]]
      if(firstCategory && firstCollection) {
        this.selectProductType(firstCategory[0]).then(() => {
          if(this.loadProductTypes[1])
            this.selectProductType(this.loadProductTypes[1].productType).then(() => {
              if(this.loadProductTypes[2])
                this.selectProductType(this.loadProductTypes[2].productType)
            })
        })
      }
    },
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
          if(bottomOfWindow && !this.isLoading) {
            var elem = this.loadProductTypes[this.totalRendered]
            if(this.totalRendered < (this.loadProductTypes.length) && !elem.rendered) {
              this.selectProductType(elem.productType).then(() => {
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
          for(var i = 0; i < data[collection][category].length; i++) {
            renderingList.push({ productType: data[collection][category][i],
                                 rendered: false,
                                 category: category })
          }
        }
      }
      this.loadProductTypes = renderingList
    },
    async scrollToElement() {
      for(var i = 0; i < this.loadProductTypes.length; i++) {
        if(this.loadProductTypes[i].category == this.selectedCategory) {
          if(this.loadProductTypes[i].rendered) {
            var elmnt = this.$refs[this.loadProductTypes[i].productType.productType]
            this.$refs['productsWindow'].scrollTop = elmnt[0].offsetTop - 200
          } else {
            this.scrollingDown = true
            this.$refs['productsWindow'].scrollTop = this.$refs['content'].offsetHeight
          }
          break
        }
      }
    },
    checkScrollingDown() {
      if(this.scrollingDown && this.loadProductTypes[this.totalRendered - 1].category != this.selectedCategory) {
        this.$refs['productsWindow'].scrollTop = this.$refs['content'].offsetHeight
        this.$refs['productsWindow'].dispatchEvent(new CustomEvent('scroll'))
      } else if (this.scrollingDown) {
        this.scrollingDown = false
        setTimeout(() => {
          var elmnt = this.$refs[this.loadProductTypes[this.totalRendered - 1].productType.productType]
          this.$refs['productsWindow'].scrollTop = elmnt[0].offsetTop - 200
        }, 700)
      }
    }
  },
  props: {
    catalog: {
      type: Object,
      required: true
    }
  },
  components: {
    ProductPublicCard
  }
};
</script>
