<template>
  <div>
    <div v-if="mobileBrowser" class="content-wrapper pb-0 pt-0">
      <div class="content-body">
        <div class="row">
          <div class="col-12 pl-0 pr-0">
            <product-list-mobile/>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="content-wrapper p-0" style="margin-top: 4.50rem;">
      <div class="content-body">
        <div class="row mx-md-0" style="height: calc(100vh - 4.5rem); overflow: hidden;">
          <product-list-resume
            @selectProductType="selectProductType"
            :isMobile="mobileBrowser"
            @update-products="updateRender"
            @clicked-select="clickedSelect"
            @clear-last-request="clearLastRequest"
            @start-loading="startLoading"
            @stop-loading="stopLoading"
          />

          <div class="col-8 col-md-10 vh-100" ref="productsWindow" style="background: #F8F8F8; padding-bottom: 6rem; overflow: scroll; scroll-behavior: smooth;" id="products">
            <div ref="content" v-if="products.length > 0">
              <product-list-products
                :products="products"
                :properties="properties"
                :productTypeName="productTypeName"
                :mobileBrowser="mobileBrowser"
                :key="renderProducts" />

              <div v-if="loading" class="d-flex justify-content-center" style="margin-top: 200px;">
                <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
                  <span class="sr-only">Loading...</span>
                </div>
              </div>

              <div class="card shadow-sm" style="margin-top: 5em; margin-bottom: 8em;">
                <div class="card-body text-center">
                  <p class="font-small-3"><span class="d-inline-block pb-1 border-bottom">Esta lista torna mais rápida a montagem das suas cotações.<br>Todo produto que você cota é automaticamente incluído aqui.</span></p>
                  <p class="font-medium-2 font-weight-bold">Precisa de mais produtos?</p>
                  <button @click="toHome()" class="btn btn-primary waves-effect waves-light" style="width: 170px">
                    <b-spinner v-if="buttonLoading" small/>
                    <span v-else>Procurar no site</span>
                  </button>
                </div>
              </div>
            </div>
            <div v-if="loadingCategory" class="d-flex justify-content-center" style="margin-top: 200px;">
              <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
                <span class="sr-only">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProductListResume from "~/components/users/components/ProductListResume";
import ProductListProducts from "~/components/users/components/ProductListProducts";
import ProductListMobile from "~/components/users/components/ProductListMobile";
import { mapState, mapActions } from "vuex";

export default {
  name: "ProductList",
  data() {
    return {
      productTypeId: undefined,
      mobileBrowser: false,
      loading: false,
      loadingCategory: false,
      renderProducts: 0,
      lastScrollTop: 0,
      lastRequest: {
        productTypeId: null,
        propertyId: null
      },
      buttonLoading: false
    };
  },
  created() {
    this.isMobile()
  },
  mounted() {
    if(!this.mobileBrowser)
      this.scroll()
  },
  updated() {
    this.loadMore()
  },
  computed: {
    ...mapState("products", ["products"]),
    ...mapState("users/products", [
      "productTypeName",
      "properties",
      "renderingStructure",
      "currentPosition"
    ]),
  },
  methods: {
    ...mapActions("products", [
      "getProducts",
      "getProductsInListFromProductType",
      "getProductsInListFromProperty",
      "getProductsInListFromPropertyAndUpdate",
      "getProductsInListFromCategoryAndUpdate"
    ]),
    ...mapActions("productTypes", ["getProductsByPageNumber"]),
    ...mapActions("users/products", ["updateRenderingStructureByPosition"]),
    selectProductType(selected) {
      this.productTypeId = selected
    },
    isMobile() {
      if (screen.width <= 760 || window.innerWidth <= 760) {
        this.mobileBrowser = true
      } else {
        this.mobileBrowser = false
      }
    },

    scroll() {
      this.$refs['productsWindow'].onscroll = () => {
        if(this.$refs['productsWindow'] && this.$refs['content']) {
          let bottomOfWindow = this.$refs['productsWindow'].scrollTop + this.$refs['productsWindow'].offsetHeight > this.$refs['content'].offsetHeight - 20;
          if(bottomOfWindow && !this.loading) {
            this.calculateCurrentElem()
            if((this.currentPosition + 1) < this.renderingStructure.length && !this.renderingStructure[this.currentPosition + 1].rendered) {
              let categoryId = this.renderingStructure[this.currentPosition + 1].categoryId
              if(categoryId != this.lastRequest.categoryId) {
                this.lastRequest = { categoryId: categoryId }
                this.loading = true
                this.getProductsInListFromCategoryAndUpdate({ categoryId: categoryId, position: this.currentPosition + 1 }).then(() => {
                  this.loading = false
                })
              }
            }
          }
          this.lastScrollTop = this.$refs['productsWindow'].scrollTop
        }
      }
    },

    calculateCurrentElem() {
      for(let i = this.renderingStructure.length - 1; i >= 0; i--) {
        if(this.renderingStructure[i].rendered) {
          this.updateRenderingStructureByPosition(i)
          break
        }
      }
    },

    loadMore() {
      if(this.$refs['productsWindow'] && this.$refs['content'] && !this.loaded) {
        let lessThanWindow = this.$refs['productsWindow'].offsetHeight > this.$refs['content'].offsetHeight
        if(lessThanWindow && this.$refs['productsWindow'].scrollTop == 0) {
          if((this.currentPosition + 1) < this.renderingStructure.length && !this.renderingStructure[this.currentPosition + 1].rendered) {
            let categoryId = this.renderingStructure[this.currentPosition + 1].categoryId
            if(categoryId != this.lastRequest.categoryId) {
              this.loaded = true
              this.lastRequest = { categoryId: categoryId }
              this.getProductsInListFromCategoryAndUpdate({ categoryId: categoryId, position: this.currentPosition + 1 }).then(() => {
                this.loaded = false
                this.loadMore()
              })
            }
          }
        }
      }
    },

    updateRender() {
      this.renderProducts++
    },
    clickedSelect() {
      this.$refs['productsWindow'].dispatchEvent(new Event('scroll'))
      this.lastRequest = { categoryId: null }
      this.loaded = false
      this.loadMore()
      this.$forceUpdate()
    },
    clearLastRequest() {
      this.lastRequest = { categoryId: null }
    },
    startLoading() {
      this.loadingCategory = true
    },
    stopLoading() {
      this.loadingCategory = false
    },
    toHome(){
      this.buttonLoading = true
      setTimeout(() => {
        this.buttonLoading = false
        location.href ='/'
      }, 300);
    }
  },
  watch: {

  },
  components: {
    ProductListResume,
    ProductListProducts,
    ProductListMobile
  },
};
</script>
