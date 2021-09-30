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
          <suppliers-families-modal
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


          <div class="m-0 pl-0 pr-1" style="flex: 0 0 48%;">
            <form
              @submit.prevent="runSearch"
              action
              class
              style="width: 100%; z-index: 1; height: -webkit-fill-available; position: relative;"
            >
              <i
                class="feather icon-search"
                style="color: black; position: absolute; left: 3px; top: 7px; font-size: 1.2rem; z-index: 2;"
                @click="runSearch()"
              />
              <input
                id="search2"
                type="text"
                placeholder="Buscar produtos"
                v-model="keyword"
                autocomplete="on"
                class="mr-2"
                style="padding-left: 20px; position: relative; left: 0; height: 30px; font-size: 1rem; border: none; border-radius: 5px;"
                :style="this.mobileBrowser ? 'width: 90%;' : 'width: 600px;'"
              />
            </form>
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
            <span v-for="family in uniqueUsedFamilies()" :key="family">
              <!-- <a
                v-if="selectedFamily == 'alimentos e bebidas' && family == 'alimentos e bebidas'"
                href="javascript:void(0)"
                @click="resetFilter()"
              >
                <vs-chip
                  class="public-chip p-0 pr-1 font-small-2 font-weight-bold"
                  style="background-color: #bc5100; color: white;"
                >Alimentos e bebidas</vs-chip>
              </a>
              <a
                v-else-if="selectedFamily != 'alimentos e bebidas' && family == 'alimentos e bebidas'"
                href="javascript:void(0)"
                @click="selectFamily('alimentos e bebidas')"
              > -->
              <a v-if="selectedFamily == 'alimentos e bebidas' && family == 'alimentos e bebidas'" href="javascript:void(0)" @click="resetFilter()">
                <vs-chip class="public-chip p-0 pr-1 font-small-2 font-weight-bold" style="background-color: #bc5100; color: white;">
                    Alimentos e bebidas
                </vs-chip>
              </a>
              <router-link
                v-else-if="selectedFamily != 'alimentos e bebidas' && family == 'alimentos e bebidas'"
                :to="{ name: 'suppliers-family',
                       params: {
                         familyName: 'alimentos-e-bebidas',
                      } }"
                style="color: inherit;"
                >
                <vs-chip class="chip-mf public-chip p-0 pr-1" >
                    Alimentos e bebidas
                </vs-chip>
              </router-link>
              <a v-else-if="selectedFamily == family" href="javascript:void(0)" @click="resetFilter()">
               <vs-chip class="public-chip p-0 pr-1 font-small-2 font-weight-bold" style="background-color: #bc5100; color: white;">
                 <span class="capitalize">{{ family }}</span>
               </vs-chip>
              </a>
              <router-link
                v-else
                :to="{ name: 'suppliers-family',
                       params: {
                         familyName: formatString(family),
                      } }"
                style="color: inherit;"
                >
                <vs-chip class="chip-mf public-chip p-0 pr-1" >
                  <span class="capitalize">{{ family }}</span>
                </vs-chip>
              </router-link>
            </span>
          </div>
          <div class="m-0 pl-0 pr-1" style="flex: 0 0 350px; margin-left: auto !important;">
            <form
              @submit.prevent="runSearch"
              action
              class
              style="width: 100%; z-index: 1; height: -webkit-fill-available; position: relative;"
            >
              <i
                class="feather icon-search"
                style="color: black; position: absolute; left: 3px; top: 7px; font-size: 1.2rem; z-index: 2;"
                @click="runSearch()"
              />
              <a href="javascript:void(0);" @click="resetFilter()">
                <small
                  style="color: black; position: absolute; left: 530px; top: 5px; font-size: 1rem; z-index: 2;"
                >Limpar</small>
              </a>
              <input
                id="search2"
                type="text"
                placeholder="Buscar produtos"
                v-model="keyword"
                autocomplete="on"
                class="mr-2"
                style="padding-left: 30px; position: relative; left: 0; height: 30px; font-size: 1rem; border: none; border-radius: 15px; "
                :style="this.mobileBrowser ? 'width: 90%;' : 'width: 600px;'"
              />
            </form>
          </div>
        </div>
        <div
          v-if="showCollections && selectedFamily == 'alimentos e bebidas' && !mobileBrowser"
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
            :key="'collection' + index"
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
            :key="'category' + index"
            :vs-value="index"
            style="flex: 0 0 auto; width: auto;"
          >
            <vs-chip v-if="category == selectedCategory" style="flex: 0 0 auto; width: auto; background-color: #f57f17;" class="public-chip text-white font-small-2 font-weight-bold p-0 pr-1" >
              <router-link
                v-if="viewType == 'product-type'"
                :to="{ name: 'suppliers-family',
                       params: {
                         familyName: formatString(selectedFamily),
                      } }"
                style="color: inherit;"
              >
                <span class="capitalize">{{ selectedCategory }}</span>
              </router-link>
              <router-link
                v-else
                :to="{ name: 'suppliers-family',
                       params: {
                         familyName: formatString(selectedFamily),
                      } }"
                style="color: inherit;"
              >
                <span class="capitalize">{{ selectedCategory }}</span>
              </router-link>
            </vs-chip>
            <vs-chip
              v-if="category != selectedCategory"
              class="chip-mf public-chip p-0 pr-1"
            >
              <router-link
                :to="{ name: 'suppliers-category',
                       params: {
                         familyName: formatString(selectedFamily),
                         categoryName: formatString(category)
                      } }"
                style="color: inherit;"
              >
                <span class="capitalize">{{ category }}</span>
              </router-link>
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
          v-if="viewType == 'collection' && selectedFamily != 'alimentos e bebidas'"
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
            :key="'cat' + index"
            :vs-value="index"
            style="flex: 0 0 auto; width: auto;"
          >
            <vs-chip
              v-if="index != selectedCategory"
              class="chip-mf public-chip p-0 pr-1"
            >
              <router-link
                :to="{ name: 'suppliers-category',
                       params: {
                         familyName: formatString(selectedFamily),
                         categoryName: formatString(category)
                      } }"
                style="color: inherit;"
              >
                <span class="capitalize">{{ category }}</span>
              </router-link>
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
            :key="type.type.productType"
            :vs-value="type.type.productType"
            style="flex: 0 0 auto; width: auto;"
          >
            <vs-chip
              v-if="selectedProductType && type.type.productTypeId == selectedProductType.productTypeId"
              style="flex: 0 0 auto; width: auto; background-color: #ffb04c;"
              class="public-chip text-white font-small-2 font-weight-bold p-0 pr-1"
            >
              <router-link
                :to="{ name: 'suppliers-category',
                       params: {
                         familyName: formatString(selectedFamily),
                         categoryName: formatString(selectedCategory)
                      } }"
                style="color: inherit;"
              >
                {{ type.type.productType }}
              </router-link>
            </vs-chip>
            <vs-chip
              v-else
              class="chip-mf public-chip p-0 pr-1"
            >
              <router-link
                :to="{ name: 'suppliers-product',
                       params: {
                         familyName: formatString(selectedFamily),
                         categoryName: formatString(selectedCategory),
                         productTypeName: formatString(type.type.productType)
                      } }"
                style="color: inherit;"
              >
                {{ type.type.productType }}
              </router-link>
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
          <a href="javascript:void(0)" @click="goToSalesPage">Ver tudo</a>
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
            :key="'prod' + product.id"
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
      </div>
      <div
        style="display: flex;
        flex-wrap: wrap;
        flex-direction: row;
        justify-content: center;"
      >
        <div v-for="supplier in filteredSuppliers" v-bind:key="supplier.id">
          <supplier-card :supplier="supplier" />
        </div>
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
  overflow: hidden;
  align-self: center;
  justify-content: center;
}
</style>

