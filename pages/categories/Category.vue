<template>
  <div class="content-wrapper pb-0">
    <div class="content-header row">
      <div class="content-header-left col-12 mb-2">
        <div class="row breadcrumbs-top">
          <div class="col-12">
            <div class="breadcrumb-wrapper">
              <ol class="breadcrumb breadcrumb-mf border-0">
                <li class="breadcrumb-item">
                  <router-link :to="{ name: 'home' }">Início</router-link>
                </li>
                <li class="breadcrumb-item">
                  <router-link :to="{ name: 'family', params: { familyId: familyId } }">{{ familyName }}</router-link>
                </li>
              </ol>
            </div>
            <h2 class="content-header-title mb-0">{{categoryName}}</h2>
          </div>
        </div>
      </div>
    </div>
    <div class="content-body">
      <div class="row">
        <product-types-list :productTypes="productTypes" />

        <div class="col-xl-8 col-12">
          <div class="row">
            <span v-for="product in products" :key="product.id" :style="widthRatio ? 'width: ' + widthRatio + '%;' : ''">
              <product-card :product="product" />
            </span>
          </div>
          <div class="row">
            <div class="col-12">
              <v-product-paginator />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProductCard from "~/components/products/components/ProductCard";
import ProductTypeService from "~/components/productTypes/services/";
import ProductTypesList from "~/components/categories/components/ProductTypesList";
import VProductPaginator from "~/components/products/components/VProductPaginator";
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  name: "Category",
  data() {
    return {
      productTypes: [],
      categoryName: "",
    };
  },
  async mounted() {
    let params = this.params
    let productTypes = await ProductTypeService.usedFromCategory(this.categoryId, params);

    this.productTypes = productTypes.data;
    this.categoryName = this.productTypes[0].category.name;

    this.getProductsByCategory(this.categoryId);
  },
  computed: {
    ...mapState("products", ["products"]),
    ...mapState("pagination", ["totalPages"]),
    ...mapGetters("navigationFilters", ["params"]),

    maxPerScreen() {
      if(window.innerWidth >= 1910) {
        return 6
      } else if(window.innerWidth >= 1680 && window.innerWidth < 1910) {
        return 5
      } else if(window.innerWidth >= 1450 && window.innerWidth < 1680) {
        return 4
      } else if(window.innerWidth >= 1220 && window.innerWidth < 1450) {
        return 3
      } else if(window.innerWidth >= 1000 && window.innerWidth < 1220) {
        return 4
      } else {
        return 2
      }
    },

    widthRatio() {
      return ((window.innerWidth / this.maxPerScreen) / window.innerWidth) * 100
    },

    categoryId() {
      return this.$route.params.categoryId;
    },

    familyName() {
      if (this.products.length) {
        return this.products[0].familyName;
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

    currentPage: {
      get() {
        return this.$store.state.pagination.currentPage;
      },
      set(value) {
        this.$store.dispatch("pagination/setCurrentPage", value);
      },
    },
  },
  watch: {
    currentPage(pageNumber) {
      this.$vs.loading()
      this.userSelectedPage(pageNumber)
      this.getProductsByCategory(this.categoryId).then(() => {
        this.$vs.loading.close()
      })
    },
  },
  methods: {
    ...mapActions("products", ["getProductsByCategory"]),
    ...mapActions("pagination", ["userSelectedPage", "setCurrentPage"]),
  },
  components: {
    ProductCard,
    ProductTypesList,
    VProductPaginator
  },
};
</script>
