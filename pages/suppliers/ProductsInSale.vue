<template>
  <div class="content-body p-0 m-0" style="overflow-x: hidden;">
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
    <div style="padding-top: 70px;">
      <div
        class
        style="background: #EDEDED; border-bottom: solid 1px #D5D5D5; padding-top: 5px; padding-bottom: 5px;"
      >
        <div
          v-if="mobileBrowser"
          class="row"
          style="border-top: solid 1px LightGrey; padding-top: 5px; padding-bottom: 5px; background: linear-gradient(90deg, rgb(245, 127, 23) 33%, rgb(255, 176, 76) 66%);"
        >
          <a
            ref="backToTop"
            href="javascript:void(0);"
            @click="scrollToTop()"
            class="position-fixed btn btn-outline-primary font-large-1"
            style="bottom: 80px; right: 15px; z-index: 100; padding: 5px;"
          >
            <i class="feather icon-chevron-up" style="color: Gray;"></i>
          </a>
          <sales-families-modal
            @selected-category="selectedCategoryAllProducts"
            @selected-collection="selectedCollectionOnModal"
            @selected-product-type="selectProductType"
            @update-modal="updateStoreFamiliesModal"
            :openPopup="familiesModal"
            :catalog="allProductTypes"
            :selectedFamily="selectedFamily"
            :selectedCategory="selectedCategory"
            :selectedCollection="selectedCollection"
          />
          <div class="m-0 pl-1 pr-0" style="flex: 0 0 10%">
            <a @click="resetFilter()" href="javascript:void(0)">
              <button
                type="button"
                :class="viewType == home ? 'btn btn-outline-primary disabled' : 'btn btn-outline-primary'"
                style="padding: 7px 7px;"
              >
                <i class="ficon feather icon-home" />
              </button>
            </a>
          </div>
          <div
            class="m-0"
            style="flex: 0 0 40%;; padding-right: 2px !important; padding-left: 2px;"
          >
            <button
              @click="openFamiliesModal()"
              type="button"
              :class="this.btnSelected ? 'btn btn-warning w-100' : 'btn btn-outline-warning bg-white w-100'"
              style="padding: 8px 3px;"
            >Categorias</button>
          </div>
        </div>
        <div
          v-else
          class="row"
          style="border-top: solid 1px LightGrey; padding: 5px 10px; background: linear-gradient(90deg, rgb(245, 127, 23) 33%, rgb(255, 176, 76) 66%);"
        >
          <a
            ref="backToTop"
            href="javascript:void(0);"
            @click="scrollToTop()"
            class="position-fixed btn btn-outline-primary font-large-1"
            style="bottom: 20px; right: 30px; z-index: 100; padding: 5px;"
          >
            <i class="feather icon-chevron-up" style="color: Gray;"></i>
          </a>
          <div class="m-0 pl-1 pr-0" style="flex: 0 0 50px">
            <a @click="resetFilter()" href="javascript:void(0)">
              <button
                type="button"
                :class="viewType == home ? 'btn btn-outline-primary ' : 'btn btn-outline-primary'"
                style="padding: 7px 7px;"
              >
                <i class="ficon feather icon-home" />
              </button>
            </a>
          </div>
          <div
            class="m-0"
            style="flex: 0 0 auto; padding-right: 2px !important; padding-left: 2px;"
          >
            <span v-for="family in uniqueUsedFamilies() " :key="family">
              <a
                v-if="selectedFamily == 'Alimentos e bebidas' && family == 'Alimentos e bebidas'"
                href="javascript:void(0)"
                @click="resetFilter()"
              >
                <vs-chip
                  class="public-chip p-0 pr-1 font-small-2 font-weight-bold"
                  style="background-color: #bc5100; color: white;"
                >Alimentos e bebidas</vs-chip>
              </a>
              <a
                v-else-if="selectedFamily != 'Alimentos e bebidas' && family == 'Alimentos e bebidas'"
                href="javascript:void(0)"
                @click="selectFamily('Alimentos e bebidas')"
              >
                <vs-chip class="chip-mf public-chip p-0 pr-1">Alimentos e bebidas</vs-chip>
              </a>
              <a
                v-else-if="selectedFamily == family"
                href="javascript:void(0)"
                @click="resetFilter()"
              >
                <vs-chip
                  class="public-chip p-0 pr-1 font-small-2 font-weight-bold"
                  style="background-color: #bc5100; color: white;"
                >
                  <span class="capitalize">{{ family }}</span>
                </vs-chip>
              </a>
              <a v-else href="javascript:void(0)" @click="selectFamily(family)">
                <vs-chip class="chip-mf public-chip p-0 pr-1">
                  <span class="capitalize">{{ family }}</span>
                </vs-chip>
              </a>
            </span>
          </div>
        </div>
        <div
          v-if="showCollections && selectedFamily == 'Alimentos e bebidas' && !mobileBrowser"
          ref="scrollCollections"
          class="row no-wrap no-scrollbar"
          @mousewheel="scrollXCollections"
          v-dragscroll
          style="border-top: solid 1px LightGrey; padding-top: 5px; padding-bottom: 5px; padding-left: 17px; overflow-x: scroll; background-color: #f5f6f7;"
        >
          <a
            href="javascript:void(0);"
            v-if="hasScroll($refs.scrollCollections)"
            @click="addScrollX($refs.scrollCollections, -1)"
            class="btn btn-outline-primary font-medium-1"
            style="position: sticky; left: 0px; z-index: 100; padding: 5px; height: 25px;"
          >
            <i class="feather icon-chevron-left" style="color: Gray;"></i>
          </a>

          <span
            v-for="(collection, index) in showCollections"
            :key="index"
            :vs-value="index"
            style="flex: 0 0 auto; width: auto;"
          >
            <vs-chip v-if="collection != selectedCollection" class="chip-mf public-chip p-0 pr-1">
              <a
                @click="selectedCollectionOnModal({ family: selectedFamily, collection: collection })"
                style
              >
                <span class="capitalize">{{ collection }}</span>
              </a>
            </vs-chip>
            <vs-chip
              v-if="collection == selectedCollection"
              style="flex: 0 0 auto; width: auto; background-color: #ffb04c;"
              class="public-chip text-white font-small-2 font-weight-bold p-0 pr-1"
            >
              <a
                @click="selectedCollectionOnModal({ family: selectedFamily, collection: collection })"
                style
              >
                <span class="capitalize">{{ collection }}</span>
              </a>
            </vs-chip>
          </span>
          <vs-chip class="chip-mf public-chip p-0 pr-1" style="visibility: hidden;">a</vs-chip>
          <a
            href="javascript:void(0);"
            v-if="hasScroll($refs.scrollCollections)"
            @click="addScrollX($refs.scrollCollections, 1)"
            class="btn btn-outline-primary font-medium-1"
            style="position: sticky; right: 20px; z-index: 100; padding: 5px; height: 25px;"
          >
            <i class="feather icon-chevron-right" style="color: Gray;"></i>
          </a>
        </div>
        <div
          v-if="(selectedCollection || selectedCategory)"
          ref="scrollCategories"
          class="row no-wrap no-scrollbar"
          @mousewheel="scrollXCategories"
          v-dragscroll
          style="border-top: solid 1px LightGrey; padding-top: 5px; padding-bottom: 5px; padding-left: 17px; overflow-x: scroll; background-color: #f5f6f7;"
        >
          <a
            href="javascript:void(0);"
            v-if="hasScroll($refs.scrollCategories)"
            @click="addScrollX($refs.scrollCategories, -1)"
            class="btn btn-outline-primary font-medium-1"
            style="position: sticky; left: 0px; z-index: 100; padding: 5px; height: 25px;"
          >
            <i class="feather icon-chevron-left" style="color: Gray;"></i>
          </a>
          <a
            v-if="selectedCollection"
            style="margin-left: 5px; align-self: center;"
            class="public-chip text-black font-small-2 font-weight-bold p-0 pr-1"
          >
            <a @click="selectFamily(selectedFamily)" style>
              <span class="capitalize">{{ selectedCollection }}</span>
            </a>
          </a>
          <div v-if="selectedCollection" style="border-right: 1px solid DarkGrey; margin: 0 5px;"></div>
          <span
            v-for="(category, index) in showCategories"
            :key="index"
            :vs-value="index"
            style="flex: 0 0 auto; width: auto;"
          >
            <vs-chip
              v-if="category == selectedCategory"
              style="flex: 0 0 auto; width: auto; background-color: #f57f17;"
              class="public-chip text-white font-small-2 font-weight-bold p-0 pr-1"
            >
              <a v-if="viewType == 'product-type'" @click="selectFamily(selectedFamily)" style>
                <span class="capitalize">{{ selectedCategory }}</span>
              </a>
              <a v-else @click="selectFamily(selectedFamily)" style>
                <span class="capitalize">{{ selectedCategory }}</span>
              </a>
            </vs-chip>
            <vs-chip v-if="category != selectedCategory" class="chip-mf public-chip p-0 pr-1">
              <a
                @click="selectedCategoryAllProducts({ family: selectedFamily, category: category, collection: selectedCollection })"
                style
              >
                <span class="capitalize">{{ category }}</span>
              </a>
            </vs-chip>
          </span>
          <vs-chip class="chip-mf public-chip p-0 pr-1" style="visibility: hidden;">a</vs-chip>
          <a
            href="javascript:void(0);"
            v-if="hasScroll($refs.scrollCategories)"
            @click="addScrollX($refs.scrollCategories, 1)"
            class="btn btn-outline-primary font-medium-1"
            style="position: sticky; right: 20px; z-index: 100; padding: 5px; height: 25px;"
          >
            <i class="feather icon-chevron-right" style="color: Gray;"></i>
          </a>
        </div>
        <div
          v-if="viewType == 'collection' && selectedFamily != 'Alimentos e bebidas'"
          ref="scrollCategoriesAB"
          class="row no-wrap no-scrollbar"
          @mousewheel="scrollXCategoriesAB"
          v-dragscroll
          style="border-top: solid 1px LightGrey; padding-top: 5px; padding-bottom: 5px; padding-left: 17px; overflow-x: scroll; background-color: #f5f6f7;"
        >
          <a
            href="javascript:void(0);"
            v-if="hasScroll($refs.scrollCategoriesAB)"
            @click="addScrollX($refs.scrollCategoriesAB, -1)"
            class="btn btn-outline-primary font-medium-1"
            style="position: sticky; left: 0px; z-index: 100; padding: 5px; height: 25px;"
          >
            <i class="feather icon-chevron-left" style="color: Gray;"></i>
          </a>
          <span
            v-for="(category, index) in showCategories"
            :key="index"
            :vs-value="index"
            style="flex: 0 0 auto; width: auto;"
          >
            <vs-chip v-if="category != selectedCategory" class="chip-mf public-chip p-0 pr-1">
              <a
                @click="selectedCategoryAllProducts({ family: selectedFamily, category: category, collection: '' })"
                style
              >
                <span class="capitalize">{{ category }}</span>
              </a>
            </vs-chip>
          </span>
          <a
            href="javascript:void(0);"
            v-if="hasScroll($refs.scrollCategoriesAB)"
            @click="addScrollX($refs.scrollCategoriesAB, 1)"
            class="btn btn-outline-primary font-medium-1"
            style="position: sticky; right: 20px; z-index: 100; padding: 5px; height: 25px;"
          >
            <i class="feather icon-chevron-right" style="color: Gray;"></i>
          </a>
        </div>
        <div
          v-if="viewType == 'category-all-products' || viewType == 'product-type'"
          ref="scrollProducts"
          class="row no-wrap no-scrollbar"
          style="overflow-x: scroll; border-top: solid 1px LightGrey; padding-top: 2px; padding-bottom: 2px; padding-left: 15px; background-color: #f5f6f7;"
          @mousewheel="scrollXProducts"
          v-dragscroll
        >
          <a
            href="javascript:void(0);"
            v-if="hasScroll($refs.scrollProducts)"
            @click="addScrollX($refs.scrollProducts, -1)"
            class="btn btn-outline-primary font-medium-1"
            style="position: sticky; left: 0px; z-index: 100; padding: 5px; height: 25px;"
          >
            <i class="feather icon-chevron-left" style="color: Gray;"></i>
          </a>
          <span
            v-for="type in showProductTypes"
            :key="'a' + type.type.productType"
            :vs-value="'a' + type.type.productType"
            style="flex: 0 0 auto; width: auto;"
          >
            <vs-chip
              v-if="selectedProductType && type.type.productTypeId == selectedProductType.productTypeId"
              style="flex: 0 0 auto; width: auto; background-color: #ffb04c;"
              class="public-chip text-white font-small-2 font-weight-bold p-0 pr-1"
            >
              <a
                @click="selectedCategoryAllProducts({ family: selectedFamily, category: selectedCategory, collection: selectedCollection })"
                style
              >{{ type.type.productType }}</a>
            </vs-chip>
            <vs-chip v-else class="chip-mf public-chip p-0 pr-1">
              <a
                @click="selectProductType(type.type.productTypeId)"
                style
              >{{ type.type.productType }}</a>
            </vs-chip>
          </span>
          <vs-chip class="chip-mf public-chip p-0 pr-1" style="visibility: hidden;">a</vs-chip>
          <a
            href="javascript:void(0);"
            v-if="hasScroll($refs.scrollProducts)"
            @click="addScrollX($refs.scrollProducts, 1)"
            class="btn btn-outline-primary font-medium-1"
            style="position: sticky; right: 20px; z-index: 100; padding: 5px; height: 25px;"
          >
            <i class="feather icon-chevron-right" style="color: Gray;"></i>
          </a>
        </div>
      </div>

      <div v-if="this.keywordAux != null">
        <div
          v-if="filteredSuppliers.length == 0"
          style="display: flex; flex-direction: row; justify-content: center;"
        >
          <pre style="margin: 2em 0em; white-space: pre-wrap; text-align: center;"> <h4>Nenhum fornecedor encontrado para  <span style="color:#f57f17;">{{this.keywordAux}}.</span></h4> </pre>
        </div>
        <div v-else style="display: flex; flex-direction: row; justify-content: center;">
          <pre style="margin: 2em 0em; white-space: pre-wrap; text-align: center;"> <h4>Fornecedores encontrados para <span style="color:#f57f17;">{{this.keywordAux}}:</span></h4> </pre>
        </div>
        <a
          v-show="this.mobileBrowser"
          href="javascript:void(0)"
          @click="resetFilter()"
          style="display: flex; justify-content: center; margin-top: -50px; color: black"
        >Limpar</a>
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
        <h6>Escolha por oferta</h6>
      </div>
      <div
        :class="
                this.mobileBrowser
                  ? 'product-card-list-mobile'
                  : 'product-card-list-desktop'
              "
      >
        <span
          v-for="(product, index) in this.filteredRandomSaleProducts"
          :key="index"
          style="min-width: 165px; max-width: 165px;"
        >
          <a v-if="index >= 0" style="text-decoration: underline">{{ product.productTypeName }}</a>
          <div class="card font-small-3" style="margin-right: 7px; margin-left: 3px">
            <div class="card-body pl-1 pr-1 pt-0 pb-0">
              <ProductInSaleCard
                :product="product"
                :expeditions="product.supplierProductExpeditions"
              />
            </div>
          </div>
        </span>
      </div>
    </div>
    <v-footer
      :class="this.mobileBrowser == true ? 'mobile' : 'desktop' "
      style="margin-top:100px;"
    />
  </div>
