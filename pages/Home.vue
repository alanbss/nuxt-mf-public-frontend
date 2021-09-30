<template>
  <div class="content-wrapper pb-0">
    <partner-modal :openPopup="openPartner" @update-modal="closePopup" />
    <div class="content-body">
      <template>
        <div v-if="!$auth.check()">
          <unlogged-banner />
          <div v-if="mobileBrowser" style="padding-bottom:120px"></div>
          <div v-else style="padding-bottom:100px"></div>
        </div>

        <product-list-empty-banner v-if="productListIsEmpty" />

        <div
          style="display: flex; justify-content: space-around;"
          :style="
            this.mobileBrowser ? 'flex-wrap: wrap;' : 'flex-wrap: nowrap;'
          "
          v-else
        >
          <open-quotes-banner class="p-1" />
          <orders-banner class="p-1" />
          <to-do-now-banner />
        </div>

        <div v-if="productListIsEmpty">
          <section class="card p-1" style="background: rgb(251, 253, 254)">
            <div class="row" style="background: #e9fcee; margin: 0; border-radius: 8px">
              <div class="col" style="margin-top: 5px">
                <h2 style="color: #008567">Cotar</h2>
                <h6>Veja preços de vários fornecedores ao mesmo tempo.</h6>
              </div>
            </div>
            <div
              class="row"
              style="
              background: linear-gradient(90deg, rgba(12,182,149,1) 33%, rgba(92,233,198,1) 66%);
              justify-content: space-between;
              margin: 0; max-height: 148px;
            "
            >
              <div class="row" style="padding: 15px 20px">
                <router-link
                  v-if="catalog.hasOwnProperty('Alimentos e bebidas')"
                  :to="{
                    name: 'cotar-familia',
                    params: {
                      familyName: 'alimentos-e-bebidas',
                    },
                  }"
                >
                  <vs-chip class="chip-mf public-chip p-0 pr-1">Alimentos e bebidas</vs-chip>
                </router-link>
                <router-link
                  v-if="catalog.hasOwnProperty('Embalagens')"
                  :to="{
                    name: 'cotar-familia',
                    params: {
                      familyName: 'embalagens',
                    },
                  }"
                >
                  <vs-chip class="chip-mf public-chip p-0 pr-1">Embalagens</vs-chip>
                </router-link>
                <router-link
                  v-if="catalog.hasOwnProperty('Limpeza')"
                  :to="{
                    name: 'cotar-familia',
                    params: {
                      familyName: 'limpeza',
                    },
                  }"
                >
                  <vs-chip class="chip-mf public-chip p-0 pr-1">Limpeza</vs-chip>
                </router-link>
                <router-link
                  v-if="catalog.hasOwnProperty('Utensílios')"
                  :to="{
                    name: 'cotar-familia',
                    params: {
                      familyName: 'utensilios',
                    },
                  }"
                >
                  <vs-chip class="chip-mf public-chip p-0 pr-1">Utensílios</vs-chip>
                </router-link>
              </div>
              <div class="p-1">
                <div class="m-0 pl-0 pr-1" style="flex: 0 0 300px; margin-left: auto !important">
                  <form
                    @submit.prevent="runSearch"
                    action
                    class
                    style="
                    z-index: 1;
                    height: -webkit-fill-available;
                    position: relative;
                  "
                  >
                    <i
                      class="feather icon-search"
                      style="
                      color: black;
                      position: absolute;
                      left: 3px;
                      top: 7px;
                      font-size: 1.2rem;
                      z-index: 2;
                    "
                      @click="runSearch()"
                    />
                    <input
                      id="search2"
                      type="text"
                      placeholder="Buscar produtos."
                      v-model="keyword"
                      autocomplete="on"
                      class="mr-2"
                      style="
                      padding-left: 35px;
                      position: relative;
                      left: 0;
                      height: 30px;
                      font-size: 1rem;
                      border: 0;
                      border-radius: 15px;
                    "
                      :style="searchBarWidth()"
                    />
                  </form>
                </div>
              </div>
            </div>
            <div
              class="p-1"
              style="
              display: flex;
              justify-content: space-between;
              padding-top: 10px;
              border: none;
              border-radius: 0.5rem;
              box-shadow: 0 4px 25px 0 rgb(0 0 0 / 10%);
              transition: all 0.3s ease-in-out;
            "
            >
              <h6>Sugestões</h6>
              <a href="/cotar-em-massa">Ver mais</a>
            </div>
            <div
              :class="
                this.mobileBrowser
                  ? 'product-card-list-mobile'
                  : 'product-card-list-desktop'
              "
            >
              <span
                v-for="(product, index) in this.filteredRandomProducts.slice(0, maxPerScreen)"
                :key="product.id"
                style="min-width: 165px; max-width: 165px;"
              >
                <a @click="openProductType(product)"
                  v-if="index < maxPerScreen"
                  style="text-decoration: underline"
                >{{ product.productTypeName }}</a>
                <div class="card font-small-3" style="margin-right: 7px; margin-left: 3px">
                  <div class="card-body pl-1 pr-1 pt-0 pb-0">
                    <product-card v-if="index < maxPerScreen" :product="product" />
                  </div>
                </div>
              </span>
              <div
                class="card"
                style="min-width: 120px;
                      max-width: 120px;
                      height: 200px;
                      align-self: center;
                      justify-content: center;
                      text-align-last: center;"
              >
                <div class="row m-0 p-0" style="width: 120px;">
                  <div class="col-12 text-center">Tem muito mais produtos para cotar.</div>
                  <div class="col-12 mt-1">
                    <button type="button" class="btn btn-primary">
                      <a
                        style="color: white; white-space: nowrap;"
                        href="/cotar-em-massa"
                        class="font-medium-1 align-middle"
                      >Ver tudo</a>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section class="card" style="background: rgb(251, 253, 254)">
            <div class="row" style="background: #ffede1; margin: 0; border-radius: 8px">
              <div class="col" style="margin-top: 5px">
                <h2 style="color: #bc5100">Pedir direto</h2>
                <h6>Escolha o fornecedor e peça direto na sua loja virtual.</h6>
              </div>
            </div>
            <div
              class="row"
              style="
              background: linear-gradient(90deg, rgba(245,127,23,1) 33%, rgba(255,176,76,1) 66%);
              justify-content: space-between;
              margin: 0; max-height: 148px;
            "
            >
              <div class="row" style="padding: 15px 20px">
                <span v-for="family in uniqueUsedFamilies()" :key="family">
                  <router-link :to="{ name: 'suppliers-family', params: { familyName: formatString(family) } }">
                    <vs-chip class="chip-mf public-chip p-0 pr-1">
                      <span class="capitalize">{{ family }}</span>
                    </vs-chip>
                  </router-link>
                </span>
              </div>
              <div class="p-1">
                <div class="m-0 pl-0 pr-1" style="flex: 0 0 300px; margin-left: auto !important">
                  <form
                    @submit.prevent="runSupplierSearch"
                    action
                    class
                    style="
                    z-index: 1;
                    height: -webkit-fill-available;
                    position: relative;
                  "
                  >
                    <i
                      class="feather icon-search"
                      style="
                      color: black;
                      position: absolute;
                      left: 3px;
                      top: 7px;
                      font-size: 1.2rem;
                      z-index: 2;
                    "
                      @click="runSuplierSearch()"
                    />
                    <input
                      id="search3"
                      type="text"
                      placeholder="Buscar fornecedor."
                      v-model="keyword2"
                      autocomplete="on"
                      class="mr-2"
                      style="
                      padding-left: 35px;
                      position: relative;
                      left: 0;
                      height: 30px;
                      font-size: 1rem;
                      border: 0;
                      border-radius: 15px;
                    "
                      :style="searchBarWidth()"
                    />
                  </form>
                </div>
              </div>
            </div>
            <div v-if="this.filteredRandomSaleProducts.length > 0">
        <div
          class="p-1"
          style="
              display: flex;
              justify-content: space-between;
              padding-top: 10px;
              border: none;
              border-radius: 0.5rem;
              box-shadow: 0 4px 25px 0 rgb(0 0 0 / 10%);
              transition: all 0.3s ease-in-out;
            "
        >
          <h6>Escolha por oferta</h6>
          <a href="javascript:void(0)" @click="goToSalesPage()">Ver tudo</a>
        </div>
        <div
          :class="
                this.mobileBrowser
                  ? 'product-card-list-mobile'
                  : 'product-card-list-desktop'
              "
        >
          <span
            v-for="(product, index) in this.filteredRandomSaleProducts.slice(0, maxPerScreen)"
            :key="product.id"
            style="min-width: 165px; max-width: 165px;"
          >
            <a
              v-if="index < maxPerScreen"
              style="text-decoration: underline"
            >{{ product.productTypeName }}</a>
            <div class="card font-small-3" style="margin-right: 7px; margin-left: 3px">
              <div class="card-body pl-1 pr-1 pt-0 pb-0">
                <ProductInSaleCard
                  :product="product"
                  :expeditions="product.supplierProductExpeditions"
                />
              </div>
            </div>
          </span>
          <div
            class="card"
            style="min-width: 120px;
                      max-width: 120px;
                      height: 200px;
                      align-self: center;
                      justify-content: center;
                      text-align-last: center;"
          >
            <div class="row">
              <div class="col-12 text-center">Tem muito mais produtos em oferta.</div>
              <div class="col-12 mt-1">
                <button @click="goToSalesPage()" type="button" class="btn btn-primary">
                  <a
                    style="color: white; white-space: nowrap;"
                    class="font-medium-1 align-middle"
                  >Ver tudo</a>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
            <div
              class="p-1"
              style="
              display: flex;
              justify-content: space-between;
              padding-top: 10px;
              border: none;
              border-radius: 0.5rem;
              box-shadow: 0 4px 25px 0 rgb(0 0 0 / 10%);
              transition: all 0.3s ease-in-out;
            "
            >
              <h6>Escolha o Fornecedor</h6>
              <a href="/fornecedores">Ver mais</a>
            </div>
            <div
              style="
              display: flex;
              flex-direction: row;
              flex-wrap: wrap;
              justify-content: center;
            "
            >
              <div v-for="supplier in filteredSuppliers.slice(0, 9)" v-bind:key="supplier.id">
                <supplier-card :supplier="supplier" />
              </div>
            </div>
          </section>
        </div>

        <section
          class="p-2"
          v-if="productListIsEmpty"
          style="background: white;
                                    margin-top:80px;
                                    margin-bottom: 2.2rem;
                                    border: none;
                                    border-radius: 0.5rem;
                                    box-shadow: 0 4px 25px 0 rgb(0 0 0 / 10%);
                                    transition: all 0.3s ease-in-out;"
        >
          <div style="display: flex; flex-direction: column">
            <div style="display: flex; flex-direction: column">
              <h3 style="padding-bottom:10px;">Cadastre grátis sua distribuidora</h3>
              <h6 style="padding-bottom:10px;">
                Se você vende alimentos, bebidas, embalagens, descartáveis,
                utensílios ou produtos de limpeza e seus clientes são
                restaurantes, padarias ou minimercados, vire nosso parceiro.
              </h6>
              <button
                class="btn btn-outline-primary p-1"
                style="width: fit-content"
                @click="openPartner = true"
              >Fazer cadastro grátis</button>
            </div>
            <vs-divider></vs-divider>
            <div
              style="
                display: flex;
                flex-direction: row;
                justify-content: space-between;
              "
            >
              <div style="display: flex; flex-direction: column">
                <span>Veja quais fornecedores já temos cadastrados</span>
                <a
                  href="/fornecedores-ativos"
                  style="text-decoration-line: underline;"
                >Ver todos os fornecedores</a>
              </div>
              <div style="display: flex; flex-direction: column">
                <span>
                  Veja a união dos produtos das distribuidoras em um só
                  catálogo
                </span>
                <a
                  href="/todos-os-produtos"
                  style="text-decoration-line: underline;"
                >Ver todos os produtos</a>
              </div>
            </div>
          </div>
        </section>
      </template>
    </div>
    <vs-popup title="Um momento..." :active.sync="showLoadingAlert">
      <div>
        <h5
          class="d-flex justify-content-center"
        >Carregando os produtos de distribuidoras da sua região.</h5>
        <div class="d-flex justify-content-center" style="margin-top: 20px; margin-bottom: 20px;">
          <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    </vs-popup>
  </div>
