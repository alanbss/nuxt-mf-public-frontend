<template>
<span>
  <div class="row" v-if="!isMobile">
    <div class="col-8 col-md-10 p-0 m-0" style="background: #E5DDD5;">
      <VQuotePanelSupplierInfoHeader :supplier="supplier" :quotation="infoQuotation" @back-button="emitBackbutton" :openQuotation="true" :isMobile="isMobile"/>
      <div v-if="loading || !loadedPrices || !loadedCategories || !loadedTypes" class="d-flex justify-content-center" style="margin-top: 200px;">
        <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
      <div
        class="vh-100"
        ref="desktopScroll"
        style="padding-bottom: 10rem; overflow-y: scroll; scroll-behavior: smooth; position: relative;"
        v-if="quotationProducts && selectedProductType"
      >
        <div class="mb-2">
          <div>
            <div class="row m-1" v-if="!loading && loadedPrices && loadedCategories && loadedTypes">
              <div class="col-12 pl-0 pr-0" style="margin-bottom: 40px;" v-for="(chunkedProducts, index) in fromProductType(selectedProductType)"
                   :key="'chunked' + index"
                   :class="setClassFirstProduct(chunkedProducts)" >
                <div v-for="(product, index) in chunkedProducts" :key="'prod' + product.id">
                  <h6 class="font-weight-bold" style="margin-bottom: 10px;" v-if="!loading && index == 0" >
                    <small class="d-block mb-50">
                      <span v-if="product.categoryCollection">
                        <i>
                          {{ product.categoryCollection }}
                        </i> &nbsp;|&nbsp;
                      </span>
                      {{ product.categoryName }}
                      <span class="font-medium-1 font-weight-bold ml-1">{{ product.productTypeName }}</span>
                    </small>
                  </h6>
                  <div class="card font-small-3 mb-0" :style="index == 0 ? 'border-radius: 1em; border: solid 1px #9e9e9e;' : 'border-radius: 1em; border-left: solid 1px #9e9e9e; border-right: solid 1px #9e9e9e; border-bottom: solid 1px #9e9e9e;' ">
                    <div class="card-body pl-1 pr-1 pt-0 pb-0">
                      <QuoteOpenProductCard
                        :product="product"
                        :quotation="String(quotation.id)"
                        :prices="productPrices(product.id)"
                        :loadedTotals="totals"
                        :expired="quotation.hasExpired"
                        @quantity-input="checkTotals"
                        @all-mounted="checkMounted"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <h4 style="text-align: right; margin-right:15px">Mais produtos deste fornecedor <i class="feather icon-arrow-right"/> </h4>
      </div>
    </div>
    <div class="col-4 col-md-2 p-0"  style="border-left: solid 1px #D5D5D5; background: #F5F5F5; height: 100vh;">
      <p class="font-weight-bold p-1 mb-0 text-body" >PRODUTOS</p>
      <div v-if="loadedPrices && loadedCategories && loadedTypes" style="max-height: calc(100vh - 200px); max-width: 90%; overflow-y: scroll;">
        <hr class="mt-0">
        <div class="nav-item" v-for="family in families" :key="family.id">
          <div class="tab-content" style="overflow-x: hidden;">
            <div class="tab-pane active" :id="'tabProdutos' + family.id" role="tabpanel">
                <p class="font-weight-bold px-75 mb-0 text-body pb-1">{{ getFamilyName(family.name)}}</p>
                <div v-if="haveCollection(family.id)">
                  <ul v-for="collection in collectionsFromCategory(family.id)" :key="collection.id" >
                    <li :style="typeStyle(collection.name, collection.id)">
                      <a class="m-0 pl-75 pb-20 pt-1 font-small-3 font-weight-bold" @click="selectProductTypeByCollection(collection, collection.name, collection.id)">
                          {{ collection.name }}
                      </a>
                    </li>
                    <hr class="mt-0">
                    <ul v-for="category in categoryFromCollection(collection)" :key="category.id" style="margin-top: 15px">
                      <li :style="typeStyle(category.category.name, category.category.id)">
                        <a class="m-0 pl-75 pb-20 pt-1 font-small-4 font-weight-bold"
                          @click="selectProductTypeByCollection(category.category, category.category.name, category.category.id)"
                        >
                        {{ category.category.name }}
                        </a>
                      </li>
                      <ul class="nav flex-column font-small-3 pl-25" v-if="quotationProductTypes.length">
                        <li  :class="typeClass(type.name, type.id)" v-for="type in productTypesFromCategory(category.category.id)" :key="type.id" :style="typeStyle(type.name, type.id)">
                          <a class="nav-link py-25"
                            @click="selectProductTypeByCollection(category.category, type.name, type.id)"
                            @mouseover="watchingItem(type.name, type.id)"
                            @mouseleave="watchingItem(type.name, type.id, true)">
                            {{ type.name }}
                          </a>
                        </li>
                      </ul>
                    </ul>
                    <hr class="mt-0">
                  </ul>
                  <ul v-for="category in noCollections(family.id)" :key="category.id">
                    <li :style="typeStyle(category.name, category.id)">
                      <a class="m-0 pl-75 pb-20 pt-1 font-small-4 font-weight-bold" @click="selectProductType(category, category.name, category.id)">
                        {{ category.name }}
                      </a>
                    </li>
                    <ul class="nav flex-column font-small-3 pl-25" v-if="quotationProductTypes.length">
                      <li :class="typeClass(type.name, type.id)" v-for="type in productTypesFromCategory(category.id)" :key="type.id"
                          :style="typeStyle(type.name, type.id)"
                          @mouseover="watchingItem(type.name, type.id)"
                          @mouseleave="watchingItem(type.name, type.id, true)">
                        <a class="nav-link py-25" @click="selectProductType(category, type.name, type.id)">
                          {{ type.name }}
                        </a>
                      </li>
                    </ul>
                  </ul>
                </div>
                <div v-else>
                  <ul v-for="category in noCollections(family.id)" :key="category.id">
                    <li :style="typeStyle(category.name, category.id)">
                      <a class="m-0 pl-75 pb-20 pt-1 font-small-4 font-weight-bold"  @click="selectProductType(category, category.name, category.id)">
                        {{ category.name }}
                      </a>
                    </li>
                    <ul class="nav flex-column font-small-3 pl-25" v-if="quotationProductTypes.length">
                      <li :class="typeClass(type.name, type.id)" v-for="type in productTypesFromCategory(category.id)"
                          :key="type.id" :style="typeStyle(type.name, type.id)"
                          @mouseover="watchingItem(type.name, type.id)"
                          @mouseleave="watchingItem(type.name, type.id, true)"
                          >
                        <a class="nav-link py-25"
                          @click="selectProductType(category, type.name, type.id)">
                          {{ type.name }}
                        </a>
                      </li>
                    </ul>
                  </ul>
                </div>
              <hr class="mt-0">
            </div>
          </div>
        </div>
      </div>
      <hr class="mt-0" >
      <div class="float-left w-100 pr-1 mt-0" :class="isMobile ? '' : 'pl-1'" style="background-color: #FEFEFE; position: absolute; bottom: 0; max-width: 90%;">
        <div class="row">
          <div class="col-1 col-md-1 ">
            <span :class="isMobile ? 'font-small-2' : 'font-small-3'">Mín.</span>
          </div>
          <div class="col text-right" :class="isMobile ? 'font-small-1' : 'font-small-3'">
            {{ isMobile ? formatPrice(quotation.minimumOrderValue).substring(1) : formatPrice(quotation.minimumOrderValue) }}
          </div>
        </div>
        <div class="row mt-1" v-if="quotation.maximumOrderValue">
          <div class="col-1  col-md-1 ">
            <span :class="isMobile ? 'font-small-2' : 'font-small-3'">Máx.</span>
          </div>
          <div class="col text-right" :class="isMobile ? 'font-small-1' : 'font-small-3'">
            {{ isMobile ? formatPrice(quotation.maximumOrderValue).substring(1) : formatPrice(quotation.maximumOrderValue) }}
          </div>
        </div>
          <div class="row mt-1" styl v-show="!quotation.hasExpired">
          <div class="col-1 col-md-1 ">
            <strong :class="isMobile ? 'font-small-2' : 'font-medium-2'">Total</strong><br>
          </div>
          <div class="col text-right">
            <strong :class="isMobile ? 'font-small-2' : 'font-medium-2'">
              {{ formatPrice(total) }}
            </strong>
          </div>
        </div>
        <div class="row mt-1" :class="isMobile ? ' mr-0' : ''" v-show="!quotation.hasExpired">
          <vs-tooltip :text="tooltipText" :active="isDisabled" position="top" style="width: 95%;">
            <button
                id="next"
                style="width: 88%; margin-left: 15px; margin-bottom: 10px"
                :disabled='isDisabled'
                type="button"
                :class="!isDisabled ? 'animate__animated animate__flash' : ''"
                class="btn btn-primary text-bold-600 px-1 waves-effect waves-light mr-50 "
                :style="isMobile ? 'font-size: 0.9em !important;' : ''"
                @click="submitValues()"
              >
                <b-spinner v-if="buttonLoading" small/>
                <span v-else>Avançar</span>
              </button>
              <span>&nbsp;</span>
            </vs-tooltip>
        </div>
      </div>
    </div>
  </div>
  <div style="position: fixed; height: 100%;" v-else>
    <VQuotePanelSupplierInfoHeader :supplier="supplier" :quotation="infoQuotation" @back-button="emitBackbutton" :openQuotation="true" :isMobile="isMobile"/>
    <div class="row" style="background-color: #FEFEFE; padding: 5px 10px;">
      <div class="col-8" style="padding-top: 5px; width: 65%; max-width: 65%;">
        <i v-if="fromProductType(selectedProductType) && fromProductType(selectedProductType).length && fromProductType(selectedProductType)[0][0].categoryCollection" class="font-small-3">
          {{ fromProductType(selectedProductType)[0][0].categoryCollection }} |
        </i>
        <i class="font-small-3" v-if="fromProductType(selectedProductType) && fromProductType(selectedProductType).length && fromProductType(selectedProductType)[0][0].categoryName">
           {{ fromProductType(selectedProductType)[0][0].categoryName }}
         </i>
      </div>
      <div class="col-4 m-0 p-0 w-100" style="width: 35%; max-width: 35%;">
        <vs-button
          @click.prevent.stop="$refs.categoryMenu.open($event)"
          class="ml-1 float-right w-100" color="#27b6f6" type="filled"
          style="padding: 4px 5px; margin-top: 3px; border: 1px solid #27b6f6;"
        >
          <b><span style="color: white;"> Mais produtos</span></b>
        </vs-button>
      </div>
    </div>
    <div style="height: 90%; max-height: 90%;" >
      <vue-context ref="categoryMenu">
        <div class="ml-1 mr-1" v-for="family in families" :key="'menufamily' + family.id">
          <h6>{{ family.name }}</h6>
          <div class="d-flex flex-column" style="max-width: 300px;">
            <div
              v-for="collection in collectionsFromCategory(family.id)" :key="'menucol' + collection.id"
              style="margin-bottom: 5px; border: LightGray 1px solid; padding: 3px;"
            >
              <i>{{ collection.name }}</i><br>
              <span v-for="category in categoryFromCollection(collection)" :key="'menucat' + category.id">
                <a @click="selectProductTypeByCollection(category.category, category.category.name, category.category.id)">
                  <b>{{ category.category.name }}</b>
                </a>
                <li v-for="type in productTypesFromCategory(category.category.id)" :key="'menutype' + type.id">
                  <vs-button
                  color="primary"
                  type="flat"
                  style="color: inherit; padding-left: 0; padding-top: 3px; padding-bottom: 3px; text-align: left;"
                  class="mf-item-list"
                  @click="selectProductTypeByCollection(category.category, type.name, type.id)"
                >
                    {{ type.name }}
                  </vs-button>
                </li>
              </span>
            </div>
            <div
              v-if="noCollections(family.id).length"
              style="margin-bottom: 5px; border: LightGray 1px solid; padding: 3px;"
            >
              <li v-for="category in noCollections(family.id)" :key="'nocolcat' + category.id">
                <vs-button
                color="primary"
                type="flat"
                style="color: inherit; padding-left: 0; padding-top: 3px; padding-bottom: 3px; text-align: left;"
                class="mf-item-list"
                @click="selectProductType(category, category.name, category.id)">
                  {{ category.name }}
                </vs-button>
              </li>
            </div>
          </div>
        </div>
      </vue-context>
      <div ref="mobileScroll" style="max-height: calc(100% - 20px); padding-bottom: 2rem; overflow-y: scroll; overflow-x: hidden; scroll-behavior: smooth;" v-if="quotationProducts && selectedProductType">
        <div class="mb-2">
          <div>
            <div class="row mt-1 mb-1" v-if="!loading" style="margin-left: 2px; margin-right: 2px;">
              <div class="col-12 pl-0 pr-0" style="margin-bottom: 40px;" v-for="(chunkedProducts, index) in fromProductType(selectedProductType)"
                   :key="'chunked' + index"
                   :class="setClassFirstProduct(chunkedProducts)" >
                <div v-for="(product, index) in chunkedProducts" :key="'prod' + product.id" :class="setClass(product.productTypeName, product.productTypeId, product.categoryName, product.categoryCollection)">
                  <h6 class="font-weight-bold" style="margin-bottom: 10px;" v-if="!loading && index == 0" >
                    <small class="d-block mb-50">
                      <span v-if="product.categoryCollection">
                        <i>
                          {{ product.categoryCollection }}
                        </i> &nbsp;|&nbsp;
                      </span>
                      {{ product.categoryName }}
                      <span class="font-medium-1 font-weight-bold ml-1">{{ product.productTypeName }}</span>
                    </small>
                  </h6>
                  <div class="card font-small-3 mb-0" :style="index == 0 ? 'border-radius: 1em; border: solid 1px #9e9e9e;' : 'border-radius: 1em; border-left: solid 1px #9e9e9e; border-right: solid 1px #9e9e9e; border-bottom: solid 1px #9e9e9e;' ">
                    <div class="card-body pl-1 pr-1 pt-0 pb-0 col">
                      <QuoteOpenProductCard
                        :product="product"
                        :quotation="String(quotation.id)"
                        :prices="productPrices(product.id)"
                        :loadedTotals="totals"
                        :expired="quotation.hasExpired"
                        :isMobile="isMobile"
                        @quantity-input="checkTotals"
                        @all-mounted="checkMounted"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="w-100 pr-1 mt-0" style="background-color: #FEFEFE; position: absolute; bottom: 0px; ">
      <div class="row" style="padding: 5px;">
        <div class="col-9">
          <div class="row">
            <div class="col-4 font-small-2">
              <span>Mín.</span><br>
              <span>{{ formatPrice(quotation.minimumOrderValue).substring(3) }}</span>
            </div>
            <div class="col-4 font-small-2">
              <span v-if="quotation.maximumOrderValue">
                <span>Max.</span><br>
                <span>{{ formatPrice(quotation.maximumOrderValue).substring(3) }}</span>
              </span>
            </div>
            <div class="col-4 font-small-3">
              <span>Total</span><br>
              <strong>{{ formatPrice(total) }}</strong>
            </div>
          </div>
        </div>
        <div class="col-3 p-0">
          <div v-show="!quotation.hasExpired">
            <vs-tooltip :text="tooltipText" :active="isDisabled" position="top">
              <button
                  id="next"
                  style="margin-left: 10px;"
                  :disabled='isDisabled'
                  type="button"
                  :class="!isDisabled ? 'animate__animated animate__flash' : ''"
                  class="btn btn-primary text-bold-600 px-1 waves-effect waves-light mr-50 "
                  :style="isMobile ? 'font-size: 0.9em !important;' : ''"
                  @click="submitValues()"
                >
                  <b-spinner v-if="buttonLoading" small/>
                  <span v-else>Avançar</span>
              </button>
              <span>&nbsp;</span>
            </vs-tooltip>
          </div>
        </div>
      </div>
    </div>
  </div>

