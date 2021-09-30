<template>
  <div>
    <div v-if="mobileBrowser" class="content-wrapper pb-0 pt-0">
      <div class="content-body" v-if="supplier">
        <div
          class="py-2 px-2 bg-mf-verde"
          style="margin: -4.7rem -2.2rem 1.5rem -2.2rem"
        >
          <h4 class="m-0 pl-75 font-weight-bold text-white">
            {{ supplier.user.name }}
          </h4>
        </div>
        <div v-if="catalog" class="row" style="display: contents">
          <catalog-public-mobile :catalog="catalog" />
          <div
            class="position-fixed"
            style="bottom: 0; right: 0"
            v-if="showBtn && mobileBrowser"
          >
            <vs-button
              @click="goToHome()"
              class="animate__animated animate__pulse animate__infinite"
              color="primary"
              type="filled"
              style="
                margin-bottom: 30px;
                margin-right: 30px;
                box-shadow: 0 0 10px #0391d1;
              "
            >
              <i class="feather icon-dollar-sign font-medium-3"></i>
              Cotar para ver os preços
            </vs-button>
          </div>
        </div>
      </div>
    </div>
    <div
      v-else
      class="content-wrapper pb-0"
      style="max-height: calc(100vh - 5em); overflow-y: hidden"
    >
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
      <div class="content-body" v-if="supplier">
        <div class="row">
          <div class="col-md-3" v-if="showScreen('menu')">
            <h3 class="text-body color-mf-verde">
              <strong>{{ supplier.user.name }}</strong>
            </h3>
            <p>Monte sua cotação para receber os preços</p>
            <div class="card shadow-sm mb-0">
              <div v-if="catalog">
                <div
                  class="card bg-transparent mb-0"
                  style="max-height: calc(100vh - 14.3em); overflow-y: scroll"
                >
                  <div v-for="(collections, family) in catalog" :key="family">
                    <div
                      slot="header"
                      class="m-1 font-weight-bold font-medium-2"
                    >
                      {{ family }}
                    </div>
                    <span
                      v-for="(categories, collection) in collections"
                      :key="collection"
                    >
                      <div class="m-1">
                        {{ collection }}
                      </div>
                      <div id="'collapseCategoria' + index" class="">
                        <div class="card-body pt-0">
                          <ul class="list-group list-group-flush">
                            <li
                              v-for="(productTypes, category) in categories"
                              :key="category"
                              class="list-group-item px-25"
                            >
                              <span class="font-medium-1">{{ category }}</span>
                              <ul class="list-group list-group-flush">
                                <li
                                  v-for="productType in productTypes"
                                  :key="productType.productType"
                                  class="list-group-item px-25 font-medium-2"
                                >
                                  <a
                                    href="javascript:void(0);"
                                    @click="scrollToElement(productType)"
                                    class="d-block"
                                  >
                                    <strong>{{
                                      productType.productType
                                    }}</strong>
                                  </a>
                                </li>
                              </ul>
                              <!-- <span class="d-block text-body mt-25">{{ productTypeQuantity(productTypes) }}</span> -->
                            </li>
                          </ul>
                        </div>
                      </div>
                    </span>
                  </div>
                </div>
              </div>
              <div v-else>Não há produtos no catálogo.</div>
            </div>
          </div>
          <div
            class="col-md-9"
            v-if="showScreen('products')"
            ref="productsWindow"
            style="
              max-height: calc(100vh - 11em);
              padding-bottom: 6rem;
              overflow-x: hidden;
              overflow-y: scroll;
              scroll-behavior: smooth;
            "
            id="products"
          >
            <div ref="content">
              <!-- <div class="mt-6 border-left pl-2">
              <a v-if="mobileBrowser" href="javascript:void(0)" @click="cleanSelectedProductType()" title="Voltar">
                <i class="feather icon-arrow-left my-50 mr-1 float-left font-large-1"></i>
              </a>
              <h4>{{ showProducts.name }}</h4>
              <br>
            </div> -->
              <div v-if="showProducts && showProducts.length">
                <div
                  class="row mt-1"
                  v-for="(chunck, index) in productChunks(showProducts)"
                  :key="index"
                >
                  <span
                    v-for="product in chunck"
                    :key="'product' + product.id"
                    :style="widthRatio ? 'width: ' + widthRatio + '%;' : ''"
                    :id="product.productTypeName + '-' + product.id"
                  >
                    <product-public-card
                      :product="product"
                      :blockProductTypeTitle="false"
                      :supplierUserName="supplier.user.name"
                    />
                  </span>
                  <vs-divider class="mb-3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="position-fixed d-sm-block d-none"
      style="bottom: 0; right: 0"
      v-if="showBtn && !mobileBrowser"
    >
      <vs-button
      @click="goToHome()"
        class="animate__animated animate__pulse animate__infinite"
        color="primary"
        type="filled"
        style="
          margin-bottom: 30px;
          margin-right: 30px;
          box-shadow: 0 0 10px #0391d1;
        "
      >
        <i class="feather icon-dollar-sign font-medium-3"></i>
        Cotar para ver os preços
      </vs-button>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import CatalogPublicMobile from "@/resources/users/components/CatalogPublicMobile";