</template>
<style>
.card .card {
  box-shadow: 0 4px 25px 0 rgb(0 0 0 / 10%) !important;
}
span.capitalize:first-letter {
  text-transform: uppercase;
}
span.capitalize {
  display: inline-block;
}
.product-card-list-mobile {
  padding: 20px;
  display: flex;
  flex-direction: row;
  overflow: auto;
}
.product-card-list-desktop {
  padding-top: 20px;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  align-self: center;
  justify-content: center;
}
</style>
<script>
import ProductListEmptyBanner from "~/components/home/ProductListEmptyBanner";
import UnloggedBanner from "~/components/home/UnloggedBanner";
import OpenQuotesBanner from "~/components/home/OpenQuotesBanner";
import ToDoNowBanner from "~/components/home/ToDoNowBanner";
import OrdersBanner from "~/components/home/OrdersBanner";
import ProductCard from "~/components/products/components/ProductCard";
import SuppliersService from "~/components/suppliers/services/index";
import ProductsService from "~/components/products/services/index";
import SupplierCard from "~/components/suppliers/components/SupplierCard";
import PartnerModal from "~/components/users/components/PartnerModal";
import ProductInSaleCard from "~/components/products/components/ProductInSaleCard";
import { mapGetters, mapActions, mapState } from "vuex";

