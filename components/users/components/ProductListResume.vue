<template>
  <div class="col-4 col-md-2 p-0 bg-white" style="border-right: solid 1px #D5D5D5;">
    <p class="font-small-3 p-1 mb-0" style="background: #F8F8F8;"><strong class="d-block">Minha lista</strong>Produtos que você já cotou</p>
    <div class="border-top">
      <ul class="nav nav-tabs mt-50">
        <li class="nav-item" v-for="family in families" :key="'family' + family">
          <a
            :class="familyClass(family)"
            id="baseProdutos-tab1"
            data-toggle="tab"
            aria-controls="tabProdutos1"
            href="javascript:void(0);"
            role="tab"
            style="padding-left: 6px; padding-right: 6px; text-align: center;"
            @click="selectFamily(family)"
          >
            <span v-if="!isMobile" v-html="getFamilyIcon(family)"></span><br> {{ getFamilyName(family, true) }}
          </a>
        </li>
      </ul>
    </div>
    <div class="border-top font-medium-2 overflow-auto" style=" height:calc(100vh - 200px);padding-bottom: 5rem;">
      <hr class="mt-0">
      <div class="tab-content">
        <div class="tab-pane active" id="tabProdutos1" role="tabpanel">
          <span v-for="(collections, family) in resumedProductList" :key="family">
            <span v-if="family == selectedFamily">
              <p class="font-weight-bold px-75 mb-0 text-body">{{ getFamilyName(family) }}</p>
              <span
                v-for="(categories, collection) in collections"
                :key="collection"
              >
                <p class="m-0 pl-75 pt-2">
                  <small v-if="collection" class="d-block"><i>{{ collection }}</i></small>
                </p>
                <vs-collapse accordion type="border" style="background-color: #fcfcf7;">
                  <span
                    v-for="(productTypes, category) in categories"
                    :key="category"
                    style="background-color: #fcfced;"
                  >
                    <vs-collapse-item class="product-list" :style="category == selectedCategory ? 'background-color: rgb(12, 182, 149);' : ''">
                      <div slot="header">
                        <a
                          @click="selectCategory(category, productTypes[Object.keys(productTypes)[0]][0]); selectedType = null"
                          class="product-type"
                          style="color: black;">
                          <span class="font-medium-1" style="padding-right: 25px;">
                            {{ category }}
                          </span>
                        </a>
                      </div>
                      <ul class="nav flex-column" style="background-color: #fcfcf7;">
                        <li
                          class="nav-item"
                          v-for="(properties, type) in productTypes"
                          :key="type"
                          :style="properties[0].productTypeId == selectedType ? 'background-color: rgb(12, 182, 149);' : ''"
                        >
                          <a
                            :class="properties[0].productTypeId == selectedType ? 'nav-link py-25 white-hover' : 'nav-link py-25 product-type'"
                            href="javascript:void(0)"
                            :style="properties[0].productTypeId == selectedType ? 'background-color: rgb(12, 182, 149); color: black;' : 'color: #707070;'"
                            @click="selectType(category, properties[0], properties, type)"
                          >
                            <span class="font-medium-1">{{ type }}</span>
                          </a>
                        </li>
                      </ul>
                    </vs-collapse-item>
                  </span>
                </vs-collapse>
              </span>
            </span>
          </span>

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-type:hover {
  color: #007bff !important;
}
.white-hover:hover {
  color: white !important;
  font-weight: bold;
}
</style>