import ProductPublicCard from "@/resources/products/components/ProductPublicCard";

export default {
  name: "CatalogPublic",
  metaInfo() {
    return {
      title: this.titleContent,
      titleTemplate: null,

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
      color: "#0cb695",
      loader: "spinner",
      width: 110,
      height: 110,
      backgroundColor: "#0cb695",
      opacity: 0.3,
      fullPage: true,
      isLoading: false,
      loading: false,
      selectedProductType: undefined,
      showProducts: [],
      slug: null,
      showBtn: false,
      mobileBrowser: false,
      currentScreen: undefined,
      loadProductTypes: [],
      totalRendered: 0,
      scrollingDown: false,
      titleContent: null,
      descriptionContent: null,
    };
  },

  created() {
    this.isMobile();
    this.currentScreen = "menu";
    this.isLoading = true;
    this.slug = this.$route.params.supplierSlug;
    this.getSupplierBySlug(this.slug).then(() => {
      this.titleContent = "" + this.supplier.user.name + " | MeuFornecedor";
      this.descriptionContent =
        "Confira o catálogo online de " +
        this.supplier.user.name +
        ". Acesse grátis e faça sua cotação. Compre para seu restaurante, padaria, minimercado.";
      this.getCatalogById(this.supplier.id).then(() => {
        this.createProductList(this.catalog);
        this.isLoading = false;
        this.initialLoad();
        this.scroll();
        //this.$refs['productsWindow'].dispatchEvent(new CustomEvent('scroll'))
      });
    });
  },

  mounted() {
    setTimeout(() => {
      this.showBtn = true;
      if (this.supplier.user.supplierStatus != "Liberado") {
        this.$router.push({ name: "home" });
      }
    }, 2000);
  },

  computed: {
    ...mapState("suppliers", [
      "supplier",
      "catalog",
      "supplierProducts",
      "supplierExpeditions",
    ]),
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
      } else if (window.innerWidth >= 800 && window.innerWidth < 1000) {
        return 2;
      } else {
        return 1;
      }
    },

    widthRatio() {
      return (window.innerWidth / this.maxPerScreen / window.innerWidth) * 100;
    },
  },

  methods: {
    ...mapActions("suppliers", [
      "getCatalogById",
      "getSupplierBySlug",
      "getCatalogByProductTypeAndSupplier",
      "getExpeditionsByProductType",
    ]),

    initialLoad() {
      if (window.innerWidth > 1920) {
        for (var i = 0; i <= 18; i++) {
          this.selectProductType(this.loadProductTypes[i].productType);
        }
      } else {
        for (var j = 0; j <= 10; j++) {
          this.selectProductType(this.loadProductTypes[j].productType);
        }
      }
    },

    async selectProductType(productType) {
      this.isLoading = true;
      var ended = null;
      ended = await this.getCatalogByProductTypeAndSupplier({
        productTypeId: productType.productTypeId,
        supplierId: this.supplier.id,
      }).then(() => {
        for (var i = 0; i < this.supplierProducts.length; i++) {
          this.showProducts.push(this.supplierProducts[i]);
        }
        this.isLoading = false;
        this.loadProductTypes[this.totalRendered].rendered = true;
        this.totalRendered++;
      });
      return ended;
    },
    scroll() {
      this.$refs["productsWindow"].onscroll = () => {
        if (this.$refs["productsWindow"] && this.$refs["content"]) {
          let bottomOfWindow =
            this.$refs["productsWindow"].scrollTop +
              this.$refs["productsWindow"].offsetHeight >
            this.$refs["content"].offsetHeight - 350;
          if (bottomOfWindow && !this.loading) {
            var elem = this.loadProductTypes[this.totalRendered];
            if (
              this.totalRendered < this.loadProductTypes.length &&
              !elem.rendered
            ) {
              this.loading = true;
              this.selectProductType(elem.productType).then(() => {
                this.loading = false;
                if (this.scrollingDown) this.checkScrollingDown();
                else if (
                  this.$refs["productsWindow"].scrollTop +
                    this.$refs["productsWindow"].offsetHeight >
                  this.$refs["content"].offsetHeight - 50
                )
                  this.$refs["productsWindow"].dispatchEvent(
                    new CustomEvent("scroll")
                  );
              });
            }
          }
        }
      };
    },
    createProductList(data) {
      this.loadProductTypes = [];
      let renderingList = [];
      for (let family in data) {
        for (let collection in data[family]) {
          for (let category in data[family][collection]) {
            for (
              var i = 0;
              i < data[family][collection][category].length;
              i++
            ) {
              renderingList.push({
                productType: data[family][collection][category][i],
                rendered: false,
                category: category,
              });
            }
          }
        }
      }
      this.loadProductTypes = renderingList;
    },
    async scrollToElement(productType) {
      this.selectedProductType = productType;
      for (var i = 0; i < this.loadProductTypes.length; i++) {
        if (
          this.loadProductTypes[i].productType.productTypeId ==
          this.selectedProductType.productTypeId
        ) {
          if (this.loadProductTypes[i].rendered) {
            var elmnt = document.querySelectorAll(
              `*[id^="${productType.productType}"]`
            )[0];
            this.$refs["productsWindow"].scrollTop = elmnt.offsetTop - 200;
          } else {
            this.scrollingDown = true;
            this.$refs["productsWindow"].scrollTop =
              this.$refs["content"].offsetHeight;
          }
          break;
        }
      }
    },
    checkScrollingDown() {
      if (
        this.scrollingDown &&
        this.loadProductTypes[this.totalRendered - 1].productType
          .productTypeId != this.selectedProductType.productTypeId
      ) {
        this.$refs["productsWindow"].scrollTop =
          this.$refs["content"].offsetHeight;
        this.$refs["productsWindow"].dispatchEvent(new CustomEvent("scroll"));
      } else if (this.scrollingDown) {
        this.scrollingDown = false;
        setTimeout(() => {
          var elmnt = document.querySelectorAll(
            `*[id^="${this.selectedProductType.productType}"]`
          )[0];
          this.$refs["productsWindow"].scrollTop = elmnt.offsetTop - 100;
          this.loadMore(
            Math.floor(this.showProducts.length / this.maxPerScreen)
          );
        }, 700);
      }
    },
    loadMore(initial) {
      this.$refs["productsWindow"].dispatchEvent(new CustomEvent("scroll"));
      if (
        initial == Math.floor(this.showProducts.length / this.maxPerScreen) &&
        !this.loadProductTypes[this.loadProductTypes.length - 1].rendered
      ) {
        setTimeout(() => {
          this.loadMore(initial);
        }, 500);
      }
    },
    productChunks(products) {
      var result = [];
      var data = products;
      if (data) {
        for (var i = 0; i < data.length; i++) {
          if (i % this.maxPerScreen == 0) result.push([]);
          result[Math.floor(i / this.maxPerScreen)].push(data[i]);
        }
      }
      return result;
    },
    productTypeQuantity(types) {
      return types.length === 1
        ? "1 tipo de produto"
        : `${types.length} tipos de produtos`;
    },
    productsQuantityText(quantity) {
      return quantity === 1 ? "1 produto" : `${quantity} produtos`;
    },
    cleanSelectedProductType() {
      this.showProducts = null;
      this.currentScreen = "menu";
    },
    goToHome() {
      this.$router.push({
        name: "home",
      });
    },
    isMobile() {
      if (screen.width <= 760 || window.innerWidth <= 760) {
        this.mobileBrowser = true;
      } else {
        this.mobileBrowser = false;
      }
    },
    showScreen(name) {
      if (this.mobileBrowser && this.currentScreen == name) {
        return true;
      } else if (!this.mobileBrowser) {
        return true;
      } else {
        return false;
      }
    },
  },
  components: {
    CatalogPublicMobile,
    ProductPublicCard,
  },
};
</script>
