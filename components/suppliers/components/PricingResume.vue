<template>
  <div class="col-4 col-md-2 p-0 bg-white" style="border-right: solid 1px #D5D5D5;">
    <p class="font-small-3 p-1 mb-0" style="background: #F8F8F8;">
      <strong class="d-block">Precifique seus produtos</strong>Preços-base, descontos e disponibilidade
    </p>
    <div class="border-top font-small-3" style="padding-bottom: 5rem; max-height: calc(100vh - 12em); overflow-y: scroll;">
      <div class="card shadow-sm mb-0">
        <div v-if="catalog">
          <div class="card bg-transparent mb-0">
            <a href="javascript:void(0);" @click="resetInfo()">
              <h6 class="m-1 mt-2">Condições de entrega / financ.</h6>
            </a>
            <div v-for="(collections, family) in catalog" :key="family" class="mb-1">
              <div slot="header" class="m-1 font-small-3 font-weight-bold">
                {{ family }}
              </div>
              <span
                v-for="(categories, collection) in collections"
                :key="collection"
              >
                <span
                  v-for="(productTypes, category) in categories"
                  :key="category"
                  class=""
                >
                  <p class="m-0 pl-75 pb-25 pt-1">
                    <small v-if="collection" class="d-block"><i>{{ collection }}</i></small>{{ category }}
                  </p>
                  <ul class="nav flex-column pl-25">
                    <li
                      class="nav-item"
                      v-for="type in productTypes"
                      :key="type.productType"
                    >
                      <a
                        class="nav-link py-25"
                        href="javascript:void(0)"
                        @click="selectProductType(type)"
                      >
                        {{ type.productType }} <span v-if="noPriceProducts(type)">({{ noPriceProducts(type) }})</span>
                      </a>
                    </li>
                  </ul>
                </span>
              </span>
            </div>
          </div>
        </div>
        <div v-else>
          Não há produtos no catálogo.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "PricingResume",
  data() {
    return {
      selected: undefined,
      currentScreen: undefined,
      selectedFamily: null,
      families: []
    };
  },
  mounted() {
    this.getNoPriceData()
    this.getCatalog().then(() => {
      this.createFamilyData(this.catalog)
    })
  },
  // destroyed() {
  //   this.changeProductTypeName("Todos");
  // },
  computed: {
    ...mapState("products/supplierProductExpeditions", ["supplierProductExpeditions"]),
    ...mapState("quotations", [
      "deliveryInfo"
    ]),
    ...mapState("suppliers", [
      "catalog",
      "noPriceData",
      "supplierProducts",
      "supplierExpeditions",
      "renderingProducts"
    ]),
    ...mapState("products", [
      "products"
    ]),

  },
  methods: {
    ...mapActions("suppliers", [
      "getCatalog",
      "getNoPriceData",
      "getCatalogByProductType",
      "getExpeditionsByProductType",
      "setRenderingProducts",
      "updateRenderingProducts",
      "updateDeliveryRate"
    ]),
    ...mapActions("products", [
      "getProductsInListFromProperty",
      "getProductsInListFromPropertyAndUpdate",
      "clearProducts"
    ]),
    ...mapActions("users/products", [
      "getResumedProductList",
      "setRenderingStructure",
      "updateRenderingStructureByPosition",
      "updateRenderingStructure",
      "hideAllExceptPosition",
      "hideAllBeforePosition",
      "updateRendered",
      "setCurrentPosition"
    ]),
    ...mapActions("products/supplierProductExpeditions", [
      "savePricing",
    ]),

    resetInfo() {
      this.updateDeliveryRate(this.deliveryInfo)
      this.savePricing(this.supplierProductExpeditions).then(() => {
        this.getNoPriceData()
      })
      this.createFamilyData(this.catalog)
      this.$emit('clicked-reset')
    },

    initFamily(familyName) {
      this.clearProducts()
      this.createFamilyData(this.resumedProductList[familyName])
      this.selectedFamily = this.families[0]
      let firstCollection = this.resumedProductList[familyName]
      let firstCategory = firstCollection[Object.keys(firstCollection)[0]]
      let firstType = firstCategory[Object.keys(firstCategory)[0]]
      let firstProductType = firstType[Object.keys(firstType)[0]][0]
      let properties = this.orderedProperties(firstType[Object.keys(firstType)[0]])
      if(firstType && firstProductType) {
        this.getProductsInListFromProperty({ productTypeId: properties[0].productTypeId, propertyId: properties[0].propertyId }).then(() => {
          this.updateRenderingStructureByPosition(0)
          this.$emit('update-products')
        })
      }
    },

    selectProductType(productType) {
      this.updateDeliveryRate(this.deliveryInfo)
      this.savePricing(this.supplierProductExpeditions).then(() => {
        this.getNoPriceData()
      })
      var index = null
      for(var i = 0; i < this.renderingProducts.length; i++) {
        if(this.renderingProducts[i].id == productType.productTypeId)
          index = i
      }
      this.$emit('clicked-select', index)
      // this.getCatalogByProductType(productType.productTypeId).then(() => {
      //   this.getExpeditionsByProductType(productType.productTypeId).then(() => {
      //     this.updateRenderingProducts({ id: productType.productTypeId, products: this.supplierProducts, expeditions: this.supplierExpeditions })
      //   })
      // })
    },

    expeditionsByProduct(productId) {
      return this.supplierExpeditions.filter(exp => exp.productExpedition.productId == productId)
    },

    productsQuantityText(quantity) {
      return quantity === 1 ? "1 produto" : `${quantity} produtos`;
    },

    productTypeQuantity(types) {
      return types.length === 1 ? "1 tipo de produto" : `${types.length} tipos de produtos`;
    },

    getProducts(productId) {
      this.selected = productId;
      this.$emit('selectProductType', productId)

      for(let i = 0; i < this.renderingStructure.length; i++) {
        if(this.renderingStructure[i].productTypeId == productId) {
          if(!this.renderingStructure[i].rendered) {
            this.getFromPropertyAndUpdate(this.renderingStructure[i].productTypeId, this.renderingStructure[i].propertyId, i)
          } else {
            this.hideAllBeforePosition(i).then(() => {
              this.focusElement(this.renderingStructure[i].productTypeId, this.renderingStructure[i].propertyId)
              this.setCurrentPosition(i)
            })
          }
          break
        }
      }
    },

    orderedProperties(properties) {
      let propertiesClone = [...properties]
      if(properties && properties.length > 0)
        return propertiesClone.sort((a, b) => a.property.localeCompare(b.property))
      else
        return properties
    },

    selectType(property, properties, type) {
      this.getProducts(property.productTypeId)
    },

    focusElement(productTypeId, propertyId) {
      var myElement = document.getElementById('top' + productTypeId + propertyId)
      var topPos = myElement.offsetTop
      document.getElementById('products').scrollTop = topPos
      this.$emit('clicked-select')
    },

    selectFamily(family) {
      this.initFamily(family)
      this.selectedFamily = family
    },

    familyClass(family) {
      if (this.selectedFamily && (this.selectedFamily == family))
        return "nav-link active"
      else
        return "nav-link"
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
        return family
      }
    },

    getFamilyIcon(family) {
      switch(family) {
        case 'Alimentos e bebidas':
          return '<img src="' + require(`@/assets/images/maca.svg`) + '" alt="*" width="16">'
        case 'Embalagens':
          return '<i class="feather icon-shopping-bag mr-25 d-none d-sm-inline"></i>'
        case 'Limpeza':
          return '<img src="' + require(`@/assets/images/window-cleaner.svg`) + '" alt="*" width="16">'
        case 'Utensílios':
          return '<i class="fa fa-cutlery mr-25 d-none d-sm-inline"></i>'
      }
      return null
    },

    createFamilyData(catalog) {
      this.setRenderingProducts([])
      let renderingList = []
      for(let family in catalog) {
        for(let collection in catalog[family]) {
          for(let category in catalog[family][collection]) {
            for(var i = 0; i < catalog[family][collection][category].length; i++) {
              var type = catalog[family][collection][category][i]
              renderingList.push({ family: family, name: type.productType, id: type.productTypeId, products: [], expeditions: [] })
            }
              // for(let i = 0; i < ordered.length; i++) {
              //   let property = ordered[i]
              //   renderingList.push({ productTypeId: property.productTypeId,
              //                        propertyId: property.propertyId,
              //                        rendered: false,
              //                        propertyName: property.property,
              //                        productTypeName: type,
              //                        categoryName: category,
              //                        collectionName: collection,
              //                        position: 0,
              //                        height: 0 })
              // }
          }
        }
      }
      this.setRenderingProducts(renderingList)
    },

    noPriceProducts(productType) {
      if(this.noPriceData)
        return this.noPriceData[productType.productTypeId]
      else
        return null
    },
  },
  props: {
    isMobile: {
      type: Boolean
    }
  }
};
</script>

<style scoped>
.is-active {
  background-color: #ecedef;
}
</style>
