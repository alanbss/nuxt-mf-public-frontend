<template>
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
      <div class="row" ref="productsWindow" style="max-height: calc(100vh - 8em); overflow-y: scroll;">
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
                <div v-for="product in chunk" :key="product.id" :style="widthRatio ? 'width: ' + widthRatio + '%;' : ''" class="card-body pl-1 pr-1 pt-0 pb-0">
                  <product-card :product="product" />
                </div>
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
                <router-link :to="{ name: 'home' }" style="color: 0391D1; text-decoration: underline;">navegar pelo site</router-link>
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
import ProductCard from "@/resources/products/components/ProductCard";
import { mapActions, mapGetters, mapState } from "vuex";

export default {
  name: "Search",
  data() {
    return {
      keyword: this.$route.params.keyword,
      category: this.$route.query.category,
      productsLoaded: false,
      color: "#0cb695",
      loader: "spinner",
      width: 110,
      height: 110,
      backgroundColor: "#0cb695",
      opacity: 0.3,
      fullPage: true,
      isLoadingProducts: false,
      isLoadingCategories: false,
    };
  },
  mounted() {
    this.productsLoaded = false
    this.isLoadingProducts = true
    this.isLoadingCategories = true
    this.clearProducts()
    this.userSelectedPage(1)
    this.setCurrentPage(1)
    this.getSearchWithCategories(this.keyword).then(() => {
      this.isLoadingCategories = false
    })
    this.searchProducts({ keyword: this.keyword, category: this.category }).then(() => {
      this.productsLoaded = true
      this.isLoadingProducts = false
      this.scroll()
    })
  },
  beforeRouteLeave(to, from, next) {
    this.userSelectedPage(1)
    this.setCurrentPage(1)
    next()
  },
  watch: {
    '$route.params.keyword': function (keyword) {
      this.keyword = keyword
      this.productsLoaded = false
      this.isLoadingProducts = true
      this.isLoadingCategories = true
      this.clearProducts()
      this.userSelectedPage(1)
      this.setCurrentPage(1)
      this.getSearchWithCategories(this.keyword).then(() => {
        this.isLoadingCategories = false
      })
      this.searchProducts({ keyword: this.keyword, category: null }).then(() => {
        this.productsLoaded = true
        this.isLoadingProducts = false
      })
    },
    '$route.query.category': function (categoryId) {
      this.category = categoryId
      this.productsLoaded = false
      this.isLoadingProducts = true
      this.clearProducts()
      this.userSelectedPage(1)
      this.setCurrentPage(1)
      this.searchProducts({ keyword: this.keyword, category: categoryId }).then(() => {
        this.productsLoaded = true
        this.isLoadingProducts = false
      })
    },
    currentPage(pageNumber) {
      this.productsLoaded = false
      this.isLoadingProducts = true
      this.userSelectedPage(pageNumber)
      this.searchProducts({ keyword: this.keyword, category: this.category }).then(() => {
        this.productsLoaded = true
        this.isLoadingProducts = false
      })
    },
  },

  computed: {
    ...mapState("pagination", ["totalPages"]),
    ...mapState("families", ["family", "products", "searchedFamilies"]),
    ...mapState("products", ["products"]),
    ...mapGetters("families", [
      "chunckedProductsFromFamily",
      "categoriesWithCollection",
      "categoriesWithoutCollection",
    ]),

    isLoading() {
      return this.isLoadingProducts || this.isLoadingCategories
    },

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
    ...mapActions("families", ["getSearchWithCategories"]),
    ...mapActions("products", ["searchProducts", "clearProducts"]),
    ...mapActions("pagination", ["userSelectedPage", "setCurrentPage"]),
    productsFromFamily(name) {
      return this.products.filter(product => product.familyName == name)
    },
    familyHasProducts(name) {
      return this.products.find(product => product.familyName == name)
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
  },
  components: {
    FamilySearchList,
    ProductCard,
  },
};
</script>