<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "ProductListResume",
  data() {
    return {
      selected: undefined,
      currentScreen: undefined,
      selectedFamily: null,
      selectedCategory: null,
      selectedType: null,
      families: [],
    };
  },
  mounted() {
    this.getResumedProductList().then(() => {
      for(var family in this.resumedProductList) {
        this.families.push(family)
      }
      if(this.resumedProductList) {
        this.initFamily(Object.keys(this.resumedProductList)[0])
      }
    })
  },
  computed: {
    ...mapState("users/products", [
      "resumedProductList",
      "renderingStructure"
    ]),
    ...mapState("products", [
      "products"
    ]),
  },
  methods: {
    ...mapActions("products", [
      "getProductsInListFromProperty",
      "getProductsInListFromPropertyAndUpdate",
      "getProductsInListFromCategoryAndUpdate",
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
    initFamily(familyName) {
      this.clearProducts()
      this.createFamilyData(this.resumedProductList[familyName])
      this.selectedFamily = this.families[0]
      if(this.renderingStructure.length) {
        this.getProductsInListFromCategoryAndUpdate({ categoryId: this.renderingStructure[0].categoryId, position: 0 }).then(() => {
          this.$emit('update-products')
        })
      }
    },
    productsQuantityText(quantity) {
      return quantity === 1 ? "1 produto" : `${quantity} produtos`;
    },
    // getProducts(productId) {
    //   this.selected = productId;
    //   this.$emit('selectProductType', productId)
    //
    //   for(let i = 0; i < this.renderingStructure.length; i++) {
    //     if(this.renderingStructure[i].productTypeId == productId) {
    //       if(!this.renderingStructure[i].rendered) {
    //         this.getFromPropertyAndUpdate(this.renderingStructure[i].productTypeId, this.renderingStructure[i].propertyId, i)
    //       } else {
    //         this.hideAllBeforePosition(i).then(() => {
    //           this.focusElement(this.renderingStructure[i].productTypeId)
    //           this.setCurrentPosition(i)
    //         })
    //       }
    //       break
    //     }
    //   }
    // },
    selectType(category, property, properties, type) {
      this.selectedType = property.productTypeId
      this.selectCategory(category, property, property.productTypeId)
    },
    getFromPropertyAndUpdate(productTypeId, propertyId, position) {
      this.clearProducts().then(() => {
        this.hideAllExceptPosition(position).then(() => {
          this.getProductsInListFromPropertyAndUpdate({ productTypeId: productTypeId, propertyId: propertyId, position: position }).then(() => {
            this.focusElement(productTypeId)
          })
        })
      })
    },
    focusElement(productTypeId) {
      var myElement = document.querySelectorAll(`*[id^="product-header-${productTypeId}"]`)[0]
      var topPos = myElement.offsetTop
      document.getElementById('products').scrollTop = topPos
      //this.$emit('clicked-select')
    },
    focusCategory(categoryName) {
      var myElement = document.getElementById('category-header-' + categoryName)
      var topPos = myElement.offsetTop
      document.getElementById('products').scrollTop = topPos
      //this.$emit('clicked-select')
    },
    selectCategory(category, firstProperty, productTypeId = null) {
      this.selectedCategory = category
      this.$emit('start-loading')
      for(let i = 0; i < this.renderingStructure.length; i++) {
        var categoryElement = this.renderingStructure[i]
        if(categoryElement.categoryId == firstProperty.categoryId) {
          if(!categoryElement.rendered) {
            this.clearProducts().then(() => {
              this.hideAllExceptPosition(i).then(() => {
                this.$emit('clear-last-request')
                this.getProductsInListFromCategoryAndUpdate({ categoryId: this.renderingStructure[i].categoryId, position: i }).then(() => {
                  if(productTypeId)
                    this.focusElement(productTypeId)
                  else
                    this.focusCategory(categoryElement.categoryName)
                  this.$emit('stop-loading')
                })
              })
            })
          } else {
            this.hideAllBeforePosition(i).then(() => {
              if(productTypeId)
                this.focusElement(productTypeId)
              else
                this.focusCategory(categoryElement.categoryName)
              this.setCurrentPosition(i)
              this.$emit('stop-loading')
            })
          }
          break
        }
      }
    },
    selectFamily(family) {
      if(this.selectedFamily != family) {
        this.initFamily(family)
        this.selectedFamily = family
        this.$emit('clicked-select')
      }
    },
    familyClass(family) {
      if (this.selectedFamily && (this.selectedFamily == family))
        return "nav-link active"
      else
        return "nav-link"
    },
    getFamilyName(family, force = false) {
      if(this.isMobile || force) {
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
    createFamilyData(data) {
      this.setRenderingStructure(null)
      let renderingList = []
      for(let collection in data) {
        for(let category in data[collection]) {
          for(let type in data[collection][category]) {
            let properties = data[collection][category][type]
            for(let i = 0; i < properties.length; i++) {
              let property = properties[i]
              if(!renderingList.find(obj => obj.categoryId == property.categoryId)) {
                renderingList.push({ categoryId: property.categoryId,
                                     rendered: false,
                                     categoryName: category,
                                     collectionName: collection,
                                     position: 0 })
              }
            }
          }
        }
      }
      this.setRenderingStructure(renderingList)
    }
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
