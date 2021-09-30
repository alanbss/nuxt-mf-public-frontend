<template>
  <div>
    <div v-for="category in getCategories(renderingStructure)" :key="'cat' + category.name">
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
            <add-all-button :categoryId="getCategoryId(category.name)" :count="true"/>
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
              :id="'product-header-' + product.productTypeId + '-' + product.id"
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
</template>

<script>
import { mapState, mapActions } from "vuex";
import AddAllButton from "~/components/products/components/AddAllButton";
import ProductCard from "~/components/products/components/ProductCard";

export default {
  name: "ProductListProducts",
  data() {
    return {
      categoryIds: [],
      loading: true
    };
  },
  mounted() {

  },

  updated() {
    for(let i = 0; i < this.renderingStructure.length; i++) {
      if(this.renderingStructure[i].rendered) {
        var elem = document.getElementById('top' + this.renderingStructure[i].productTypeId)
        if(elem)
          this.updatePosAndHeight({ position: elem.offsetTop, height: elem.offsetHeight, index: i })
      }
    }
  },

  computed: {
    ...mapState("users/products", ["renderingStructure"]),
    maxPerScreen() {
      if(window.innerWidth >= 1910) {
        return 8
      } else if(window.innerWidth >= 1680 && window.innerWidth < 1910) {
        return 7
      } else if(window.innerWidth >= 1450 && window.innerWidth < 1680) {
        return 6
      } else if(window.innerWidth >= 1220 && window.innerWidth < 1450) {
        return 5
      } else if(window.innerWidth >= 1000 && window.innerWidth < 1220) {
        return 3
      } else if(window.innerWidth >= 800 && window.innerWidth < 1000) {
        return 2
      } else {
        return 1
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
    ...mapActions("pagination", ["userSelectedPage", "setCurrentPage"]),

    hasProductsFromCategory(categoryName) {
      return this.products.filter(product => (product.categoryName == categoryName)).length > 0
    },

    productsFromCategory(categoryName) {
      return this.products.filter(product => (product.categoryName == categoryName))
    },

    productsFromPropertyNotInQuote(categoryName) {
      return this.products.filter(product => (product.onQuotation == null && product.hasSupplier == true && product.categoryName == categoryName))
    },

    getCategoryId(categoryName) {
      var hasProducts = this.products.filter(prod => prod.categoryName == categoryName)
      if(hasProducts.length && hasProducts[0].categoryId) {
        return hasProducts[0].categoryId
      } else {
        return null
      }
    },

    getTypes(typeProducts) {
        let allTypes = {}
      typeProducts.forEach(product => {
        allTypes[product.productTypeName] = {
          categoryName: product.categoryName,
          collectionName: product.collectionName,
          productTypeName: product.productTypeName,
          productTypeId: product.productTypeId,
          propertyName: product.propertyName,
          propertyId: product.propertyId,
          rendered: product.rendered,
          products: []
        }
        if(allTypes[product.productTypeName].productTypeName == product.productTypeName){
          allTypes[product.productTypeName].products.push(product)
        }
      })
      return Object.entries(allTypes).map(([key, value]) => value)
    },
    getCategories(typeProducts) {
      let categories = typeProducts.map(prod => ({ name: prod.categoryName, collection: prod.collectionName }))
      let uniqueCategories = categories.filter((thing, index, self) => self.findIndex(t => t.name === thing.name && t.collection === thing.collection) === index)
      return uniqueCategories
    },
    getTypesFromCategory(category, typeProducts) {
      let allTypes = {}
      typeProducts.forEach(product => {
        if(product.categoryName == category) {
          allTypes[product.productTypeName] = {
            categoryName: product.categoryName,
            collectionName: product.collectionName,
            productTypeName: product.productTypeName,
            productTypeId: product.productTypeId,
            propertyName: product.propertyName,
            propertyId: product.propertyId,
            rendered: product.rendered,
            products: []
          }
          if(allTypes[product.productTypeName].productTypeName == product.productTypeName){
            allTypes[product.productTypeName].products.push(product)
          }
        }
      })
      return Object.entries(allTypes).map(([key, value]) => value)
    },
    getCollectionName(type){
      return this.products.filter(product => product.productTypeName = type)[0].categoryCollection
    },
    getCategoryName(type){
      return this.products.filter(product => product.productTypeName = type)[0].categoryName
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
  },
  props: {
    products: {
      type: Array,
      required: true
    },
    properties: {
      type: Array,
      required: true
    },
    mobileBrowser: {
      type: Boolean,
      required: true
    },
    productTypeName: {
      type: String,
      required: true
    }
  },
  components: {
    ProductCard,
    AddAllButton
  }
};
</script>