</span>
</template>

<script>
import priceFormatter from "@/mixins/priceFormatter";
import QuoteOpenProductCard from "~/components/products/components/QuoteOpenProductCard";
import VQuotePanelSupplierInfoHeader from "~/components/quotes/Components/VQuotePanelSupplierInfoHeader";
import VueContext from 'vue-context';
import 'vue-context/dist/css/vue-context.css';
// import VTourCard from "~/components/quotes/Components/VTourCard";


import { mapActions, mapState } from "vuex";

export default {
  data() {
    return {
      families: [],
      fistTime: false,
      infoTriggered: false,
      collections: [],
      firstSelected: undefined,
      selectedFamily: undefined,
      selectedCategory: undefined,
      selectedProductType: undefined,
      selectedProduct: undefined,
      watchedItem: undefined,
      uniqueProductTypes: [],
      totals: [],
      total: 0,
      hasBelowMin: false,
      loading: false,
      componentesCount: 0,
      totalMounted: 0,
      buttonLoading: false,
      loadedCategories: false,
      loadedTypes: false,
      loadedPrices: false
    }
  },
  created() {
    this.loading = true
    let selectCategory = null
    this.changeQuotation()
  },
  mounted() {
    this.userEmail = this.$auth.user().email
  },
  computed: {
    //...mapGetters("users/products", ["productIsOnList", "productIsOnCart", "productCartIsEmpty"]),
    ...mapState("quotations", [
      "quotationCategories",
      "quotationCategoriesCollections",
      "quotationProducts",
      "quotationProductTypes"
    ]),
    ...mapState("quotations/quotationPrices", [
      "quotationPrices"
    ]),
    familyCategories() {
      return this.quotationCategories.filter(category => category.family.id == this.selectedFamily.id)
    },
    tooltipText() {
      var min = 0
      if(this.quotation.minimumOrderValue)
        min = parseFloat(this.quotation.minimumOrderValue)

      if(this.total < min)
        return "Valor mínimo não atingido (definido pelo fornecedor)"
      else if(this.total > parseFloat(this.quotation.maximumOrderValue))
        return "Você ultrapassou o valor máximo de pedido (definido pelo fornecedor)"
      else
        return ''
    },
    isDisabled() {
      var min = 0
      if(this.quotation.minimumOrderValue)
        min = parseFloat(this.quotation.minimumOrderValue)

      if((this.total >= min && this.total > 0) && (this.total <= parseFloat(this.quotation.maximumOrderValue)) && !this.hasBelowMin){
        if(!this.infoTriggered){
          this.$nextTick(()=> {
            //this.$refs.popover.$emit('open')
            if(document.querySelector('.btn.btn-primary.text-right.float-right.m-1.text-bold-600'))
              document.querySelector('.row.mx-md-0').style.pointerEvents = 'none'
          })
        }

        return false
      }
      else if((this.total >= min && this.total > 0) && (!this.quotation.maximumOrderValue) && !this.hasBelowMin){
        if(!this.infoTriggered){
          this.$nextTick(()=> {
            //this.$refs.popover.$emit('open')
              if(document.querySelector('.btn.btn-primary.text-right.float-right.m-1.text-bold-600'))
                document.querySelector('.row.mx-md-0').style.pointerEvents = 'none'
          })
        }
        return false
      }
      else
        return true
    }
  },
  watch: {
    quotation(newVal, oldVal) {
      if(newVal.id != oldVal.id)
        this.total = 0
      if(this.totals.length)
        this.saveExpeditionQuantitiesNoSet({ totals: this.totals, quotationId: oldVal.id })
      this.changeQuotation()
    }
  },
  methods: {
    ...mapActions("quotations", [
      "getQuotationCategories",
      "getQuotationCategoriesCollections",
      "getQuotationProductsByCategory",
      "getQuotationProductsByCollection",
      "saveExpeditionQuantities",
      "saveExpeditionQuantitiesNoSet",
      "getQuotationProductTypes",
      "clearQuotationProducts",
      "clearQuotationProductTypes"
    ]),
    ...mapActions("quotations/quotationPrices", [
      "getPricesByQuotation"
    ]),
    changeQuotation() {
      this.loading = true
      let selectCategory = null
      this.collections = []
      this.families = []
      this.loadedTypes = false
      this.loadedCategories = false
      this.loadedPrices = false
      this.totals = []
      this.clearQuotationProducts()
      this.clearQuotationProductTypes()

      this.getPricesByQuotation(this.quotation.id).then(() => {
        this.loading = false
        this.loadTotals()
        this.loadedPrices = true
      })
      this.getQuotationCategoriesCollections(this.quotation.id).then(() => {
        for(let i = 0; i < this.quotationCategoriesCollections.length; i++) {
          if(!this.collections.find(collection => collection.id == this.quotationCategoriesCollections[i].collection_id))
            this.collections.push(this.quotationCategoriesCollections[i])
        }
        this.getQuotationCategories({ id: this.quotation.id, unavailable: true }).then(() => {
          this.loadedCategories = true
          for(let i = 0; i < this.quotationCategories.length; i++) {
            if(!this.families.find(family => family.id == this.quotationCategories[i].family.id))
              this.families.push(this.quotationCategories[i].family)
            if(this.$route.query.quotationId && this.$route.query.quotationId == this.quotation.id &&
               this.$route.query.categoryId && this.quotationCategories[i].id == this.$route.query.categoryId) {
              selectCategory = this.quotationCategories[i]
            }
          }

          this.getQuotationProductTypes(this.quotation.id).then(() => {
            if(this.families.length) {
              this.families.sort((a, b) => a.name.localeCompare(b.name))

              if(selectCategory) {
                //this.selectFamilyAndCategory(selectCategory)
                var goToProductType = null
                if(this.$route.query.productType)
                  goToProductType = this.quotationProductTypes.find(obj => obj.name == this.$route.query.productType)

                if(selectCategory.categoriesCollectionId && goToProductType) {
                  this.selectProductTypeByCollection(selectCategory, goToProductType.name, goToProductType.id)
                } else if(selectCategory.categoriesCollectionId) {
                  this.selectProductTypeByCollection(selectCategory, selectCategory.name, selectCategory.id)
                } else if(goToProductType) {
                  this.selectedFamily = selectCategory.family
                  this.selectProductType(selectCategory, goToProductType.name, goToProductType.id)
                } else {
                  this.selectFamilyAndCategory(selectCategory)
                }
              } else {
                if(this.collections.length) {
                  this.selectedFamily = this.families[0]
                  if(!selectCategory)
                    this.selectProductTypeByCollection(this.familyCategories[0], this.familyCategories[0].name, this.familyCategories[0].id)
                  if(this.collections.length != 0 ) {
                    this.firstSelected = this.collections[0].name
                    this.selectedProduct = { name: this.firstSelected, id: this.collections[0].id }
                  } else {
                    this.firstSelected = this.quotationCategories[0].name
                  }
                } else {
                  this.selectFamily(this.families[0])
                }
              }
            }
            this.loadedTypes = true
          })
        })
      })
    },
    selectFamilyAndCategory(category) {
      this.selectedFamily = category.family
      // this.selectCategory(category)
      this.selectProductType(category, category.name, category.id)
    },
    selectFamily(family) {
      this.selectedFamily = family
      this.selectCategory(this.familyCategories[0])
    },
    selectCategory(category) {
      this.loading = true
      this.selectedCategory = category
      this.firstSelected = undefined
      this.getQuotationProductsByCategory({ quotationId: this.quotation.id, categoryId: category.id }).then(() => {
        this.uniqueProductTypes = [...new Set(this.quotationProducts.map(item => item.productTypeName))]
        if(this.uniqueProductTypes.length > 1)
          this.uniqueProductTypes.sort((a, b) => a.localeCompare(b))
        this.selectedProductType = category.categoriesCollectionName != null ? category.categoriesCollectionName : this.quotationProducts[0].categoryName
        this.loading = false
      })
    },
    selectProductType(category, type, typeId) {
      var scrollElement = this.$refs.desktopScroll
      if(this.isMobile)
        scrollElement = this.$refs.mobileScroll
      this.firstSelected = undefined
      this.selectedProduct = { name: type, id: typeId }
      this.selectedCategory = category
      const page  = scrollElement
      const elementExist = document.querySelector(`.${this.getProductClass(type) + typeId}`)

      if(elementExist){
        page.scrollTop = elementExist.offsetTop - page.offsetTop
      } else {
        this.loading = true
        this.getQuotationProductsByCategory({ quotationId: this.quotation.id, categoryId: category.id}).then(() => {
          this.uniqueProductTypes = [...new Set(this.quotationProducts.map(item => item.productTypeName))]
          this.selectedProductType = category.name
          this.loading = false
          setTimeout(() => {
            var scrollParent = this.$refs.desktopScroll
            var element = document.querySelector(`.${this.getProductClass(type) + typeId}`)
            scrollParent.scrollTop = document.querySelector(`.${this.getProductClass(type) + typeId}`).offsetTop - scrollParent.offsetTop
          }, 500)
        })
      }
    },
    selectProductTypeByCollection(collection, type, typeId) {
      var scrollElement = this.$refs.desktopScroll
      if(this.isMobile)
        scrollElement = this.$refs.mobileScroll
      this.firstSelected = undefined
      this.selectedProduct = { name: type, id: typeId }
      this.selectedCategory = collection
      const page  = scrollElement
      const elementExist = document.querySelector(`.${this.getProductClass(type) + typeId}`)
      if(elementExist){
        page.scrollTop = elementExist.offsetTop - page.offsetTop
      } else {
        this.loading = true
        this.getQuotationProductsByCollection({ quotationId: this.quotation.id, collectionName: collection.categoriesCollectionName ? collection.categoriesCollectionName : collection.name}).then(() => {
          this.uniqueProductTypes = [...new Set(this.quotationProducts.map(item => item.productTypeName))]
          this.selectedProductType = collection.categoriesCollectionName ? collection.categoriesCollectionName : collection.name
          this.loading = false
          setTimeout(()=> {
            var scrollParent = this.$refs.desktopScroll
            scrollParent.scrollTop = document.querySelector(`.${this.getProductClass(type) + typeId}`).offsetTop - scrollParent.offsetTop
          }, 500)
        })
      }
    },
    productPrices(productId) {
      return this.quotationPrices.filter(price => (price.supplierProductExpedition.productExpeditionProductId == productId && ((price.price && !price.unavailable) || price.unavailable)))
    },
    calculatePrice(priceObj) {
      var price = priceObj.price
      if(priceObj.supplierProductExpedition.productExpeditionPricing) {
        if(priceObj.supplierProductExpedition.productExpeditionPricing == 1) {
          price = parseFloat(priceObj.price) * parseFloat(priceObj.supplierProductExpedition.productQuantity.replace(',', '.'))
          if(priceObj.supplierProductExpedition.productPackageQuantity)
             price = price * parseFloat(this.product.packageQuantity)
        } else if(priceObj.supplierProductExpedition.productExpeditionPricing == 2) {
          price = priceObj.price
        } else if(priceObj.supplierProductExpedition.productExpeditionPricing == 3) {
          price = parseFloat(priceObj.price) / parseFloat(priceObj.supplierProductExpedition.productExpeditionQuantity)
          // if(this.product.packageQuantity)
          //   price = price / parseFloat(this.product.packageQuantity)
        }
      }
      return price
    },
    loadTotals() {
      for(var i = 0; i < this.quotationPrices.length; i++) {
        let price = this.quotationPrices[i]
        if(price.quantity) {
          let result = this.checkDiscounts(price, price.quantity, this.expeditionPrice(this.calculatePrice(price), price.supplierProductExpedition.productExpeditionQuantity))
          let obj = { id: price.id, quantity: price.quantity, total: result, minimum: price.supplierProductExpedition.minimumOrder }
          this.checkTotals(obj)
        }
      }
    },
    checkDiscounts(priceObj, calcQuantity, price) {
      var range1 = priceObj.supplierProductExpedition.discountRange1
      var range2 = priceObj.supplierProductExpedition.discountRange2
      var discount1 = priceObj.supplierProductExpedition.discountPercentage1
      var discount2 = priceObj.supplierProductExpedition.discountPercentage2

      var total = 0

      if(!range1 && !range2) {
        total = calcQuantity * price
      } else if(range1 && !range2 && calcQuantity >= range1) {
        total = calcQuantity * price * ((100 - discount1) * 0.01)
      } else if(range1 && !range2 && calcQuantity < range1) {
        total = calcQuantity * price
      } else if(range2 >= range1 && calcQuantity >= range2) {
        total = calcQuantity * price * ((100 - discount2) * 0.01)
      } else if(range1 > range2 && calcQuantity >= range1) {
        total = calcQuantity * price * ((100 - discount1) * 0.01)
      } else if(calcQuantity < range1 && calcQuantity < range2) {
        total = calcQuantity * price
      } else if(range2 >= range1 && calcQuantity < range2 && calcQuantity >= range1) {
        total = calcQuantity * price * ((100 - discount1) * 0.01)
      } else if(range1 > range2 && calcQuantity < range1 && calcQuantity >= range2) {
        total = calcQuantity * price * ((100 - discount2) * 0.01)
      }

      return total
    },
    familyClass(familyId) {
      if (this.selectedFamily && (this.selectedFamily.id == familyId))
        return "nav-link active font-weight-bold"
      else
        return "nav-link font-weight-bold"
    },
    categoryClass(categoryId) {
      if (this.selectedCategory && (this.selectedCategory.id == categoryId))
        return "nav-link active"
      else
        return "nav-link"
    },
    typeClass(productType, id) {
      if (this.selectedProduct && (this.selectedProduct.name == productType && this.selectedProduct.id == id))
        return "nav-item font-weight-bold"
      else
        return "nav-item"
    },
    typeStyle(productType, id, firstProducts){
      if (this.selectedProduct && (this.selectedProduct.name == productType && this.selectedProduct.id == id) || productType == this.firstSelected)
        return "background-color: #0cb695"
      if (this.watchedItem && this.watchedItem.name == productType && this.watchedItem.id == id)
         return "background-color: #5ce9c6"
      else
        return ""
    },
    watchingItem(productType, id, leave = false){
      if(this.selectedProduct.name != productType || this.selectedProduct.id != id)
        this.watchedItem = { name: productType, id: id }
      if(leave)
        this.watchedItem = null
    },
    checkTotals(totals) {
      let found = this.totals.find(obj => obj.id == totals.id)
      if(found) {
        found.quantity = totals.quantity
        found.total = totals.total
      } else {
        this.totals.push(totals)
      }
      this.updateTotal()
    },
    setClass(productName, productId, categoryName, collectionName){
      if(collectionName){
        return `${this.getProductClass(productName)}${productId} ${this.getProductClass(categoryName)} ${this.getProductClass(collectionName)}`
      }else{
        return `${this.getProductClass(productName)}${productId} ${this.getProductClass(categoryName)}`
      }
    },
    setClassFirstProduct(chunkedProducts) {
      if(chunkedProducts && chunkedProducts.length)
        return this.setClass(chunkedProducts[0].productTypeName, chunkedProducts[0].productTypeId, chunkedProducts[0].categoryName, chunkedProducts[0].categoryCollection)
      else
        return ''
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
    },
    submitValues() {
      this.buttonLoading = true
      setTimeout(() => {
        this.buttonLoading = false
        this.$vs.loading()
        this.saveExpeditionQuantities({ totals: this.totals, quotationId: this.quotation.id }).then(() => {
          this.$vs.loading.close()
          this.$router.push({ name: 'users.reviewQuotation', params: { quotationId: this.quotation.id }})
      })
      }, 300);

    },
    fromProductType(productType) {
      var productsWithPrices = this.quotationPrices.map(obj => obj.supplierProductExpedition.productExpeditionProductId)
      if(this.quotationProducts && this.quotationProducts.length) {
        if(this.quotationProducts.filter(prod => (prod.categoryName == productType && !prod.categoryCollection)).length != 0){
          let prods1 = this.quotationProducts.filter(prod => prod.categoryName == productType)
                                            .filter(obj => productsWithPrices.includes(obj.id))

          this.componentesCount = prods1.length
          this.totalMounted = 0
          var uniqueTypes1 = [...new Set(prods1.map(obj => obj.productTypeId))]
          var chunkedProducts1 = []
          if(prods1 && prods1.length) {
            for(var type in uniqueTypes1) {
              var test = prods1.filter(prod => prod.productTypeId == uniqueTypes1[type])
              chunkedProducts1.push(this.orderedType(test))
            }
          }
          var sorted1 = chunkedProducts1
          if(chunkedProducts1.length > 1) {
            sorted1 = chunkedProducts1.sort((a, b) => {
              if(a[0].categoryName == b[0].categoryName)
                return a[0].productTypeName.localeCompare(b[0].productTypeName)
              else
                return a[0].categoryName.localeCompare(b[0].categoryName)
            })
          }
          return sorted1
        } else {
          let prods2 = this.quotationProducts.filter(prod => prod.categoryCollection == productType)
                                            .filter(obj => productsWithPrices.includes(obj.id))

          this.componentesCount = prods2.length
          this.totalMounted = 0
          var uniqueTypes2 = [...new Set(prods2.map(obj => obj.productTypeId))]
          var chunkedProducts2 = []
          if(prods2 && prods2.length) {
            for(var type2 in uniqueTypes2) {
              var test2 = prods2.filter(prod => prod.productTypeId == uniqueTypes2[type2])
              chunkedProducts2.push(this.orderedType(test2))
            }
          }
          var sorted2 = chunkedProducts2
          if(chunkedProducts2.length > 1) {
            sorted2 = chunkedProducts2.sort((a, b) => {
              if(a[0].categoryName == b[0].categoryName)
                return a[0].productTypeName.localeCompare(b[0].productTypeName)
              else
                return a[0].categoryName.localeCompare(b[0].categoryName)
            })
          }
          return sorted2
        }
      } else {
        return []
      }
    },
    orderedType(type) {
      var sorted = type
      if(type.length > 1) {
        sorted = type.sort((a, b) => {
          if(a.propertyName == b.propertyName) {
            if(a.brandName == b.brandName) {
              if(a.packagingName)
                return a.packagingName.localeCompare(b.packagingName)
              else
                return 0
            } else {
              if(a.brandName)
                return a.brandName.localeCompare(b.brandName)
              else
                return 0
            }
          } else {
            if(a.propertyName)
              return a.propertyName.localeCompare(b.propertyName)
            else
              return 0
          }
        })
      }
      return sorted
    },
    categoryFromCollection(collection) {
      // let sameCollectionAndCategoryItems = this.quotationProductTypes.filter(type => type.category.categoriesCollectionName == collection.name && type.category.id == collection.categoryId).length > 1
      // if(sameCollectionAndCategoryItems){
      //  return [this.quotationProductTypes.filter(type => type.category.id == collection.categoryId)[0]]
      // }
      var categories = []
      var uniqueCategoriesAndProducts = []
      for(var i = 0; i < this.quotationProductTypes.length; i++) {
        if(!categories.includes(this.quotationProductTypes[i].category.id) && this.quotationProductTypes[i].category.categoriesCollectionName == collection.name) {
          uniqueCategoriesAndProducts.push(this.quotationProductTypes[i])
          categories.push(this.quotationProductTypes[i].category.id)
        }
      }
      var sorted = uniqueCategoriesAndProducts.sort((a, b) => a.category.name.localeCompare(b.category.name))
      return sorted
    },
    categoriesFromCollection(collection) {
      return this.quotationProductTypes.filter(type => type.category.categoriesCollectionName == collection.name)
    },
    productTypesFromCollection(collection) {
      return this.quotationProductTypes.filter(type => type.category.categoriesCollectionName == collection.name)
    },
    productTypesFromCategory(categoryId) {
      return this.quotationProductTypes.filter(type => type.category.id == categoryId)
    },
    collectionsFromCategory(familyId) {
      return this.collections.filter(collection => collection.familyId == familyId)
    },
    haveCollection(familyId){
      if(this.collections.filter(collection => collection.familyId == familyId).length != 0){
        return true
      }else{
        return false
      }

    },
    getProductClass(productName){
       return productName.replace('/', '')
                         .replace('.', '')
                         .replace('(', '')
                         .replace(')', '')
                         .split(' ')
                         .join('-')
    },
    noCollections(familyId){
      return this.quotationCategories.filter(item => item.categoriesCollectionId == null && item.family.id == familyId)
    },
    hasPrices(productType) {
      var products = this.fromProductType(productType)
      var ids = products.map(prod => prod.id)
      return this.quotationPrices
                 .filter(price => ids.includes(price.supplierProductExpedition.productExpeditionProductId))
                 .length
    },
    expeditionPrice(price, quantity) {
      if(quantity)
        return (price * quantity)
      else
        return price
    },
    // agree(){
    //   this.infoTriggered = true
    //   this.$refs.popover.$emit('close')
    //   document.querySelector('.row.mx-md-0').style.pointerEvents = 'auto'
    // },
    checkMounted() {
      this.totalMounted++
      if(this.componentesCount > 0 && this.totalMounted == this.componentesCount) {
        setTimeout(() => {
          let spins = document.getElementsByClassName('spin-input')
          for(var i = 0; i < spins.length; i++) {
            spins[i].addEventListener("keyup", function(event) {
              for(var j = 0; j < spins.length; j++) {
                if(spins[j] == event.target)
                  break
              }
              if(event.keyCode == 13) {
                if(j < (spins.length - 1)) {
                  spins[j+1].focus()
                }
              }
            });
          }
        }, 500)
      }
    },
    emitBackbutton() {
      if(this.totals.length)
        this.saveExpeditionQuantitiesNoSet({ totals: this.totals, quotationId: this.quotation.id })
      this.$emit('back-button')
    },
    getFamilyName(family) {
      if(this.isMobile) {
        switch(family) {
          case 'Alimentos e bebidas':
            return 'A&B'
          case 'Embalagens':
            return 'Embal.'
          case 'Limpeza':
            return 'Limp.'
          case 'Utensílios':
            return 'Utens.'
          default:
            return family
        }
      } else {
        return family.toUpperCase()
      }
    }
  },
  props: {
    quotation: {
      type: Object,
      required: true
    },
    supplier: {
      type: Object,
      required: true
    },
    infoQuotation: {
      type: Object,
      required: true
    },
    isMobile: {
      type: Boolean
    },
  },
  components: {
    QuoteOpenProductCard,
    VQuotePanelSupplierInfoHeader,
    VueContext
  },
  mixins: [
    priceFormatter
  ]
};
</script>
<style >
.bs-popover-top {
  box-shadow: 0 0 0 99999px rgba(0,0,0,.4);
}
</style>
