<template>
  <div>
    <div v-for="family in families" :key="family.id">
      <span v-if="hasProductsFromFamily(family.name) && loadedPrices">
        <div class="bg-rgba-light mb-2 p-1 rounded">
          <h3 class="m-0">
            <i class="fa fa-lemon-o ml-50 mr-75"></i>
            {{ family.name }}
          </h3>
        </div>


        <div v-if="blockEdit">
          <div class="row">
            <div
              class="col-xl-2 col-md-4 col-6 mb-3"
              v-for="product in productsFromFamily(family.name)"
              :key="product.id"
            >
              <h6 class="my-1">{{ product.categoryName }}</h6>
              <h5 class="my-1">
                {{ product.productTypeName }}
              </h5>
              <QuoteProductCard
                :product="product"
                :quotation="String(quotation.id)"
                :prices="productPrices(product.id)"
                :blockInputs="true"
                :repeatCategory="true"
              />
            </div>
          </div>
        </div>
        <div v-else>
          <div v-for="category in familyCategories(family.name)" :key="category.id">
            <h3 class="my-2">{{ category.name }}</h3>
            <span v-for="productType in typesFromCategory(category.id)" :key="productType.id">
              <h5 class="my-1" v-if="!blockEdit">
                {{ productType.productType }}
                <router-link
                  :to="{ name: 'users.quotePanel', params: { quoteId: quotation.quoteId }, query: { quotationId: quotation.id, categoryId: category.id, productType: productType.productType } }"
                  class="font-small-3 ml-1"
                >
                  Editar
                </router-link>
              </h5>

              <div class="row">
                <div
                  class="col-xl-2 col-md-4 col-6 mb-3"
                  v-for="product in fromProductType(productType.productType)"
                  :key="product.id"
                >
                  <QuoteProductCard
                    :product="product"
                    :quotation="String(quotation.id)"
                    :prices="productPrices(product.id)"
                    :blockInputs="true"
                  />
                </div>
              </div>
            </span>
          </div>
        </div>
      </span>
    </div>
  </div>
</template>

<script>
//import { mapActions, mapGetters } from "vuex";
import { mapActions, mapState } from "vuex";
import QuoteProductCard from "~/components/products/components/QuoteProductCard";

export default {
  data() {
    return {
      families: [],
      uniqueProductTypes: [],
      typesAndCategories: [],
      total: undefined,
      loadedPrices: false,
    }
  },
  mounted() {

  },
  computed: {
    ...mapState("quotations", [
      "quotationCategories",
    ]),
    ...mapState("quotations/quotationPrices", [
      "quotationPrices"
    ]),
  },
  created() {
    this.getQuotationCategories({ id: this.quotation.id, unavailable: false }).then(() => {
      for(let i = 0; i < this.quotationCategories.length; i++) {
        if(!this.families.find(family => family.id == this.quotationCategories[i].family.id))
          this.families.push(this.quotationCategories[i].family)
      }
      if(this.families.length)
        this.families.sort((a, b) => a.name.localeCompare(b.name))
    })
    this.getPricesByQuotation(this.quotation.id).then(() => {
      this.loadedPrices = true
    })
    this.buildProductTypes()
    this.uniqueProductTypes = [...new Set(this.products.map(item => item.productTypeName))]
  },
  methods: {
    ...mapActions("quotations", [
      "getQuotationCategories",

    ]),
    ...mapActions("quotations/quotationPrices", [
      "getPricesByQuotation"
    ]),
    familyCategories(familyName) {
      var array = this.typesAndCategories.filter(obj => obj.familyName == familyName)
                                         .map(obj => obj.category)
      return this.quotationCategories.filter(category => array.includes(category.id))
    },
    productPrices(productId) {
      return this.quotationPrices
                 .filter(price =>
                   price.supplierProductExpedition.productExpeditionProductId == productId)
    },
    fromProductType(productType) {
      return this.products.filter(prod => prod.productTypeName == productType)
    },
    productsFromFamily(familyName) {
      return this.products.filter(prod => prod.familyName == familyName)
    },
    typesFromCategory(categoryId) {
      return this.typesAndCategories.filter(obj => obj.category == categoryId)
    },
    buildProductTypes() {
      for(let i = 0; i < this.products.length; i++) {
        if(!this.typesAndCategories.find(obj => obj.productType == this.products[i].productTypeName)) {
          this.typesAndCategories.push({ category: this.products[i].categoryId,
                                         productType: this.products[i].productTypeName,
                                         familyName: this.products[i].familyName })
        }
      }
    },
    hasProductsFromFamily(familyName) {
      if(this.products && this.products.length)
        return this.products.find(prod => prod.familyName == familyName)
      else
        return false
    },
  },
  props: {
    quotation: {
      type: Object,
      required: true
    },
    products: {
      type: Array,
      required: true
    },
    blockEdit: {
      type: Boolean
    }
  },
  components: {
    QuoteProductCard
  }
};
</script>
