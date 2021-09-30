<template>
  <div class="content-wrapper pb-0" v-if="catalog">
    <store-location-modal :openPopup="openLocation" :supplier="supplier" @allow-zipcode="allowZipcode" @update-modal="updateLocationModal" v-if="supplier" />
    <div class="content-body">
      <store-families-modal
        @selected-category="selectedCategoryOnModal"
        @selected-collection="selectedCollectionOnModal"
        @selected-product-type="selectProductType"
        @update-modal="updateStoreFamiliesModal"
        :openPopup="familiesModal"
        :catalog="catalog"
      />
      <div class="" v-if="isMobile" style="background: #EDEDED; border-bottom: solid 1px #D5D5D5; margin: -25px -12px 10px -12px;">
        <div class="row">
          <div class="col-12 m-0 pl-2 pr-2" style="padding-top: 10px; padding-bottom: 5px;">
            <span class="m-0 font-weight-bold font-medium-2">{{ supplier.user.name }}</span>
            <a class="float-right" href="javascript:void(0);" @click="openSupplierInfo = true">
              Ver mais
            </a>
            <supplier-info-modal :supplier="supplier" :openPopup="openSupplierInfo" @update-popup="updateSupplierPopup" />
          </div>
        </div>
        <div class="row" style="border-top: solid 1px LightGrey; padding-top: 5px; padding-bottom: 5px; height: 43px;">
          <form @submit.prevent="runSupplierSearch" action class="row" :style="show ? 'width: 100%' : 'display: none;'" style="z-index: 1; height: -webkit-fill-available">
           <i class="feather icon-search" style="color: black; position: relative; left: 9%; top: 0px; font-size: 2rem; z-index: 2;" @click="runSupplierSearch()" />
           <input
             id="search"
             type="text"
             placeholder="Buscar produtos"
             v-model="keyword"
             autocomplete="on"
             style="padding-left: 80px; padding-right: 300px; position: absolute; height: 40px; font-size: 1.2rem; margin-top: -6px;"
          >
           <i class="feather icon-corner-down-left" @click="runSupplierSearch()" style="color: black; position: relative; left: 72%; top: 0px; font-size: 2rem; z-index:9999"/>
           <i class="feather icon-x" @click="closing()" style="color: black; position: relative; left: 75%; top: 0px; font-size: 2rem; z-index:9999"/>
          </form>
          <div class="col-1 m-0 pl-1 pr-0" v-if="!show" style="">
            <button @click="storeHome()" type="button" class="btn btn-outline-primary" style="padding: 7px 7px;">
              <i class="ficon feather icon-home" />
            </button>
          </div>
          <div class="col-5 m-0 pl-1" v-if="!show" style="padding-right: 2px !important;">
            <button @click="openFamiliesModal()" type="button" class="btn btn-warning w-100" style="padding: 8px 3px;">
              Categorias
            </button>
          </div>
          <div class="col-1 m-0 pl-0 pr-0" v-if="!show && supplierOfferProducts && supplierOfferProducts.length" style="">
            <button @click="closing()" type="button" class="btn btn-outline-primary" style="padding: 7px 7px;">
              <i
                class="ficon feather icon-search" style="color: inherit;">
              </i>
            </button>
          </div>
          <div class="col-5 m-0 pl-0 pr-1" v-if="!show && supplierOfferProducts && supplierOfferProducts.length" style="">
            <button @click="goToOffers()" type="button" class="btn btn-danger w-100" style="padding: 7px 2px;">
              <img :src="require(`@/assets/images/offers.png`)" alt="*" width="16" height='16'>
              <span class="font-small-3 align-middle"> Ver ofertas</span>
            </button>
          </div>
          <div class="col-6 m-0 pl-0 pr-1" v-if="!supplierOfferProducts || !supplierOfferProducts.length" style="">
            <form @submit.prevent="runSupplierSearch" action class="" style="width: 100%; z-index: 1; height: -webkit-fill-available">
             <i class="feather icon-search" style="color: black; position: absolute; left: 3px; top: 7px; font-size: 1.2rem; z-index: 2;" @click="runSupplierSearch()" />
             <input
               id="search2"
               type="text"
               placeholder="Buscar produtos"
               v-model="keyword"
               autocomplete="on"
               class="mr-2"
               style="padding-left: 20px; position: relative; left: 0; width: 97%; height: 30px; font-size: 1rem;"
            >
            </form>
          </div>
        </div>
      </div>
      <div class="" v-else style="background: #EDEDED; border-bottom: solid 1px #D5D5D5; margin: -25px -30px 10px -30px;">
        <div class="row" style="padding: 5px 20px;">
          <div class="col-1 m-0 p-0 text-center">
            <img :src="require(`@/assets/images/avatar-default.png`)" alt="*" width="45" height="45">
          </div>
          <div class="col-7 m-0 p-0">
            <h3 class="m-0 font-weight-bold">{{ supplier.user.name }}</h3>
            {{ supplier.user.phone }}
            <a href="javascript:void(0);" @click="openSupplierInfo = true">
              Ver mais
            </a>
            <supplier-info-modal :supplier="supplier" :openPopup="openSupplierInfo" @update-popup="updateSupplierPopup" />
          </div>
          <div class="col-4 m-0 p-0">
            <div class="row">
              <div class="col-12">
                <span class="badge badge-pill float-right font-small-3" style="background-color: #b3b3b3;">
                  Min. {{ supplier.minimumOrderValue }}
                </span>
              </div>
            </div>
            <div class="row" style="margin-top: 5px;">
              <div class="col-12">
                <span class="badge badge-pill float-right font-small-3" style="background-color: #b3b3b3;" v-if="!supplier.deliveryEstimate">
                  Não faz entrega
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="row" style="border-top: solid 1px LightGrey; padding: 5px 10px; height: 43px;">
          <div class="m-0 pl-1 pr-0" style="flex: 0 0 50px">
            <a @click="storeHome()" href="javascript:void(0)">
              <button type="button" class="btn btn-outline-primary" style="padding: 7px 7px;">
                <i class="ficon feather icon-home" />
              </button>
            </a>
          </div>
          <div class="m-0" style="flex: 0 0 auto; padding-right: 2px !important; padding-left: 2px;">
            <span
              v-for="(family, index) in catalog"
              :key="index"
              style="flex: 0 0 auto; width: auto; color: black;"
            >
              <vs-chip
                class="chip-mf public-chip p-0 pr-1"
              >
                <a href="javascript:void(0)" @click="selectedFamilyOnMenu(index)" style="color: inherit;">
                  <span v-html="getFamilyIcon(index)"></span>
                  {{ index }}
                </a>
              </vs-chip>
            </span>
            <!-- <button @click="openFamiliesModal()" type="button" :class="(viewType == home || viewType == 'sale') ? 'btn btn-warning w-100' : 'btn btn-outline-warning bg-white w-100'" style="padding: 8px 3px;">
              Categorias
            </button> -->
          </div>
          <!-- <div class="m-0 pl-0 pr-0" v-if="!show && supplierOfferProducts && supplierOfferProducts.length" style="flex: 0 0 35px;">
            <button @click="closing()" type="button" class="btn btn-outline-primary" style="padding: 7px 7px;">
              <i
                class="ficon feather icon-search" style="color: inherit;">
              </i>
            </button>
          </div> -->
          <div class="m-0 pl-0 pr-1" style="flex: 0 0 350px;">
            <form @submit.prevent="runSupplierSearch" action class="" style="width: 100%; z-index: 1; height: -webkit-fill-available; position: relative;">
             <i class="feather icon-search" style="color: black; position: absolute; left: 3px; top: 7px; font-size: 1.2rem; z-index: 2;" @click="runSupplierSearch()" />
             <input
               id="search2"
               type="text"
               placeholder="Buscar neste fornec."
               v-model="keyword"
               autocomplete="on"
               class="mr-2"
               style="padding-left: 20px; position: relative; left: 0; width: 97%; height: 30px; font-size: 1rem;"
            >
            </form>
          </div>
          <div class="m-0 pl-0 pr-1" v-if="supplierOfferProducts && supplierOfferProducts.length" style="flex: 0 0 170px;">
            <button @click="goToOffers()" type="button" class="btn btn-danger w-100" style="padding: 7px 2px;">
              <img :src="require(`@/assets/images/offers.png`)" alt="*" width="16" height='16'>
              <span class="font-small-3 align-middle"> Ver ofertas</span>
            </button>
          </div>
        </div>
      </div>
      <div class="row" ref="productsWindow" :style="isMobile ? 'max-height: calc(100vh - 13em); overflow-y: scroll; overflow-x: hidden;' : 'max-height: calc(100vh - 8em); overflow-y: scroll; overflow-x: hidden;'">
        <div class="col-xl-3 col-12">
          <div class="card font-small-3">
            <div class="card-body px-0 py-0">
              <div class="card-header py-1 border-bottom">
                <h4 class="card-title font-medium-2 mb-50 font-weight-bold color-mf-verde w-100">{{ keyword }}</h4>
                <p class="mb-0">{{ totalResults }} resultados</p>
                <!-- <a href="#" data-toggle="modal" data-target="#filtrar" class="d-md-none float-right"><i class="feather icon-sliders"></i> Filtrar</a> -->
              </div>
            </div>
            <span class="search-card-hide" v-for="family in searchedFamilies" :key="family.family.id">
              <h4 class="px-2 mb-75 pt-1">{{ family.family.name }}</h4>
              <family-search-list
                :categoriesWithCollection="family.with_collection"
                :categoriesWithoutCollection="family.without_collection"
                :keyword="keyword"
                :category="category"
                :storeSearch="true"
              />
            </span>
          </div>
        </div>
        <div class="col-xl-9 col-12">
          <div v-if="totalResults > 0" ref="content">
            <span v-for="family in searchedFamilies" :key="family.family.id">
              <h3
                v-if="familyHasProducts(family.family.name)"
                class="bg-rgba-light p-1 rounded ml-0 mr-0 mt-0 mb-1"
              >
                <i class="fa fa-lemon-o ml-50 mr-75"></i> {{ family.family.name }}
              </h3>
              <div class="row mt-1" v-for="(chunk, index) in productChunks(productsFromFamily(family.family.name))" :key="index">
                <span v-for="product in chunk" :key="product.id" :style="widthRatio ? 'width: ' + widthRatio + '%; padding-left: 5px; padding-right: 5px;' : 'padding-left: 5px; padding-right: 5px;'">
                  <div style="padding-left: 5px;">
                    <h6 style="margin-bottom: 0px;">
                      <a @click="selectProductType(product)" style="text-decoration: underline;">
                        {{ product.productTypeName }}
                      </a>
                    </h6>
                  </div>
                  <PublicStoreProductCard
                    :product="product"
                    :expeditions="expeditionsByProduct(product)"
                    :loadedTotals="totals"
                    @quantity-input="checkTotals"
                    @remove-item="removeFromCart"
                    @fill-location="openLocationPopup"
                  />
                </span>
                <vs-divider class="mb-1" />
              </div>
            </span>
          </div>
          <div class="ml-3" v-else>
            <h3>Não há produtos que correspondam a sua busca.</h3>
            <ul class="ml-2">
              <li>Você escreveu o termo corretamente?</li>
              <li>Que tal usar menos palavras?</li>
              <li>Você pode
                <router-link :to="{ name: 'public-store', params: { supplierSlug: this.$route.params.supplierSlug } }" style="color: 0391D1; text-decoration: underline;">ir para o início</router-link>
                para encontrar o que procura
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <!-- <div v-if="totalResults > 0" class="centered-paginator">
      <vs-pagination :total="totalPages" v-model="currentPage" :max="10" :color="'#7367F0'" />
    </div> -->
  </div>
