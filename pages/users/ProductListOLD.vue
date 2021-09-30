<template>
  <div class="content-wrapper p-0" style="margin-top: 4.50rem;">
    <div class="content-body">
      <div class="row mx-md-0" style="height: calc(100vh - 4.5rem); overflow: hidden;">
        <product-list-resume v-if="showScreen('menu')" @selectProductType="selectProductType" :isMobile="mobileBrowser" />

        <div class="col-md-9 p-0" v-if="showScreen('products')" style="background: #E5DDD5;">
          <div class="p-2" style="background: #EDEDED; border-bottom: solid 1px #D5D5D5">
            <a v-if="mobileBrowser" href="javascript:void(0);" @click="currentScreen = 'menu'" title="Voltar" class="d-md-none">
              <i class="feather icon-arrow-left mr-1 mt-25 float-left font-large-1"></i>
            </a>
            <h6 class="m-0 font-weight-bold">
              {{productTypeName}}
            </h6>
            <add-all-button :productIds="getProductIds"/>
          </div>

          <div style="padding-bottom: 10.50rem; overflow-y: scroll; height: calc(100vh - 4.5rem);">
            <div class="row mx-0 my-1">
              <product-card v-for="product in products" :key="product.id" :product="product" :blockProductTypeTitle="true" />

              <div class="col-12">
                <vs-pagination :total="totalPages" v-model="currentPage" :max="10" :color="'#7367F0'" />
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
import ProductCard from "~/components/products/components/ProductCard";
import AddAllButton from "~/components/products/components/AddAllButton";
import { mapState, mapActions } from "vuex";

export default {
  name: "ProductList",
  data() {
    return {
      productTypeId: undefined,
      mobileBrowser: false,
      currentScreen: undefined
    };
  },
  created() {
    this.isMobile()
    this.currentScreen = 'menu'
  },
  mounted() {
    //this.getProducts()
  },
  computed: {
    ...mapState("products", ["products"]),
    //...mapState("productTypes", ["products"]),
    ...mapState("pagination", ["totalPages"]),
    ...mapState("users/products", ["productTypeName"]),
    getProductIds() {
      return this.products.map(product => product.id)
    },
    currentPage: {
      get() {
        return this.$store.state.pagination.currentPage;
      },
      set(value) {
        this.$store.dispatch("pagination/setCurrentPage", value);
      },
    },
  },
  methods: {
    ...mapActions("products", ["getProducts", "getProductsInListFromProductType"]),
    ...mapActions("pagination", ["userSelectedPage", "setCurrentPage"]),
    ...mapActions("productTypes", ["getProductsByPageNumber"]),
    selectProductType(selected) {
      this.productTypeId = selected
      this.currentScreen = 'products'
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
  },
  watch: {
    currentPage(pageNumber) {
      this.$vs.loading()
      this.userSelectedPage(pageNumber)
      this.getProductsInListFromProductType(this.productTypeId).then(() => {
        this.$vs.loading.close()
      })
    },
  },
  components: {
    ProductListResume,
    ProductCard,
    AddAllButton
  },
};
</script>
