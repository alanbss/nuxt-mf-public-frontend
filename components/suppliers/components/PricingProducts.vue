<template>
  <div>
    <delete-price-modal :openPopup="openDeletePrice" @update-popup="updatePriceDeletedModal" />
    <div class="row" v-for="family in allFamilies" :key="'type' + family">
      <div v-if="hasProductsFromFamily(family)" class="col-12 mb-1 ml-0 mr-0">
        <h3>{{ family }}</h3>
      </div>
      <div class="col-12 m-0">
        <div class="row pl-0 pr-1" >
          <pricing-product-card
            v-for="product in productChunks(productsFromFamily(family))"
            :key="'product' + product.id"
            :product="product"
            :quotation="''"
            :expeditions="productExpeditions(expeditionsFromFamily(family), product.id)"
            @price-deleted="openPriceDeletedModal()"
            @check-sale-up="emitSaleChangeUp()"
            @check-sale-down="emitSaleChangeDown()"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
</style>

<script>
import { mapState, mapActions } from "vuex";
import PricingProductCard from "~/components/products/components/PricingProductCard";
import DeletePriceModal from "~/components/suppliers/components/DeletePriceModal";

export default {
  name: "PricingProducts",
  data() {
    return {
      allFamilies: [],
      openDeletePrice: false,
      active1: true,
      has: false,
    };
  },
  created() {
    if(this.renderingProducts.length) {
      for(var i = 0; i < this.renderingProducts.length; i++) {
        if(!this.allFamilies.includes(this.renderingProducts[i].family))
          this.allFamilies.push(this.renderingProducts[i].family)
      }
    }
  },
  mounted() {
  },
  updated() {
    // for(let i = 0; i < this.renderingStructure.length; i++) {
    //   if(this.renderingStructure[i].rendered) {
    //     var elem = document.getElementById('top' + this.renderingStructure[i].productTypeId + this.renderingStructure[i].propertyId)
    //     if(elem)
    //       this.updatePosAndHeight({ position: elem.offsetTop, height: elem.offsetHeight, index: i })
    //   }
    // }
  },
  computed: {
    ...mapState("suppliers", ["renderingProducts", "supplierExpeditions"]),
  },
  methods: {
    ...mapActions("suppliers", [
      "getExpeditionsByProductType"
    ]),
    ...mapActions("products", [
      "getProductsByProductTypeId",
      "getProductsInListFromProductType",
      "getProductsInListFromProperty",
      "clearProducts"
    ]),
    ...mapActions("users/products", [
      "changeProductTypeName",
      "getResumedProductList",
      "setProductProperties",
      "updatePosAndHeight"
    ]),
    ...mapActions("pagination", ["userSelectedPage", "setCurrentPage"]),
    productsFromType(id) {
      return this.renderingProducts.filter(obj => obj.id == id).products
    },
    productExpeditions(expeditions, productId) {
      if(expeditions)
        return expeditions.filter(exp => exp.productExpedition.productId == productId)
      else
        return []
    },
    productsFromFamily(key){
      var products = []
      for(var i = 0; i < this.renderingProducts.length; i++) {
        if(this.renderingProducts[i].family == key && this.renderingProducts[i].products.length)
          products = products.concat(this.renderingProducts[i].products)
      }
      return products
    },
    expeditionsFromFamily(key){
      var expeditions = []
      for(var i = 0; i < this.renderingProducts.length; i++) {
        if(this.renderingProducts[i].family == key && this.renderingProducts[i].expeditions.length)
          expeditions = expeditions.concat(this.renderingProducts[i].expeditions)
      }
      return expeditions
    },
    hasProductsFromFamily(family) {
      var has = false
      if(this.renderingProducts.length) {
        for(var i = 0; i < this.renderingProducts.length; i++) {
          if(this.renderingProducts[i].products.length && this.renderingProducts[i].family == family)
            has = true
        }
      }
      return has
    },
    openPriceDeletedModal() {
      this.openDeletePrice = true
    },
    updatePriceDeletedModal(val) {
      this.openDeletePrice = val
    },
    emitSaleChangeUp(){
      this.$emit('sale-changed-up')
    },
    emitSaleChangeDown(){
      this.$emit('sale-changed-down')
    },
    productChunks(productsFromFamily) {
      var result = []
      var data = productsFromFamily
      for(var i = 0; i < data.length; i++){
        result.push(data[i]);
      }
      return result
    },
    
  },
  props: {
    mobileBrowser: {
      type: Boolean,
      required: true
    },
  },
  components: {
    PricingProductCard,
    DeletePriceModal
  }
};
</script>