</template>

<style>
span.capitalize:first-letter {
  text-transform: uppercase;
}
span.capitalize {
  display: inline-block;
}
.no-wrap {
  flex-wrap: nowrap;
}
.no-scrollbar {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
}
.no-scrollbar::-webkit-scrollbar {
  /* WebKit */
  width: 0;
  height: 0;
}
.desktop {
  margin-left: 10px !important;
}
.mobile {
  margin-bottom: 20px;
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
  flex-wrap: wrap;
  overflow: hidden;
  align-self: center;
  justify-content: center;
}
</style>

<script>
import SuppliersService from "~/components/suppliers/services/index";
import SalesFamiliesModal from "~/components/users/components/SalesFamiliesModal";
import VFooter from "@/layouts/main/components/VFooter";
import ProductInSaleCard from "~/components/products/components/ProductInSaleCard";
import { mapGetters } from "vuex";

export default {
  name: "ProductsInSale",
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
      viewType: "family",
      selectedCollection: null,
      selectedFamily: null,
      selectedCategory: null,
      keyword: null,
      keywordAux: null,
      home: null,
      showCollections: [],
      showCategories: [],
      showProductTypes: [],
      allProductTypes: [],
      mobileBrowser: false,
      familiesModal: false,
      btnSelected: false,
      randomSaleProducts: [],
      filteredRandomSaleProducts: [],
    };
  },
  created() {
    this.isLoading = true;
    this.isMobile();
    SuppliersService.getAllSaleProducts().then((response2) => {
      this.randomSaleProducts = response2.data;
      this.filteredRandomSaleProducts = this.randomSaleProducts.sort((a, b) =>a.productTypeName.localeCompare(b.productTypeName));
        this.createOptionsSctructures(this.randomSaleProducts);
        this.isLoading = false;
        if (this.$route.query.keyword) {
          this.keyword = this.$route.query.keyword;
          this.runSearch();
        } else if (this.$route.query.family) {
          this.selectFamily(this.$route.query.family);
        }
    });
  },
  computed: {
    ...mapGetters("navigationFilters", ["params"]),
  },
  methods: {
    filterSupplierByFamily(familyName) {
      this.filteredSuppliers = this.allAutoSuppliers.filter((obj) =>
        Object.prototype.hasOwnProperty.call(obj.catalogAsHash, familyName)
      );
    },
    filterRandomSaleProductsByFamily(familyName) {
      this.filteredRandomSaleProducts = this.randomSaleProducts.filter(
        (obj) =>
          obj.familyName ==
          familyName.charAt(0).toUpperCase() + familyName.slice(1)
      );
    },
    filterRandomSaleProductsByCollection(categoryCollection) {
      this.filteredRandomSaleProducts = this.randomSaleProducts.filter(
        (obj) =>
          obj.categoryCollection ==
          categoryCollection.charAt(0).toUpperCase() +
            categoryCollection.slice(1)
      );
    },
    filterRandomSaleProductsByCategory(categoryName) {
      this.filteredRandomSaleProducts = this.randomSaleProducts.filter(
        (obj) =>
          obj.categoryName ==
          categoryName.charAt(0).toUpperCase() + categoryName.slice(1)
      );
    },
    filterRandomSaleProductsByProductType(productTypeId) {
      this.filteredRandomSaleProducts = this.randomSaleProducts.filter(
        (obj) => obj.productTypeId == productTypeId
      );
    },
    resetFilter() {
      this.keyword = null;
      this.keywordAux = null;
      this.viewType = "family";
      this.selectedFamily = null;
      this.selectedCollection = null;
      this.selectedCategory = null;
      this.filteredSuppliers = this.allAutoSuppliers;
      this.filteredRandomSaleProducts = this.randomSaleProducts;
      this.btnSelected = false;
    },
    uniqueUsedFamilies() {
      var usedFamilies = [...new Set(this.allProductTypes.map((obj) => obj.family))];
      usedFamilies = usedFamilies.sort((a, b) =>a.localeCompare(b))
      return usedFamilies
    },
   createOptionsSctructures(suppliers) {
      var data = null;
      for (var i in suppliers) {
        data = suppliers[i];
        var collectionName = ''
        if(data.categoryCollection)
          collectionName = data.categoryCollection
          this.allProductTypes.push({
            family: data.familyName,
            collection: collectionName,
            category: data.categoryName,
            type:{  productTypeId: data.productTypeId,
                    productType: data.productTypeName,
                    quantity: data.quantity,
                  }
          });
        }
    },
    selectFamily(familyName) {
      this.selectedCollection = null;
      this.selectedCategory = null;
      if (familyName == "Alimentos e bebidas") {
        this.viewType = "family-collections";
        this.showCollections = [
          ...new Set(
            this.allProductTypes
              .filter((obj) => obj.family == familyName)
              .map((obj) => obj.collection)
          ),
        ];
        if (this.showCollections.length > 1)
          this.showCollections = this.showCollections.sort((a, b) =>
            a.localeCompare(b)
          );
      } else {
        this.viewType = "collection";
        this.showCategories = [
          ...new Set(
            this.allProductTypes
              .filter((obj) => obj.family == familyName)
              .map((obj) => obj.category)
          ),
        ];
        if (this.showCategories.length > 1)
          this.showCategories = this.showCategories.sort((a, b) =>
            a.localeCompare(b)
          );
      }
      this.selectedFamily = familyName;
      this.filterSupplierByFamily(this.selectedFamily);
      this.filterRandomSaleProductsByFamily(this.selectedFamily);
    },
    selectedCollectionOnModal(data) {
      this.viewType = "collection";
      this.showCategories = [
        ...new Set(
          this.allProductTypes
            .filter(
              (obj) =>
                obj.collection == data.collection && obj.family == data.family
            )
            .map((obj) => obj.category)
        ),
      ];
      if (this.showCategories.length > 1)
        this.showCategories = this.showCategories.sort((a, b) =>
          a.localeCompare(b)
        );
      this.selectedCollection = data.collection;
      this.selectedFamily = data.family;
      this.selectedProductType = null;
      this.filterRandomSaleProductsByCollection(this.selectedCollection);
    },
    selectedCategoryAllProducts(value) {
      this.selectedFamily = value.family;
      this.selectedCollection = value.collection;
      this.selectedCategory = value.category;
      this.filterRandomSaleProductsByCategory(this.selectedCategory);
      this.selectedProductType = null;
      this.viewType = "category-all-products";
      this.showCategories = [
        ...new Set(
          this.allProductTypes
            .filter((obj) => obj.collection == value.collection && obj.family == value.family)
            .map((obj) => obj.category)
        ),
      ];
      if (this.showCategories.length > 1)
        this.showCategories = this.showCategories.sort((a, b) =>
          a.localeCompare(b)
        );
      this.showProductTypes = [
        ...new Set(
          this.allProductTypes.filter(
            (obj) =>
              obj.collection == value.collection &&
              obj.family == value.family &&
              obj.category == value.category
          )
        ),
      ];
      if (this.showProductTypes.length > 1)
        this.showProductTypes = this.showProductTypes.sort((a, b) =>
          a.type.productType.localeCompare(b.type.productType)
        );
      var result = [];
      this.showProductTypes.filter(function (item) {
        var i = result.findIndex(
          (x) => x.type.productTypeId == item.type.productTypeId
        );
        if (i <= -1) {
          result.push(item);
        }
        return null;
      });
      this.showProductTypes = result;
    },
    async selectProductType(productTypeId) {
      this.selectedProductType = this.allProductTypes
        .filter((obj) => obj.type.productTypeId == productTypeId)
        .map((obj) => obj.type)[0];
      this.viewType = "product-type";
      var typeObj = this.allProductTypes.filter(
        (obj) => obj.type.productTypeId == productTypeId
      )[0];
      this.filterRandomSaleProductsByProductType(
        this.selectedProductType.productTypeId
      );
    },
    scrollXProducts(e) {
      this.$refs["scrollProducts"].scrollLeft += e.deltaY;
    },
    scrollXCategoriesAB(e) {
      this.$refs["scrollCategoriesAB"].scrollLeft += e.deltaY;
    },
    scrollXCategories(e) {
      this.$refs["scrollCategories"].scrollLeft += e.deltaY;
    },
    scrollXCollections(e) {
      this.$refs["scrollCollections"].scrollLeft += e.deltaY;
    },
    runSearch() {
      this.isLoading = true;
      this.keywordAux = this.keyword;
      SuppliersService.searchAutomaticCatalog(this.keyword).then((response) => {
        this.viewType = "family";
        this.selectedFamily = null;
        this.selectedCollection = null;
        this.selectedCategory = null;
        this.filteredSuppliers = this.allAutoSuppliers.filter((obj) =>
          response.data.includes(obj.id)
        );
        this.isLoading = false;
      });
    },
    isMobile() {
      if (screen.width <= 760 || window.innerWidth <= 760) {
        this.mobileBrowser = true;
      } else {
        this.mobileBrowser = false;
      }
    },
    openFamiliesModal() {
      this.familiesModal = true;
      this.btnSelected = true;
    },
    updateStoreFamiliesModal(val) {
      this.familiesModal = val;
    },
    scrollToTop() {
      document.documentElement.scrollTop = 0;
    },
    hasScroll(scroll) {
      if (scroll && scroll.scrollWidth > scroll.clientWidth) {
        return true;
      } else return false;
    },
    addScrollX(scroll, direction) {
      if (scroll) scroll.scrollLeft += 50 * direction;
    },
  },
  components: {
    SalesFamiliesModal,
    VFooter,
    ProductInSaleCard,
  },
};
</script>
