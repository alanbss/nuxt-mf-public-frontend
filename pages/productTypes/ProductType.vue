<template>
  <div style="max-height: calc(100vh); overflow-y: scroll" ref="productsWindow">
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
    <div ref="content">
      <div
        class="content-wrapper pt-0 pb-0"
        style="
          padding-left: 2px;
          padding-right: 0px;
          margin-top: 4.5rem;
          overflow-x: hidden;
        "
      >
        <div class="content-header row" style="">
          <div class="content-header-left col-12 mb-2">
            <products-filter />
            <span id="hidden-element"></span>
          </div>
        </div>

        <div class="content-body mt-1 mr-1 ml-1">
          <div class="row">
            <div class="col-md-3 col-xl-2 pl-0" v-if="!mobileBrowser">
              <products-filter-vertical />
            </div>
            <div class="col-12 col-md-9 col-xl-10">
              <div class="row">
                <div class="col-12 col-md-6">
                  <h2 v-if="productType" style="color: #212121">
                    {{ productType.name }}
                  </h2>
                </div>
                <div class="col-12 col-md-6">
                  <div
                    class="d-flex justify-content-between"
                    v-if="mobileBrowser"
                  >
                    <add-all-button
                      v-if="!loadingProducts"
                      :productIds="filterOptions.filteredIds"
                      :count="true"
                      style="margin-right: 5px"
                    />
                    <div
                      style="
                        padding: 0.75rem 1rem;
                        position: absolute;
                        right: -14px;
                        background-color: white;
                        border-radius: 0.5rem;
                      "
                    >
                      <span class="dot" v-if="hasFilters()"></span>
                      <a
                        style="
                          border-bottom: 1px solid #007bff;
                          padding-bottom: 1px;
                          color: #007bff;
                        "
                        @click="updateSidebar(true)"
                      >
                        <i
                          class="feather icon-check-square font-medium-2"
                          style="margin-left: 5px"
                        ></i>
                        Filtrar
                      </a>
                    </div>
                  </div>
                  <div class="float-right" v-else>
                    <add-all-button
                      v-if="!loadingProducts"
                      :productIds="filterOptions.filteredIds"
                      :count="true"
                      style="margin-right: 5px"
                    />
                  </div>
                </div>
              </div>
              <div class="d-flex justify-content-center" v-if="loadingProducts">
                <div
                  class="spinner-border"
                  style="width: 5rem; height: 5rem"
                  role="status"
                >
                  <span class="sr-only">Loading...</span>
                </div>
              </div>
              <div
                class="row mt-1"
                v-for="(chunk, index) in productChunks()"
                :key="index"
              >
                <span
                  v-for="product in chunk"
                  :key="product.id"
                  :style="widthRatio ? 'width: ' + widthRatio + '%;' : ''"
                >
                  <product-card :product="product" />
                </span>
                <vs-divider class="mb-1" />
              </div>
            </div>
          </div>

          <!-- <div class="row">
            <div class="col-12">
              <v-product-paginator />
            </div>
          </div> -->
        </div>
        <v-footer />
      </div>
    </div>
    <filters-sidebar
      ref="filtersMobile"
      v-if="mobileBrowser"
      :openSidebar="openSidebar"
      @update-sidebar="updateSidebar"
    />
  </div>
</template>

<style>
.dot {
  height: 10px;
  width: 10px;
  background-color: PaleGreen;
  border-radius: 50%;
  display: inline-block;
}
</style>

<script>
import ProductsFilter from "@/resources/productTypes/components/ProductsFilter";
import ProductsFilterVertical from "@/resources/productTypes/components/ProductsFilterVertical";
import FiltersSidebar from "@/resources/productTypes/components/FiltersSidebar";
import ProductCard from "@/resources/products/components/ProductCard";
import AddAllButton from "@/resources/products/components/AddAllButton";
import VFooter from "@/layouts/main/components/VFooter";
import ProductTypeService from "@/resources/productTypes/services";
import { mapActions, mapGetters, mapState } from "vuex";
var sortBy = require("lodash.sortby");