</template>

<style>
  @media only screen and (max-width: 1199px) {
    .search-card-hide{
      display: none;
    }
  }

  @media only screen and (min-width: 1200px) {
    .search-card-show{
      display: inline-block;
    }
  }
</style>

<script>
import FamilySearchList from "@/resources/families/components/FamilySearchList";
import PublicStoreProductCard from "@/resources/products/components/PublicStoreProductCard";
import SupplierInfoModal from "@/resources/suppliers/components/SupplierInfoModal";
import StoreFamiliesModal from "@/resources/users/components/StoreFamiliesModal";
import StoreLocationModal from "@/resources/users/components/StoreLocationModal";
import { mapActions, mapGetters, mapState } from "vuex";

export default {
  name: "StoreSearch",
  data() {
    return {
      keyword: this.$route.params.keyword,
      category: this.$route.query.category,
      productsLoaded: false,
      totals: [],
      supplierId: null,
      slug: undefined,
      familiesModal: false,
      show: false,
      openSupplierInfo: false,
      openLocation: false,
      targetClick: null,
    };
  },
  mounted() {
    this.productsLoaded = false
    this.slug = this.$route.params.supplierSlug
    this.$vs.loading()
    this.clearSupplierProducts()
    this.clearExpeditionsBySupplier()
    this.userSelectedPage(1)
    this.setCurrentPage(1)
    this.loadStoreTotal()
    this.totals = JSON.parse(JSON.stringify(this.storeProducts))
    this.getSupplierBySlug(this.slug).then(() => {
      this.supplierId = this.supplier.id
      this.getSupplierSearchWithCategories({ keyword: this.keyword, supplierId: this.supplierId })
      this.getCatalogById(this.supplier.id)
      this.storeSearchProducts({ keyword: this.keyword, supplierId: this.supplierId, category: this.category }).then(() => {
        this.$vs.loading.close()
        this.productsLoaded = true
      })
    })
  },
  watch: {
    '$route.params.keyword': function (keyword) {
      this.keyword = keyword
      this.productsLoaded = false
      this.$vs.loading()
      this.clearProducts()
      this.userSelectedPage(1)
      this.setCurrentPage(1)
      this.getSupplierSearchWithCategories({ keyword: this.keyword, supplierId: this.supplierId })
      this.storeSearchProducts({ keyword: this.keyword, supplierId: this.supplierId, category: null }).then(() => {
        this.$vs.loading.close()
        this.productsLoaded = true
      })
    },
    '$route.query.category': function (categoryId) {
      this.category = categoryId
      this.productsLoaded = false
      this.$vs.loading()
      this.clearProducts()
      this.userSelectedPage(1)
      this.setCurrentPage(1)
      this.storeSearchProducts({ keyword: this.keyword, supplierId: this.supplierId, category: categoryId }).then(() => {
        this.$vs.loading.close()
        this.productsLoaded = true
      })
    },
    currentPage(pageNumber) {
      this.productsLoaded = false
      this.$vs.loading()
      this.userSelectedPage(pageNumber)
      this.storeSearchProducts({ keyword: this.keyword, supplierId: this.supplierId, category: this.category  }).then(() => {
        this.$vs.loading.close()
        this.productsLoaded = true
      })
    },
  },

  computed: {
    ...mapState("pagination", ["totalPages"]),
    ...mapState("families", ["family", "products", "searchedFamilies"]),
    ...mapState("products", ["products"]),
    ...mapState("users/products", [
      "storeTotal",
      "storeProducts"
    ]),
    ...mapState("suppliers", [
      "supplier",
      "catalog",
      "supplierProducts",
      "supplierExpeditions",
      "supplierOfferProducts",
    ]),
    ...mapGetters("families", [
      "chunckedProductsFromFamily",
      "categoriesWithCollection",
      "categoriesWithoutCollection",
    ]),

    maxPerScreen() {
      if(window.innerWidth >= 1910) {
        return 8
      } else if(window.innerWidth >= 1680 && window.innerWidth < 1910) {
        return 7
      } else if(window.innerWidth >= 1450 && window.innerWidth < 1680) {
        return 6
      } else if(window.innerWidth >= 1220 && window.innerWidth < 1450) {
        return 5
      } else if(window.innerWidth >= 900 && window.innerWidth < 1220) {
        return 3
      } else if(window.innerWidth >= 600 && window.innerWidth < 900) {
        return 3
      } else {
        return 2
      }
    },

    isMobile() {
      if (screen.width <= 760 || window.innerWidth <= 760) {
        return true
      } else {
        return false
      }
    },

    widthRatio() {
      return ((window.innerWidth / this.maxPerScreen) / window.innerWidth) * 100
    },
    currentPage: {
      get() {
        return this.$store.state.pagination.currentPage;
      },
      set(value) {
        this.$store.dispatch("pagination/setCurrentPage", value);
      },
    },
    totalResults() {
      let total = 0
      for(let i = 0; i < this.searchedFamilies.length; i++) {
        let family = this.searchedFamilies[i]
        for(var key in family.with_collection) {
          let collection = family.with_collection[key]
          for(let j = 0; j < collection.length; j++) {
            total += collection[j].count
          }
        }
        for(let k = 0; k < family.without_collection.length; k++) {
          total += family.without_collection[k].count
        }
      }
      return total
    }
  },
  methods: {
    ...mapActions("families", ["getSupplierSearchWithCategories"]),
    ...mapActions("products", ["clearProducts"]),
    ...mapActions("suppliers", [
      "storeSearchProducts",
      "clearSearchProducts",
      "getExpeditionsBySearchAndSupplier",
      "getStoreSearchWithCategories",
      "clearSupplierProducts",
      "clearExpeditionsBySupplier",
      "getSupplierBySlug",
      "getCatalogById"
    ]),
    ...mapActions("pagination", ["userSelectedPage", "setCurrentPage"]),
    ...mapActions("users/products", [
      "setStoreTotal",
      "updateStoreProducts",
      "loadStoreTotal",
      "removeFromStoreProducts",
      "setStoreCanBuy",
    ]),
    removeFromCart(exp) {
      this.totals = this.totals.filter(obj => obj.id != exp.id)
      this.removeFromStoreProducts(exp)
      this.loadStoreTotal()
      this.updateTotal()
    },
    updateTotal() {
      let sum = 0
      this.hasBelowMin = false
      for(let i = 0; i < this.totals.length; i++) {
        sum += this.totals[i].total
        var formattedQuantity = this.totals[i].quantity
        if(this.totals[i].minimum && this.totals[i].quantity != '' && (formattedQuantity < this.totals[i].minimum))
          this.hasBelowMin = true
      }
      this.total = sum
      this.setStoreTotal(sum)
      this.setStoreTotal(sum)
      if(!this.hasBelowMin && this.supplier.minimumOrderValue && sum >= parseFloat(this.supplier.minimumOrderValue.replace('R$', '').replace('.', '').replace(',', '.')))
        this.setStoreCanBuy(true)
      else if(!this.hasBelowMin && !this.supplier.minimumOrderValue)
        this.setStoreCanBuy(true)
      else
        this.setStoreCanBuy(false)
    },
    allowZipcode(value) {
      // this.allowAccess = value
      if(value == true)
        this.targetClick.click()
    },
    productsFromFamily(name) {
      return this.supplierProducts.filter(product => product.familyName == name)
    },
    familyHasProducts(name) {
      return this.supplierProducts.find(product => product.familyName == name)
    },
    expeditionsByProduct(product) {
      return this.supplierProducts.filter(obj => obj.id == product.id).map(exp => exp.supplierProductExpeditions[0])
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
    scroll() {
      this.$refs['productsWindow'].onscroll = () => {
        if(this.$refs['productsWindow'] && this.$refs['content']) {
          let bottomOfWindow = this.$refs['productsWindow'].scrollTop + this.$refs['productsWindow'].offsetHeight > (this.$refs['content'].offsetHeight - 20)
          if(bottomOfWindow && !this.isLoading) {
            // var elem = this.loadProductTypes[this.totalRendered]
            if(this.currentPage < (this.totalPages) && this.productsLoaded) {
              this.currentPage++
            }

          }
        }
      }
    },
    checkTotals(totals) {
      let found = this.totals.find(obj => obj.id == totals.id)
      if(found) {
        found.quantity = totals.quantity
        found.total = totals.total
      } else {
        this.totals.push(totals)
      }
      this.updateStoreProducts(totals)
      this.updateTotal()
    },
    closing(){
      if(this.isMobile){
        this.show = !this.show
      }
    },
    storeHome() {
      this.$router.push({ name: 'public-store', params: { supplierSlug: this.$route.params.supplierSlug } })
    },
    selectedFamilyOnMenu(family) {
      this.$router.push({ name: 'public-store', params: { supplierSlug: this.$route.params.supplierSlug }, query: { selected: 'family', family: family } })
    },
    selectedCategoryOnModal(values) {
      this.$router.push({ name: 'public-store', params: { supplierSlug: this.$route.params.supplierSlug }, query: { selected: 'category', family: values.family, collection: values.collection, category: values.category } })
    },
    selectedCollectionOnModal(values) {
      this.$router.push({ name: 'public-store', params: { supplierSlug: this.$route.params.supplierSlug }, query: { selected: 'collection', family: values.family, collection: values.collection } })
    },
    selectProductType(product) {
      this.$router.push({ name: 'public-store-product',
                          params: {
                            supplierSlug: this.$route.params.supplierSlug,
                            familyName: this.formatString(product.familyName),
                            categoryName: this.formatString(product.categoryName),
                            productTypeName: this.formatString(product.productTypeName)
                          } })
      //this.$router.push({ name: 'public-store', params: { supplierSlug: this.$route.params.supplierSlug }, query: { selected: 'type', productTypeId: value } })
    },
    updateStoreFamiliesModal(val) {
      this.familiesModal = val
    },
    updateSupplierPopup(val) {
      this.openSupplierInfo = val
    },
    openFamiliesModal() {
      this.familiesModal = true
    },
    runSupplierSearch() {
      this.$router.push({ name: 'public-store-search', params: { keyword: this.keyword }})
    },
    getFamilyIcon(family) {
      switch(family) {
        case 'Alimentos e bebidas':
          return '<img src="' + require(`@/assets/images/maca.svg`) + '" alt="*" width="16">'
        case 'Embalagens':
          return '<i class="feather icon-shopping-bag mr-25"></i>'
        case 'Limpeza':
          return '<img class="mr-25" src="' + require(`@/assets/images/window-cleaner.svg`) + '" alt="*" width="16">'
        case 'Utensílios':
          return '<i class="fa fa-cutlery mr-25"></i>'
      }
      return null
    },
    openLocationPopup(target) {
      this.targetClick = target
      this.openLocation = true
    },
    updateLocationModal(val) {
      this.openLocation = val
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
      return this.normalizeString(string).replace(/\s+/g, '-')
    },
  },
  components: {
    FamilySearchList,
    PublicStoreProductCard,
    SupplierInfoModal,
    StoreFamiliesModal,
    StoreLocationModal
  },
};
</script>