<script>
import SuppliersService from "~/components/suppliers/services/index";
import SupplierCard from "~/components/suppliers/components/SupplierCard";
import SuppliersFamiliesModal from "~/components/users/components/SuppliersFamiliesModal";
import VFooter from "@/layouts/main/components/VFooter";
import ProductInSaleCard from "~/components/products/components/ProductInSaleCard";
import { mapGetters } from "vuex";

export default {
  name: "SelectSupplier",
   metaInfo() {
    return {
      title: this.titleContent,
      titleTemplate: null,

       meta: [
         {
          vmid: "description",
          name: "description",
          content: this.descriptionContent,
        },
        {
          property: "og:title",
          content: this.titleContent,
        },
        {
          property: "og:description",
          content: this.descriptionContent,
        },
        {
          property: "og:image",
          itemprop: "image",
          content:  "https://meufornecedor.com.br/logo.png",
        },

        {
          property: "og:image:secure_url",
          itemprop: "image",
          content:  "https://meufornecedor.com.br/logo.png",
        },
       ]
    }
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
      allAutoSuppliers: [],
      filteredSuppliers: [],
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
      titleContent: 'Distribuidoras - Lojas online | Meu Fornecedor',
      descriptionContent: 'Lista de distribuidoras de alimentos, bebidas, embalagens, limpeza e utensílios. Acesse as lojas e confira as ofertas em MeuFornecedor.com.br',
    };
  },
  created() {
    this.isLoading = true;
    this.isMobile();
    SuppliersService.getRandomSaleProducts().then((response2) => {
      this.randomSaleProducts = response2.data;
      this.filteredRandomSaleProducts = this.randomSaleProducts;
      SuppliersService.getAllAuto(this.params).then((response) => {
        this.allAutoSuppliers = response.data;
        this.filteredSuppliers = this.allAutoSuppliers
        this.createOptionsSctructures(this.allAutoSuppliers)
        this.isLoading = false
        if(this.$route.query.keyword) {
          this.keyword = this.$route.query.keyword
          this.runSearch()
        } else if(this.$route.meta.familyView) {
          var found = this.findKeyEncoded(this.uniqueUsedFamilies(), this.$route.params.familyName)
          if (found) {
            this.selectFamily(found.original);
            this.titleContent = "Distribuidoras de " + this.slugToName(this.selectedFamily) + " | Meu Fornecedor";
            this.descriptionContent = "Fornecedores de " + this.slugToName(this.selectedFamily) + " listados no MeuFornecedor.com.br. Compre online para seu restaurante, padaria, minimercado.";
          }
        } else if(this.$route.meta.categoryView) {
          for(var j = 0; j < this.allProductTypes.length; j++) {
            if(this.formatString(this.allProductTypes[j].category) == this.$route.params.categoryName &&
               this.formatString(this.allProductTypes[j].family) == this.$route.params.familyName) {
              this.selectedCategoryAllProducts({ family: this.allProductTypes[j].family, collection: this.allProductTypes[j].collection, category: this.allProductTypes[j].category });
              this.titleContent = "Distribuidoras de " + this.slugToName(this.selectedCategory) + " | Meu Fornecedor"
              this.descriptionContent = "Fornecedores de " + this.slugToName(this.selectedCategory) + " listados no MeuFornecedor.com.br. Compre online para seu restaurante, padaria, minimercado.";
              break
            }
          }
        } else if(this.$route.meta.productTypeView) {
          for(var k = 0; k < this.allProductTypes.length; k++) {
            if(this.formatString(this.allProductTypes[k].category) == this.$route.params.categoryName &&
               this.formatString(this.allProductTypes[k].family) == this.$route.params.familyName &&
               this.formatString(this.allProductTypes[k].type.productType) == this.$route.params.productTypeName) {
              this.selectProductType(this.allProductTypes[k].type.productTypeId);
              this.titleContent = "Distribuidoras de " + this.slugToName(this.selectedProductType.productType) + " | Meu Fornecedor";
              this.descriptionContent = "Fornecedores de " + this.slugToName(this.selectedProductType.productType) + " listados no MeuFornecedor.com.br. Compre online para seu restaurante, padaria, minimercado.";
              break
            }
          }
        } else if(this.$route.query.family) {
          this.selectFamily(this.$route.query.family)
          this.titleContent = "Distribuidoras de " + this.slugToName(this.selectedFamily) + " | Meu Fornecedor"
          this.descriptionContent = "Fornecedores de " + this.slugToName(this.selectedFamily) + " listados no MeuFornecedor.com.br. Compre online para seu restaurante, padaria, minimercado.";
        }
      });
    });
  },
  mounted(){
    
  },
  computed: {
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
    filterByFamily(familyName) {
      this.filteredSuppliers = this.allAutoSuppliers.filter(obj => Object.prototype.hasOwnProperty.call(obj.catalogAsHash, familyName))
    },
    resetFilter(){
      // this.keyword = null
      // this.keywordAux = null
      // this.viewType = 'family'
      // this.selectedFamily = null
      // this.selectedCollection = null
      // this.selectedCategory = null
      // this.filteredSuppliers = this.allAutoSuppliers
      // this.btnSelected = false
      this.$router.push({ name: 'suppliers' })
    },
    uniqueUsedFamilies() {
      return [...new Set(this.allProductTypes.map(obj => obj.family))]
    },
    createOptionsSctructures(suppliers) {
      var data = null
      for(var i in suppliers) {
        data = suppliers[i].catalogAsHash
        for(let family in data) {
          for(let collection in data[family]) {
            for(let category in data[family][collection]) {
              for(var j = 0; j < data[family][collection][category].length; j++) {
                if(!this.allProductTypes.find(type => type.productTypeId == data[family][collection][category][j].productTypeId))
                  this.allProductTypes.push({ family: family, collection: collection, category: category, type: data[family][collection][category][j] })
              }
            }
          }
        }
      }
    },
    selectFamily(familyName) {
      this.selectedCollection = null
      this.selectedCategory = null
      if(familyName == 'alimentos e bebidas') {
        this.viewType = 'family-collections'
        this.showCollections = [...new Set(this.allProductTypes.filter(obj => obj.family == familyName).map(obj => obj.collection))]
        if(this.showCollections.length > 1)
          this.showCollections = this.showCollections.sort((a, b) => a.localeCompare(b))
      } else {
        this.viewType = 'collection'
        this.showCategories = [...new Set(this.allProductTypes.filter(obj => obj.family == familyName).map(obj => obj.category))]
        if(this.showCategories.length > 1)
          this.showCategories = this.showCategories.sort((a, b) => a.localeCompare(b))
      }
      this.selectedFamily = familyName
      this.filterSupplierByFamily(this.selectedFamily);
      this.filterRandomSaleProductsByFamily(this.selectedFamily);
    },
    selectedCollectionOnModal(data) {
      this.viewType = 'collection'
      this.showCategories = [...new Set(this.allProductTypes.filter(obj => (obj.collection == data.collection && obj.family == data.family)).map(obj => obj.category))]
      if(this.showCategories.length > 1)
        this.showCategories = this.showCategories.sort((a, b) => a.localeCompare(b))
      this.selectedCollection = data.collection
      this.selectedFamily = data.family
      this.selectedProductType = null
      var suppliersWithFamily = this.allAutoSuppliers.filter(obj => Object.prototype.hasOwnProperty.call(obj.catalogAsHash, data.family))
      this.filteredSuppliers = suppliersWithFamily.filter(obj => Object.prototype.hasOwnProperty.call(obj.catalogAsHash[data.family], data.collection))
      this.filterRandomSaleProductsByCollection(this.selectedCollection);
    },
    selectedCategoryAllProducts(value) {
      this.selectedFamily = value.family
      this.selectedCollection = value.collection
      this.selectedCategory = value.category
      this.filterRandomSaleProductsByCategory(this.selectedCategory);
      this.selectedProductType = null
      this.viewType = 'category-all-products'

      if(this.selectedFamily == 'alimentos e bebidas') {
        this.showCollections = [...new Set(this.allProductTypes.filter(obj => obj.family == this.selectedFamily).map(obj => obj.collection))]
        if(this.showCollections.length > 1)
          this.showCollections = this.showCollections.sort((a, b) => a.localeCompare(b))
      }

      this.showCategories = [...new Set(this.allProductTypes.filter(obj => (obj.collection == value.collection && obj.family == value.family)).map(obj => obj.category))]
      if(this.showCategories.length > 1)
        this.showCategories = this.showCategories.sort((a, b) => a.localeCompare(b))
      this.showProductTypes = [...new Set(this.allProductTypes.filter(obj => (obj.collection == value.collection && obj.family == value.family && obj.category == value.category)))]
      if(this.showProductTypes.length > 1)
        this.showProductTypes = this.showProductTypes.sort((a, b) => a.type.productType.localeCompare(b.type.productType))
      var result = []
      this.showProductTypes.filter(function(item){
        var i = result.findIndex(x => (x.type.productTypeId == item.type.productTypeId));
        if(i <= -1){
          result.push(item);
        }
        return null;
      })
      this.showProductTypes = result

      var suppliersWithFamily = this.allAutoSuppliers.filter(obj => Object.prototype.hasOwnProperty.call(obj.catalogAsHash, value.family))
      var suppliersWithCollection = suppliersWithFamily.filter(obj => Object.prototype.hasOwnProperty.call(obj.catalogAsHash[value.family], value.collection))
      this.filteredSuppliers = suppliersWithCollection.filter(obj => Object.prototype.hasOwnProperty.call(obj.catalogAsHash[value.family][value.collection], value.category))
    },
    async selectProductType(productTypeId) {
      var foundObject = this.allProductTypes.filter(obj => obj.type.productTypeId == productTypeId)
      this.selectedProductType = foundObject.map(obj => obj.type)[0]
      this.selectedFamily = foundObject[0].family
      this.selectedCollection = foundObject[0].collection
      this.selectedCategory = foundObject[0].category
      this.viewType = 'product-type'

      if(this.selectedFamily == 'alimentos e bebidas') {
        this.showCollections = [...new Set(this.allProductTypes.filter(obj => obj.family == this.selectedFamily).map(obj => obj.collection))]
        if(this.showCollections.length > 1)
          this.showCollections = this.showCollections.sort((a, b) => a.localeCompare(b))
      }
      this.showCategories = [...new Set(this.allProductTypes.filter(obj => (obj.collection == this.selectedCollection && obj.family == this.selectedFamily)).map(obj => obj.category))]
      if(this.showCategories.length > 1)
        this.showCategories = this.showCategories.sort((a, b) => a.localeCompare(b))

      this.showProductTypes = [...new Set(this.allProductTypes.filter(obj => (obj.collection == this.selectedCollection && obj.family == this.selectedFamily && obj.category == this.selectedCategory)))]
      if(this.showProductTypes.length > 1)
        this.showProductTypes = this.showProductTypes.sort((a, b) => a.type.productType.localeCompare(b.type.productType))
      var result = []
      this.showProductTypes.filter(function(item){
        var i = result.findIndex(x => (x.type.productTypeId == item.type.productTypeId));
        if(i <= -1){
          result.push(item);
        }
        return null;
      })
      this.showProductTypes = result

      var typeObj = this.allProductTypes.filter(obj => obj.type.productTypeId == productTypeId)[0]
      var suppliersWithFamily = this.allAutoSuppliers.filter(obj => Object.prototype.hasOwnProperty.call(obj.catalogAsHash, typeObj.family))
      var suppliersWithCollection = suppliersWithFamily.filter(obj => Object.prototype.hasOwnProperty.call(obj.catalogAsHash[typeObj.family], typeObj.collection))
      var suppliersWithCategory = suppliersWithCollection.filter(obj => Object.prototype.hasOwnProperty.call(obj.catalogAsHash[typeObj.family][typeObj.collection], typeObj.category))
      this.filterRandomSaleProductsByProductType(this.selectedProductType.productTypeId);
      this.filteredSuppliers = suppliersWithCategory.filter(obj => obj.catalogAsHash[typeObj.family][typeObj.collection][typeObj.category].find(type => type.productTypeId == this.selectedProductType.productTypeId))
    },
    getFamilyIcon(family) {
      switch(family) {
        case 'alimentos e bebidas':
          return '<img src="' + require(`~/assets/images/maca.svg`) + '" alt="*" width="16">'
        case 'embalagens':
          return '<i class="feather icon-shopping-bag mr-25"></i>'
        case 'limpeza':
          return '<img class="mr-25" src="' + require(`~/assets/images/window-cleaner.svg`) + '" alt="*" width="16">'
        case 'utensílios':
          return '<i class="fa fa-cutlery mr-25"></i>'
      }
      return null
    },
    scrollXProducts(e) {
      this.$refs['scrollProducts'].scrollLeft += e.deltaY;
    },
    scrollXCategoriesAB(e) {
      this.$refs['scrollCategoriesAB'].scrollLeft += e.deltaY;
    },
    scrollXCategories(e) {
      this.$refs['scrollCategories'].scrollLeft += e.deltaY;
    },
    scrollXCollections(e) {
      this.$refs['scrollCollections'].scrollLeft += e.deltaY;
    },
    runSearch() {
      this.isLoading = true
      this.keywordAux = this.keyword
      SuppliersService.searchAutomaticCatalog(this.keyword).then((response) => {
        this.viewType = 'family'
        this.selectedFamily = null
        this.selectedCollection = null
        this.selectedCategory = null
        this.filteredSuppliers = this.allAutoSuppliers.filter(obj => response.data.includes(obj.id))
        this.isLoading = false
      })
    },
    isMobile() {
      if (screen.width <= 760 || window.innerWidth <= 760) {
        this.mobileBrowser = true
      } else {
        this.mobileBrowser = false
      }
    },
    openFamiliesModal() {
      this.familiesModal = true
      this.btnSelected = true
    },
    updateStoreFamiliesModal(val) {
      this.familiesModal = val
    },
    scrollToTop() {
      document.documentElement.scrollTop = 0
    },
    hasScroll(scroll) {
      if(scroll && scroll.scrollWidth > scroll.clientWidth) {
        return true
      } else
        return false
    },
    addScrollX(scroll, direction) {
      if(scroll)
        scroll.scrollLeft += 50 * direction;
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
    slugToName(string){
      var aux = string.charAt(0).toUpperCase() + string.slice(1)
      aux = aux.replace(/-/, ' ')
      aux = aux.replace(/-/, ' ')
      return aux
    },
    findKeyEncoded(object, encoded) {
      var aux = object.map(key => ({ original: key, encoded: this.formatString(key) }))
      var found = aux.find(obj => obj.encoded == encoded)
      return found
    },
    goToSalesPage() {
      this.$router.push({ name: "products.in.sale" });
    },
  },
  components: {
    SupplierCard,
    SuppliersFamiliesModal,
    VFooter,
    ProductInSaleCard,
  },
};
</script>