export default {
  name: "ProductType",
  metaInfo() {
    return {
      title: this.titleContent,
      titleTemplate: "%s",

      meta: [
        { charset: "utf-8" },
        {
          vmid: "description",
          name: "description",
          content: this.descriptionContent,
        },
      ],
    };
  },
  data() {
    return {
      productTypeId: null,
      isLoading: false,
      color: "#0cb695",
      loader: "spinner",
      width: 110,
      height: 110,
      backgroundColor: "#0cb695",
      opacity: 0.3,
      fullPage: true,
      collections: [],
      loadingProducts: true,
      mobileBrowser: false,
      openSidebar: false,
      productType: null,
      titleContent: null,
      descriptionContent: null,
    };
  },
  created() {
    if (
      !this.$auth.user() &&
      (!this.params.region_id || !this.params.serves_type)
    )
      this.$router.push({ name: "home" });

    this.isMobile();

    this.clearFilters();
    this.currentPage = 1;
    this.loadingProducts = true;
    this.productTypeId = this.$route.params.productTypeId;
    ProductTypeService.get(this.productTypeId).then((producTypeResponse) => {
      this.productType = producTypeResponse.data;
    });
    this.setFilterProductType(this.productTypeId);
  },

  mounted() {
    this.getProducts().then(() => {
      this.loadingProducts = false;

      this.titleContent =
        "Preços de " +
        this.products[0].categoryName +
        ", " +
        this.products[0].productTypeName +
        " | Meu Fornecedor";

      this.descriptionContent =
        "Precisa comprar " +
        this.products[0].categoryName +
        ", " +
        this.products[0].productTypeName +
        " para o seu restaurante, padaria, minimercado? Veja os preços de várias distribuidoras.";
    });
    if (this.userLogged) {
      this.getProductList().then(() => {
        sortBy(this.products, "propertyName", "packagingName", "brandName");
      });
    }
    this.scroll();
  },

  watch: {
    currentPage(pageNumber, oldPageNumber) {
      this.userSelectedPage(pageNumber);
      if (pageNumber > oldPageNumber) {
        this.isLoading = true;
        this.getProductsAndAdd().then(() => {
          this.isLoading = false;
          this.loadingProducts = false;
        });
      }
    },
  },
  computed: {
    ...mapGetters("productTypes", ["products"]),
    ...mapState("productTypes", ["filterOptions"]),
    ...mapState("pagination", ["totalPages"]),
    ...mapGetters("navigationFilters", ["params"]),

    currentPage: {
      get() {
        return this.$store.state.pagination.currentPage;
      },
      set(value) {
        this.$store.dispatch("pagination/setCurrentPage", value);
      },
    },

    maxPerScreen() {
      if (window.innerWidth >= 1910) {
        return 8;
      } else if (window.innerWidth >= 1680 && window.innerWidth < 1910) {
        return 7;
      } else if (window.innerWidth >= 1450 && window.innerWidth < 1680) {
        return 6;
      } else if (window.innerWidth >= 1220 && window.innerWidth < 1450) {
        return 5;
      } else if (window.innerWidth >= 1000 && window.innerWidth < 1220) {
        return 3;
      } else {
        return 2;
      }
    },

    widthRatio() {
      return (window.innerWidth / this.maxPerScreen / window.innerWidth) * 100;
    },

    userLogged() {
      return this.$auth.check() ? true : false;
    },

    productTypeName() {
      if (this.products.length) {
        return this.products[0].productTypeName;
      } else {
        return "";
      }
    },

    categoryName() {
      if (this.products.length) {
        return this.products[0].categoryName;
      } else {
        return "";
      }
    },

    familyName() {
      if (this.products.length) {
        return this.products[0].familyName;
      } else {
        return "";
      }
    },

    categoryId() {
      if (this.products.length) {
        return this.products[0].categoryId;
      } else {
        return "";
      }
    },

    familyId() {
      if (this.products.length) {
        return this.products[0].familyId;
      } else {
        return "";
      }
    },

    getProductIds() {
      return this.filteredIds;
    },
  },
  methods: {
    ...mapActions("productTypes", [
      "getProducts",
      "setFilterProductType",
      "getProductsAndAdd",
      "clearFilters",
    ]),
    ...mapActions("users/products", ["getProductList"]),
    ...mapActions("pagination", ["userSelectedPage"]),
    updateSidebar(val) {
      this.openSidebar = val;
      if (!val) this.$refs.filtersMobile.updateFilters();
    },
    productChunks() {
      var result = [];
      var data = sortBy(
        this.products,
        "propertyName",
        "packagingName",
        "brandName"
      );
      for (var i = 0; i < data.length; i++) {
        if (i % this.maxPerScreen == 0) result.push([]);
        result[Math.floor(i / this.maxPerScreen)].push(data[i]);
      }
      return result;
    },
    scroll() {
      this.$refs["productsWindow"].onscroll = () => {
        if (this.$refs["productsWindow"] && this.$refs["content"]) {
          let bottomOfWindow =
            this.$refs["productsWindow"].scrollTop +
              this.$refs["productsWindow"].offsetHeight >
            this.$refs["content"].offsetHeight - 20;
          if (bottomOfWindow && !this.isLoading) {
            if (this.totalPages > this.currentPage) this.currentPage++;
          }
        }
      };
    },
    isMobile() {
      if (screen.width <= 760 || window.innerWidth <= 760) {
        this.mobileBrowser = true;
      } else {
        this.mobileBrowser = false;
      }
    },
    hasFilters() {
      if (
        this.filterOptions.data.brand_ids.length ||
        this.filterOptions.data.packaging_ids.length ||
        this.filterOptions.data.property_ids.length ||
        this.filterOptions.data.tag_ids.length
      )
        return true;
      else return false;
    },
  },
  components: {
    ProductsFilter,
    ProductsFilterVertical,
    ProductCard,
    AddAllButton,
    FiltersSidebar,
    VFooter,
  },
};
</script>