export default {
  data() {
    return {
      allAutoSuppliers: [],
      filteredSuppliers: [],
      randomProducts: [],
      randomSaleProducts: [],
      filteredRandomSaleProducts: [],
      filteredRandomProducts: [],
      keyword: null,
      keyword2: null,
      quoteLoading: false,
      openPartner: false,
      mobileBrowser: undefined,
      allProductTypes: [],
      showLoadingAlert: false,
    };
  },
  async created() {
    if (this.$route.query.loadingProducts == "true")
      this.showLoadingAlert = true;

    ProductsService.getRandom(this.params).then((RandomProducts) => {
      this.randomProducts = RandomProducts.data;
      this.filteredRandomProducts = this.randomProducts;
      this.showLoadingAlert = false;
    });

    this.getAllCatalog();

    SuppliersService.getAllAuto(this.params).then((response) => {
      this.allAutoSuppliers = response.data;
      this.filteredSuppliers = this.allAutoSuppliers;
      this.createOptionsSctructures(this.allAutoSuppliers);
    });
    SuppliersService.getRandomSaleProducts().then((response2) => {
      this.randomSaleProducts = response2.data;
      this.filteredRandomSaleProducts = this.randomSaleProducts;
    });

    this.isMobile();
    if (this.$auth.check()) {
      if (
        this.$auth.user().isSupplier &&
        this.$auth.user().supplierStatus == "Não liberado"
      )
        this.$router.push({ name: "products-empty" });
      else if (
        this.$auth.user().isSupplier &&
        this.$auth.user().supplierStatus == "Liberado"
      )
        this.$router.push({ name: "quotation-panel" });
    }
  },
  mounted() {},
  computed: {
    ...mapState("navigationFilters", ["cep", "region", "supplierServes"]),
    ...mapState("users/products", ["catalog"]),
    ...mapGetters("users/products", ["productListIsEmpty"]),
    ...mapGetters("navigationFilters", ["params"]),
    maxPerScreen() {
      if (window.innerWidth >= 2000) {
        return 10;
      } else if (window.innerWidth >= 1800 && window.innerWidth < 2000) {
        return 9;
      } else if (window.innerWidth >= 1600 && window.innerWidth < 1800) {
        return 8;
      } else if (window.innerWidth >= 1400 && window.innerWidth < 1600) {
        return 7;
      } else if (window.innerWidth >= 1200 && window.innerWidth < 1400) {
        return 6;
      } else if (window.innerWidth >= 1000 && window.innerWidth < 1200) {
        return 4;
      } else if (window.innerWidth >= 800 && window.innerWidth < 1000) {
        return 3;
      } else {
        return 6;
      }
    },
    widthRatio() {
      return (window.innerWidth / this.maxPerScreen / window.innerWidth) * 100;
    },
  },
  methods: {
    searchBarWidth() {
      if (window.innerWidth >= 1910) {
        return "width: 600px;";
      } else if (window.innerWidth >= 1680 && window.innerWidth < 1910) {
        return "width: 600px;";
      } else if (window.innerWidth >= 1450 && window.innerWidth < 1680) {
        return "width: 600px;";
      } else if (window.innerWidth >= 1220 && window.innerWidth < 1450) {
        return "width: 400px;";
      } else if (window.innerWidth >= 1000 && window.innerWidth < 1220) {
        return "width: 300px;";
      } else {
        return "width: 300px;";
      }
    },

    ...mapActions("users/products", ["getAllCatalog"]),

    offerExpeditionsByProduct(product) {
      return this.supplierOfferExpeditions.filter(
        (obj) => obj.productExpedition.productId == product.id
      );
    },

    isMobile() {
      if (screen.width <= 760 || window.innerWidth <= 760) {
        this.mobileBrowser = true;
      } else {
        this.mobileBrowser = false;
      }
    },
    runSearch() {
      if (this.keyword != "") {
        this.$router.push({
          name: "users.search",
          params: { keyword: this.keyword },
        });
      }
    },
    runSupplierSearch() {
      this.$router.push({
        name: "suppliers",
        query: { keyword: this.keyword2 },
      });
    },
    toQuotePanel() {
      this.quoteLoading = true;
      setTimeout(() => {
        this.quoteLoading = false;
        this.$router.push({ name: "users.orderPanel" });
      }, 300);
    },
    filterSupplierByFamily(familyName) {
      this.filteredSuppliers = this.allAutoSuppliers
        .filter((obj) =>
          Object.prototype.hasOwnProperty.call(obj.catalogAsHash, familyName)
        )
        .slice(0, 9);
    },
    filterProductByFamily(familyName) {
      this.filteredRandomProducts = this.randomProducts.filter(
        (obj) => obj.familyName == familyName
      );
    },
    closePopup(value) {
      this.openPartner = value;
    },
    createOptionsSctructures(suppliers) {
      var data = null;
      for (var i in suppliers) {
        data = suppliers[i].catalogAsHash;
        for (let family in data) {
          for (let collection in data[family]) {
            for (let category in data[family][collection]) {
              for (
                var j = 0;
                j < data[family][collection][category].length;
                j++
              ) {
                if (
                  !this.allProductTypes.find(
                    (type) =>
                      type.productTypeId ==
                      data[family][collection][category][j].productTypeId
                  )
                )
                  this.allProductTypes.push({
                    family: family,
                    collection: collection,
                    category: category,
                    type: data[family][collection][category][j],
                  });
              }
            }
          }
        }
      }
    },
    uniqueUsedFamilies() {
      return [...new Set(this.allProductTypes.map((obj) => obj.family))];
    },
    openProductType(product){
      this.$router.push({ name: 'cotar-produto',
                          params: {
                            familyName: this.formatString(product.familyName),
                            categoryName: this.formatString(product.categoryName),
                            productTypeName: this.formatString(product.productTypeName)
                          } })
    },
    normalizeString(s) {
      var r = s.toLowerCase();
      r = r.replace(new RegExp("[àáâãäå]", 'g'),"a");
      r = r.replace(new RegExp("ç", 'g'),"c");
      r = r.replace(new RegExp("[èéêë]", 'g'),"e");
      r = r.replace(new RegExp("[ìíîï]", 'g'),"i");
      r = r.replace(new RegExp("[òóôõö]", 'g'),"o");
      r = r.replace(new RegExp("[ùúûü]", 'g'),"u");
      return r;
    },
    formatString(string) {
      return this.normalizeString(string).replace(/\s+/g, '-').replace('.', '')
    },
    goToSalesPage() {
      this.$router.push({ name: "products.in.sale" });
    },
  },
  components: {
    ProductListEmptyBanner,
    OpenQuotesBanner,
    ToDoNowBanner,
    OrdersBanner,
    UnloggedBanner,
    ProductCard,
    SupplierCard,
    PartnerModal,
    ProductInSaleCard,
  },
};
</script>
